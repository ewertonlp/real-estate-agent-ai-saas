# backend/app/api/endpoints/subscriptions.py
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse # Importar JSONResponse se usado no webhook
from sqlalchemy.orm import Session
from app import crud, schemas, models # Certifique-se que crud, schemas, models estão importados
from app.core.config import settings
from app.services import stripe_service
import logging

from app.core.database import get_db # <--- MANTENHA ESTA IMPORTAÇÃO
from app.api.endpoints.history import get_current_user # <--- MANTENHA ESTA IMPORTAÇÃO (se não estiver lá)

import stripe

router = APIRouter() # <--- ESTA LINHA DEVE ESTAR AQUI NO INÍCIO E APENAS UMA VEZ
logger = logging.getLogger(__name__) # Inicialize o logger para este módulo

# Você pode manter o logger.setLevel(logging.DEBUG) se quiser ver os logs detalhados
# logger.setLevel(logging.DEBUG)
# if not logger.handlers:
#     handler = logging.StreamHandler()
#     formatter = logging.Formatter('%(levelname)s: %(message)s')
#     handler.setFormatter(formatter)
#     logger.addHandler(handler)


# --- ATUALIZAÇÃO CRÍTICA AQUI: Mapeamento de Gerações por Plano E Intervalo ---
# Use um dicionário aninhado ou chaves compostas para mapear gerações por nome E intervalo
MAX_GENERATIONS_MAP = {
    "Basic": {"month": 20, "year": 240},  # 20 * 12
    "Premium": {"month": 50, "year": 600}, # 50 * 12
    "Unlimited": {"month": 0, "year": 0},  # Ilimitado (0) para ambos
}
# -----------------------------------------------------------------------------

