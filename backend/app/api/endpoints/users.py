# backend/app/api/endpoints/users.py

import asyncio
from typing import List, Optional
from app.services.email_service import send_password_changed_email_resend
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session # Correctamente importado Session
from app import crud, schemas, models # Certifique-se que 'models' está importado
from app.core.security import get_current_user, get_password_hash, verify_password 
from app.api.deps import get_db
from app.core.security import get_current_active_user # Correctamente importado get_db
from app.models import User
# Remova esta importação se você a colocou temporariamente para debug:
# from pydantic import ValidationError 

router = APIRouter()


@router.put("/me/password", status_code=status.HTTP_204_NO_CONTENT) # <<< MUDADO PARA 204 NO CONTENT
def change_my_password(
    password_change: schemas.PasswordChange,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db), # Necessita de DB para commit
):
    """
    Permite que o usuário logado altere sua própria senha.
    Requer a senha atual para verificação. Retorna 204 No Content em sucesso.
    """
    if not verify_password(
        password_change.current_password, current_user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Senha atual incorreta."
        )

    hashed_new_password = get_password_hash(password_change.new_password)

    # Atualiza a senha no objeto do usuário e persiste no DB
    current_user.hashed_password = hashed_new_password
    db.add(current_user)
    db.commit()
    # Não precisa de db.refresh(current_user) se o retorno for 204 No Content.

    asyncio.create_task(send_password_changed_email_resend(
        to_email=current_user.email,
        name=current_user.nome or "Usuário" # Usa o nome do usuário ou "Usuário" como fallback
    ))
    
    return # Não retorna nenhum corpo


@router.get("/me", response_model=schemas.UserPublic)
def read_users_me(
    current_user: models.User = Depends(get_current_user),
    # REMOVIDO: db: Session = Depends(get_db), pois current_user já está populado
):
    """
    Retorna os dados do usuário logado, incluindo informações do plano de assinatura.
    O relacionamento subscription_plan é carregado via joinedload em get_current_user.
    """
    # A serialização para schemas.UserPublic acontecerá automaticamente pelo FastAPI.
    # Se 'current_user.subscription_plan' está vindo como None, o problema está
    # no models.py ou no crud.py/get_user_by_email que não está carregando o relacionamento.
    # Os logs de debug anteriores indicaram que estava carregando, então deve funcionar.

    # REMOVIDO TODO O BLOCO TRY/EXCEPT MANUAL DE SERIALIZAÇÃO.
    # O FastAPI com response_model e from_attributes=True faz isso automaticamente.
    # A exceção de serialização será capturada pelo FastAPI e transformada em 500.

    return current_user # Retorna o objeto models.User diretamente para serialização Pydantic


# === NOVO ENDPOINT DE ANALYTICS ===
@router.get("/me/analytics", response_model=schemas.UserAnalytics)
def get_user_analytics(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db), # <<< ADICIONADO: db é necessário para crud.get_total_generated_content_count
):
    """
    Retorna estatísticas de uso para o usuário logado.
    """
    # crud.get_total_generated_content_count deve ser síncrono
    total_generated = crud.get_total_generated_content_count(db, user_id=current_user.id)
    return schemas.UserAnalytics(
        total_generated_content=total_generated
    )

@router.post("/me/update-info")
def update_user_info(
    updated_data: schemas.UserUpdateInfo,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.update_user_info(db, current_user.id, updated_data.dict())