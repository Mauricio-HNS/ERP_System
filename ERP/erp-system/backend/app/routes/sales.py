from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import schemas
from ..controllers import sales as sales_controller
from ..database import get_db
from ..auth.dependencies import get_current_active_user

router = APIRouter(prefix="/sales", tags=["sales"])

@router.get("/", response_model=List[schemas.Sale])
def read_sales(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    sales = sales_controller.get_sales(db, skip=skip, limit=limit, status=status)
    return sales

@router.post("/", response_model=schemas.Sale)
def create_sale(
    sale: schemas.SaleCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    return sales_controller.create_sale(db=db, sale=sale, user_id=current_user.id)

@router.get("/{sale_id}", response_model=schemas.Sale)
def read_sale(
    sale_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    db_sale = sales_controller.get_sale(db, sale_id=sale_id)
    if db_sale is None:
        raise HTTPException(status_code=404, detail="Sale not found")
    return db_sale

@router.put("/{sale_id}", response_model=schemas.Sale)
def update_sale(
    sale_id: int,
    sale: schemas.SaleUpdate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    db_sale = sales_controller.update_sale(db, sale_id=sale_id, sale=sale)
    if db_sale is None:
        raise HTTPException(status_code=404, detail="Sale not found")
    return db_sale

@router.delete("/{sale_id}")
def delete_sale(
    sale_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    if current_user.role not in ['admin', 'gerente']:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    success = sales_controller.delete_sale(db, sale_id=sale_id)
    if not success:
        raise HTTPException(status_code=404, detail="Sale not found")
    return {"message": "Sale deleted successfully"}