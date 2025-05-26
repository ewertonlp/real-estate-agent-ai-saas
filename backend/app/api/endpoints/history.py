# backend/app/api/endpoints/history.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import schemas, crud, models
from app.core.database import get_db
from app.core.security import decode_access_token # Para validar o token
from fastapi.security import OAuth2PasswordBearer # Para obter o token do cabeçalho

router = APIRouter()

# Schema para obter o token do cabeçalho Authorization
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

# Dependência para obter o usuário atual
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Função de dependência para obter o usuário logado a partir do token JWT.
    """
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autenticação inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )
    email: str = payload.get("sub")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autenticação inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = crud.get_user_by_email(db, email=email)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")
    return user

@router.post("/contents/", response_model=schemas.GeneratedContentResponse)
def create_content_history(
    content: schemas.GeneratedContentCreate,
    current_user: models.User = Depends(get_current_user), # Protege o endpoint
    db: Session = Depends(get_db)
):
    """
    Salva um conteúdo gerado pela IA para o usuário logado.
    """
    return crud.create_user_generated_content(db=db, content=content, user_id=current_user.id)

@router.get("/contents/", response_model=List[schemas.GeneratedContentResponse])
def get_user_contents_history(
    current_user: models.User = Depends(get_current_user), # Protege o endpoint
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """
    Retorna o histórico de conteúdos gerados pelo usuário logado.
    """
    return crud.get_user_generated_contents(db=db, user_id=current_user.id, skip=skip, limit=limit)