# backend/app/core/config.py

import os
from pydantic_settings import BaseSettings, SettingsConfigDict


# Para lidar com a dependência pydantic-settings
# pip install pydantic-settings


class Settings(BaseSettings):
    # Configuração do banco de dados SQLite
    DATABASE_URL: str = (
        "sqlite:///./sql_app.db"  # Banco de dados SQLite no arquivo sql_app.db
    )

    # Chave secreta para assinar os JWTs (muito importante!)
    # Gerar uma string aleatória e complexa, ex: openssl rand -hex 32
    SECRET_KEY: str
    ALGORITHM: str = "HS256"  # Algoritmo usado para assinar o JWT
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # Token expira em 24 horas

    # Chave da API Gemini (já temos isso no .env)
    GOOGLE_API_KEY: str

     # --- Adicione as configurações do Stripe aqui ---
    STRIPE_SECRET_KEY: str
    STRIPE_WEBHOOK_SECRET: str
    STRIPE_SUCCESS_URL: str
    STRIPE_CANCEL_URL: str
    STRIPE_FREE_PLAN_PRICE_ID: str
    STRIPE_BASIC_PLAN_PRICE_ID: str
    STRIPE_PREMIUM_PLAN_PRICE_ID: str
    # -----------------------------------------------

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
