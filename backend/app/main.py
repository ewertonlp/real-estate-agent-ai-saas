# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Importe o novo módulo de endpoints
from app.api.endpoints import content_generator, auth, history, users, image_generator, subscriptions # <-- Certifique-se que 'subscriptions' está aqui
from app.core.database import Base, engine

# Cria as tabelas no banco de dados (para desenvolvimento)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Gerador de Conteúdo para Corretores de Imóveis",
    description="API para gerar conteúdo de redes sociais automatizado e otimizado para o mercado imobiliário.",
    version="0.1.0",
)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(content_generator.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(history.router, prefix="/api/v1/history", tags=["History"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
# app.include_router(image_generator.router, prefix="/api/v1/images", tags=["Images"])

# --- ESTA LINHA É A MAIS CRÍTICA PARA O SEU 404 ---
app.include_router(subscriptions.router, prefix="/api/v1/subscriptions", tags=["Subscriptions"]) #
# -----------------------------------------------

@app.get("/")
async def read_root():
    return {"message": "Bem-vindo ao Gerador de Conteúdo para Corretores de Imóveis!"}
