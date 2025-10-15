from sqlalchemy.orm import Session
from .. import models, schemas

def get_sale(db: Session, sale_id: int):
    return db.query(models.Sale).filter(models.Sale.id == sale_id).first()

def get_sales(db: Session, skip: int = 0, limit: int = 100, status: str = None):
    query = db.query(models.Sale)
    if status:
        query = query.filter(models.Sale.status == status)
    return query.offset(skip).limit(limit).all()

def create_sale(db: Session, sale: schemas.SaleCreate, user_id: int):
    db_sale = models.Sale(
        customer_id=sale.customer_id,
        sale_date=sale.sale_date,
        total_amount=sale.total_amount,
        status=sale.status,
        payment_method=sale.payment_method,
        notes=sale.notes,
        created_by=user_id
    )
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    
    # Create sale items
    for item in sale.items:
        db_item = models.SaleItem(
            sale_id=db_sale.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.unit_price,
            total_price=item.total_price
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_sale)
    return db_sale

def update_sale(db: Session, sale_id: int, sale: schemas.SaleUpdate):
    db_sale = get_sale(db, sale_id)
    if not db_sale:
        return None
    
    update_data = sale.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_sale, field, value)
    
    db.commit()
    db.refresh(db_sale)
    return db_sale

def delete_sale(db: Session, sale_id: int):
    db_sale = get_sale(db, sale_id)
    if not db_sale:
        return False
    
    # Delete related items first
    db.query(models.SaleItem).filter(models.SaleItem.sale_id == sale_id).delete()
    db.delete(db_sale)
    db.commit()
    return True