# backend/app/crud.py

from sqlalchemy.orm import Session, joinedload 
from app import models, schemas
from app.core.security import get_password_hash
from app.core.config import settings
from sqlalchemy import desc, func
from datetime import datetime

def get_user_by_email(db: Session, email: str):
    return db.query(models.User)\
             .options(joinedload(models.User.subscription_plan))\
             .filter(models.User.email == email)\
             .first()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = get_user_by_email(db, email=user.email) # Verificação já feita no endpoint, mas reforce
    if db_user:
        return None # Usuário já existe

    hashed_password = get_password_hash(user.password)

    # --- NOVO: Atribuir plano "Free" ao usuário ao registrar ---
    free_plan = db.query(models.SubscriptionPlan).filter(models.SubscriptionPlan.name == "Free").first()
    if not free_plan:
        # Se o plano "Free" não existe no DB, pode criar um aqui ou lançar erro
        # Para simplificar o desenvolvimento, vamos criar se não existir
        free_plan = models.SubscriptionPlan(
            name="Free",
            description="Plano gratuito com gerações limitadas",
            max_generations=5, # Exemplo: 5 gerações grátis
            price_id_stripe=settings.STRIPE_FREE_PLAN_PRICE_ID, # Usar o ID do .env
            is_active=True
        )
        db.add(free_plan)
        db.commit() # Commita para que free_plan tenha um ID
        db.refresh(free_plan)
        print("Plano 'Free' criado automaticamente no banco de dados.")
    # --------------------------------------------------------

    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        subscription_plan_id=free_plan.id, # Atribui o plano Free
        content_generations_count=0 # Inicia o contador
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_user_generated_content(db: Session, content: schemas.GeneratedContentCreate, user_id: int):
    """
    Cria e salva um novo registro de conteúdo gerado no banco de dados.
    """
    db_content = models.GeneratedContent(**content.model_dump(), owner_id=user_id)
    db.add(db_content)

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        user.content_generations_count += 1
        db.add(user)

    db.commit()
    db.refresh(db_content)
    if user:
        db.refresh(user)
    return db_content


def get_user_generated_contents(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    is_favorite: bool | None = None,
    search_query: str | None = None,
    start_date: datetime | None = None,
    end_date: datetime | None = None
):
    """
    Retorna o histórico de conteúdo gerado por um usuário, com opções de filtragem.
    """
    query = db.query(models.GeneratedContent).filter(models.GeneratedContent.owner_id == user_id)

    if is_favorite is not None:
        query = query.filter(models.GeneratedContent.is_favorite == is_favorite)

    if search_query:
        query = query.filter(
            (models.GeneratedContent.prompt_used.ilike(f"%{search_query}%")) |
            (models.GeneratedContent.generated_text.ilike(f"%{search_query}%"))
        )

    if start_date:
        query = query.filter(models.GeneratedContent.created_at >= start_date)
    if end_date:
        query = query.filter(models.GeneratedContent.created_at <= end_date)

    return query.order_by(desc(models.GeneratedContent.created_at)).offset(skip).limit(limit).all()

def update_generated_content_favorite_status(db: Session, content_id: int, user_id: int, is_favorite: bool):
    """
    Atualiza o status de favorito de um conteúdo gerado.
    """
    db_content = db.query(models.GeneratedContent).filter(
        models.GeneratedContent.id == content_id,
        models.GeneratedContent.owner_id == user_id
    ).first()

    if db_content:
        db_content.is_favorite = is_favorite
        db.add(db_content)
        db.commit()
        db.refresh(db_content)
    return db_content