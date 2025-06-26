from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import SessionLocal
from app import crud
import logging

logger = logging.getLogger(__name__)

def reset_content_generations_if_due():
    db: Session = SessionLocal()
    try:
        users = crud.get_all_users(db)
        now = datetime.utcnow()

        for user in users:
            plan = user.subscription_plan
            if not plan:
                continue

            if plan.max_generations == 0:  # Plano ilimitado
                continue

            if not user.last_reset:
                user.content_generations_count = 0
                user.last_reset = now
                db.add(user)
                logger.info(f"[RESET INICIAL] {user.email}")
                continue

            days = (now - user.last_reset).days

            if (plan.interval == "month" and days >= 30) or (plan.interval == "year" and days >= 365):
                user.content_generations_count = 0
                user.last_reset = now
                db.add(user)
                logger.info(f"[RESET] {user.email} (plano: {plan.name}, intervalo: {plan.interval})")

        db.commit()
    except Exception as e:
        logger.error(f"Erro ao resetar gerações: {e}")
        db.rollback()
    finally:
        db.close()

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(reset_content_generations_if_due, 'cron', hour=2)
    scheduler.start()
