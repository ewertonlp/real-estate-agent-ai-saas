# backend/app/api/endpoints/history.py

from fastapi import APIRouter, Depends, HTTPException, status, Query # Import Query
from sqlalchemy.orm import Session
from typing import List, Optional # Import Optional
from app import schemas, crud, models
from app.core.database import get_db
from app.core.security import decode_access_token
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime # Import datetime

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autenticação inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )
    email: str = payload.get("sub")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autenticação inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = crud.get_user_by_email(db, email=email)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")
    return user

@router.post("/contents/", response_model=schemas.GeneratedContentBase)
def create_content_history(
    content: schemas.GeneratedContentCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.create_user_generated_content(db=db, content=content, user_id=current_user.id)

@router.get("/contents/", response_model=List[schemas.GeneratedContentBase])
def get_user_contents_history(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    is_favorite: Optional[bool] = Query(None, description="Filter by favorite status"), #
    search_query: Optional[str] = Query(None, description="Search by prompt or generated text"), #
    start_date: Optional[datetime] = Query(None, description="Filter by start date (YYYY-MM-DDTHH:MM:SS)"), #
    end_date: Optional[datetime] = Query(None, description="Filter by end date (YYYY-MM-DDTHH:MM:SS)") #
):
    """
    Retorna o histórico de conteúdos gerados pelo usuário logado, com opções de filtragem.
    """
    # Passa os parâmetros de filtro para a função CRUD
    return crud.get_user_generated_contents(
        db=db,
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        is_favorite=is_favorite,
        search_query=search_query,
        start_date=start_date,
        end_date=end_date
    )

@router.patch("/contents/{content_id}/favorite", response_model=schemas.GeneratedContentCreate)
def toggle_favorite_status(
    content_id: int,
    favorite_update: schemas.GeneratedContentUpdateFavorite, # Expects a body like {"is_favorite": true/false}
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Alterna o status de favorito de um conteúdo gerado.
    """
    updated_content = crud.update_generated_content_favorite_status(
        db=db,
        content_id=content_id,
        user_id=current_user.id,
        is_favorite=favorite_update.is_favorite # Use the value from the request body
    )
    if not updated_content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conteúdo não encontrado ou não pertence a este usuário."
        )
    return updated_content