@router.get("/plans", response_model=List[schemas.SubscriptionPlan])
async def get_subscription_plans(db: Session = Depends(get_db)):
    logger.info("--- INICIANDO get_subscription_plans ---")
    try:
        stripe_products_and_prices = await stripe_service.get_all_stripe_products_and_prices()
        logger.info(f"Dados Stripe: {stripe_products_and_prices}")

        for sp_data in stripe_products_and_prices:
            plan_name = sp_data["name"]
            stripe_price_id = sp_data["price_id_stripe"]
            plan_interval = sp_data["interval"] # Pega o intervalo do Stripe

            logger.debug(f"Processando plano Stripe: {plan_name} com price_id: {stripe_price_id}, intervalo: {plan_interval}")

            # Obtenha o max_generations com base no nome E no intervalo
            current_max_generations = MAX_GENERATIONS_MAP.get(plan_name, {}).get(plan_interval, 0)
            if plan_name == "Free":
                current_max_generations = settings.FREE_PLAN_MAX_GENERATIONS # O Free plan tem um limite único

            # Use o `interval` na busca do plano existente
            existing_plan = crud.get_subscription_plan_by_stripe_price_id(db, stripe_price_id)

            if existing_plan:
                # Verifique se o plano no DB precisa ser atualizado (nome, descrição, gerações etc.)
                needs_update = False
                if existing_plan.name != plan_name: needs_update = True
                if existing_plan.description != sp_data["description"]: needs_update = True
                if existing_plan.unit_amount != sp_data["unit_amount"]: needs_update = True
                if existing_plan.currency != sp_data["currency"]: needs_update = True
                if existing_plan.interval != sp_data["interval"]: needs_update = True
                if existing_plan.interval_count != sp_data["interval_count"]: needs_update = True
                if existing_plan.type != sp_data["type"]: needs_update = True
                if existing_plan.max_generations != current_max_generations: needs_update = True
                if existing_plan.is_active != True: needs_update = True # Garantir que planos Stripe ativos estejam ativos no DB

                if needs_update:
                    crud.update_subscription_plan(
                        db,
                        db_obj=existing_plan,
                        obj_in=schemas.SubscriptionPlanUpdate(
                            name=plan_name,
                            description=sp_data["description"],
                            unit_amount=sp_data["unit_amount"],
                            currency=sp_data["currency"],
                            interval=sp_data["interval"],
                            interval_count=sp_data["interval_count"],
                            type=sp_data["type"],
                            price_id_stripe=stripe_price_id,
                            max_generations=current_max_generations,
                            is_active=True # Garantir que o plano esteja ativo
                        )
                    )
                    logger.debug(f"Plano existente atualizado (por price_id): {existing_plan.name} - {existing_plan.interval}")
                else:
                    logger.debug(f"Plano existente inalterado: {existing_plan.name} - {existing_plan.interval}")
            else:
                crud.create_subscription_plan(
                    db=db,
                    plan=schemas.SubscriptionPlanCreate(
                        name=plan_name,
                        description=sp_data["description"],
                        price_id_stripe=stripe_price_id,
                        unit_amount=sp_data["unit_amount"],
                        currency=sp_data["currency"],
                        interval=sp_data["interval"],
                        interval_count=sp_data["interval_count"],
                        type=sp_data["type"],
                        max_generations=current_max_generations,
                        is_active=True # Criar como ativo
                    )
                )
                logger.debug(f"Novo plano Stripe criado no DB: {plan_name} - {sp_data['interval']} (price_id: {stripe_price_id})")

        # Garanta que o plano "Free" exista e esteja com as configurações corretas
        free_plan_db = crud.get_subscription_plan_by_name(db, "Free", interval="month") # Especifica o intervalo para o plano Free
        if not free_plan_db:
            free_plan_db = crud.create_subscription_plan(
                db=db,
                plan=schemas.SubscriptionPlanCreate(
                    name="Free",
                    description="Plano gratuito com funcionalidades básicas.",
                    price_id_stripe=settings.STRIPE_FREE_PLAN_PRICE_ID,
                    unit_amount=0,
                    currency="BRL",
                    interval="month",
                    interval_count=1,
                    type="recurring",
                    max_generations=settings.FREE_PLAN_MAX_GENERATIONS,
                    is_active=True
                )
            )
            if not free_plan_db:
                raise HTTPException(status_code=500, detail="Could not create Free plan.")
            logger.info("Plano 'Free' criado no banco de dados.")
        else:
            # Atualiza o plano "Free" caso os valores configurados no .env tenham mudado
            if (free_plan_db.price_id_stripe != settings.STRIPE_FREE_PLAN_PRICE_ID or
                free_plan_db.max_generations != settings.FREE_PLAN_MAX_GENERATIONS or
                free_plan_db.unit_amount != 0 or
                free_plan_db.currency != "BRL" or # Garante que currency, interval, etc. estão corretos
                free_plan_db.interval != "month" or
                free_plan_db.interval_count != 1 or
                free_plan_db.type != "recurring" or
                free_plan_db.is_active != True): # Garante que o Free plan está ativo
                
                crud.update_subscription_plan(
                    db,
                    db_obj=free_plan_db,
                    obj_in=schemas.SubscriptionPlanUpdate(
                        name="Free",
                        description="Plano gratuito com funcionalidades básicas.",
                        price_id_stripe=settings.STRIPE_FREE_PLAN_PRICE_ID,
                        unit_amount=0,
                        currency="BRL",
                        interval="month",
                        interval_count=1,
                        type="recurring",
                        max_generations=settings.FREE_PLAN_MAX_GENERATIONS,
                        is_active=True
                    )
                )
                logger.info("Plano 'Free' atualizado no banco de dados.")

            if not any(p.get('price_id_stripe') == settings.STRIPE_FREE_PLAN_PRICE_ID for p in stripe_products_and_prices):
                logger.warning(f"Preço Stripe ID {settings.STRIPE_FREE_PLAN_PRICE_ID} para o plano 'Free' não encontrado no Stripe (esperado).")

        db_plans = crud.get_all_subscription_plans(db)

        logger.info(f"Planos recuperados do DB antes da serialização: {[p.name for p in db_plans]}")
        for p in db_plans:
            logger.debug(f"Detalhes do plano DB: ID={p.id}, Nome={p.name}, Preço={p.unit_amount}, MaxGenerations={p.max_generations}, PriceIDStripe={p.price_id_stripe}, Tipo={p.type}, Interval={p.interval}, IntervalCount={p.interval_count}, IsActive={getattr(p, 'is_active', None)}")

        return db_plans

    except Exception as e:
        logger.exception("Erro inesperado em get_subscription_plans:")
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor ao buscar planos: {e}")


