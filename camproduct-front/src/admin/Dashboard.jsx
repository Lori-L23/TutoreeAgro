import { useState, useEffect } from 'react';
import { useAuth } from '../Contexts/Authcontexts';
import { 
  FaChartLine, 
  FaUsers, 
  FaStore, 
  FaFileInvoiceDollar,
  FaCog,
  FaBell
} from 'react-icons/fa';
import AdminStatsCard from '../admin/AdminStatsCard ';
import RecentActivities from '../admin/RecentActivities';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    entreprises: 0,
    produits: 0,
    commandes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un appel API
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Ici vous feriez un appel à votre API
        const mockStats = {
          users: 1245,
          entreprises: 367,
          produits: 2894,
          commandes: 843
        };
        setStats(mockStats);
      } catch (error) {
        console.error("Erreur de chargement des stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center ">
          <h1 className="text-3xl font-bold text-gray-900 mt-20">Tableau de Bord</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700 mt-20">
              <FaBell className="text-xl" />
            </button>
            <div className="flex items-center mt-20">
              <span className="mr-2 text-sm font-medium text-gray-700">
                {user?.name || 'Admin'}
              </span>
              <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AdminStatsCard 
            icon={<FaUsers className="text-2xl" />}
            title="Utilisateurs"
            value={stats.users}
            change="+12% ce mois"
            loading={loading}
          />
          <AdminStatsCard 
            icon={<FaStore className="text-2xl" />}
            title="Entreprises"
            value={stats.entreprises}
            change="+5% ce mois"
            loading={loading}
          />
          <AdminStatsCard 
            icon={<FaStore className="text-2xl" />}
            title="Produits"
            value={stats.produits}
            change="+18% ce mois"
            loading={loading}
          />
          <AdminStatsCard 
            icon={<FaFileInvoiceDollar className="text-2xl" />}
            title="Commandes"
            value={stats.commandes}
            change="+23% ce mois"
            loading={loading}
          />
        </div>

        {/* Recent Activities */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Activités Récentes</h2>
            <button className="text-green-600 hover:text-green-800 text-sm font-medium">
              Voir tout
            </button>
          </div>
          <RecentActivities />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FaCog className="mr-2 text-green-600" />
              Actions Rapides
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition">
                Valider nouvelles entreprises
              </button>
              <button className="w-full text-left px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition">
                Modérer les avis
              </button>
              <button className="w-full text-left px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition">
                Gérer les catégories
              </button>
            </div>
          </div>

          {/* Dernières entreprises inscrites */}
          <div className="bg-white shadow rounded-lg p-6 md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Dernières entreprises inscrites
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Secteur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[1, 2, 3].map((item) => (
                    <tr key={item}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Entreprise {item}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Secteur {item}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date().toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item % 2 === 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {item % 2 === 0 ? 'Validé' : 'En attente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;