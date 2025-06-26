import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';

const UserModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    user_type: 'client', // Changé de user_type à role pour cohérence
  });

  // Initialisation du formulaire
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        user_type: user.user_type || 'client', // Utilisation de role au lieu de user_type
      });
    } else {
      setFormData({
        name: '',
        email: '',
        user_type: 'client',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: user?.id || Date.now(),
    });
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 z-50 relative">
          <Dialog.Title className="text-xl font-semibold mb-4">
            {user ? 'Modifier Utilisateur' : 'Ajouter Utilisateur'}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rôle
              </label>
              <select
                name="user_type"
                value={formData.user_type}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
              >
                <option value="admin">Administrateur</option>
                <option value="entreprise">Entreprise</option>
                <option value="client">Client</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                {user ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default UserModal;