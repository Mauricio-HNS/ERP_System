import React, { useState, useEffect } from 'react';
import DataTable from '../components/common/DataTable';
import FormModal from '../components/common/FormModal';
import api from '../services/api';
import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);

  const columns = [
    { key: 'id', title: 'ID' },
    { 
      key: 'purchase_date', 
      title: 'Data', 
      render: (value) => formatDate(value) 
    },
    { key: 'supplier.name', title: 'Fornecedor', render: (value, item) => item.supplier?.name || '-' },
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
          'received': 'Recebido',
          'cancelled': 'Cancelado'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
            {statusText[value] || value}
          </span>
        );
      }
    },
    { 
      key: 'created_at', 
      title: 'Criado em', 
      render: (value) => formatDate(value) 
    }
  ];

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    try {
      const response = await api.get('/purchases/');
      setPurchases(response.data);
    } catch (error) {
      console.error('Erro ao carregar compras:', error);
    }
  };

  const handleCreate = () => {
    setEditingPurchase(null);
    setIsModalOpen(true);
  };

  const handleEdit = (purchase) => {
    setEditingPurchase(purchase);
    setIsModalOpen(true);
  };

  const handleDelete = async (purchase) => {
    if (window.confirm(`Tem certeza que deseja excluir a compra #${purchase.id}?`)) {
      try {
        await api.delete(`/purchases/${purchase.id}`);
        loadPurchases();
      } catch (error) {
        console.error('Erro ao excluir compra:', error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingPurchase) {
        await api.put(`/purchases/${editingPurchase.id}`, formData);
      } else {
        await api.post('/purchases/', formData);
      }
      setIsModalOpen(false);
      loadPurchases();
    } catch (error) {
      console.error('Erro ao salvar compra:', error);
    }
  };

  const formFields = [
    { name: 'supplier_id', label: 'Fornecedor', type: 'number', required: true },
    { name: 'purchase_date', label: 'Data da Compra', type: 'date', required: true },
    { name: 'total_amount', label: 'Total', type: 'number', required: true, step: '0.01' },
    { 
      name: 'status', 
      label: 'Status', 
      type: 'select',
      options: [
        { value: 'pending', label: 'Pendente' },
        { value: 'received', label: 'Recebido' },
        { value: 'cancelled', label: 'Cancelado' }
      ],
      required: true 
    },
    { name: 'notes', label: 'Observações', type: 'textarea' }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Compras</h1>
        <button
          onClick={handleCreate}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Nova Compra
        </button>
      </div>

      <DataTable
        data={purchases}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingPurchase ? 'Editar Compra' : 'Nova Compra'}
        fields={formFields}
        initialData={editingPurchase}
      />
    </div>
  );
};

export default Purchases;