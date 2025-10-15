import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0
  });
  
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simulação de dados - implementar chamadas reais à API
      setStats({
        totalSales: 150,
        totalRevenue: 45000,
        pendingOrders: 12,
        lowStockProducts: 5
      });
      
      setSalesData([
        { month: 'Jan', sales: 4000 },
        { month: 'Fev', sales: 3000 },
        { month: 'Mar', sales: 5000 },
        { month: 'Abr', sales: 2780 },
        { month: 'Mai', sales: 1890 },
        { month: 'Jun', sales: 2390 },
      ]);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total de Vendas</h3>
          <p className="text-3xl font-bold text-indigo-600">{stats.totalSales}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Receita Total</h3>
          <p className="text-3xl font-bold text-green-600">
            R$ {stats.totalRevenue.toLocaleString('pt-BR')}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Pedidos Pendentes</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Produtos com Estoque Baixo</h3>
          <p className="text-3xl font-bold text-red-600">{stats.lowStockProducts}</p>
        </div>
      </div>

      {/* Gráfico de Vendas */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Vendas Mensais</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;