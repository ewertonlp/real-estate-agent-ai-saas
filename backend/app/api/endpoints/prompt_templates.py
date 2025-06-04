# backend/app/api/endpoints/prompt_templates.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import crud, schemas, models
from app.core.database import get_db
from app.api.endpoints.history import get_current_user # To get current user and their plan

router = APIRouter()

@router.post("/templates/", response_model=schemas.PromptTemplate, status_code=status.HTTP_201_CREATED)
def create_template(
    template: schemas.PromptTemplateBase,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user) # Only for admin/privileged users
):
    # Implement authorization here if only certain users can create templates
    # For simplicity, we'll assume a basic check, but you might need a more robust role management
    if current_user.email != "admin@example.com": # Replace with actual admin check
         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Apenas administradores podem criar templates.")

    db_template = crud.get_prompt_template_by_name(db, name=template.name)
    if db_template:
        raise HTTPException(status_code=400, detail="Nome do template já existe.")
    return crud.create_prompt_template(db=db, template=template)

@router.get("/templates/", response_model=List[schemas.PromptTemplate])
def get_templates(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user) # To filter by user plan
):
    # Logic to return only non-premium templates for non-premium users
    # Your user's subscription_plan should be loaded with the user object via `joinedload`
    if current_user.subscription_plan and current_user.subscription_plan.name in ["Premium", "Unlimited"]:
        templates = crud.get_all_prompt_templates(db)
    else:
        templates = crud.get_active_prompt_templates(db, current_user.subscription_plan.name if current_user.subscription_plan else "Free")

    if not templates:
        raise HTTPException(status_code=404, detail="Nenhum template encontrado.")
    return templates

# You might want endpoints for getting a single template, updating, deleting
# depending on your needs.