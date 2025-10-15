from sqlalchemy.orm import Session
from ..models import Product

def check_low_stock_products(db: Session):
    """Retorna produtos com estoque abaixo do mínimo"""
    return db.query(Product).filter(
        Product.stock_quantity <= Product.min_stock,
        Product.is_active == True
    ).all()

def get_sales_summary(db: Session, start_date, end_date):
    """Retorna resumo de vendas por período"""
    # Implementação básica - expandir conforme necessário
    pass

def get_financial_summary(db: Session):
    """Retorna resumo financeiro"""
    # Implementação básica - expandir conforme necessário
    pass