# backend/app/api/endpoints/content_generator.py

from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import crud, schemas, models # Importe crud, schemas e models
from app.api.endpoints.history import get_current_user # Para obter o usuário logado
from app.core.database import get_db # Para obter a sessão do banco de dados
from app.services.gemini_service import generate_text_content # Importe generate_text_content do gemini_service

router = APIRouter() # O objeto 'router' precisa ser definido aqui!

@router.post("/generate", response_model=schemas.GeneratedContentResponse) # Endpoint para gerar conteúdo
async def create_content(
    content_in: schemas.GeneratedContentCreate, # Usar o esquema GeneratedContentCreate para input
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
) -> Any:
    """
    Endpoint para gerar conteúdo de texto otimizado para redes sociais de imóveis.
    Controla o número de gerações com base no plano do usuário e salva detalhes do imóvel.
    """
    if not content_in.prompt_used:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="O prompt não pode estar vazio.")

    # --- Lógica de controle de gerações ---
    # Recarrega o usuário para garantir que o plano e o contador estejam atualizados
    db.refresh(current_user)

    user_plan = current_user.subscription_plan
    if not user_plan:
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

    # Obtenha os novos campos do content_in
    prompt_to_gemini = content_in.prompt_used
    property_value = content_in.property_value
    condo_fee = content_in.condo_fee
    iptu_value = content_in.iptu_value

    # Gerar o texto com o serviço Gemini, passando todos os detalhes
    generated_text = await generate_text_content(
        prompt=prompt_to_gemini,
        property_value=property_value,
        condo_fee=condo_fee,
        iptu_value=iptu_value,
    )

    # Preparar dados para salvar no DB usando o esquema GeneratedContentCreate
    # Note: O esquema GeneratedContentCreate agora inclui todos os campos.
    # O user_id é obtido do current_user. A categoria e is_favorite são definidas aqui como padrão.
    content_data_for_db = schemas.GeneratedContentCreate(
        user_id=current_user.id,
        category="Descrição de Imóvel", # Categoria padrão para este gerador
        prompt_used=content_in.prompt_used, # Salva o prompt original ou construído do frontend
        generated_text=generated_text,
        generated_image_url=None, # Por enquanto, nulo
        is_favorite=False, # Padrão para novo conteúdo
        property_value=property_value,
        condo_fee=condo_fee,
        iptu_value=iptu_value,
    )

    # Criar o registro no banco de dados e incrementar o contador de gerações via CRUD
    db_content = crud.create_user_generated_content(db=db, content=content_data_for_db, user_id=current_user.id)
    
    # Retorna o objeto completo do conteúdo gerado, que será validado pelo response_model
    return db_content