# backend/app/crud.py

from typing import Optional
from sqlalchemy.orm import Session, joinedload
from app import models, schemas
from app.core.security import get_password_hash
from app.core.config import settings
from sqlalchemy import desc, func
from datetime import datetime


def get_user_by_email(db: Session, email: str):
    user = (
        db.query(models.User)
        .options(joinedload(models.User.subscription_plan))
        .filter(models.User.email == email)
        .first()
    )

    return user

def create_user(db: Session, user: schemas.UserCreate):
    db_user = get_user_by_email(
        db, email=user.email
    )  # Verificação já feita no endpoint, mas reforce
    if db_user:
        return None  # Usuário já existe

    hashed_password = get_password_hash(user.password)

    # --- CORREÇÃO AQUI: Atribuir plano "Free" ao usuário ao registrar ---
    free_plan = (
        db.query(models.SubscriptionPlan)
        .filter(models.SubscriptionPlan.name == "Free")
        .first()
    )
    if not free_plan:

        # AGORA, ESTAMOS PASSANDO TODOS OS CAMPOS NECESSÁRIOS
        free_plan = models.SubscriptionPlan(
            name="Free",
            description="Plano gratuito com gerações limitadas",
            max_generations=settings.FREE_PLAN_MAX_GENERATIONS,  # Usar o limite do settings
            price_id_stripe=settings.STRIPE_FREE_PLAN_PRICE_ID,  # Usar o ID do .env
            is_active=True,
            # >>> ADICIONAR ESTES CAMPOS FALTANTES QUE SÃO NOT NULL NO MODELO <<<
            unit_amount=0,  # O valor para o plano Free (0 centavos)
            currency="BRL",  # Moeda padrão para o Free plan
            interval="month",  # Intervalo padrão para o Free plan
            interval_count=1,  # Contagem do intervalo (1 mês)
            type="recurring",  # Tipo do plano
        )
        db.add(free_plan)
        db.commit()  # Commita para que free_plan tenha um ID
        db.refresh(free_plan)
        print("Plano 'Free' criado automaticamente no banco de dados.")
    # --------------------------------------------------------

    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        subscription_plan_id=free_plan.id,  # Atribui o plano Free
        content_generations_count=0,  # Inicia o contador
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_user_generated_content(
    db: Session, content: schemas.GeneratedContentCreate, user_id: int
):
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
    end_date: datetime | None = None,
):
    """
    Retorna o histórico de conteúdo gerado por um usuário, com opções de filtragem.
    """
    query = db.query(models.GeneratedContent).filter(
        models.GeneratedContent.owner_id == user_id
    )

    if is_favorite is not None:
        query = query.filter(models.GeneratedContent.is_favorite == is_favorite)

    if search_query:
        query = query.filter(
            (models.GeneratedContent.prompt_used.ilike(f"%{search_query}%"))
            | (models.GeneratedContent.generated_text.ilike(f"%{search_query}%"))
        )

    if start_date:
        query = query.filter(models.GeneratedContent.created_at >= start_date)
    if end_date:
        query = query.filter(models.GeneratedContent.created_at <= end_date)

    return (
        query.order_by(desc(models.GeneratedContent.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )


def update_generated_content_favorite_status(
    db: Session, content_id: int, user_id: int, is_favorite: bool
):
    """
    Atualiza o status de favorito de um conteúdo gerado.
    """
    db_content = (
        db.query(models.GeneratedContent)
        .filter(
            models.GeneratedContent.id == content_id,
            models.GeneratedContent.owner_id == user_id,
        )
        .first()
    )

    if db_content:
        db_content.is_favorite = is_favorite
        db.add(db_content)
        db.commit()
        db.refresh(db_content)
    return db_content


def create_prompt_template(db: Session, template: schemas.PromptTemplateBase):
    db_template = models.PromptTemplate(**template.model_dump())
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template


def get_prompt_template(db: Session, template_id: int):
    return (
        db.query(models.PromptTemplate)
        .filter(models.PromptTemplate.id == template_id)
        .first()
    )


def get_all_prompt_templates(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.PromptTemplate).offset(skip).limit(limit).all()


def get_active_prompt_templates(
    db: Session, user_plan_name: str, skip: int = 0, limit: int = 100
):
    query = db.query(models.PromptTemplate)
    if user_plan_name not in [
        "Premium",
        "Unlimited",
    ]:  # Adjust plan names as per your models
        query = query.filter(models.PromptTemplate.is_premium == False)
    return query.offset(skip).limit(limit).all()


# ... (código existente em app/crud.py) ...


# Função para obter um plano de assinatura pelo seu ID de preço do Stripe
def get_subscription_plan_by_stripe_price_id(db: Session, stripe_price_id: str):
    return (
        db.query(models.SubscriptionPlan)
        .filter(models.SubscriptionPlan.price_id_stripe == stripe_price_id)
        .first()
    )


# Função para obter todos os planos de assinatura (usado em subscriptions.py)
def get_all_subscription_plans(db: Session):
    return db.query(models.SubscriptionPlan).all()


# Função para criar um plano de assinatura (usado em subscriptions.py e em seeds/init_db.py se você tiver)
def create_subscription_plan(db: Session, plan: schemas.SubscriptionPlanCreate):

    db_plan = models.SubscriptionPlan(**plan.model_dump())
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)

    return db_plan


# Função para atualizar um plano de assinatura (usado em subscriptions.py)
def update_subscription_plan(
    db: Session, db_obj: models.SubscriptionPlan, obj_in: schemas.SubscriptionPlanUpdate
):
    for field, value in obj_in.model_dump(exclude_unset=True).items():
        setattr(db_obj, field, value)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


# Função para obter um plano de assinatura pelo nome (usado em subscriptions.py e em seeds/init_db.py se você tiver)
def get_subscription_plan_by_name(db: Session, name: str, interval: Optional[str] = None): # MODIFICADO AQUI: adicione 'interval: Optional[str] = None'
    query = db.query(models.SubscriptionPlan).filter(models.SubscriptionPlan.name == name)
    if interval: # Adicione esta lógica para filtrar por intervalo, se fornecido
        query = query.filter(models.SubscriptionPlan.interval == interval)
    return query.first()

# Adicione esta nova função para atualizar o customer_id do Stripe do usuário
def update_user_stripe_customer_id(db: Session, user_id: int, stripe_customer_id: str):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        user.stripe_customer_id = stripe_customer_id
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    return None

# Adicione esta nova função para obter usuário por stripe_customer_id, usada no webhook
def get_user_by_stripe_customer_id(db: Session, stripe_customer_id: str):
    return db.query(models.User).filter(models.User.stripe_customer_id == stripe_customer_id).first()

# Adicione esta nova função para obter um usuário por ID, usada no webhook
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_total_generated_content_count(db: Session, user_id: int) -> int:
    """
    Retorna a contagem total de conteúdos gerados por um usuário.
    """
    return (
        db.query(func.count(models.GeneratedContent.id))
        .filter(models.GeneratedContent.owner_id == user_id)
        .scalar() # Usa .scalar() para obter o resultado de contagem diretamente
    )