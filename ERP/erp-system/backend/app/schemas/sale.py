from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from decimal import Decimal

class SaleItemBase(BaseModel):
    product_id: int
    quantity: int
    unit_price: Decimal
    total_price: Decimal

class SaleItemCreate(SaleItemBase):
    pass

class SaleItem(SaleItemBase):
    id: int
    sale_id: int
    
    class Config:
        from_attributes = True

class SaleBase(BaseModel):
    customer_id: int
    sale_date: date
    total_amount: Decimal
    status: str = 'pending'
    payment_method: Optional[str] = None
    notes: Optional[str] = None

class SaleCreate(SaleBase):
    items: List[SaleItemCreate]

class SaleUpdate(BaseModel):
    customer_id: Optional[int] = None
    sale_date: Optional[date] = None
    total_amount: Optional[Decimal] = None
    status: Optional[str] = None
    payment_method: Optional[str] = None
    notes: Optional[str] = None

class Sale(SaleBase):
    id: int
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    items: List[SaleItem] = []
    
    class Config:
        from_attributes = True