# backend/app/api/endpoints/users.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app import (
    schemas,
    crud,
    models,
)
from app.core.database import get_db
from app.core.security import (
    get_password_hash,
    verify_password,
)
# CORREÇÃO AQUI: Mude a importação de get_current_user
from app.api.endpoints.history import ( # <-- CORREÇÃO
    get_current_user,
)

router = APIRouter()


@router.put("/me/password", response_model=schemas.UserInDB)
def change_my_password(
    password_change: schemas.PasswordChange,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Permite que o usuário logado altere sua própria senha.
    Requer a senha atual para verificação.
    """
    if not verify_password(
        password_change.current_password, current_user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Senha atual incorreta."
        )

    hashed_new_password = get_password_hash(password_change.new_password)

    current_user.hashed_password = hashed_new_password
    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return current_user


@router.get(
    "/me", response_model=schemas.UserPublic
)
def read_users_me(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    
    subscription_plan_data = None
    if current_user.subscription_plan:
       
        
        try:
            subscription_plan_data = schemas.SubscriptionPlanPublic.model_validate(current_user.subscription_plan)
          
        except Exception as e:
           
            subscription_plan_data = None
    else:
        print(f"###### DEBUG (Endpoint - /users/me): current_user.subscription_plan é None. ######")

    try:
        user_public_response = schemas.UserPublic(
            id=current_user.id,
            email=current_user.email,
            is_active=current_user.is_active,
            content_generations_count=current_user.content_generations_count,
            stripe_customer_id=current_user.stripe_customer_id,
            stripe_subscription_id=current_user.stripe_subscription_id,
            subscription_plan_id=current_user.subscription_plan_id,
            subscription_plan=subscription_plan_data
        )
       
        return user_public_response
    except Exception as e:
      
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor ao serializar dados do usuário: {e}")

    # Remova ou comente o bloco de código inacessível abaixo
    # (Já foi instruído anteriormente, apenas para confirmar que não está ativo)
    # """
    # Retorna os dados do usuário logado, incluindo informações do plano de assinatura.
    # """
    # user_with_plan = (
    #     db.query(models.User)
    #     .options(joinedload(models.User.subscription_plan))
    #     .filter(models.User.id == current_user.id)
    #     .first()
    # )
    # if not user_with_plan:
    #     raise HTTPException(...)
    # return user_with_plan


# === NOVO ENDPOINT DE ANALYTICS ===
@router.get("/me/analytics", response_model=schemas.UserAnalytics)
def get_user_analytics(
    current_user: models.User = Depends(get_current_user),
):
    """
    Retorna estatísticas de uso para o usuário logado.
    """
    return schemas.UserAnalytics(
        total_generated_content=current_user.content_generations_count
    )