import React from 'react';
import { FaUsers, FaChartLine, FaBoxOpen, FaMoneyBillWave } from 'react-icons/fa';

const Dashboard = () => {
  const stats = {
    totalUsers: 1234,
    revenue: '50,000 €',
    products: 45,
    growth: '15%',
  };

  const cards = [
    {
      title: 'Utilisateurs',
      value: stats.totalUsers,
      icon: <FaUsers className="text-blue-500" size={28} />,
    },
    {
      title: 'Revenus',
      value: stats.revenue,
      icon: <FaMoneyBillWave className="text-green-500" size={28} />,
    },
    {
      title: 'Produits',
      value: stats.products,
      icon: <FaBoxOpen className="text-yellow-500" size={28} />,
    },
    {
      title: 'Croissance',
      value: stats.growth,
      icon: <FaChartLine className="text-teal-500" size={28} />,
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Tableau de bord</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white shadow rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <h3 className="text-2xl font-bold">{card.value}</h3>
            </div>
            {card.icon}
          </div>
        ))}
      </div>

      {/* Graph + Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-xl p-4 col-span-2">
          <h5 className="text-lg font-semibold mb-4">Graphique des ventes</h5>
          <div className="h-48 flex items-center justify-center text-gray-400">
            Emplacement pour le graphique
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <h5 className="text-lg font-semibold mb-4">Activités récentes</h5>
          <div className="h-48 flex items-center justify-center text-gray-400">
            Liste des activités récentes
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
