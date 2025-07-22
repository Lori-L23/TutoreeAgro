import { useState, useEffect } from "react";
import { useAuth } from "../Contexts/Authcontexts";
import {
  FaChartLine,
  FaUsers,
  FaStore,
  FaFileInvoiceDollar,
  FaCog,
  FaBell,
  FaCheck,
  FaTimes,
  FaEdit,
} from "react-icons/fa";
import AdminStatsCard from "./AdminStatsCard ";
import RecentActivities from "./RecentActivities";
import Api from "../Services/Api";
import { ToastContainer } from "react-toastify";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    entreprises: 0,
    produits: 0,
    commandes: 0,
    users_change: 0,
    companies_change: 0,
    products_change: 0,
    orders_change: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [editingCompany, setEditingCompany] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les stats
        const statsResponse = await Api.get("/api/admin/stats");
        setStats(statsResponse.data.data);

        // Récupérer les activités récentes
        const activitiesResponse = await Api.get(
          "/api/admin/recent-activities"
        );
        setActivities(activitiesResponse.data.data);

        // Récupérer les dernières entreprises
        const companiesResponse = await Api.get("/api/admin/latest-companies");
        setCompanies(companiesResponse.data.data);
      } catch (error) {
        console.error("Erreur de chargement des données:", error);
      } finally {
        setLoading(false);
        setLoadingActivities(false);
        setLoadingCompanies(false);
      }
    };

    fetchData();
  }, []);

  const handleEditStatus = (company) => {
    setEditingCompany(company.id);
    setStatus(company.status ? "approved" : "pending");
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSaveStatus = async (companyId) => {
    try {
      const response = await Api.put(
        `/api/admin/companies/${companyId}/status`,
        {
          status: status === "approved",
        }
      );

      if (response.data.success) {
        setCompanies(
          companies.map((company) =>
            company.id === companyId
              ? { ...company, status: status === "approved" }
              : company
          )
        );
        setEditingCompany(null);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingCompany(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center ">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-20">
            Tableau de Bord
          </h1>
          <div className="flex items-center space-x-4  sm:mt-0">
            <button className="p-2 text-gray-500 mt-20 hover:text-gray-700">
              <FaBell className="text-xl" />
            </button>
            <div className="flex items-center mt-20">
              <span className="mr-2 text-sm font-medium text-gray-700 hidden sm:inline">
                {user?.noms || "Admin"}
              </span>
              <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                {user?.noms?.charAt(0) || "A"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <AdminStatsCard
            icon={<FaUsers className="text-2xl" />}
            title="Utilisateurs"
            value={stats.users}
            change={`${stats.users_change > 0 ? "+" : ""}${
              stats.users_change
            }% ce mois`}
            loading={loading}
          />
          <AdminStatsCard
            icon={<FaStore className="text-2xl" />}
            title="Entreprises"
            value={stats.entreprises}
            change={`${stats.companies_change > 0 ? "+" : ""}${
              stats.companies_change
            }% ce mois`}
            loading={loading}
          />
          <AdminStatsCard
            icon={<FaStore className="text-2xl" />}
            title="Clients"
            value={stats.clients}
            change={`${stats.companies_change > 0 ? "+" : ""}${
              stats.companies_change
            }% ce mois`}
            loading={loading}
          />
          <AdminStatsCard
            icon={<FaFileInvoiceDollar className="text-2xl" />}
            title="Commandes"
            value={stats.commandes}
            change={`${stats.orders_change > 0 ? "+" : ""}${
              stats.orders_change
            }% ce mois`}
            loading={loading}
          />
        </div>

        {/* Recent Activities */}
        <div className="bg-white shadow rounded-lg p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              Activités Récentes
            </h2>
            <button className="text-green-600 hover:text-green-800 text-sm font-medium">
              Voir tout
            </button>
          </div>
          <RecentActivities
            activities={activities}
            loading={loadingActivities}
          />
        </div>

        {/* Dernières entreprises inscrites */}
        <div className="bg-white shadow rounded-lg p-4 md:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Dernières entreprises inscrites
          </h3>
          {loadingCompanies ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Secteur
                    </th>
                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {companies.map((company) => (
                    <tr key={company.id}>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {company.nom_entreprise}
                      </td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                        {company.activity_sector || "Non spécifié"}
                      </td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(company.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                        {editingCompany === company.id ? (
                          <select
                            value={status}
                            onChange={handleStatusChange}
                            className="block w-full pl-2 pr-8 py-1 sm:pl-3 sm:pr-10 sm:py-2 text-xs sm:text-sm border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
                          >
                            <option value="pending">En attente</option>
                            <option value="approved">Approuvé</option>
                          </select>
                        ) : (
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              company.status
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {company.status ? "Approuvé" : "En attente"}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editingCompany === company.id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSaveStatus(company.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEditStatus(company)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FaEdit />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;