# backend/app/models.py

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text # Importe 'Text' e 'ForeignKey'
from sqlalchemy.orm import relationship 
from sqlalchemy.sql import func
from app.core.database import Base

# --- Novo Modelo: SubscriptionPlan ---
class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False) # Ex: "Free", "Basic", "Premium"
    description = Column(String, nullable=True)
    max_generations = Column(Integer, nullable=False, default=0) # 0 para ilimitado, ou um número
    price_id_stripe = Column(String, unique=True, nullable=False) # ID do preço no Stripe
    is_active = Column(Boolean, default=True) # Para ativar/desativar planos

    users = relationship("User", back_populates="subscription_plan") # Relacionamento com usuários


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    stripe_customer_id = Column(String, unique=True, nullable=True) # ID do cliente no Stripe
    stripe_subscription_id = Column(String, unique=True, nullable=True) # ID da assinatura no Stripe
    subscription_plan_id = Column(Integer, ForeignKey("subscription_plans.id"), nullable=True) # Plano atual do usuário

    subscription_plan = relationship("SubscriptionPlan", back_populates="users")
    
    content_generations_count = Column(Integer, default=0, nullable=False)
    generated_contents = relationship("GeneratedContent", back_populates="owner")


class GeneratedContent(Base):
    __tablename__ = "generated_contents" # Nome da nova tabela

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id")) # Chave estrangeira para o usuário
    prompt_used = Column(Text, nullable=False) # Armazena o prompt completo que gerou o conteúdo
    generated_text = Column(Text, nullable=False) # Armazena o conteúdo gerado pela IA
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_favorite = Column(Boolean, default=False) 

    # Relacionamento de volta para o User
    owner = relationship("User", back_populates="generated_contents")