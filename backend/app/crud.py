# backend/app/crud.py

from sqlalchemy.orm import Session
from app import models, schemas
from app.core.security import get_password_hash # Vamos criar isso em seguida

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user) # Atualiza o objeto com o ID gerado pelo DB
    return db_user

def create_user_generated_content(db: Session, content: schemas.GeneratedContentCreate, user_id: int):
    """
    Cria e salva um novo registro de conteúdo gerado no banco de dados.
    """
    db_content = models.GeneratedContent(**content.model_dump(), owner_id=user_id)
    db.add(db_content)
    db.commit()
    db.refresh(db_content)
    return db_content

def get_user_generated_contents(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    """
    Retorna o histórico de conteúdo gerado por um usuário.
    """
    return db.query(models.GeneratedContent)\
             .filter(models.GeneratedContent.owner_id == user_id)\
             .order_by(models.GeneratedContent.created_at.desc())\
             .offset(skip).limit(limit).all()

# Futuramente: Funções para atualizar/deletar usuários