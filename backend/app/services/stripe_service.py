# backend/app/services/stripe_service.py

import stripe
from app.core.config import settings
from app.models import User, SubscriptionPlan # Importe os modelos User e SubscriptionPlan
from typing import List, Dict, Any
import logging # Adicione esta importação

logger = logging.getLogger(__name__) # Inicialize o logger

# Configure a chave secreta do Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

PLAN_PRICE_IDS = {
    settings.STRIPE_FREE_PLAN_PRICE_ID: "Free",
    settings.STRIPE_BASIC_MONTHLY_PLAN_PRICE_ID: "Basic",
    settings.STRIPE_PREMIUM_MONTHLY_PLAN_PRICE_ID: "Premium",
    settings.STRIPE_UNLIMITED_MONTHLY_PLAN_PRICE_ID: "Unlimited",
    settings.STRIPE_BASIC_ANNUAL_PLAN_PRICE_ID: "Basic",
    settings.STRIPE_PREMIUM_ANNUAL_PLAN_PRICE_ID: "Premium",
    settings.STRIPE_UNLIMITED_ANNUAL_PLAN_PRICE_ID: "Unlimited", 
}

async def create_stripe_customer(user_email: str, user_id: int):
    """
    Cria um cliente no Stripe para um novo usuário.
    Retorna o ID do cliente Stripe.
    """
    try:
        customer = stripe.Customer.create(
            email=user_email,
            metadata={"user_id": user_id} # Guarda o ID do seu usuário para referência
        )
        return customer.id
    except stripe.error.StripeError as e:
        print(f"Erro ao criar cliente Stripe: {e}")
        raise

async def create_checkout_session(customer_id: str, price_id: str, user_id: int):
    """
    Cria uma sessão de checkout do Stripe para uma nova assinatura.
    """
    try:
        checkout_session = stripe.checkout.Session.create(
            customer=customer_id,
            line_items=[
                {
                    "price": price_id,
                    "quantity": 1,
                },
            ],
            mode="subscription",
            success_url=settings.STRIPE_SUCCESS_URL,
            cancel_url=settings.STRIPE_CANCEL_URL,
            metadata={
                "user_id": str(user_id), # Certifique-se de que é string para o Stripe
                "price_id": price_id # Para rastrear qual preço foi selecionado
            }
        )
        return checkout_session.url
    except stripe.error.StripeError as e:
        print(f"Erro ao criar sessão de checkout Stripe: {e}")
        raise

async def get_stripe_price_id_for_plan(plan_name: str) -> str:
    """
    Retorna o Price ID do Stripe para um determinado nome de plano.
    """
    if plan_name == "Free":
        return settings.STRIPE_FREE_PLAN_PRICE_ID
    elif plan_name == "Basic":
        return settings.STRIPE_BASIC_PLAN_PRICE_ID
    elif plan_name == "Premium":
        return settings.STRIPE_PREMIUM_PLAN_PRICE_ID
    else:
        raise ValueError(f"Plano '{plan_name}' não reconhecido.")

async def retrieve_stripe_event(payload: bytes, sig_header: str):
    """
    Verifica e constrói um evento Stripe a partir do payload do webhook.
    """
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
        return event
    except ValueError as e:
        # Invalid payload
        print(f"Erro de payload do webhook: {e}")
        raise
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        print(f"Erro de verificação de assinatura do webhook: {e}")
        raise

async def get_subscription_status(subscription_id: str):
    """
    Obtém o status de uma assinatura do Stripe.
    """
    try:
        subscription = stripe.Subscription.retrieve(subscription_id)
        return subscription.status
    except stripe.error.StripeError as e:
        print(f"Erro ao obter status da assinatura Stripe: {e}")
        raise

async def cancel_stripe_subscription(subscription_id: str):
    """
    Cancela uma assinatura no Stripe.
    """
    try:
        subscription = stripe.Subscription.delete(subscription_id)
        return subscription.status == "canceled"
    except stripe.error.StripeError as e:
        print(f"Erro ao cancelar assinatura Stripe: {e}")
        raise

async def get_all_stripe_products_and_prices() -> List[Dict[str, Any]]:
    
    all_prices_data = []
    try:
        # Fetch all active prices from Stripe, automatically handling pagination
        # Use limit parameter if you have many prices (default is 10)
        prices = stripe.Price.list(active=True, limit=100) # Aumentei o limite para ter certeza de pegar todos, se houver muitos
        

        # Fetch all active products
        products = stripe.Product.list(active=True, limit=100) # Aumentei o limite aqui também


        product_map = {p.id: p for p in products.data}

        for price in prices.data:
            product = product_map.get(price.product)
            if product:
                # Filtrar apenas os preços que correspondem aos IDs que você configurou
                # Isso garante que apenas 'seus' planos sejam processados
                if price.id in PLAN_PRICE_IDS:
                    plan_data = {
                        "id": product.id, # ID do Produto
                        "name": product.name,
                        "description": product.description,
                        "price_id_stripe": price.id, # ID do Preço
                        "unit_amount": price.unit_amount,
                        "currency": price.currency,
                        "interval": price.recurring.interval if price.recurring else None,
                        "interval_count": price.recurring.interval_count if price.recurring else None,
                        "type": price.type,
                    }
                    all_prices_data.append(plan_data)
                else:
                    logger.debug(f"Preço Stripe '{price.id}' ({product.name}) não está nos IDs de plano configurados no backend. Ignorando.")

    except stripe.error.StripeError as e:
        logger.error(f"Erro ao buscar produtos/preços do Stripe: {e}")
        raise
    except Exception as e:
        logger.error(f"Erro inesperado em get_all_stripe_products_and_prices: {e}")
        raise

    logger.info(f"Final list of products and prices fetched from Stripe: {all_prices_data}")
    return all_prices_data


# CANCELAR ASSINATURA

async def cancel_subscription(subscription_id: str, at_period_end: bool = True):
    """
    Cancela uma assinatura do Stripe.
    Se at_period_end=True, cancela no fim do período atual.
    Se False, cancela imediatamente.
    """
    try:
        subscription = stripe.Subscription.modify(
            subscription_id,
            cancel_at_period_end=at_period_end
        )
        return subscription
    except Exception as e:
        raise Exception(f"Erro ao cancelar assinatura: {str(e)}")
