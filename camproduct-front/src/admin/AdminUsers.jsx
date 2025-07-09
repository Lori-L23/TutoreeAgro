import { useState, useEffect } from 'react';
import { FaSearch, FaUserEdit, FaUserTimes, FaFilter } from 'react-icons/fa';
import AdminUserTable from '../admin/AdminUserTable';
import UserModal from '../admin/UserModal';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all'
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Simuler un appel API
        const mockUsers = Array.from({ length: 15 }, (_, i) => ({
          id: i + 1,
          name: `Utilisateur ${i + 1}`,
          email: `user${i + 1}@example.com`,
          role: i % 3 === 0 ? 'admin' : i % 2 === 0 ? 'entreprise' : 'client',
          status: i % 4 === 0 ? 'inactif' : 'actif',
          lastLogin: new Date(Date.now() - i * 86400000).toLocaleDateString(),
          registeredAt: new Date(Date.now() - (i + 5) * 86400000).toLocaleDateString()
        }));
        setUsers(mockUsers);
      } catch (error) {
        console.error("Erreur de chargement des utilisateurs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filters.role === 'all' || user.role === filters.role;
    const matchesStatus = filters.status === 'all' || user.status === filters.status;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSave = (updatedUser) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setIsModalOpen(false);
  };

  const handleDelete = (userId) => {
    if (window.confirm("Êtes-vous sûr de vouloir désactiver cet utilisateur ?")) {
      setUsers(users.map(u => u.id === userId ? {...u, status: 'inactif'} : u));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 ">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 mt-20">Gestion des Utilisateurs</h1>
        
        {/* Filtres et recherche */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                value={filters.role}
                onChange={(e) => setFilters({...filters, role: e.target.value})}
              >
                <option value="all">Tous les rôles</option>
                <option value="admin">Administrateurs</option>
                <option value="entreprise">Entreprises</option>
                <option value="client">Clients</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-500" />
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="all">Tous les statuts</option>
                <option value="actif">Actifs</option>
                <option value="inactif">Inactifs</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {filteredUsers.length} utilisateur(s) trouvé(s)
            </p>
            <button 
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              onClick={() => {
                setSelectedUser(null);
                setIsModalOpen(true);
              }}
            >
              Ajouter un utilisateur
            </button>
          </div>
        </div>
        
        {/* Tableau des utilisateurs */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <AdminUserTable 
            users={filteredUsers} 
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Modal d'édition */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSave={handleSave}
      />
    </div>
  );
};

export default AdminUsers;