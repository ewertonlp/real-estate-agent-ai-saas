#  SaaS Corretor de Imóveis

Este repositório contém o backend (Python/FastAPI) e o frontend (Next.js) para a aplicação SaaS de geração de conteúdo para corretores de imóveis.

<img width="1920" height="1080" alt="capa-realtor-ai" src="https://github.com/user-attachments/assets/baf33491-c99e-426d-809d-007d380425e9" />


## 1.  Configuração das Variáveis de Ambiente

Antes de iniciar qualquer parte do projeto, você deve configurar as variáveis de ambiente necessárias.

Crie um arquivo chamado **`.env`** (para o backend) na raiz da pasta `backend/` e outro arquivo chamado **`.env.local`** (para o frontend) na raiz da pasta `frontend/`.

### 1.1 Variáveis do Backend (`backend/.env`)

Este arquivo armazena chaves de API, segredos e a URL do banco de dados.

```dotenv
# --- Configurações Básicas ---
SECRET_KEY="SUA_CHAVE_SECRETA_ALEATORIA_PARA_JWT" # Use uma string longa e aleatória
DATABASE_URL="sqlite:///./sql_app.db" # Exemplo para SQLite (ou sua URL PostgreSQL/MySQL)

# --- APIs de Serviços ---
GOOGLE_API_KEY="SUA_CHAVE_API_DO_GEMINI"
RESEND_API_KEY="SUA_CHAVE_API_DO_RESEND" # Para envio de e-mails

# --- Configurações Stripe (Pagamentos) ---
STRIPE_SECRET_KEY="sk_live_xxxxxxxxxxxxxxxxxxxxxx" # Chave secreta do Stripe (começa com sk_test ou sk_live)
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxxxxxxxxxxx" # Segredo do webhook

# URLs de Redirecionamento Padrão
STRIPE_SUCCESS_URL=http://localhost:3000/dashboard?payment_status=success
STRIPE_CANCEL_URL=http://localhost:3000/dashboard?payment_status=cancelled

# IDs dos Planos do Stripe (Preencha com os IDs reais do seu Catálogo de Produtos do Stripe)
# Certifique-se de que estes IDs correspondam aos planos Free, Basic, Premium e Unlimited.
STRIPE_FREE_PLAN_PRICE_ID=price_xxxxxxxxxxxx_free
STRIPE_BASIC_MONTHLY_PLAN_PRICE_ID=price_xxxxxxxxxxxx_basic_monthly
STRIPE_PREMIUM_MONTHLY_PLAN_PRICE_ID=price_xxxxxxxxxxxx_premium_monthly
STRIPE_UNLIMITED_MONTHLY_PLAN_PRICE_ID=price_xxxxxxxxxxxx_unlimited_monthly

STRIPE_BASIC_ANNUAL_PLAN_PRICE_ID=price_xxxxxxxxxxxx_basic_annual
STRIPE_PREMIUM_ANNUAL_PLAN_PRICE_ID=price_xxxxxxxxxxxx_premium_annual
STRIPE_UNLIMITED_ANNUAL_PLAN_PRICE_ID=price_xxxxxxxxxxxx_unlimited_annual
```

## 1.2 Variáveis do Frontend (frontend/.env.local)
Este arquivo armazena variáveis que o Next.js precisa para se comunicar com o backend e o Stripe.

```
# --- Configurações de API ---
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1 
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_xxxxxxxxxxxxxxxxxxxxxx" # Chave pública do Stripe

# Variável de Debug (Opcional)
NODE_ENV=development
```


### 2. Inicializando o Backend (Python/FastAPI)
Navegue até o diretório backend e siga os passos:

2.1 Configurar o Ambiente Virtual e Dependências

```ambiente virtual
# 1. Navega para a pasta do backend
cd backend

# 2. Cria o ambiente virtual (venv)
python -m venv venv

# 3. Ativa o ambiente virtual
# No Windows (PowerShell):
.\venv\Scripts\Activate.ps1

# No Linux/macOS:
# source venv/bin/activate

# 4. Instala todas as dependências do requirements.txt
pip install -r requirements.txt
```

## 2.2 Configurar o Banco de Dados (Alembic)
Se for a primeira vez que você está a rodar o projeto, você precisa aplicar as migrações do banco de dados definidas pelo Alembic:

```
# Aplica todas as migrações (cria as tabelas no DB)
(venv) alembic upgrade head
```
Nota: Se estiver a usar o SQLite (como no exemplo do .env), o arquivo do banco de dados (sql_app.db) será criado automaticamente.


## 2.3 Iniciar o Servidor

```
(venv) uvicorn app.main:app --reload
```

--------------------------------------------------------------------------------

## 3. Inicializando o Frontend (Next.js)
Abra um novo terminal, navegue até o diretório frontend e siga os passos:

3.1 Instalar Dependências

```
# 1. Navega para a pasta do frontend
cd frontend

# 2. Instala as dependências do Node.js
npm install 
# OU
# yarn install
```

O frontend estará acessível em http://localhost:3000

