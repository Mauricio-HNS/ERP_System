import React, { useState, useEffect } from 'react';
import DataTable from '../components/common/DataTable';
import FormModal from '../components/common/FormModal';
import api from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const columns = [
    { key: 'name', title: 'Nome' },
    { key: 'sku', title: 'SKU' },
    { 
      key: 'price', 
      title: 'Preço', 
      render: (value) => formatCurrency(value) 
    },
    { 
      key: 'cost_price', 
      title: 'Preço de Custo', 
      render: (value) => value ? formatCurrency(value) : '-' 
    },
    { key: 'stock_quantity', title: 'Estoque' },
    { key: 'min_stock', title: 'Estoque Mínimo' },
    { key: 'category', title: 'Categoria' },
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
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.get('/products/');
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Tem certeza que deseja excluir o produto ${product.name}?`)) {
      try {
        await api.delete(`/products/${product.id}`);
        loadProducts();
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, formData);
      } else {
        await api.post('/products/', formData);
      }
      setIsModalOpen(false);
      loadProducts();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const formFields = [
    { name: 'name', label: 'Nome', type: 'text', required: true },
    { name: 'sku', label: 'SKU', type: 'text', required: true },
    { name: 'description', label: 'Descrição', type: 'textarea' },
    { name: 'price', label: 'Preço', type: 'number', required: true, step: '0.01' },
    { name: 'cost_price', label: 'Preço de Custo', type: 'number', step: '0.01' },
    { name: 'stock_quantity', label: 'Quantidade em Estoque', type: 'number' },
    { name: 'min_stock', label: 'Estoque Mínimo', type: 'number' },
    { name: 'max_stock', label: 'Estoque Máximo', type: 'number' },
    { name: 'category', label: 'Categoria', type: 'text' }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
        <button
          onClick={handleCreate}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Novo Produto
        </button>
      </div>

      <DataTable
        data={products}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingProduct ? 'Editar Produto' : 'Novo Produto'}
        fields={formFields}
        initialData={editingProduct}
      />
    </div>
  );
};

export default Products;