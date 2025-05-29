

from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Dict
# Certifique-se de que esta importação está correta para o serviço Gemini
from app.services.gemini_service import generate_content_for_real_estate # OU openai_service se não renomeou
from app.api.endpoints.history import get_current_user # Para obter o usuário logado
from sqlalchemy.orm import Session # Para acessar o banco de dados
from app.core.database import get_db # Para obter a sessão do banco de dados
from app.models import User # Importe o modelo User

# ESTA LINHA É CRÍTICA!
router = APIRouter() # <--- O objeto 'router' precisa ser definido aqui!

# Define o modelo de dados para a requisição de geração de conteúdo
class ContentRequest(BaseModel):
    prompt: str

# Define o modelo de dados para a resposta da geração de conteúdo
class ContentResponse(BaseModel):
    generated_content: str

@router.post("/generate-text", response_model=ContentResponse)
async def generate_real_estate_content(
    request: ContentRequest,
    current_user: User = Depends(get_current_user), # Obtenha o usuário logado
    db: Session = Depends(get_db) # Obtenha a sessão do DB
):
    """
    Endpoint para gerar conteúdo de texto otimizado para redes sociais de imóveis.
    Controla o número de gerações com base no plano do usuário.
    """
    if not request.prompt:
        raise HTTPException(status_code=400, detail="O prompt não pode estar vazio.")

    # --- Lógica de controle de gerações ---
    # Recarrega o usuário para garantir que o plano e o contador estejam atualizados
    db.refresh(current_user)

    user_plan = current_user.subscription_plan
    if not user_plan:
        # Se o usuário não tem um plano, podemos considerar um plano Free padrão
        # Ou levantar um erro se todos os usuários DEVEM ter um plano
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seu plano de assinatura não pôde ser determinado. Por favor, contate o suporte."
        )

    # Verifica o limite de gerações
    if user_plan.max_generations > 0 and current_user.content_generations_count >= user_plan.max_generations:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Você atingiu o limite de {user_plan.max_generations} gerações para o seu plano '{user_plan.name}'. Faça upgrade para continuar gerando conteúdo."
        )

    # -----------------------------------

    generated_text = await generate_content_for_real_estate(request.prompt)

    # Incrementa o contador de gerações APÓS a geração bem-sucedida
    current_user.content_generations_count += 1
    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return ContentResponse(generated_content=generated_text)



# async def generate_real_estate_content(request: ContentRequest):
#     """
#     Endpoint para gerar conteúdo de texto otimizado para redes sociais de imóveis.
#     """
#     if not request.prompt:
#         raise HTTPException(status_code=400, detail="O prompt não pode estar vazio.")

#     generated_text = await generate_content_for_real_estate(request.prompt)

#     return ContentResponse(generated_content=generated_text)