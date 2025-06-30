# backend/app/api/endpoints/auth.py

import asyncio
from datetime import timedelta
from typing import Any
from app.services.email_service import send_registration_email_resend
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app import crud, schemas, models # Certifique-se que 'models' está importado
# <<< MANTENHA ESTA LINHA COM verify_password:
from app.core.security import create_access_token, get_current_user, verify_password 
from app.core.config import settings
from app.api.deps import get_db

router = APIRouter()

@router.post("/token", response_model=schemas.Token)
def login_for_access_token( # 'def' para síncrono
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user: # Verifique a existência do usuário antes de acessar user.hashed_password
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # <<< MANTENHA ESTA CHAMADA DIRETA A verify_password:
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=schemas.UserPublic, status_code=status.HTTP_201_CREATED, summary="Registra um novo usuário") # 'UserPublic' é um schema comum para retorno público
async def register_user( # MUDADO PARA 'async def'
    user_create: schemas.UserCreate, # Renomeado para user_create para clareza
    db: Session = Depends(get_db)
):
    """
    Registra um novo usuário no sistema.
    Verifica se o e-mail já está em uso e cria o usuário no banco de dados.
    Envia um e-mail de boas-vindas após o registro bem-sucedido.
    """
    db_user = crud.get_user_by_email(db, email=user_create.email)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    # Cria o usuário no banco de dados
    # O crud.create_user deve lidar com o hash da senha internamente ou você pode fazer aqui:
    # hashed_password = get_password_hash(user_create.password)
    # user_in_db = models.User(email=user_create.email, hashed_password=hashed_password, nome=user_create.nome)
    # db.add(user_in_db)
    # db.commit()
    # db.refresh(user_in_db)
    
    # Assumindo que crud.create_user já faz o hash da senha e persiste o usuário
    new_user = crud.create_user(db=db, user=user_create) # Use user_create aqui

    # NOVO: Enviar e-mail de boas-vindas em segundo plano
    # Usa asyncio.create_task para não bloquear a resposta da API
    asyncio.create_task(send_registration_email_resend(
        to_email=new_user.email,
        name=new_user.nome or "Usuário" # Usa o nome do usuário ou "Usuário" como fallback
    ))

    return new_user # Retorna o objeto do usuário recém-criado

@router.get("/me", response_model=schemas.UserPublic)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user