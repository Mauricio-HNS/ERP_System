import React, { useState, useEffect } from 'react';
import DataTable from '../components/common/DataTable';
import FormModal from '../components/common/FormModal';
import api from '../services/api';
import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers';

const Financial = () => {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const columns = [
    { key: 'description', title: 'Descrição' },
    { 
      key: 'type', 
      title: 'Tipo', 
      render: (value) => {
        const types = {
          'receivable': 'A Receber',
          'payable': 'A Pagar'
        };
        return types[value] || value;
      }
    },
    { 
      key: 'amount', 
      title: 'Valor', 
      render: (value) => formatCurrency(value) 
    },
    { 
      key: 'due_date', 
      title: 'Vencimento', 
      render: (value) => formatDate(value) 
    },
    { 
      key: 'status', 
      title: 'Status', 
      render: (value) => {
        const statusText = {
          'pending': 'Pendente',
          'paid': 'Pago',
          'overdue': 'Atrasado'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
            {statusText[value] || value}
          </span>
        );
      }
    },
    { 
      key: 'payment_date', 
      title: 'Data Pagamento', 
      render: (value) => value ? formatDate(value) : '-' 
    },
    { 
      key: 'created_at', 
      title: 'Criado em', 
      render: (value) => formatDate(value) 
    }
  ];

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const response = await api.get('/financial/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    }
  };

  const handleCreate = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = async (transaction) => {
    if (window.confirm(`Tem certeza que deseja excluir a transação "${transaction.description}"?`)) {
      try {
        await api.delete(`/financial/transactions/${transaction.id}`);
        loadTransactions();
      } catch (error) {
        console.error('Erro ao excluir transação:', error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingTransaction) {
        await api.put(`/financial/transactions/${editingTransaction.id}`, formData);
      } else {
        await api.post('/financial/transactions', formData);
      }
      setIsModalOpen(false);
      loadTransactions();
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
    }
  };

  const formFields = [
    { name: 'description', label: 'Descrição', type: 'text', required: true },
    { 
      name: 'type', 
      label: 'Tipo', 
      type: 'select',
      options: [
        { value: 'receivable', label: 'A Receber' },
        { value: 'payable', label: 'A Pagar' }
      ],
      required: true 
    },
    { name: 'amount', label: 'Valor', type: 'number', required: true, step: '0.01' },
    { name: 'due_date', label: 'Data de Vencimento', type: 'date', required: true },
    { 
      name: 'status', 
      label: 'Status', 
      type: 'select',
      options: [
        { value: 'pending', label: 'Pendente' },
        { value: 'paid', label: 'Pago' },
        { value: 'overdue', label: 'Atrasado' }
      ],
      required: true 
    },
    { name: 'payment_date', label: 'Data de Pagamento', type: 'date' },
    { name: 'reference_id', label: 'ID de Referência', type: 'number' },
    { name: 'reference_type', label: 'Tipo de Referência', type: 'text' }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
        <button
          onClick={handleCreate}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Nova Transação
        </button>
      </div>

      <DataTable
        data={transactions}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingTransaction ? 'Editar Transação' : 'Nova Transação'}
        fields={formFields}
        initialData={editingTransaction}
      />
    </div>
  );
};

export default Financial;