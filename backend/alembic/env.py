# backend/alembic/env.py

from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# Isso é para que o Alembic possa encontrar seus módulos (como app.core.database)
import os
import sys
# Adicione a pasta 'app' ao sys.path para que as importações funcionem
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "app"))

# Importe o Base.metadata do seu banco de dados
from app.core.database import Base # <--- ADICIONE ESTA LINHA

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
target_metadata = Base.metadata # <--- ALTERE ESTA LINHA


# other values from the config, defined by the needs of env.py,
# can be acquired a la:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here send literal SQL to the
    configured target registry.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario, we need to create an Engine
    and associate a Connection with the Context.
    """
    connectable = engine_from_config(
        config.get_section("alembic:environment"), # Obtém a seção 'alembic:environment' diretamente
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            render_as_batch=True, # Adicione esta linha para SQLite (opcional, mas evita alguns problemas)
            # Adicionado para evitar erro com múltiplos modelos em SQLite
            # https://alembic.sqlalchemy.org/en/latest/batch.html#batch-migrations-for-sqlite-and-other-dbs-that-dont-support-ddl-in-transactions
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()