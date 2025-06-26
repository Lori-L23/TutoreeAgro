import React from 'react';
import { FaUserEdit, FaUserTimes } from 'react-icons/fa';

const AdminUserTable = ({ users, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Chargement des utilisateurs...
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600">
        Aucun utilisateur trouvé.
      </div>
    );
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
          {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th> */}
          {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière connexion</th> */}
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inscription</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {users.map(user => (
          <tr key={user.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.id}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">{user.user_type}</td>
            
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.created_at}</td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-2">
              <button
                onClick={() => onEdit(user)}
                className="text-blue-600 hover:text-blue-800 transition"
                title="Modifier"
              >
                <FaUserEdit />
              </button>
              <button
                onClick={() => onDelete(user.id)}
                className="text-red-600 hover:text-red-800 transition"
                title="Désactiver"
              >
                <FaUserTimes />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminUserTable;
