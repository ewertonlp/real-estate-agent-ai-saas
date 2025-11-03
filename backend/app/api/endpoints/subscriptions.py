# backend/app/api/endpoints/subscriptions.py
import asyncio
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse # Importar JSONResponse se usado no webhook
from sqlalchemy.orm import Session
from app import crud, schemas, models # Certifique-se que crud, schemas, models estão importados
from app.core.config import settings
from app.services.email_service import send_cancellation_email_resend, send_plan_subscribed_email_resend
from app.services import stripe_service

from datetime import datetime
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
        return JSONResponse(content={"error": "Cabeçalho 'stripe-signature' ausente"}, status_code=400)

    try:
        event = await stripe_service.retrieve_stripe_event(payload, sig_header)
        logger.info(f"###### DEBUG (Webhook): Evento Stripe construído com sucesso: {event['type']} (ID: {event['id']}) ######")
    except ValueError as e:
        logger.error(f"Erro de payload do webhook: {e}")
        return JSONResponse(content={"error": f"Payload inválido: {e}"}, status_code=400)
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"Erro de verificação de assinatura do webhook: {e}")
        return JSONResponse(content={"error": f"Assinatura do webhook inválida: {e}"}, status_code=400)
    except Exception as e:
        logger.exception(f"Erro inesperado ao processar webhook: {e}")
        return JSONResponse(content={"error": f"Erro inesperado: {e}"}, status_code=500)

    # Processar evento checkout.session.completed
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # 1. Verificação segura de metadata
        metadata = session.get('metadata', {})
        user_id_from_metadata = metadata.get('user_id')
        price_id_from_metadata = metadata.get('price_id')
        
        # 2. Obter campos essenciais
        customer_id = session.get('customer')
        subscription_id = session.get('subscription')
        
        logger.info(f"Checkout Session Completed: Customer {customer_id}, "
                   f"Subscription {subscription_id}, "
                   f"User {user_id_from_metadata}, "
                   f"Price {price_id_from_metadata}")

        # 3. Validação de campos obrigatórios
        if not all([user_id_from_metadata, subscription_id, price_id_from_metadata]):
            logger.error("Dados essenciais faltando no webhook: user_id, subscription_id ou price_id")
            return JSONResponse(
                content={"error": "Dados incompletos no metadata"},
                status_code=400
            )

        try:
            user_id = int(user_id_from_metadata)
        except (TypeError, ValueError):
            logger.error(f"User ID inválido: {user_id_from_metadata}")
            return JSONResponse(
                content={"error": "User ID deve ser um número inteiro"},
                status_code=400
            )

        # 4. Busca de usuário
        user = crud.get_user(db, user_id)
        if not user:
            logger.error(f"Usuário não encontrado: ID {user_id}")
            return JSONResponse(
                content={"error": "Usuário não encontrado"},
                status_code=404
            )
        
        # 5. Busca de plano
        target_plan = crud.get_subscription_plan_by_stripe_price_id(db, price_id_from_metadata)
        if not target_plan:
            logger.error(f"Plano não encontrado: Price ID {price_id_from_metadata}")
            return JSONResponse(
                content={"error": "Plano de assinatura não encontrado"},
                status_code=404
            )

        # 6. Atualizar informações do usuário
        try:
            user.stripe_subscription_id = subscription_id
            user.subscription_plan_id = target_plan.id
            user.content_generations_count = 0
            
            db.add(user)
            db.commit()
            db.refresh(user)
            logger.info(f"Usuário {user.email} atualizado para o plano {target_plan.name}.")
        except Exception as e:
            logger.exception(f"Erro ao atualizar usuário: {e}")
            db.rollback()
            return JSONResponse(
                content={"error": "Erro ao atualizar informações do usuário"},
                status_code=500
            )

        # 7. Enviar e-mail de confirmação (assíncrono)
        try:
            stripe_subscription = stripe.Subscription.retrieve(subscription_id)
            start_date = datetime.fromtimestamp(stripe_subscription.current_period_start).strftime("%d/%m/%Y")
            end_date = datetime.fromtimestamp(stripe_subscription.current_period_end).strftime("%d/%m/%Y")
            
            asyncio.create_task(send_plan_subscribed_email_resend(
                to_email=user.email,
                name=user.nome or "Usuário",
                plan_name=target_plan.name,
                start_date=start_date,
                end_date=end_date
            ))
            logger.info(f"E-mail de confirmação enviado para {user.email}.")
        except Exception as e:
            logger.error(f"ERRO ao enviar e-mail: {e}")
            # Não interrompe o fluxo principal por erro no e-mail

    # Processar evento customer.subscription.updated
    elif event['type'] == 'customer.subscription.updated':
        subscription = event['data']['object']
        customer_id = subscription.get('customer')
        new_status = subscription.get('status')
        subscription_id = subscription.get('id')
        
        # Obter price_id atual
        try:
            current_price_id = subscription['items']['data'][0]['price']['id']
        except (KeyError, IndexError):
            current_price_id = None
            logger.warning("Não foi possível obter o price_id da assinatura atualizada")

        user = crud.get_user_by_stripe_customer_id(db, customer_id)
        if not user:
            logger.warning(f"Usuário com Stripe Customer ID {customer_id} não encontrado")
            return JSONResponse(content={"warning": "Usuário não encontrado"}, status_code=200)

        logger.info(f"Assinatura atualizada: Customer {customer_id}, Status: {new_status}")
        
        try:
            # Atualização de plano
            if new_status == 'active' and current_price_id:
                target_plan = crud.get_subscription_plan_by_stripe_price_id(db, current_price_id)
                if target_plan:
                    user.subscription_plan_id = target_plan.id
                    user.content_generations_count = 0
                    db.add(user)
                    db.commit()
                    logger.info(f"Plano do usuário {user.email} atualizado para {target_plan.name}")
                else:
                    logger.warning(f"Plano com price_id {current_price_id} não encontrado")
            
            # Cancelamento ou não pagamento
            elif new_status in ['canceled', 'unpaid']:
                free_plan = crud.get_subscription_plan_by_name(db, "Free")
                if free_plan:
                    user.stripe_subscription_id = None
                    user.subscription_plan_id = free_plan.id
                    user.content_generations_count = 0
                    db.add(user)
                    db.commit()
                    logger.info(f"Usuário {user.email} revertido para plano Free")
                else:
                    logger.error("Plano Free não encontrado no banco de dados")
        except Exception as e:
            logger.exception(f"Erro ao processar atualização de assinatura: {e}")
            db.rollback()

    # Processar evento customer.subscription.deleted
    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        customer_id = subscription.get('customer')
        subscription_id = subscription.get('id')
        
        user = crud.get_user_by_stripe_customer_id(db, customer_id)
        if not user:
            logger.warning(f"Usuário com Stripe Customer ID {customer_id} não encontrado")
            return JSONResponse(content={"warning": "Usuário não encontrado"}, status_code=200)

        logger.info(f"Assinatura excluída: Customer {customer_id}, Subscription {subscription_id}")
        
        try:
            free_plan = crud.get_subscription_plan_by_name(db, "Free")
            if free_plan:
                user.stripe_subscription_id = None
                user.subscription_plan_id = free_plan.id
                user.content_generations_count = 0
                db.add(user)
                db.commit()
                logger.info(f"Usuário {user.email} atribuído ao plano Free")
            else:
                logger.error("Plano Free não encontrado no banco de dados")
        except Exception as e:
            logger.exception(f"Erro ao processar exclusão de assinatura: {e}")
            db.rollback()

    # Responder para todos os tipos de evento
    return JSONResponse(content={"received": True}, status_code=200)

