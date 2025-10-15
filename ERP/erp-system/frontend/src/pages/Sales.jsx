import React, { useState, useEffect } from 'react';
import DataTable from '../components/common/DataTable';
import FormModal from '../components/common/FormModal';
import api from '../services/api';
import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);

  const columns = [
    { key: 'id', title: 'ID' },
    { 
      key: 'sale_date', 
      title: 'Data', 
      render: (value) => formatDate(value) 
    },
    { key: 'customer.name', title: 'Cliente', render: (value, item) => item.customer?.name || '-' },
    { 
      key: 'total_amount', 
      title: 'Total', 
      render: (value) => formatCurrency(value) 
    },
    { 
      key: 'status', 
      title: 'Status', 
      render: (value) => {
        const statusText = {
          'pending': 'Pendente',
          'completed': 'Concluída',
          'cancelled': 'Cancelada'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
            {statusText[value] || value}
          </span>
        );
      }
    },
    { key: 'payment_method', title: 'Pagamento' },
    { 
      key: 'created_at', 
      title: 'Criado em', 
      render: (value) => formatDate(value) 
    }
  ];

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      const response = await api.get('/sales/');
      setSales(response.data);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
    }
  };

  const handleCreate = () => {
    setEditingSale(null);
    setIsModalOpen(true);
  };

  const handleEdit = (sale) => {
    setEditingSale(sale);
    setIsModalOpen(true);
  };

  const handleDelete = async (sale) => {
    if (window.confirm(`Tem certeza que deseja excluir a venda #${sale.id}?`)) {
      try {
        await api.delete(`/sales/${sale.id}`);
        loadSales();
      } catch (error) {
        console.error('Erro ao excluir venda:', error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingSale) {
        await api.put(`/sales/${editingSale.id}`, formData);
      } else {
        await api.post('/sales/', formData);
      }
      setIsModalOpen(false);
      loadSales();
    } catch (error) {
      console.error('Erro ao salvar venda:', error);
    }
  };

  const formFields = [
    { name: 'customer_id', label: 'Cliente', type: 'number', required: true },
    { name: 'sale_date', label: 'Data da Venda', type: 'date', required: true },
    { name: 'total_amount', label: 'Total', type: 'number', required: true, step: '0.01' },
    { 
      name: 'status', 
      label: 'Status', 
      type: 'select',
      options: [
        { value: 'pending', label: 'Pendente' },
        { value: 'completed', label: 'Concluída' },
        { value: 'cancelled', label: 'Cancelada' }
      ],
      required: true 
    },
    { 
      name: 'payment_method', 
      label: 'Método de Pagamento', 
      type: 'select',
      options: [
        { value: 'cash', label: 'Dinheiro' },
        { value: 'card', label: 'Cartão' },
        { value: 'transfer', label: 'Transferência' }
      ]
    },
    { name: 'notes', label: 'Observações', type: 'textarea' }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Vendas</h1>
        <button
          onClick={handleCreate}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Nova Venda
        </button>
      </div>

      <DataTable
        data={sales}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingSale ? 'Editar Venda' : 'Nova Venda'}
        fields={formFields}
        initialData={editingSale}
      />
    </div>
  );
};

export default Sales;