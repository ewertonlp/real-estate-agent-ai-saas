# backend/app/api/endpoints/image_generator.py

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from fastapi.responses import StreamingResponse # Para retornar a imagem
from typing import Literal
from app.api.endpoints.history import get_current_user # Reutiliza a dependência de autenticação
from app.services.image_generator_service import generate_image_with_text_overlay, TEMPLATES # Importe o serviço e templates
import io # Para BytesIO
from app import models

router = APIRouter()

@router.post("/generate-image", response_class=StreamingResponse)
async def generate_image_post(
    image: UploadFile = File(...), # O arquivo de imagem enviado
    text: str = Form(...),        # O texto a ser sobreposto
    template: Literal[tuple(TEMPLATES.keys())] = Form("padrao"), # O template escolhido
    current_user: models.User = Depends(get_current_user) # Protege o endpoint
):
    """
    Gera uma imagem com texto sobreposto, usando uma imagem de upload e um template.
    """
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="O arquivo enviado não é uma imagem.")

    try:
        image_bytes = await image.read() # Lê os bytes da imagem
        
        # Chama o serviço para gerar a imagem com o texto
        processed_image_stream = await generate_image_with_text_overlay(
            image_bytes=image_bytes,
            text_content=text,
            template_name=template
        )

        # Retorna a imagem processada como um StreamingResponse
        return StreamingResponse(processed_image_stream, media_type="image/png")

    except Exception as e:
        print(f"Erro ao processar imagem: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao processar imagem: {e}")