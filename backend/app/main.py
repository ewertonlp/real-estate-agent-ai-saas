# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Importe o novo módulo de endpoints
from app.api.endpoints import content_generator, auth, history, users, image_generator, subscriptions, prompt_templates # <-- Certifique-se que 'subscriptions' está aqui
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
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(content_generator.router, prefix="/api/v1", tags=["content_generator"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(history.router, prefix="/api/v1/history", tags=["History"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(prompt_templates.router, prefix="/api/v1/prompt_templates", tags=["Prompt Templates"]) 
# app.include_router(image_generator.router, prefix="/api/v1/images", tags=["Images"])

# --- ESTA LINHA É A MAIS CRÍTICA PARA O SEU 404 ---
app.include_router(subscriptions.router, prefix="/api/v1/subscriptions", tags=["Subscriptions"]) #
# -----------------------------------------------

@app.get("/")
async def read_root():
    return {"message": "Bem-vindo ao Gerador de Conteúdo para Corretores de Imóveis!"}


# --- NOVO: Endpoint de depuração para listar rotas ---
@app.get("/debug-routes")
async def debug_routes():
    routes_list = []
    for route in app.routes:
        if hasattr(route, 'path') and hasattr(route, 'methods'):
            routes_list.append({
                "path": route.path,
                "methods": list(route.methods) if hasattr(route, 'methods') and route.methods else [],
                "name": route.name if hasattr(route, 'name') else None,
                "summary": route.summary if hasattr(route, 'summary') else None
            })
        elif hasattr(route, 'routes'): # Para routers aninhados
            for sub_route in route.routes:
                if hasattr(sub_route, 'path') and hasattr(sub_route, 'methods'):
                    routes_list.append({
                        "path": route.prefix + sub_route.path if hasattr(route, 'prefix') else sub_route.path,
                        "methods": list(sub_route.methods) if hasattr(sub_route, 'methods') and sub_route.methods else [],
                        "name": sub_route.name if hasattr(sub_route, 'name') else None,
                        "summary": sub_route.summary if hasattr(sub_route, 'summary') else None
                    })
    return routes_list
# --- FIM do endpoint de depuração ---