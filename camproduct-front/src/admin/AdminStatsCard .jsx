import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const AdminStatsCard = ({ icon, title, value, change, loading }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex items-center">
      <div className="text-green-600 text-3xl mr-4">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {loading ? (
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <FaSpinner className="animate-spin" />
            <span>Chargement...</span>
          </div>
        ) : (
          <>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-green-600">{change}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminStatsCard;