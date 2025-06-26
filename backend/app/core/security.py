# backend/app/core/security.py

from datetime import datetime, timedelta, timezone
from typing import Optional
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from jose import JWTError, jwt
from app.core.config import settings
from fastapi import Depends, HTTPException, status # Certifique-se de importar Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.api.deps import get_db # <<< ADICIONE ESTA LINHA
from sqlalchemy.orm import Session 
from app.models import User 

# O OAuth2PasswordBearer é usado para obter o token do cabeçalho Authorization
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

# Para hash de senhas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha em texto puro corresponde ao hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Gera o hash de uma senha."""
    return pwd_context.hash(password)


# Para JWT
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Cria um token de acesso JWT."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode.update({"exp": expire})  # Adiciona a data de expiração

    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def decode_access_token(token: str):
    """Decodifica e valida um token de acesso JWT."""
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        email: str = payload.get("sub")  # "sub" é a convenção para o assunto (email)
        if email is None:
            return None  # Credenciais inválidas
        return payload
    except JWTError:
        return None  # Token inválido ou expirado

# A função get_current_user precisa usar a sessão síncrona
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db) # <<< TIPO CORRIGIDO PARA Session (síncrona)
):
    from app import crud, models # Importe crud e models aqui para evitar circular import

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception
    
    # crud.get_user_by_email pode precisar ser síncrono também
    # Se crud.get_user_by_email() for um await, ele precisa ser síncrono.
    # Se crud.get_user_by_email é uma função assíncrona, você precisa executá-la
    # dentro de um run_in_threadpool para ambientes síncronos.
    # Vamos assumir que suas funções crud.py serão síncronas agora.
    user = crud.get_user_by_email(db, email=email) # Removido 'await' se crud for síncrono

    if user is None:
        raise credentials_exception
    
    return user


def get_current_active_user(
    current_user: User = Depends(get_current_user),
):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Usuário inativo")
    return current_user