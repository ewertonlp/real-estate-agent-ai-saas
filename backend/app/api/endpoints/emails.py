from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.email_service import (
    send_registration_email_resend,
    send_password_changed_email_resend,
    send_plan_subscribed_email_resend,
    send_cancellation_email_resend
)

# Cria um novo router para os endpoints de e-mail
router = APIRouter()

# Modelos Pydantic para validação dos dados de entrada
class RegistrationEmailRequest(BaseModel):
    to_email: str
    name: str

class PasswordChangedEmailRequest(BaseModel):
    to_email: str
    name: str

class PlanSubscribedEmailRequest(BaseModel):
    to_email: str
    name: str
    plan_name: str
    start_date: str # Pode ser um formato de data mais específico, como date ou datetime
    end_date: str   # Pode ser um formato de data mais específico, como date ou datetime

class CancellationEmailRequest(BaseModel):
    to_email: str
    name: str
    subscription_end: str # Pode ser um formato de data mais específico, como date ou datetime

@router.post("/send-registration-email", summary="Enviar e-mail de registro")
async def send_registration_email(request: RegistrationEmailRequest):
    """
    Endpoint para enviar um e-mail de boas-vindas a um novo usuário.
    """
    try:
        await send_registration_email_resend(request.to_email, request.name)
        return {"message": "E-mail de registro enviado com sucesso!"}
    except Exception as e:
        # Registra o erro para depuração
        print(f"Erro ao enviar e-mail de registro: {e}")
        raise HTTPException(status_code=500, detail=f"Falha ao enviar e-mail de registro: {e}")

@router.post("/send-password-changed-email", summary="Enviar e-mail de senha alterada")
async def send_password_changed_email(request: PasswordChangedEmailRequest):
    """
    Endpoint para enviar um e-mail de notificação de alteração de senha.
    """
    try:
        await send_password_changed_email_resend(request.to_email, request.name)
        return {"message": "E-mail de senha alterada enviado com sucesso!"}
    except Exception as e:
        # Registra o erro para depuração
        print(f"Erro ao enviar e-mail de senha alterada: {e}")
        raise HTTPException(status_code=500, detail=f"Falha ao enviar e-mail de senha alterada: {e}")

@router.post("/send-plan-subscribed-email", summary="Enviar e-mail de plano contratado")
async def send_plan_subscribed_email(request: PlanSubscribedEmailRequest):
    """
    Endpoint para enviar um e-mail de confirmação de assinatura de plano.
    """
    try:
        await send_plan_subscribed_email_resend(
            request.to_email,
            request.name,
            request.plan_name,
            request.start_date,
            request.end_date
        )
        return {"message": "E-mail de plano contratado enviado com sucesso!"}
    except Exception as e:
        # Registra o erro para depuração
        print(f"Erro ao enviar e-mail de plano contratado: {e}")
        raise HTTPException(status_code=500, detail=f"Falha ao enviar e-mail de plano contratado: {e}")

@router.post("/send-cancellation-email", summary="Enviar e-mail de cancelamento de plano")
async def send_cancellation_email(request: CancellationEmailRequest):
    """
    Endpoint para enviar um e-mail de notificação de cancelamento de plano.
    """
    try:
        await send_cancellation_email_resend(
            request.to_email,
            request.name,
            request.subscription_end
        )
        return {"message": "E-mail de cancelamento enviado com sucesso!"}
    except Exception as e:
        # Registra o erro para depuração
        print(f"Erro ao enviar e-mail de cancelamento: {e}")
        raise HTTPException(status_code=500, detail=f"Falha ao enviar e-mail de cancelamento: {e}")