# --- Endpoint para criar uma sessão de checkout do Stripe ---
@router.post("/create-checkout-session/{price_id}", response_model=schemas.CheckoutSessionResponse) # Use CheckoutSessionResponse (schema a ser definido)
async def create_checkout_session(
    price_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    logger.info(f"###### DEBUG (Endpoint - create_checkout_session): Função iniciada para price_id: {price_id} e user_id: {current_user.id} ######")
    
    if not current_user.stripe_customer_id:
        logger.info(f"###### DEBUG: Cliente Stripe não encontrado para {current_user.email}. Criando novo... ######")
        customer_id = await stripe_service.create_stripe_customer(current_user.email, current_user.id)
        crud.update_user_stripe_customer_id(db, current_user.id, customer_id)
        db.refresh(current_user)
        logger.info(f"###### DEBUG: Cliente Stripe criado com ID: {customer_id} ######")
    else:
        customer_id = current_user.stripe_customer_id
        logger.info(f"###### DEBUG: Cliente Stripe existente para {current_user.email}: {customer_id} ######")

    try:
        checkout_url = await stripe_service.create_checkout_session(customer_id, price_id, current_user.id)
        logger.info(f"###### DEBUG: Sessão de checkout Stripe criada: {checkout_url} ######")
        return {"checkout_url": checkout_url} # Retorna um dicionário que será validado pelo response_model
    except Exception as e:
        logger.error(f"###### ERRO: Falha ao criar sessão de checkout para {current_user.email} (price_id: {price_id}): {e} ######")
        raise HTTPException(status_code=500, detail="Falha ao criar sessão de checkout.")

# --- Endpoint de Webhook do Stripe ---
@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')

    if not sig_header:
        logger.error("###### ERRO (Webhook): Cabeçalho 'stripe-signature' ausente. Retornando 400. ######")
        raise HTTPException(status_code=400, detail="Cabeçalho 'stripe-signature' ausente.")

    try:
        event = await stripe_service.retrieve_stripe_event(payload, sig_header)
        logger.info(f"###### DEBUG (Webhook): Evento Stripe construído com sucesso: {event['type']} (ID: {event['id']}) ######")
    except ValueError as e:
        logger.error(f"Erro de payload do webhook: {e}")
        raise HTTPException(status_code=400, detail=f"Payload inválido: {e}")
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"Erro de verificação de assinatura do webhook: {e}")
        raise HTTPException(status_code=400, detail=f"Assinatura do webhook inválida: {e}")
    except Exception as e:
        logger.exception(f"Erro inesperado ao processar webhook: {e}") # Usar exception para ver traceback
        raise HTTPException(status_code=500, detail=f"Erro inesperado ao processar webhook: {e}")

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        customer_id = session.get('customer')
        subscription_id = session.get('subscription')
        user_id_from_metadata = session['metadata'].get('user_id')
        price_id_from_metadata = session['metadata'].get('price_id')

        logger.info(f"Checkout Session Completed: Customer {customer_id}, Subscription {subscription_id}, User {user_id_from_metadata}, Price {price_id_from_metadata}")

        if user_id_from_metadata and subscription_id:
            user = crud.get_user(db, int(user_id_from_metadata)) # Use crud.get_user
            if user:
                user.stripe_subscription_id = subscription_id
                
                target_plan = crud.get_subscription_plan_by_stripe_price_id(db, price_id_from_metadata) # Use crud.get_subscription_plan_by_stripe_price_id
                if target_plan:
                    user.subscription_plan_id = target_plan.id
                    user.content_generations_count = 0 # Resetar contador ao mudar de plano (opcional)
                    db.add(user)
                    db.commit()
                    db.refresh(user)
                    logger.info(f"Usuário {user.email} atualizado para o plano {target_plan.name}.")
                else:
                    logger.warning(f"AVISO: Plano Stripe ID {price_id_from_metadata} não encontrado no DB para o usuário {user.email}.")
            else:
                logger.warning(f"AVISO: Usuário com ID {user_id_from_metadata} não encontrado para o webhook.")

    elif event['type'] == 'customer.subscription.updated':
        subscription = event['data']['object']
        customer_id = subscription.get('customer')
        new_status = subscription.get('status')
        current_price_id = subscription.get('items', {}).get('data', [{}])[0].get('price', {}).get('id')

        user = crud.get_user_by_stripe_customer_id(db, customer_id) # Use crud.get_user_by_stripe_customer_id
        if user:
            logger.info(f"Assinatura do cliente {customer_id} atualizada para status: {new_status}")
            
            # Se a assinatura for ativa e o preço mudar, atualize o plano do usuário
            if new_status == 'active' and current_price_id and user.stripe_subscription_id == subscription.id:
                target_plan = crud.get_subscription_plan_by_stripe_price_id(db, current_price_id)
                if target_plan:
                    user.subscription_plan_id = target_plan.id
                    user.content_generations_count = 0 # Resetar contador ao mudar de plano (opcional, como no checkout)
                    db.add(user)
                    db.commit()
                    db.refresh(user)
                    logger.info(f"Usuário {user.email} plano atualizado para {target_plan.name} via customer.subscription.updated.")
                else:
                    logger.warning(f"AVISO: Plano Stripe ID {current_price_id} não encontrado no DB para o usuário {user.email} durante update de assinatura.")
            elif new_status == 'canceled' or new_status == 'unpaid':
                # Reverter para o plano 'Free' se a assinatura for cancelada ou não paga
                free_plan = crud.get_subscription_plan_by_name(db, "Free")
                if free_plan:
                    user.stripe_subscription_id = None
                    user.subscription_plan_id = free_plan.id
                    user.content_generations_count = 0
                    db.add(user)
                    db.commit()
                    db.refresh(user)
                    logger.info(f"Assinatura do usuário {user.email} foi cancelada/não paga. Revertido para plano Free.")
                else:
                    logger.error(f"ERRO: Plano 'Free' não encontrado ao tentar reverter assinatura cancelada para {user.email}.")

        else:
            logger.warning(f"AVISO: Usuário com Stripe Customer ID {customer_id} não encontrado para o webhook updated.")

    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        customer_id = subscription.get('customer')
        
        user = crud.get_user_by_stripe_customer_id(db, customer_id) # Use crud.get_user_by_stripe_customer_id
        if user:
            logger.info(f"Assinatura do cliente {customer_id} deletada.")
            user.stripe_subscription_id = None
            
            # Atribuir o plano "Free" em vez de None
            free_plan = crud.get_subscription_plan_by_name(db, "Free")
            if free_plan:
                user.subscription_plan_id = free_plan.id
                user.content_generations_count = 0 # Resetar gerações
                db.add(user)
                db.commit()
                db.refresh(user)
                logger.info(f"Assinatura do usuário {user.email} removida do DB e atribuído plano Free.")
            else:
                logger.error(f"ERRO: Plano 'Free' não encontrado ao tentar remover assinatura para {user.email}.")

        else:
            logger.warning(f"AVISO: Usuário com Stripe Customer ID {customer_id} não encontrado para o webhook deleted.")
    
    return JSONResponse(content={"received": True}, status_code=200)

# CANCELAR ASSINATURA
@router.post("/cancel-subscription", status_code=200)
async def cancel_user_subscription(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if not current_user.stripe_subscription_id:
        raise HTTPException(status_code=400, detail="Usuário não possui uma assinatura ativa.")

    try:
        subscription = await stripe_service.cancel_subscription(
            current_user.stripe_subscription_id,
            at_period_end=True  # ou False se quiser cancelamento imediato
        )
        
        return {
            "message": "Assinatura marcada para cancelamento ao final do período.",
            "subscription_id": subscription.id,
            "cancel_at_period_end": subscription.cancel_at_period_end,
            "current_period_end": subscription.current_period_end
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