# CANCELAR ASSINATURA
@router.post("/cancel-subscription", status_code=status.HTTP_200_OK, summary="Cancela a assinatura de um usuário")
async def cancel_user_subscription(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Cancela a assinatura Stripe de um usuário.
    A assinatura será cancelada ao final do período atual.
    """
    if not current_user.stripe_subscription_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Usuário não possui uma assinatura ativa.")

    try:
        # Chama o serviço Stripe para cancelar a assinatura
        subscription = await stripe_service.cancel_subscription(
            current_user.stripe_subscription_id,
            at_period_end=True  # Define para cancelar no final do período atual
        )

        # Opcional: Atualizar o status da assinatura no seu banco de dados, se necessário
        # Exemplo: current_user.subscription_status = "canceled_at_period_end"
        # db.add(current_user)
        # db.commit()
        # db.refresh(current_user)

        # Enviar e-mail de confirmação de cancelamento em segundo plano
        # Converte o timestamp do Stripe para uma string de data formatada
        subscription_end = datetime.fromtimestamp(subscription.current_period_end).strftime("%d/%m/%Y")

        # Cria uma tarefa assíncrona para enviar o e-mail,
        # permitindo que a resposta da API seja retornada imediatamente.
        asyncio.create_task(send_cancellation_email_resend(
            to_email=current_user.email,
            nome=current_user.nome or "Usuário", # Usa o nome do usuário ou "Usuário" como fallback
            subscription_end=subscription_end
        ))

        return {
            "message": "Assinatura marcada para cancelamento ao final do período.",
            "subscription_id": subscription.id,
            "cancel_at_period_end": subscription.cancel_at_period_end,
            "current_period_end": subscription.current_period_end
        }
    except Exception as e:
        # Captura e levanta uma exceção HTTP para erros no processo de cancelamento
        print(f"Erro ao cancelar assinatura ou enviar e-mail: {e}") # Log para depuração
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erro ao processar o cancelamento da assinatura: {str(e)}")
