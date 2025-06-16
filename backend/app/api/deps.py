# backend/app/api/deps.py

# Não precisamos de AsyncGenerator nem AsyncSession aqui
# from typing import AsyncGenerator
# from sqlalchemy.ext.asyncio import AsyncSession

# Importe a função get_db e SessionLocal diretamente do seu database.py
from app.core.database import get_db as get_sync_db_session
from sqlalchemy.orm import Session # Importe Session do sqlalchemy.orm

# A dependência do FastAPI para obter a sessão do banco de dados síncrona
def get_db() -> Session: # Tipo de retorno corrigido para Session (síncrona)
    yield from get_sync_db_session() # Use yield from para a função geradora síncrona