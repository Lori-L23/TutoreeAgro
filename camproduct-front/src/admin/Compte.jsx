import React from 'react';
import { FaUserCircle, FaEnvelope, FaPhone, FaLock, FaBell, FaCog } from 'react-icons/fa';

const AdminAccount = () => {
  const admin = {
    name: 'Jean Admin',
    email: 'admin@example.com',
    phone: '+237 6 99 99 99 99',
    role: 'Administrateur',
    avatar: null,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-8 mt-16">
        {/* Header */}
        <div className="flex items-center mb-8 ">
          <div className="text-green-600 text-6xl mr-6">
            {admin.avatar ? (
              <img src={admin.avatar} alt="Admin avatar" className="rounded-full w-20 h-20" />
            ) : (
              <FaUserCircle />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">{admin.name}</h2>
            <p className="text-gray-500">{admin.role}</p>
          </div>
        </div>

        {/* Informations de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="flex items-center space-x-4">
            <FaEnvelope className="text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-800 font-medium">{admin.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <FaPhone className="text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Téléphone</p>
              <p className="text-gray-800 font-medium">{admin.phone}</p>
            </div>
          </div>
        </div>

        {/* Paramètres du compte */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-3">
              <FaLock className="text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Sécurité</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Modifier votre mot de passe ou activer l’authentification à deux facteurs.
            </p>
            <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Gérer la sécurité
            </button>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-3">
              <FaBell className="text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Choisissez comment vous souhaitez recevoir les alertes.
            </p>
            <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Gérer les notifications
            </button>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg shadow-sm md:col-span-2">
            <div className="flex items-center mb-3">
              <FaCog className="text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Préférences du compte</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Mettre à jour les préférences du tableau de bord, la langue, ou le thème.
            </p>
            <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Modifier les préférences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAccount;
