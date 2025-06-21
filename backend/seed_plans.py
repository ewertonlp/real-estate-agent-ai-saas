# backend/seed_plans.py

import os
import sys
from sqlalchemy.orm import Session

# Adiciona o diretório pai ao PYTHONPATH para importar módulos do seu app
# Isso é necessário para que você possa importar app.core, app.crud, etc.
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), './app')))

from app.core.database import SessionLocal, engine, Base
from app.crud import get_subscription_plan_by_name, create_subscription_plan
from app.schemas import SubscriptionPlanCreate
from app.core.config import settings # Para acessar as configurações e IDs do Stripe

def seed_database():
    print(f"DEBUG (Seed Script): DATABASE_URL em seed_plans.py: {settings.DATABASE_URL}")
    print("Iniciando o seeding do banco de dados...")
    db: Session = SessionLocal() # Obtém uma sessão do banco de dados
    try:
        # NOTA: Em um ambiente de produção/com Alembic,
        # 'Base.metadata.create_all' não deve ser usado no seed script,
        # pois as migrações cuidam da criação das tabelas.
        # No entanto, para fins de desenvolvimento rápido, se você não rodar
        # 'alembic upgrade head' manualmente, pode descomentar para criar as tabelas.
        # Base.metadata.create_all(bind=engine) # Descomente se você NÃO usa 'alembic upgrade head'

        # --- Criação dos Planos (somente se não existirem) ---

        # Plano "Free"
        if not get_subscription_plan_by_name(db, name="Free"):
            free_plan_data = SubscriptionPlanCreate(
                name="Free", description="Plano gratuito com gerações limitadas",
                max_generations=settings.FREE_PLAN_MAX_GENERATIONS, unit_amount=0,
                currency="BRL", interval="month", interval_count=1, type="recurring",
                is_active=True, price_id_stripe=settings.STRIPE_FREE_PLAN_PRICE_ID
            )
            create_subscription_plan(db, free_plan_data)
            print("Plano 'Free' criado.")

        # Plano "Basic" Mensal
        if not get_subscription_plan_by_name(db, name="Basic", interval="month"):
            basic_month_plan_data = SubscriptionPlanCreate(
                name="Basic", description="Plano Essencial para corretores ativos.",
                max_generations=20, # VALOR CORRETO PARA MENSAL
                unit_amount=2000, # R$20.00
                currency="BRL", interval="month", interval_count=1, type="recurring",
                is_active=True, price_id_stripe=settings.STRIPE_BASIC_MONTHLY_PLAN_PRICE_ID
            )
            create_subscription_plan(db, basic_month_plan_data)
            print("Plano 'Basic' Mensal criado.")

        # Plano "Basic" Anual
        if not get_subscription_plan_by_name(db, name="Basic", interval="year"):
            basic_year_plan_data = SubscriptionPlanCreate(
                name="Basic", description="Plano Essencial com desconto anual.",
                max_generations=240, # VALOR CORRIGIDO: 20 * 12
                unit_amount=21600, # R$216.00 (Ex: 12 meses * 18 = 216)
                currency="BRL", interval="year", interval_count=1, type="recurring",
                is_active=True, price_id_stripe=settings.STRIPE_BASIC_ANNUAL_PLAN_PRICE_ID
            )
            create_subscription_plan(db, basic_year_plan_data)
            print("Plano 'Basic' Anual criado.")

        # Plano "Premium" Mensal
        if not get_subscription_plan_by_name(db, name="Premium", interval="month"):
            premium_month_plan_data = SubscriptionPlanCreate(
                name="Premium", description="Para corretores que buscam resultados máximos.",
                max_generations=50, # VALOR CORRETO PARA MENSAL
                unit_amount=4000, # R$40.00
                currency="BRL", interval="month", interval_count=1, type="recurring",
                is_active=True, price_id_stripe=settings.STRIPE_PREMIUM_MONTHLY_PLAN_PRICE_ID
            )
            create_subscription_plan(db, premium_month_plan_data)
            print("Plano 'Premium' Mensal criado.")

        # Plano "Premium" Anual
        if not get_subscription_plan_by_name(db, name="Premium", interval="year"):
            premium_year_plan_data = SubscriptionPlanCreate(
                name="Premium", description="Para corretores que buscam resultados máximos com desconto anual.",
                max_generations=600, # VALOR CORRIGIDO: 50 * 12
                unit_amount=43200, # R$432.00
                currency="BRL", interval="year", interval_count=1, type="recurring",
                is_active=True, price_id_stripe=settings.STRIPE_PREMIUM_ANNUAL_PLAN_PRICE_ID
            )
            create_subscription_plan(db, premium_year_plan_data)
            print("Plano 'Premium' Anual criado.")

        # Plano "Unlimited" Mensal
        if not get_subscription_plan_by_name(db, name="Unlimited", interval="month"):
            unlimited_month_plan_data = SubscriptionPlanCreate(
                name="Unlimited", description="Gerações ilimitadas para o seu crescimento.",
                max_generations=0, unit_amount=10000, currency="BRL", interval="month", interval_count=1,
                type="recurring", is_active=True, price_id_stripe=settings.STRIPE_UNLIMITED_MONTHLY_PLAN_PRICE_ID
            )
            create_subscription_plan(db, unlimited_month_plan_data)
            print("Plano 'Unlimited' Mensal criado.")

        # Plano "Unlimited" Anual
        if not get_subscription_plan_by_name(db, name="Unlimited", interval="year"):
            unlimited_year_plan_data = SubscriptionPlanCreate(
                name="Unlimited", description="Gerações ilimitadas para o seu crescimento com desconto anual.",
                max_generations=0, unit_amount=108000, currency="BRL", interval="year", interval_count=1,
                type="recurring", is_active=True, price_id_stripe=settings.STRIPE_UNLIMITED_ANNUAL_PLAN_PRICE_ID
            )
            create_subscription_plan(db, unlimited_year_plan_data)
            print("Plano 'Unlimited' Anual criado.")

    except Exception as e:
        print(f"Erro no seeding do banco de dados: {e}")
    finally:
        db.close()
    print("Seeding do banco de dados concluído.")

if __name__ == "__main__":
    seed_database()