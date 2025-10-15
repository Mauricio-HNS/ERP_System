from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from decimal import Decimal

class FinancialTransactionBase(BaseModel):
    type: str
    description: str
    amount: Decimal
    due_date: date
    status: str = 'pending'
    payment_date: Optional[date] = None
    reference_id: Optional[int] = None
    reference_type: Optional[str] = None

class FinancialTransactionCreate(FinancialTransactionBase):
    pass

class FinancialTransactionUpdate(BaseModel):
    type: Optional[str] = None
    description: Optional[str] = None
    amount: Optional[Decimal] = None
    due_date: Optional[date] = None
    status: Optional[str] = None
    payment_date: Optional[date] = None
    reference_id: Optional[int] = None
    reference_type: Optional[str] = None

class FinancialTransaction(FinancialTransactionBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True