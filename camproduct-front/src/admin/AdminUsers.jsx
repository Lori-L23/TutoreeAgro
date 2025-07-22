import { useState, useEffect, Fragment } from 'react';
import { FaSearch, FaUserEdit, FaUserTimes, FaFilter, FaPlus } from 'react-icons/fa';
import AdminUserTable from './AdminUserTable';
import UserModal from './UserModal';
import Api from '../Services/Api';
import { Dialog, Transition } from '@headlessui/react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    user_type: 'all' 
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Fonction pour charger les utilisateurs
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await Api.get('/api/admin/users');
      
      if (response.data?.success) {
        setUsers(response.data.users);
      } else {
        throw new Error(response.data?.message || 'Erreur lors du chargement des utilisateurs');
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Erreur de chargement');
      console.error("Erreur API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtrage des utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (user.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = 
      filters.user_type === 'all' || user.user_type === filters.user_type;
    
    return matchesSearch && matchesRole;
  });

  // Gestion des actions
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSave = async (userData) => {
    try {
      const isUpdate = !!userData.id;
      const response = isUpdate
        ? await Api.put(`/api/admin/users/${userData.id}`, userData)
        : await Api.post('/api/admin/users', userData);

      if (response.data.success) {
        await fetchUsers(); // Recharger la liste
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Erreur API:", error);
      alert(error.response?.data?.message || "Erreur lors de l'opération");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        const response = await Api.delete(`/api/admin/users/${userId}`);
        if (response.data.success) {
          await fetchUsers(); // Recharger la liste
        }
      } catch (error) {
        console.error("Erreur API:", error);
        alert(error.response?.data?.message || "Erreur de suppression");
      }
    }
  };

  // Gestion des modals
  const openAddUserModal = () => setIsConfirmOpen(true);
  const closeConfirmModal = () => setIsConfirmOpen(false);
  const confirmAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
    setIsConfirmOpen(false);
  };

  // Affichage des erreurs
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={fetchUsers}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestion des Utilisateurs</h1>
        
        {/* Barre de recherche et filtres */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher utilisateurs..."
                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-500" />
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={filters.user_type}
                onChange={(e) => setFilters({...filters, user_type: e.target.value})}
              >
                <option value="all">Tous les rôles</option>
                <option value="admin">Administrateurs</option>
                <option value="entreprise">Entreprises</option>
                <option value="client">Clients</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {filteredUsers.length} utilisateur(s) trouvé(s)
            </p>
            <button 
              onClick={openAddUserModal}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              <FaPlus /> Ajouter un utilisateur
            </button>
          </div>
        </div>
        
        {/* Tableau des utilisateurs */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des utilisateurs...</p>
            </div>
          ) : (
            <AdminUserTable 
              users={filteredUsers} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Modal d'édition/création */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSave={handleSave}
      />

      {/* Confirmation d'ajout */}
      <Transition show={isConfirmOpen} as={Fragment}>
        <Dialog onClose={closeConfirmModal} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  Confirmer l'ajout
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-sm text-gray-500">
                  Êtes-vous sûr de vouloir ajouter un nouvel utilisateur ?
                </Dialog.Description>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={closeConfirmModal}
                    className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmAddUser}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Confirmer
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default AdminUsers;