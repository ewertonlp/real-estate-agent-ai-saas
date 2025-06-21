# backend/app/core/config.py

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
import os

class Settings(BaseSettings):
    # A base de configurações é SettingsConfigDict para Pydantic V2+
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DATABASE_URL: str = Field("sqlite:///D:/TEMPLATES/seu-saas-corretor/backend/sql_app.db", env="DATABASE_URL")
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    ALGORITHM: str = Field("HS256", env="ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(30, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    GOOGLE_API_KEY: str = Field(..., env="GOOGLE_API_KEY")

    STRIPE_SECRET_KEY: str = Field(..., env="STRIPE_SECRET_KEY")
    STRIPE_WEBHOOK_SECRET: str = Field(..., env="STRIPE_WEBHOOK_SECRET")
    STRIPE_SUCCESS_URL: str = Field("http://localhost:3000/dashboard?payment_status=success", env="STRIPE_SUCCESS_URL")
    STRIPE_CANCEL_URL: str = Field("http://localhost:3000/dashboard?payment_status=cancelled", env="STRIPE_CANCEL_URL")

    # >>> ADICIONE ESTAS LINHAS PARA OS IDs DOS PLANOS DO STRIPE E O LIMITE DO PLANO FREE <<<
    STRIPE_FREE_PLAN_PRICE_ID: str = Field("price_free_plan", env="STRIPE_FREE_PLAN_PRICE_ID") # Um ID fictício para o plano Free
    STRIPE_BASIC_MONTHLY_PLAN_PRICE_ID: str = Field(..., env="STRIPE_BASIC_MONTHLY_PLAN_PRICE_ID")
    STRIPE_PREMIUM_MONTHLY_PLAN_PRICE_ID: str = Field(..., env="STRIPE_PREMIUM_MONTHLY_PLAN_PRICE_ID")
    STRIPE_UNLIMITED_MONTHLY_PLAN_PRICE_ID: str = Field(..., env="STRIPE_UNLIMITED_MONTHLY_PLAN_PRICE_ID")

    STRIPE_BASIC_ANNUAL_PLAN_PRICE_ID: str = Field(..., env="STRIPE_BASIC_ANNUAL_PLAN_PRICE_ID")
    STRIPE_PREMIUM_ANNUAL_PLAN_PRICE_ID: str = Field(..., env="STRIPE_PREMIUM_ANNUAL_PLAN_PRICE_ID")
    STRIPE_UNLIMITED_ANNUAL_PLAN_PRICE_ID: str = Field(..., env="STRIPE_UNLIMITED_ANNUAL_PLAN_PRICE_ID")

    FREE_PLAN_MAX_GENERATIONS: int = Field(5, env="FREE_PLAN_MAX_GENERATIONS") # <-- ADICIONE ESTA LINHA
    # >>> FIM DA ADIÇÃO <<<


settings = Settings()