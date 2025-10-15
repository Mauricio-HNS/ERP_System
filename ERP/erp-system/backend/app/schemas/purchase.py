from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from decimal import Decimal

class PurchaseItemBase(BaseModel):
    product_id: int
    quantity: int
    unit_price: Decimal
    total_price: Decimal

class PurchaseItemCreate(PurchaseItemBase):
    pass

class PurchaseItem(PurchaseItemBase):
    id: int
    purchase_id: int
    
    class Config:
        from_attributes = True

class PurchaseBase(BaseModel):
    supplier_id: int
    purchase_date: date
    total_amount: Decimal
    status: str = 'pending'
    notes: Optional[str] = None

class PurchaseCreate(PurchaseBase):
    items: List[PurchaseItemCreate]

class PurchaseUpdate(BaseModel):
    supplier_id: Optional[int] = None
    purchase_date: Optional[date] = None
    total_amount: Optional[Decimal] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class Purchase(PurchaseBase):
    id: int
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    items: List[PurchaseItem] = []
    
    class Config:
        from_attributes = True