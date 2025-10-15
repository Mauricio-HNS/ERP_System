from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import schemas
from ..controllers import financial as financial_controller
from ..database import get_db
from ..auth.dependencies import get_current_active_user

router = APIRouter(prefix="/financial", tags=["financial"])

@router.get("/transactions", response_model=List[schemas.FinancialTransaction])
def read_transactions(
    skip: int = 0,
    limit: int = 100,
    type: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    if current_user.role not in ['admin', 'gerente', 'financeiro']:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    transactions = financial_controller.get_transactions(db, skip=skip, limit=limit, type=type, status=status)
    return transactions

@router.post("/transactions", response_model=schemas.FinancialTransaction)
def create_transaction(
    transaction: schemas.FinancialTransactionCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    if current_user.role not in ['admin', 'gerente', 'financeiro']:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return financial_controller.create_transaction(db=db, transaction=transaction)

@router.get("/transactions/{transaction_id}", response_model=schemas.FinancialTransaction)
def read_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    if current_user.role not in ['admin', 'gerente', 'financeiro']:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db_transaction = financial_controller.get_transaction(db, transaction_id=transaction_id)
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return db_transaction

@router.put("/transactions/{transaction_id}", response_model=schemas.FinancialTransaction)
def update_transaction(
    transaction_id: int,
    transaction: schemas.FinancialTransactionUpdate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    if current_user.role not in ['admin', 'gerente', 'financeiro']:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db_transaction = financial_controller.update_transaction(db, transaction_id=transaction_id, transaction=transaction)
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return db_transaction

@router.delete("/transactions/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    if current_user.role not in ['admin', 'gerente']:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    success = financial_controller.delete_transaction(db, transaction_id=transaction_id)
    if not success:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"message": "Transaction deleted successfully"}