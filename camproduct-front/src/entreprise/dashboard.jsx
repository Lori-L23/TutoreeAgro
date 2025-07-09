import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaChartLine,
  FaBoxOpen,
  FaUsers,
  FaMoneyBillWave,
  FaEye,
  FaShoppingCart,
  // FaTrendingUp,
  // FaTrendingDown,
  // FaCalendarAlt,
  // FaClock,
  FaArrowUp,
  FaArrowDown,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglass,
  FaStar,
  FaEdit,
  FaPlus
} from "react-icons/fa";
import { useAuth } from "../Contexts/Authcontexts";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("30");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Simulation des données du dashboard
        setTimeout(() => {
          const mockData = {
            entreprise: {
              nom: "AgroFresh Cameroun",
              logo: null,
              dateCreation: "2022-03-15",
              statut: "active",
              ville: "Douala",
              region: "Littoral"
            },
            statistiques: {
              totalVentes: 2450000,
              ventesEvolution: 12.5,
              nombreCommandes: 156,
              commandesEvolution: -3.2,
              nouveauxClients: 45,
              clientsEvolution: 8.7,
              produits: 24,
              produitsActifs: 21,
              tauxConversion: 3.4,
              panierMoyen: 15700
            },
            ventesParMois: [
              { mois: "Jan", ventes: 180000 },
              { mois: "Fév", ventes: 220000 },
              { mois: "Mar", ventes: 195000 },
              { mois: "Avr", ventes: 240000 },
              { mois: "Mai", ventes: 285000 },
              { mois: "Juin", ventes: 310000 }
            ],
            produitsPopulaires: [
              { 
                id: 1, 
                nom: "Ananas Victoria Bio", 
                ventes: 89, 
                chiffre: 133500,
                stock: 25,
                image: null 
              },
              { 
                id: 2, 
                nom: "Mangues Kent Premium", 
                ventes: 76, 
                chiffre: 152000,
                stock: 12,
                image: null 
              },
              { 
                id: 3, 
                nom: "Avocats Hass Bio", 
                ventes: 64, 
                chiffre: 96000,
                stock: 8,
                image: null 
              }
            ],
            commandesRecentes: [
              {
                id: "CMD-2024-156",
                client: "Marie Dubois",
                montant: 45000,
                statut: "en cours",
                date: "2024-01-15T10:30:00Z",
                produits: 3
              },
              {
                id: "CMD-2024-155",
                client: "Jean Kamga",
                montant: 28500,
                statut: "livré",
                date: "2024-01-14T16:45:00Z",
                produits: 2
              },
              {
                id: "CMD-2024-154",
                client: "Sarah Chen",
                montant: 67200,
                statut: "en préparation",
                date: "2024-01-14T09:15:00Z",
                produits: 5
              }
            ],
            alertes: [
              {
                type: "stock",
                message: "3 produits ont un stock faible",
                niveau: "warning"
              },
              {
                type: "commande",
                message: "5 nouvelles commandes en attente",
                niveau: "info"
              }
            ]
          };
          
          setDashboardData(mockData);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error("Erreur lors du chargement du dashboard:", error);
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, selectedPeriod]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('fr-FR', options);
  };

  const getStatusClass = (statut) => {
    switch (statut) {
      case "livré":
        return "bg-green-100 text-green-800";
      case "en cours":
        return "bg-blue-100 text-blue-800";
      case "en préparation":
        return "bg-yellow-100 text-yellow-800";
      case "annulé":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAlertClass = (niveau) => {
    switch (niveau) {
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder au dashboard</p>
          <Link
            to="/connexion"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Tableau de bord
              </h1>
              <p className="text-gray-600">
                Bienvenue, {dashboardData?.entreprise.nom}
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="7">7 derniers jours</option>
                <option value="30">30 derniers jours</option>
                <option value="90">3 derniers mois</option>
                <option value="365">Cette année</option>
              </select>
              <Link
                to="/mes-produits/nouveau"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200 flex items-center"
              >
                <FaPlus className="mr-2" />
                Nouveau produit
              </Link>
            </div>
          </div>

          {/* Alertes */}
          {dashboardData?.alertes && dashboardData.alertes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {dashboardData.alertes.map((alerte, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getAlertClass(alerte.niveau)}`}>
                  <div className="flex items-center">
                    <FaExclamationTriangle className="mr-2" />
                    <span className="font-medium">{alerte.message}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Chiffre d'affaires</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(dashboardData?.statistiques.totalVentes)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaMoneyBillWave className="text-green-600 text-xl" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              {dashboardData?.statistiques.ventesEvolution > 0 ? (
                <FaArrowUp className="text-green-500 mr-1" />
              ) : (
                <FaArrowDown className="text-red-500 mr-1" />
              )}
              <span className={dashboardData?.statistiques.ventesEvolution > 0 ? "text-green-600" : "text-red-600"}>
                {Math.abs(dashboardData?.statistiques.ventesEvolution)}%
              </span>
              <span className="text-gray-500 ml-1">vs période précédente</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Commandes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.statistiques.nombreCommandes}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaShoppingCart className="text-blue-600 text-xl" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              {dashboardData?.statistiques.commandesEvolution > 0 ? (
                <FaArrowUp className="text-green-500 mr-1" />
              ) : (
                <FaArrowDown className="text-red-500 mr-1" />
              )}
              <span className={dashboardData?.statistiques.commandesEvolution > 0 ? "text-green-600" : "text-red-600"}>
                {Math.abs(dashboardData?.statistiques.commandesEvolution)}%
              </span>
              <span className="text-gray-500 ml-1">vs période précédente</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Nouveaux clients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.statistiques.nouveauxClients}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaUsers className="text-purple-600 text-xl" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <FaArrowUp className="text-green-500 mr-1" />
              <span className="text-green-600">
                {dashboardData?.statistiques.clientsEvolution}%
              </span>
              <span className="text-gray-500 ml-1">vs période précédente</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Produits actifs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.statistiques.produitsActifs}/{dashboardData?.statistiques.produits}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <FaBoxOpen className="text-orange-600 text-xl" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-500">
                Taux de conversion: {dashboardData?.statistiques.tauxConversion}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Graphique des ventes */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Évolution des ventes</h2>
              <FaChartLine className="text-green-600" />
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {dashboardData?.ventesParMois.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-green-500 rounded-t"
                    style={{
                      height: `${(item.ventes / Math.max(...dashboardData.ventesParMois.map(v => v.ventes))) * 200}px`
                    }}
                  ></div>
                  <div className="mt-2 text-xs text-gray-600">{item.mois}</div>
                  <div className="text-xs font-medium text-gray-800">
                    {(item.ventes / 1000).toFixed(0)}k
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Produits populaires */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Produits populaires</h2>
              <Link to="/mes-produits" className="text-green-600 hover:text-green-700 text-sm font-medium">
                Voir tout
              </Link>
            </div>
            <div className="space-y-4">
              {dashboardData?.produitsPopulaires.map((produit, index) => (
                <div key={produit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                      <img
                        src="/api/placeholder/48/48"
                        alt={produit.nom}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{produit.nom}</p>
                      <p className="text-xs text-gray-500">{produit.ventes} ventes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatPrice(produit.chiffre)}</p>
                    <p className={`text-xs ${produit.stock < 10 ? 'text-red-600' : 'text-gray-500'}`}>
                      Stock: {produit.stock}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Commandes récentes */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Commandes récentes</h2>
            <Link
              to="/commandes"
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              Voir toutes les commandes
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commande
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData?.commandesRecentes.map((commande) => (
                  <tr key={commande.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{commande.id}</div>
                        <div className="text-sm text-gray-500">{commande.produits} produits</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {commande.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(commande.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(commande.statut)}`}>
                        {commande.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(commande.montant)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/commandes/${commande.id}`}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        <FaEye />
                      </Link>
                      <button className="text-gray-400 hover:text-gray-600">
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;