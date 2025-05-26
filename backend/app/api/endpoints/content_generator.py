

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict
# Certifique-se de que esta importação está correta para o serviço Gemini
from app.services.gemini_service import generate_content_for_real_estate # OU openai_service se não renomeou

# ESTA LINHA É CRÍTICA!
router = APIRouter() # <--- O objeto 'router' precisa ser definido aqui!

# Define o modelo de dados para a requisição de geração de conteúdo
class ContentRequest(BaseModel):
    prompt: str

# Define o modelo de dados para a resposta da geração de conteúdo
class ContentResponse(BaseModel):
    generated_content: str

@router.post("/generate-text", response_model=ContentResponse)
async def generate_real_estate_content(request: ContentRequest):
    """
    Endpoint para gerar conteúdo de texto otimizado para redes sociais de imóveis.
    """
    if not request.prompt:
        raise HTTPException(status_code=400, detail="O prompt não pode estar vazio.")

    generated_text = await generate_content_for_real_estate(request.prompt)

    return ContentResponse(generated_content=generated_text)