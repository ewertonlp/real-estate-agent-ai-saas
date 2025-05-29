# backend/app/api/endpoints/users.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app import (
    schemas,
    crud,
    models,
)  # Certifique-se que crud, schemas e models estão importados
from app.core.database import get_db
from app.core.security import (
    get_password_hash,
    verify_password,
)  # Importe as funções de hash de senha
from app.api.endpoints.history import (
    get_current_user,
)  # Reutiliza a dependência de autenticação

router = APIRouter()


@router.put("/me/password", response_model=schemas.UserInDB)
def change_my_password(
    password_change: schemas.PasswordChange,
    current_user: models.User = Depends(get_current_user),  # Protege o endpoint
    db: Session = Depends(get_db),
):
    """
    Permite que o usuário logado altere sua própria senha.
    Requer a senha atual para verificação.
    """
    # 1. Verificar a senha atual
    if not verify_password(
        password_change.current_password, current_user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Senha atual incorreta."
        )

    # 2. Fazer hash da nova senha
    hashed_new_password = get_password_hash(password_change.new_password)

    # 3. Atualizar a senha no banco de dados
    current_user.hashed_password = hashed_new_password
    db.add(current_user)  # Adiciona o objeto modificado de volta à sessão
    db.commit()  # Confirma a transação
    db.refresh(current_user)  # Atualiza o objeto com os dados do DB

    return current_user  # Retorna o usuário com a senha atualizada (mas o hash, não a nova senha em texto puro)


# --- NOVO ENDPOINT para obter os dados do usuário logado (incluindo plano) ---
@router.get(
    "/me", response_model=schemas.UserInDB
)  # Use UserInDB que já é o schema mais completo
def read_users_me(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),  # Inclua db para usar joinedload
):
    """
    Retorna os dados do usuário logado, incluindo informações do plano de assinatura.
    """
    # Use joinedload para carregar o relacionamento 'subscription_plan'
    user_with_plan = (
        db.query(models.User)
        .options(joinedload(models.User.subscription_plan))
        .filter(models.User.id == current_user.id)
        .first()
    )

    if not user_with_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado."
        )

    return user_with_plan  # Retorna o objeto User completo com o plano carregado


# === NOVO ENDPOINT DE ANALYTICS ===
@router.get("/me/analytics", response_model=schemas.UserAnalytics)  #
def get_user_analytics(
    current_user: models.User = Depends(get_current_user),  # Protege o endpoint
):
    """
    Retorna estatísticas de uso para o usuário logado.
    """
    return schemas.UserAnalytics(
        total_generated_content=current_user.content_generations_count
    )  #
