'use client';

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaChartLine,
  FaBoxOpen,
  FaUsers,
  FaMoneyBillWave,
  FaEye,
  FaShoppingCart,
  FaArrowUp,
  FaArrowDown,
  FaExclamationTriangle,
  FaEdit,
  FaPlus,
  FaSpinner
} from "react-icons/fa";
import { useAuth } from "../Contexts/Authcontexts";
import Api from "../Services/Api";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Utilisation correcte du composant Api
        const data = await Api.get(`/api/dashboard?period=${selectedPeriod}`);
        setDashboardData(data);
      } catch (err) {
        console.error("Erreur API:", err);
        setError(err.message || "Erreur lors du chargement des données");
      } finally {
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
    }).format(price || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('fr-FR', options);
  };

  const getStatusClass = (statut) => {
    if (!statut) return "bg-gray-100 text-gray-800";
    switch (statut.toLowerCase()) {
      case "livré":
      case "livree":
        return "bg-green-100 text-green-800";
      case "en cours":
      case "en_route":
        return "bg-blue-100 text-blue-800";
      case "en préparation":
      case "preparation":
        return "bg-yellow-100 text-yellow-800";
      case "annulé":
      case "annulee":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAlertClass = (niveau) => {
    if (!niveau) return "bg-gray-50 border-gray-200 text-gray-800";
    switch (niveau.toLowerCase()) {
      case "warning":
      case "alerte":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
      case "information":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "error":
      case "erreur":
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
          <p className="text-gray-600 mb-6">Connectez-vous pour accéder au dashboard</p>
          <Link
            to="/connexion"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <FaSpinner className="animate-spin text-green-600 text-4xl mb-4" />
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Erreur de chargement</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Tableau de bord</h1>
              <p className="text-gray-600">
                Bienvenue, {dashboardData?.entreprise?.nom || user?.name || 'Utilisateur'}
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
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center"
              >
                <FaPlus className="mr-2" />
                Nouveau produit
              </Link>
            </div>
          </div>

          {/* Alertes */}
          {dashboardData?.alertes?.length > 0 && (
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* CA Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Chiffre d'affaires</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(dashboardData?.statistiques?.totalVentes)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaMoneyBillWave className="text-green-600 text-xl" />
              </div>
            </div>
            {dashboardData?.statistiques?.ventesEvolution !== undefined && (
              <div className="mt-2 flex items-center text-sm">
                {dashboardData.statistiques.ventesEvolution > 0 ? (
                  <FaArrowUp className="text-green-500 mr-1" />
                ) : (
                  <FaArrowDown className="text-red-500 mr-1" />
                )}
                <span className={dashboardData.statistiques.ventesEvolution > 0 ? "text-green-600" : "text-red-600"}>
                  {Math.abs(dashboardData.statistiques.ventesEvolution)}%
                </span>
                <span className="text-gray-500 ml-1">vs période précédente</span>
              </div>
            )}
          </div>

          {/* Commandes Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Commandes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.statistiques?.nombreCommandes || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaShoppingCart className="text-blue-600 text-xl" />
              </div>
            </div>
            {dashboardData?.statistiques?.commandesEvolution !== undefined && (
              <div className="mt-2 flex items-center text-sm">
                {dashboardData.statistiques.commandesEvolution > 0 ? (
                  <FaArrowUp className="text-green-500 mr-1" />
                ) : (
                  <FaArrowDown className="text-red-500 mr-1" />
                )}
                <span className={dashboardData.statistiques.commandesEvolution > 0 ? "text-green-600" : "text-red-600"}>
                  {Math.abs(dashboardData.statistiques.commandesEvolution)}%
                </span>
                <span className="text-gray-500 ml-1">vs période précédente</span>
              </div>
            )}
          </div>

          {/* Clients Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Nouveaux clients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.statistiques?.nouveauxClients || 0}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaUsers className="text-purple-600 text-xl" />
              </div>
            </div>
            {dashboardData?.statistiques?.clientsEvolution !== undefined && (
              <div className="mt-2 flex items-center text-sm">
                {dashboardData.statistiques.clientsEvolution > 0 ? (
                  <FaArrowUp className="text-green-500 mr-1" />
                ) : (
                  <FaArrowDown className="text-red-500 mr-1" />
                )}
                <span className={dashboardData.statistiques.clientsEvolution > 0 ? "text-green-600" : "text-red-600"}>
                  {Math.abs(dashboardData.statistiques.clientsEvolution)}%
                </span>
                <span className="text-gray-500 ml-1">vs période précédente</span>
              </div>
            )}
          </div>

          {/* Produits Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Produits actifs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.statistiques?.produitsActifs || 0}/{dashboardData?.statistiques?.produits || 0}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <FaBoxOpen className="text-orange-600 text-xl" />
              </div>
            </div>
            {dashboardData?.statistiques?.tauxConversion !== undefined && (
              <div className="mt-2 text-sm text-gray-500">
                Taux de conversion: {dashboardData.statistiques.tauxConversion}%
              </div>
            )}
          </div>
        </div>

        {/* Charts and Popular Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Évolution des ventes</h2>
              <FaChartLine className="text-green-600" />
            </div>
            {dashboardData?.ventesParMois?.length > 0 ? (
              <div className="h-64 flex items-end justify-between space-x-2">
                {dashboardData.ventesParMois.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-green-500 rounded-t"
                      style={{
                        height: `${(item.ventes / Math.max(...dashboardData.ventesParMois.map(v => v.ventes))) * 200}px`
                      }}
                    ></div>
                    <div className="mt-2 text-xs text-gray-600">{item.mois}</div>
                    <div className="text-xs font-medium text-gray-800">
                      {formatPrice(item.ventes)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                Aucune donnée de vente disponible
              </div>
            )}
          </div>

          {/* Popular Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Produits populaires</h2>
              <Link to="/mes-produits" className="text-green-600 hover:text-green-700 text-sm font-medium">
                Voir tout
              </Link>
            </div>
            {dashboardData?.produitsPopulaires?.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.produitsPopulaires.map((produit) => (
                  <div key={produit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3 flex items-center justify-center overflow-hidden">
                        {produit.image ? (
                          <img
                            src={`/api/uploads/products/${produit.image}`}
                            alt={produit.nom}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder-product.png';
                            }}
                          />
                        ) : (
                          <FaBoxOpen className="text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{produit.nom}</p>
                        <p className="text-xs text-gray-500">{produit.ventes || 0} ventes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatPrice(produit.chiffre)}</p>
                      <p className={`text-xs ${(produit.stock || 0) < 10 ? 'text-red-600' : 'text-gray-500'}`}>
                        Stock: {produit.stock || 0}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                Aucun produit populaire à afficher
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Commandes récentes</h2>
            <Link
              to="/commandes"
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              Voir toutes les commandes
            </Link>
          </div>
          {dashboardData?.commandesRecentes?.length > 0 ? (
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
                  {dashboardData.commandesRecentes.map((commande) => (
                    <tr key={commande.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{commande.id}</div>
                          <div className="text-sm text-gray-500">{commande.produits || 0} produits</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {commande.client || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(commande.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(commande.statut)}`}>
                          {commande.statut || 'N/A'}
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
          ) : (
            <div className="text-center text-gray-500 py-8">
              Aucune commande récente à afficher
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;