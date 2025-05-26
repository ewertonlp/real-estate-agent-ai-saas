# backend/app/core/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Cria o motor do banco de dados usando a URL do DATABASE_URL das configurações
engine = create_engine(settings.DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {})

# Cria uma SessionLocal que será usada para instanciar sessões de banco de dados
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para seus modelos de banco de dados
Base = declarative_base()

# Dependência para obter a sessão do banco de dados (para uso no FastAPI)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        