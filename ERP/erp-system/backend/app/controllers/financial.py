from sqlalchemy.orm import Session
from .. import models, schemas

def get_transaction(db: Session, transaction_id: int):
    return db.query(models.FinancialTransaction).filter(models.FinancialTransaction.id == transaction_id).first()

def get_transactions(db: Session, skip: int = 0, limit: int = 100, type: str = None, status: str = None):
    query = db.query(models.FinancialTransaction)
    if type:
        query = query.filter(models.FinancialTransaction.type == type)
    if status:
        query = query.filter(models.FinancialTransaction.status == status)
    return query.offset(skip).limit(limit).all()

def create_transaction(db: Session, transaction: schemas.FinancialTransactionCreate):
    db_transaction = models.FinancialTransaction(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def update_transaction(db: Session, transaction_id: int, transaction: schemas.FinancialTransactionUpdate):
    db_transaction = get_transaction(db, transaction_id)
    if not db_transaction:
        return None
    
    update_data = transaction.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_transaction, field, value)
    
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def delete_transaction(db: Session, transaction_id: int):
    db_transaction = get_transaction(db, transaction_id)
    if not db_transaction:
        return False
    
    db.delete(db_transaction)
    db.commit()
    return True