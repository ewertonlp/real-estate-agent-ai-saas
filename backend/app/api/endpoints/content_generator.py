# backend/app/api/endpoints/content_generator.py

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)  # Não precisa de Body se não for usar para debug
from sqlalchemy.orm import Session  # Tipo de sessão síncrona
from app import crud, schemas, models
from app.core.security import get_current_user
from app.services.gemini_service import generate_content_for_real_estate
from app.api.deps import get_db  # get_db síncrono

router = APIRouter()


@router.post("/generate-content", response_model=schemas.GeneratedContent)
async def create_content(
    property_details: schemas.PropertyDetailsBase, 
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),  # Tipo de sessão síncrona
):
   
    # Construa a string do prompt para o Gemini usando 'property_details' diretamente
    # REMOVIDO: prompt_to_gemini = schemas.PropertyDetailsInput(...) - Não é necessário
    prompt_string = f"Gere conteúdo para redes sociais sobre um imóvel. Tipo de imóvel: {property_details.property_type}."
    if (
        property_details.bedrooms is not None
    ):  # Use 'is not None' para Optional[int/float]
        prompt_string += f" Quartos: {property_details.bedrooms}."
    if property_details.bathrooms is not None:
        prompt_string += f" Banheiros: {property_details.bathrooms}."
    if property_details.location:  # Strings vazias são Falsy
        prompt_string += f" Localização: {property_details.location}."
    if property_details.special_features:
        prompt_string += (
            f" Características especiais: {property_details.special_features}."
        )
    if property_details.purpose:
        prompt_string += f" Finalidade: {property_details.purpose}."
    if property_details.target_audience:
        prompt_string += f" Público-alvo: {property_details.target_audience}."
    if property_details.tone:
        prompt_string += f" Tom: {property_details.tone}."
    if property_details.length:
        prompt_string += f" Comprimento: {property_details.length}."
    if property_details.language:
        prompt_string += f" Idioma: {property_details.language}."
    if property_details.property_value is not None:
        prompt_string += f" Valor do imóvel: R$ {property_details.property_value}."
    if property_details.condo_fee is not None:
        prompt_string += f" Condomínio: R$ {property_details.condo_fee}."
    if property_details.iptu_value is not None:
        prompt_string += f" IPTU: R$ {property_details.iptu_value}."
    if property_details.additional_details:  # Novo campo
        prompt_string += f" Outros detalhes: {property_details.additional_details}."

    # Adicionar detalhes de SEO/GMB se otimizados
    if property_details.optimize_for_seo_gmb:
        seo_gmb_details = []
        if property_details.seo_keywords:
            seo_gmb_details.append(
                f"Palavras-chave SEO: {property_details.seo_keywords}"
            )
        if property_details.contact_phone:
            seo_gmb_details.append(f"Telefone: {property_details.contact_phone}")
        if property_details.contact_email:
            seo_gmb_details.append(f"Email: {property_details.contact_email}")
        if property_details.contact_website:
            seo_gmb_details.append(f"Website: {property_details.contact_website}")
        if property_details.property_address:
            seo_gmb_details.append(f"Endereço: {property_details.property_address}")

        if seo_gmb_details:
            prompt_string += f" Detalhes de SEO/GMB: {'; '.join(seo_gmb_details)}."

    prompt_string += " Use emojis relevantes. Inclua uma chamada para ação (CTA). Inclua hashtags relevantes. O objetivo é atrair compradores e despertar interesse."

    # Chame o serviço Gemini
    generated_text = await generate_content_for_real_estate(
        prompt=prompt_string,
    )

    # Salve o conteúdo gerado no histórico
    # ou modificá-las para serem síncronas. Assumindo síncronas aqui.
    db_generated_content = crud.create_user_generated_content(
        db=db,
        user_id=current_user.id,
        content=schemas.GeneratedContentCreate(  
            prompt_used=prompt_string, generated_text=generated_text
        ),
    )

    # CORREÇÃO 4: Retorno com o modelo correto
    return schemas.GeneratedContent.model_validate(db_generated_content)
