# backend/app/models.py

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text # Importe 'Text' e 'ForeignKey'
from sqlalchemy.orm import relationship # Já deve estar importado
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

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