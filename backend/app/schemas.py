# backend/app/schemas.py

from pydantic import BaseModel, EmailStr
from datetime import datetime

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

    class Config:
        from_attributes = True


# --- Novo Esquema para Mudança de Senha ---

class PasswordChange(BaseModel):
    current_password: str
    new_password: str        