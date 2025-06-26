# backend/app/api/deps.py

from app.core.database import get_db as get_sync_db_session
from sqlalchemy.orm import Session

def get_db() -> Session:
    yield from get_sync_db_session()


# # Simulação de extração de usuário a partir do token
# def get_current_user(
#     db: Session = Depends(get_db),
#     token: str = Depends(verify_token),  # Você precisa implementar essa parte!
# ) -> User:
    
#     user = db.query(User).filter(User.email == token).first()
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Usuário não autenticado",
#         )
#     return user


# def get_current_active_user(
#     current_user: User = Depends(get_current_user),
# ) -> User:
#     if not current_user.is_active:
#         raise HTTPException(status_code=400, detail="Usuário inativo")
#     return current_user