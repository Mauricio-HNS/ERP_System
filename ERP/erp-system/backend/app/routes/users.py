from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import schemas
from ..controllers import users as users_controller
from ..database import get_db
from ..auth.dependencies import get_current_active_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=List[schemas.User])
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    if current_user.role not in ['admin', 'gerente']:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    users_list = users_controller.get_users(db, skip=skip, limit=limit)
    return users_list

@router.post("/", response_model=schemas.User)
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Not enough permissions")
    db_user = users_controller.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return users_controller.create_user(db=db, user=user)

@router.get("/me", response_model=schemas.User)
def read_user_me(current_user: schemas.User = Depends(get_current_active_user)):
    return current_user