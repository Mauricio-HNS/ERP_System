from sqlalchemy.orm import Session
from .. import models, schemas

def get_purchase(db: Session, purchase_id: int):
    return db.query(models.Purchase).filter(models.Purchase.id == purchase_id).first()

def get_purchases(db: Session, skip: int = 0, limit: int = 100, status: str = None):
    query = db.query(models.Purchase)
    if status:
        query = query.filter(models.Purchase.status == status)
    return query.offset(skip).limit(limit).all()

def create_purchase(db: Session, purchase: schemas.PurchaseCreate, user_id: int):
    db_purchase = models.Purchase(
        supplier_id=purchase.supplier_id,
        purchase_date=purchase.purchase_date,
        total_amount=purchase.total_amount,
        status=purchase.status,
        notes=purchase.notes,
        created_by=user_id
    )
    db.add(db_purchase)
    db.commit()
    db.refresh(db_purchase)
    
    # Create purchase items
    for item in purchase.items:
        db_item = models.PurchaseItem(
            purchase_id=db_purchase.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.unit_price,
            total_price=item.total_price
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_purchase)
    return db_purchase

def update_purchase(db: Session, purchase_id: int, purchase: schemas.PurchaseUpdate):
    db_purchase = get_purchase(db, purchase_id)
    if not db_purchase:
        return None
    
    update_data = purchase.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_purchase, field, value)
    
    db.commit()
    db.refresh(db_purchase)
    return db_purchase

def delete_purchase(db: Session, purchase_id: int):
    db_purchase = get_purchase(db, purchase_id)
    if not db_purchase:
        return False
    
    # Delete related items first
    db.query(models.PurchaseItem).filter(models.PurchaseItem.purchase_id == purchase_id).delete()
    db.delete(db_purchase)
    db.commit()
    return True