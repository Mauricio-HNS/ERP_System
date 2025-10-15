import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: '📊', label: 'Dashboard' },
    { path: '/customers', icon: '👥', label: 'Clientes/Fornecedores' },
    { path: '/products', icon: '📦', label: 'Produtos' },
    { path: '/sales', icon: '💰', label: 'Vendas' },
    { path: '/purchases', icon: '🛒', label: 'Compras' },
    { path: '/financial', icon: '💳', label: 'Financeiro' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0 transition duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-center h-16 bg-indigo-600">
          <h2 className="text-xl font-semibold text-white">ERP Menu</h2>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => window.innerWidth < 1024 && onClose()}
              className={`flex items-center px-6 py-3 mt-2 text-gray-600 transition-colors duration-300 transform hover:bg-gray-100 hover:text-gray-700 ${
                isActive(item.path) ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-500' : ''
              }`}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              <span className="mx-2 font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;