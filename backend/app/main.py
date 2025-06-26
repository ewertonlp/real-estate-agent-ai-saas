# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import content_generator, auth, history, users, image_generator, subscriptions, prompt_templates # <-- Certifique-se que 'subscriptions' está aqui
from app.core.database import Base, engine
from app.core.config import settings
from sqlalchemy.orm import Session
from app.core.database import SessionLocal # Importe SessionLocal
from app.crud import get_all_subscription_plans # Importe a função CRUD para ler planos
from app.jobs.monthly_reset import start_scheduler

start_scheduler()

# Cria as tabelas no banco de dados (para desenvolvimento)
# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Gerador de Conteúdo para Corretores de Imóveis",
    description="API para gerar conteúdo de redes sociais automatizado e otimizado para o mercado imobiliário.",
    version="0.1.0",
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- BLOCO DE INICIALIZAÇÃO E DEBUG DO BANCO DE DADOS ---
@app.on_event("startup")
def on_startup():
    print(f"\n--- INÍCIO DO PROCESSO DE STARTUP DO FASTAPI ---")
    print(f"DEBUG: DATABASE_URL configurada: {settings.DATABASE_URL}")

    # Opcional: Recriar tabelas se você quiser um ambiente limpo a cada restart (NÃO RECOMENDADO EM PROD)
    # Se você está usando Alembic, esta linha geralmente deve ser comentada.
    # Base.metadata.create_all(bind=engine)

    # Inserção inicial de dados (se necessário e não for via script seed_plans.py)
    # Por exemplo, se você quer ter certeza que o plano Free sempre existe no DB do servidor
    # (Mas se você tem seed_plans.py, esta parte aqui pode ser duplicada ou omitida)

    db: Session = SessionLocal()
    try:
        print("DEBUG: Lendo planos do DB no startup do FastAPI:")
        all_plans_from_db = get_all_subscription_plans(db) # Usa o CRUD para ler
        for p in all_plans_from_db:
            print(f"  - Plano: {p.name} ({p.interval}), Max Gerações: {p.max_generations}, ID DB: {p.id}")
        if not all_plans_from_db:
            print("  - NENHUM plano encontrado no DB no startup. DB pode estar vazio.")
    except Exception as e:
        print(f"ERRO DE DEBUG NO STARTUP: Não foi possível ler planos do DB: {e}")
    finally:
        db.close()
    print("--- FIM DO PROCESSO DE STARTUP DO FASTAPI ---\n")
# --------------------------------------------------------

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