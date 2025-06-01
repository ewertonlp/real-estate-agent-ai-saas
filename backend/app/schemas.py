# backend/app/schemas.py

from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# Esquema para criar um novo usuário (registro)
class UserCreate(BaseModel):
    email: EmailStr
    password: str

# Esquema para o modelo de usuário no banco de dados (retorno da API)
class UserInDB(BaseModel):
    id: int
    email: EmailStr
    is_active: bool

    class Config:
        from_attributes = True # Permite que o Pydantic leia de ORM models

# Esquema para o token JWT retornado no login
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Esquema para os dados do token (payload)
class TokenData(BaseModel):
    email: str | None = None


# Esquema para criar um novo registro de conteúdo (o que o frontend envia)
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


# --- Novo Esquema: SubscriptionPlanBase ---
class SubscriptionPlanBase(BaseModel):
    name: str
    description: Optional[str] = None
    max_generations: int
    price_id_stripe: str
    is_active: bool = True

# --- Novo Esquema: SubscriptionPlan (para retorno) ---
class SubscriptionPlan(SubscriptionPlanBase):
    id: int

    class Config:
        from_attributes = True

# --- Atualizar UserInDB para incluir plano de assinatura ---
class UserInDB(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    stripe_customer_id: Optional[str] = None
    stripe_subscription_id: Optional[str] = None
    subscription_plan_id: Optional[int] = None
    subscription_plan: Optional[SubscriptionPlan] = None 
    content_generations_count: int 

    class Config:
        from_attributes = True    