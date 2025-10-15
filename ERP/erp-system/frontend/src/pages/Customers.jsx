import React, { useState, useEffect } from 'react';
import DataTable from '../components/common/DataTable';
import FormModal from '../components/common/FormModal';
import api from '../services/api';
import { formatDate } from '../utils/helpers';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const columns = [
    { key: 'name', title: 'Nome' },
    { key: 'email', title: 'Email' },
    { key: 'phone', title: 'Telefone' },
    { 
      key: 'type', 
      title: 'Tipo', 
      render: (value) => {
        const types = {
          'client': 'Cliente',
          'supplier': 'Fornecedor',
          'both': 'Ambos'
        };
        return types[value] || value;
      }
    },
    { key: 'document', title: 'Documento' },
    { 
      key: 'is_active', 
      title: 'Status', 
      render: (value) => value ? 'Ativo' : 'Inativo' 
    },
    { 
      key: 'created_at', 
      title: 'Cadastrado em', 
      render: (value) => formatDate(value) 
    }
  ];

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await api.get('/customers/');
      setCustomers(response.data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const handleCreate = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDelete = async (customer) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente ${customer.name}?`)) {
      try {
        await api.delete(`/customers/${customer.id}`);
        loadCustomers();
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer.id}`, formData);
      } else {
        await api.post('/customers/', formData);
      }
      setIsModalOpen(false);
      loadCustomers();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  const formFields = [
    { name: 'name', label: 'Nome', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Telefone', type: 'text' },
    { name: 'address', label: 'Endereço', type: 'textarea' },
    { 
      name: 'type', 
      label: 'Tipo', 
      type: 'select',
      options: [
        { value: 'client', label: 'Cliente' },
        { value: 'supplier', label: 'Fornecedor' },
        { value: 'both', label: 'Cliente e Fornecedor' }
      ],
      required: true 
    },
    { name: 'document', label: 'Documento', type: 'text' }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clientes/Fornecedores</h1>
        <button
          onClick={handleCreate}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Novo Cliente/Fornecedor
        </button>
      </div>

      <DataTable
        data={customers}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingCustomer ? 'Editar Cliente/Fornecedor' : 'Novo Cliente/Fornecedor'}
        fields={formFields}
        initialData={editingCustomer}
      />
    </div>
  );
};

export default Customers;