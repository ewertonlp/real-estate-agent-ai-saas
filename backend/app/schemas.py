# backend/app/schemas.py

from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, Literal, List


# Esquema para o token JWT retornado no login
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Esquema para os dados do token (payload)
class TokenData(BaseModel):
    email: str | None = None

# Esquema para criar um novo usuário (registro)
class UserCreate(BaseModel):
    email: EmailStr
    password: str

# Esquema para atualizar dados do usuário (ex: senha, plano de assinatura)
class UserUpdate(BaseModel):
    password: Optional[str] = None
    subscription_plan_id: Optional[int] = None # Para atualizar o plano de assinatura

# --- NOVO Esquema: SubscriptionPlanBase (definição base para planos) ---
class SubscriptionPlanBase(BaseModel):
    name: str
    description: Optional[str] = None
    max_generations: int # 0 para ilimitadas, ou um número específico
    is_active: bool = True # Novo campo para indicar se o plano está ativo

    # >>> ESTES CAMPOS DEVEM ESTAR AQUI <<<
    unit_amount: int
    currency: str
    interval: str
    interval_count: int
    type: str
    # >>> FIM DOS CAMPOS A SEREM ADICIONADOS <<<


# --- NOVO Esquema: SubscriptionPlanCreate (para criação de planos, pode ter price_id_stripe opcional) ---
class SubscriptionPlanCreate(SubscriptionPlanBase):
    price_id_stripe: Optional[str] = None # Pode ser None para planos gratuitos

# --- NOVO Esquema: SubscriptionPlanUpdate (para atualização de planos) ---
class SubscriptionPlanUpdate(SubscriptionPlanBase):
    price_id_stripe: Optional[str] = None

# --- NOVO Esquema: SubscriptionPlanInDBBase (para o modelo de DB base, inclui ID e price_id_stripe) ---
class SubscriptionPlanInDBBase(SubscriptionPlanBase):
    id: int
    price_id_stripe: Optional[str] = None # Necessário para o ORM (pode ser None para planos Free)

    class Config:
        from_attributes = True

# --- NOVO Esquema: SubscriptionPlan (para retorno público de planos, inclui detalhes de preço) ---
class SubscriptionPlan(SubscriptionPlanInDBBase):
    
     class Config:
        from_attributes = True 

# --- NOVO Esquema: SubscriptionPlanPublic (o que será retornado para a API) ---
class SubscriptionPlanPublic(SubscriptionPlan): # Herda de SubscriptionPlan que já tem todos os campos
     class Config:
        from_attributes = True 

# --- Esquema para o modelo de usuário no banco de dados / retorno da API ---
# Esta é a definição consolidada de UserInDB, que inclui os campos de assinatura
class UserInDB(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    stripe_customer_id: Optional[str] = None
    stripe_subscription_id: Optional[str] = None
    subscription_plan_id: Optional[int] = None
    # subscription_plan: Optional[SubscriptionPlan] = None # Comentado para evitar ciclo de importação se não for estritamente necessário aqui
    content_generations_count: int

    class Config:
        from_attributes = True

# Esquema para dados de usuário a serem expostos publicamente (pode incluir o plano de assinatura aninhado)
# Esta é a classe que normalmente aninharia o SubscriptionPlanPublic, se não for UserInDB já faz isso.
class UserPublic(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    content_generations_count: int
    subscription_plan: Optional[SubscriptionPlanPublic] = None # Aqui aninhamos o plano público

    class Config:
        from_attributes = True


# --- Esquema para criar um novo registro de conteúdo (o que o frontend envia)
class GeneratedContentCreate(BaseModel):
    prompt_used: str
    generated_text: str

# Esquema para exibir um registro de conteúdo (o que o backend retorna)
class GeneratedContentResponse(BaseModel):
    id: int
    prompt_used: str
    generated_text: str
    owner_id: int
    created_at: datetime
    is_favorite: bool

    class Config:
        from_attributes = True


# --- Novo Esquema para Mudança de Senha ---
class PasswordChange(BaseModel):
    current_password: str
    new_password: str


# --- NOVO Esquema para Analytics do Usuário ---
class UserAnalytics(BaseModel):
    total_generated_content: int #
    # Você pode adicionar mais métricas aqui no futuro, como:
    # daily_generations: int
    # last_7_days_generations: int

    class Config:
        from_attributes = True


# --- NOVO Esquema para Atualizar Favorito ---
class GeneratedContentUpdateFavorite(BaseModel):
    is_favorite: bool #


# --- TEMPLATES
class PromptTemplateBase(BaseModel):
    name: str
    template_text: str
    description: Optional[str] = None
    is_premium: bool = False

class PromptTemplate(PromptTemplateBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Esquema para a criação de um Prompt Template (do admin/dashboard)
class PromptTemplateCreate(PromptTemplateBase):
    pass

# Esquema para atualização de um Prompt Template
class PromptTemplateUpdate(BaseModel):
    name: Optional[str] = None
    template_text: Optional[str] = None
    description: Optional[str] = None
    is_premium: Optional[bool] = None


# Adicione esta classe para a resposta da sessão de checkout do Stripe
class CheckoutSessionResponse(BaseModel):
    checkout_url: str
# Se você tiver UserInDB com `subscription_plan: Optional[SubscriptionPlan]`
# e UserPublic com `subscription_plan: Optional[SubscriptionPlanPublic]`,
# a forward reference precisa ser atualizada para ambos.
# user_public.update_forward_refs() é para o caso de ter a definição de SubscriptionPlanPublic
# depois de UserPublic.
# Não é estritamente necessário aqui pois SubscriptionPlanPublic é definido antes de UserPublic.