import os
import resend
from fastapi.templating import Jinja2Templates
from fastapi import Request

# Inicializa o cliente Resend com a chave API do ambiente
# Certifique-se de que a variável de ambiente RESEND_API_KEY esteja definida
resend.api_key = os.environ["RESEND_API_KEY"]

# Configura o diretório para os templates Jinja2
# O caminho é relativo ao diretório onde o FastAPI está sendo executado
templates = Jinja2Templates(directory="app/templates")

async def send_registration_email_resend(to_email: str, name: str):
        """
        Envia um e-mail de boas-vindas para novos usuários após o registro.
        """
        html_content = templates.get_template("email/registration_welcome.html").render({
            "name": name
        })

        params: resend.Emails.SendParams = {
        "from": "AuraSync <onboarding@resend.dev>",
        "to": [to_email],
        "subject": "Bem-vindo(a) à AuraSync!",
        "html": html_content
    }

        try:
            email = resend.Emails.send(params)
            print(email)  # Log da resposta da API
            return email
        except Exception as e:
            print("Erro ao enviar email:", str(e))
        raise



async def send_password_changed_email_resend(to_email: str, name: str):
    """
    Envia um e-mail para notificar o usuário sobre a alteração de senha.
    """
    # Renderiza o template HTML para o e-mail de senha alterada
    html_content = templates.get_template("email/password_changed.html").render({
        "name": name
    })

    try:
        # Envia o e-mail usando o Resend
        await resend.emails.send({
            "from": "AuraSync <onboarding@resend.dev>",  # Domínio verificado no Resend
            "to": [to_email],
            "subject": "Sua senha foi alterada com sucesso",
            "html": html_content
        })
        print(f"E-mail de senha alterada enviado para: {to_email}")
    except Exception as e:
        print(f"Erro ao enviar e-mail de senha alterada para {to_email}: {e}")

async def send_plan_subscribed_email_resend(to_email: str, name: str, plan_name: str, start_date: str, end_date: str):
    """
    Envia um e-mail de confirmação de assinatura de plano.
    """
    # Renderiza o template HTML para o e-mail de plano contratado
    html_content = templates.get_template("email/plan_subscribed.html").render({
        "name": name,
        "plan_name": plan_name,
        "start_date": start_date,
        "end_date": end_date
    })

    try:
        # Envia o e-mail usando o Resend
        await resend.emails.send({
            "from": "AuraSync <onboarding@resend.dev>",  # Domínio verificado no Resend
            "to": [to_email],
            "subject": "Confirmação de Assinatura do Plano AuraSync",
            "html": html_content
        })
        print(f"E-mail de plano contratado enviado para: {to_email}")
    except Exception as e:
        print(f"Erro ao enviar e-mail de plano contratado para {to_email}: {e}")

async def send_cancellation_email_resend(to_email: str, nome: str, subscription_end: str):
    """
    Envia um e-mail de notificação de cancelamento de assinatura.
    Esta é a função que você já tinha, incluída para completude.
    """
    # Renderiza o HTML com Jinja2 manualmente
    html_content = templates.get_template("email/cancellation_notice.html").render({
        "nome": nome,
        "data_fim": subscription_end
    })

    try:
        await resend.emails.send({
            "from": "AuraSync <onboarding@resend.dev>",  # Domínio verificado no Resend
            "to": [to_email],
            "subject": "Sua assinatura foi cancelada",
            "html": html_content
        })
        print(f"E-mail de cancelamento enviado para: {to_email}")
    except Exception as e:
        print(f"Erro ao enviar e-mail de cancelamento para {to_email}: {e}")
