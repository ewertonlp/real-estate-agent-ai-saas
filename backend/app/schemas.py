# backend/app/schemas.py

from datetime import datetime
from typing import Optional, List # Removido Literal pois não está sendo usado
from pydantic import BaseModel, EmailStr # Certifique-se de importar BaseModel e EmailStr


# =========================================================================
# 1. Esquemas de Autenticação e Usuário
# =========================================================================

# Esquema para o token JWT retornado no login
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Esquema para os dados do token (payload)
class TokenData(BaseModel):
    email: str | None = None

# Esquema base para User
class UserBase(BaseModel):
    # email: EmailStr
    nome: Optional[str] = None
    creci: Optional[str] = None

    class Config:
        orm_mode = True

# Esquema para criar um novo usuário (registro)
class UserCreate(UserBase):
    password: str

# Esquema para atualizar dados do usuário
class UserUpdate(UserBase):
    password: Optional[str] = None

# Esquema para o modelo de usuário no banco de dados / retorno da API (User sem plano aninhado)
# Esta é a classe que corresponde diretamente ao models.User no DB
class User(UserBase): # Renomeado de UserInDB para User para consistência
    id: int
    is_active: bool
    stripe_customer_id: Optional[str] = None
    stripe_subscription_id: Optional[str] = None
    subscription_plan_id: Optional[int] = None
    content_generations_count: int = 0 # Valor padrão para garantir que sempre tem um int

    class Config:
        from_attributes = True

class PasswordChange(BaseModel):
    current_password: str
    new_password: str
    
# =========================================================================
# 2. Esquemas de Planos de Assinatura
# =========================================================================

# Esquema base para planos de assinatura
class SubscriptionPlanBase(BaseModel):
    name: str
    description: Optional[str] = None
    max_generations: int
    price_id_stripe: Optional[str] = None # Pode ser None para planos gratuitos
    unit_amount: Optional[int] = None # Preço em centavos (null para planos gratuitos sem valor Stripe)
    currency: Optional[str] = None # Ex: "brl" (null para planos gratuitos sem valor Stripe)
    interval: Optional[str] = None # Ex: "month", "year" (null para planos gratuitos sem valor Stripe)
    interval_count: Optional[int] = 1 # Contagem do intervalo (null para planos gratuitos sem valor Stripe)
    type: Optional[str] = "recurring" # "recurring" ou "one_time" (null para planos gratuitos sem valor Stripe)
    is_active: bool = True

    class Config:
        from_attributes = True

class SubscriptionPlanCreate(SubscriptionPlanBase):
    pass # Herda tudo de SubscriptionPlanBase

class SubscriptionPlanUpdate(SubscriptionPlanBase):
    name: Optional[str] = None
    description: Optional[str] = None
    max_generations: Optional[int] = None
    price_id_stripe: Optional[str] = None
    unit_amount: Optional[int] = None
    currency: Optional[str] = None
    interval: Optional[str] = None
    interval_count: Optional[int] = None
    type: Optional[str] = None
    is_active: Optional[bool] = None

# Esquema completo do plano de assinatura, incluindo o ID do DB
class SubscriptionPlan(SubscriptionPlanBase):
    id: int

    class Config:
        from_attributes = True

# =========================================================================
# 3. Esquemas de Usuário com Plano (para API)
# =========================================================================

# Esquema para dados de usuário a serem expostos publicamente (com plano aninhado)
class UserPublic(User): # Herda de User (que era UserInDB), adiciona o plano
    subscription_plan: Optional[SubscriptionPlan] = None 
    
    class Config:
        from_attributes = True


# =========================================================================
# 4. Esquemas de Conteúdo Gerado
# =========================================================================

# Esquema base para os campos de conteúdo gerado (para criação e leitura)
class GeneratedContentBase(BaseModel):
    prompt_used: str
    generated_text: str
    is_favorite: bool = False # Com default para criação

    class Config:
        from_attributes = True

# Esquema para a criação de um novo registro de conteúdo (o que o frontend envia para o backend)
class GeneratedContentCreate(GeneratedContentBase):
    pass # Herda prompt_used, generated_text e is_favorite

# Esquema COMPLETO para exibir um registro de conteúdo (o que o backend retorna)
# Inclui campos gerados pelo DB como id, owner_id, created_at
class GeneratedContent(GeneratedContentBase):
    id: int
    owner_id: int  # user_id no modelo, owner_id no esquema para o ORM
    created_at: datetime

    class Config:
        from_attributes = True


# =========================================================================
# 5. Esquemas de Detalhes da Propriedade (Input do Formulário)
# =========================================================================

class PropertyDetailsBase(BaseModel):
    property_type: str
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    location: str
    special_features: Optional[str] = None
    purpose: str
    target_audience: Optional[str] = None
    tone: Optional[str] = None
    length: Optional[str] = None
    language: Optional[str] = None
    property_value: Optional[float] = None
    condo_fee: Optional[float] = None
    iptu_value: Optional[float] = None
    
    optimize_for_seo_gmb: Optional[bool] = False
    seo_keywords: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_website: Optional[str] = None
    property_address: Optional[str] = None
    additional_details: Optional[str] = None

    class Config:
        from_attributes = True

class PropertyDetailsCreate(PropertyDetailsBase):
    pass # Herda de PropertyDetailsBase


# =========================================================================
# 6. Esquemas de Templates de Prompt
# =========================================================================

class PromptTemplateBase(BaseModel):
    name: str
    template_text: str
    description: Optional[str] = None
    is_premium: bool = False

    class Config:
        from_attributes = True

class PromptTemplateCreate(PromptTemplateBase):
    pass

class PromptTemplateUpdate(BaseModel): # Para atualização, todos os campos são opcionais
    name: Optional[str] = None
    template_text: Optional[str] = None
    description: Optional[str] = None
    is_premium: Optional[bool] = None

    class Config:
        from_attributes = True

class PromptTemplate(PromptTemplateBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# =========================================================================
# 7. Esquemas de Analytics (Corrigido para corresponder à sua versão)
# =========================================================================

class UserAnalytics(BaseModel):
    total_generated_content: int

    class Config:
        from_attributes = True


# =========================================================================
# 8. Esquemas de Stripe / Checkout
# =========================================================================

# Adicione esta classe para a resposta da sessão de checkout do Stripe
class CheckoutSessionResponse(BaseModel):
    checkout_url: str


class GeneratedContentUpdateFavorite(BaseModel):
    is_favorite: bool #

    class Config:
        from_attributes = True