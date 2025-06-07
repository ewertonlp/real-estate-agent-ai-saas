# backend/app/api/endpoints/subscriptions.py

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import RedirectResponse, JSONResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.endpoints.history import get_current_user
from app.models import User, SubscriptionPlan # Importe os modelos User e SubscriptionPlan
from app.schemas import SubscriptionPlan as SubscriptionPlanSchema # Use SubscriptionPlanSchema for response
from app.services import stripe_service
from app.core.config import settings
import stripe

router = APIRouter() # <--- ESSA LINHA PRECISA ESTAR AQUI NO INÍCIO

@router.get("/plans", response_model=list[SubscriptionPlanSchema])
async def get_subscription_plans(db: Session = Depends(get_db)):
    print("\n--- INICIANDO get_subscription_plans ---") # Print para indicar o início da função

    # 1. Obtenha os planos do seu banco de dados
    db_plans = db.query(SubscriptionPlan).filter(SubscriptionPlan.is_active == True).all()
    if not db_plans:
        print("--- NENHUM PLANO ATIVO ENCONTRADO NO DB DA APLICACAO, LEVANTANDO 404 ---")
        raise HTTPException(status_code=404, detail="Nenhum plano de assinatura encontrado.")

    # 2. Obtenha todos os produtos e preços do Stripe
    try:
        stripe_products_prices = await stripe_service.get_all_stripe_products_and_prices()
        print(f"Dados Stripe: {stripe_products_prices}")
    except Exception as e:
        print(f"Erro ao buscar produtos/preços do Stripe: {e}")
        raise HTTPException(status_code=500, detail="Erro ao carregar dados do Stripe.")

    # 3. Combine os dados do DB com os dados do Stripe
    plans_for_frontend = []
    for db_plan in db_plans:
        # Encontrar o preço correspondente no Stripe
        stripe_price_info = next(
            (sp for sp in stripe_products_prices if sp["price_id_stripe"] == db_plan.price_id_stripe),
            None
        )
        
        if stripe_price_info:
            plans_for_frontend.append(
                SubscriptionPlanSchema(
                    id=db_plan.id,
                    name=db_plan.name,
                    description=db_plan.description,
                    max_generations=db_plan.max_generations,
                    price_id_stripe=db_plan.price_id_stripe,
                    is_active=db_plan.is_active,
                    unit_amount=stripe_price_info["unit_amount"], #
                    currency=stripe_price_info["currency"], #
                    interval=stripe_price_info["interval"] #
                )
            )
        else:
            print(f"AVISO: Preço Stripe ID {db_plan.price_id_stripe} para o plano '{db_plan.name}' não encontrado no Stripe.")
            # Opcional: Você pode optar por não incluir planos sem preço Stripe válido
            # ou incluir com valores nulos para `unit_amount`, `currency`, `interval`.
            # Por enquanto, ele será incluído se encontrado, caso contrário não será adicionado ao `plans_for_frontend`.

    if not plans_for_frontend:
        raise HTTPException(status_code=404, detail="Nenhum plano com preços Stripe válidos encontrado.")

    print(f"Retornando {len(plans_for_frontend)} planos enriquecidos para o frontend.")
    return plans_for_frontend




# --- Endpoint para criar uma sessão de checkout do Stripe ---
@router.post("/create-checkout-session/{price_id}")
async def create_checkout_session(
    price_id: str, # ID do preço do Stripe para o plano
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Cria uma sessão de checkout do Stripe para o usuário.
    Redireciona o usuário para a página de pagamento do Stripe.
    """
    if not current_user.stripe_customer_id:
        # Se o usuário não tem um customer_id no Stripe, cria um
        try:
            customer_id = await stripe_service.create_stripe_customer(current_user.email, current_user.id)
            current_user.stripe_customer_id = customer_id
            db.add(current_user)
            db.commit()
            db.refresh(current_user)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro ao criar cliente Stripe: {e}")
    else:
        customer_id = current_user.stripe_customer_id

    try:
        checkout_session_url = await stripe_service.create_checkout_session(
            customer_id=customer_id,
            price_id=price_id,
            user_id=current_user.id
        )
        return {"checkout_url": checkout_session_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao criar sessão de checkout: {e}")

# --- Endpoint de Webhook do Stripe ---
@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Recebe eventos de webhook do Stripe e atualiza o status da assinatura do usuário.
    """
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')

    if not sig_header:
        raise HTTPException(status_code=400, detail="Cabeçalho 'stripe-signature' ausente.")

    try:
        event = await stripe_service.retrieve_stripe_event(payload, sig_header)
    except ValueError as e:
        # Invalid payload
        raise HTTPException(status_code=400, detail=f"Payload inválido: {e}")
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise HTTPException(status_code=400, detail=f"Assinatura do webhook inválida: {e}")
    except Exception as e:
        # Other errors during event construction
        raise HTTPException(status_code=500, detail=f"Erro inesperado ao processar webhook: {e}")

    # Lidar com os tipos de eventos importantes
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        customer_id = session.get('customer')
        subscription_id = session.get('subscription')
        user_id_from_metadata = session['metadata'].get('user_id')
        price_id_from_metadata = session['metadata'].get('price_id')

        print(f"Checkout Session Completed: Customer {customer_id}, Subscription {subscription_id}, User {user_id_from_metadata}")

        if user_id_from_metadata and subscription_id:
            user = db.query(User).filter(User.id == int(user_id_from_metadata)).first()
            if user:
                user.stripe_subscription_id = subscription_id
                
                # Encontrar o plano de assinatura pelo price_id_stripe
                target_plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.price_id_stripe == price_id_from_metadata).first()
                if target_plan:
                    user.subscription_plan_id = target_plan.id
                    user.content_generations_count = 0 # Resetar contador ao mudar de plano (opcional)
                    db.add(user)
                    db.commit()
                    db.refresh(user)
                    print(f"Usuário {user.email} atualizado para o plano {target_plan.name}.")
                else:
                    print(f"AVISO: Plano Stripe ID {price_id_from_metadata} não encontrado no DB para o usuário {user.email}.")
            else:
                print(f"AVISO: Usuário com ID {user_id_from_metadata} não encontrado para o webhook.")

    elif event['type'] == 'customer.subscription.updated':
        subscription = event['data']['object']
        customer_id = subscription.get('customer')
        new_status = subscription.get('status') # Ex: 'active', 'canceled', 'past_due'
        
        user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
        if user:
            print(f"Assinatura do cliente {customer_id} atualizada para status: {new_status}")
            # Você pode adicionar lógica para lidar com diferentes status aqui
            # Ex: se new_status == 'canceled', pode desativar funcionalidades premium
        else:
            print(f"AVISO: Usuário com Stripe Customer ID {customer_id} não encontrado para o webhook updated.")

    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        customer_id = subscription.get('customer')
        
        user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
        if user:
            print(f"Assinatura do cliente {customer_id} deletada.")
            user.stripe_subscription_id = None
            user.subscription_plan_id = None # Ou defina para o plano Free se desejar
            user.content_generations_count = 0 # Resetar gerações
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"Assinatura do usuário {user.email} removida do DB.")
        else:
            print(f"AVISO: Usuário com Stripe Customer ID {customer_id} não encontrado para o webhook deleted.")
    
    # Adicione mais tipos de eventos conforme necessário (ex: invoice.payment_succeeded, invoice.payment_failed)

    return JSONResponse(content={"received": True}, status_code=200)