# Serviço de email para notificações
# Implementação básica - expandir conforme necessário

def send_low_stock_alert(product_name: str, current_stock: int, min_stock: int):
    """Envia alerta de estoque baixo"""
    print(f"ALERTA: Estoque baixo para {product_name}. Estoque atual: {current_stock}, Mínimo: {min_stock}")

def send_payment_reminder(transaction_description: str, due_date: str):
    """Envia lembrete de pagamento"""
    print(f"LEMBRETE: Pagamento pendente para {transaction_description}. Vencimento: {due_date}")