import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "../Contexts/Authcontexts"; // Ajustez le chemin selon votre structure
import Dashboardentre from "../entreprise/dashboard";
import Produits from "../entreprise/Produits";
import {
  FaBuilding,
  FaEdit,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe,
  FaStore,
  FaShoppingCart,
  FaEye,
  FaPlus,
  FaChartLine,
  FaDollarSign,
  FaBox,
  FaClock,
  FaCheck,
  FaTimes,
  FaSave,
  FaCamera,
  FaStar,
  FaUsers,
  FaCalendarAlt,
  FaSpinner,
  FaTrash,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Api from "../Services/Api";

const CompteEntreprise = () => {
  const { user, profile, refetchUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profil");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // États pour les données
  const [profileData, setProfileData] = useState({
    nom_entreprise: "",
    activity_sector: "",
    description: "",
    ville: "",
    phone: "",
    email: "",
    // site_web: "",
    logo: "",
    created_at: "",
    siret: "",
  });

  const [stats, setStats] = useState({
    total_produits: 0,
    commandes_recues: 0,
    chiffre_affaires: "0",
    clients_actifs: 0,
    note_moyenne: 0,
    taux_satisfaction: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Récupération du profil entreprise
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await Api.get("api/entreprise/profil");

      if (response.data.success) {
        setProfileData({
          ...response.data.data,
          // On s'assure que les champs du user sont à jour
          phone: user?.phone || response.data.data.phone,
          email: user?.email || response.data.data.email,
          created_at: user?.created_at || response.data.data.created_at
        });
      } else {
        setError("Erreur lors du chargement du profil");
      }
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
      setError("Impossible de charger les données du profil");
    } finally {
      setLoading(false);
    }
  };

  // Récupération des statistiques
  const fetchStats = async () => {
    try {
      const response = await Api.get("api/entreprise/statistiques");

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    }
  };

  // Récupération des commandes récentes
  const fetchRecentOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await Api.get("api/entreprise/commandes?limit=10");

      if (response.data.success) {
        setRecentOrders(response.data.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Sauvegarde du profil
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const response = await Api.put(
        "api/entreprise/profil",
        profileData
      );
      
      if (response.data.success) {
        setIsEditing(false);
        await refetchUser(); // Mettre à jour les données utilisateur
        alert("Profil mis à jour avec succès!");
      } else {
        setError(response.data.message || "Erreur lors de la sauvegarde");
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      setError(error.response?.data?.message || "Impossible de sauvegarder les modifications");
    } finally {
      setSaving(false);
    }
  };

  // Upload du logo
  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("logo", file);

    try {
      const response = await Api.post(
        "api/entreprise/upload-logo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setProfileData((prev) => ({
          ...prev,
          logo: response.data.data.logo_url,
        }));
        await refetchUser(); // Mettre à jour les données utilisateur
      }
    } catch (error) {
      console.error("Erreur lors de l'upload du logo:", error);
      setError(error.response?.data?.message || "Erreur lors de l'upload du logo");
    }
  };

  // Mise à jour du statut d'une commande
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await Api.put(
        `api/commandes/${orderId}/statut`,
        { statut: newStatus }
      );

      if (response.data.success) {
        setRecentOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, statut: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      alert(error.response?.data?.message || "Erreur lors de la mise à jour du statut");
    }
  };

  // Supprimer une commande
  const deleteOrder = async (orderId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
      return;
    }

    try {
      const response = await Api.delete(`api/commandes/${orderId}`);

      if (response.data.success) {
        setRecentOrders((prev) => prev.filter((order) => order.id !== orderId));
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert(error.response?.data?.message || "Erreur lors de la suppression de la commande");
    }
  };

  // Chargement initial des données
  useEffect(() => {
    if (profile) {
      setProfileData({
        ...profile,
        phone: user?.phone || profile.phone,
        email: user?.email || profile.email,
        created_at: user?.created_at || profile.created_at
      });
      setLoading(false);
    } else {
      fetchProfileData();
    }
    fetchStats();
    fetchRecentOrders();
  }, [user, profile]);

  const getStatusColor = (statut) => {
    switch (statut) {
      case "Livré":
      case "livré":
        return "bg-green-100 text-green-800";
      case "En cours":
      case "en_cours":
        return "bg-blue-100 text-blue-800";
      case "En préparation":
      case "en_preparation":
        return "bg-yellow-100 text-yellow-800";
      case "Annulé":
      case "annule":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const tabs = [
    { id: "profil", label: "Profil", icon: <FaBuilding /> },
    { id: "dashboard", label: "Tableau de bord", icon: <FaChartLine /> },
    { id: "produits", label: "Mes Produits", icon: <FaBox /> },
    { id: "commandes", label: "Commandes", icon: <FaShoppingCart /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Affichage des erreurs */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button
              onClick={() => setError(null)}
              className="float-right font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="relative">
                <img
                  src={profileData.logo || "/placeholder-logo.png"}
                  alt="Logo entreprise"
                  className="w-20 h-20 rounded-full object-cover border-4 border-green-200"
                />
                <label className="absolute -bottom-2 -right-2 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors cursor-pointer">
                  <FaCamera className="w-3 h-3" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {profileData.nom_entreprise || "Nom de l'entreprise"}
                </h1>
                <p className="text-gray-600">{profileData.activity_sector}</p>
                <div className="flex items-center mt-1">
                  <FaStar className="text-yellow-400 w-4 h-4" />
                  <span className="ml-1 text-sm text-gray-600">
                    {stats.note_moyenne}/5
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              disabled={saving}
            >
              {saving ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaEdit className="mr-2" />
              )}
              {isEditing ? "Annuler" : "Modifier le profil"}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="flex flex-wrap border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-600 hover:text-green-600"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="p-6">
            {/* Profil Tab */}
            {activeTab === "profil" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informations générales */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      Informations générales
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom de l'entreprise
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.nom_entreprise}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              nom_entreprise: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      ) : (
                        <p className="text-gray-900">
                          {profileData.nom_entreprise}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Secteur d'activité
                      </label>
                      {isEditing ? (
                        <select
                          value={profileData.activity_sector}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              activity_sector: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">Sélectionner un secteur</option>
                          <option value="Commerce">Commerce</option>
                          <option value="Services">Services</option>
                          <option value="Agriculture">Agriculture</option>
                          <option value="Industrie">Industrie</option>
                          <option value="Autres">Autres</option>
                        </select>
                      ) : (
                        <p className="text-gray-900">{profileData.activity_sector}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      {isEditing ? (
                        <textarea
                          value={profileData.description}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              description: e.target.value,
                            })
                          }
                          rows="4"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Décrivez votre entreprise..."
                        />
                      ) : (
                        <p className="text-gray-900">
                          {profileData.description}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Numéro RCCM
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.siret}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              siret: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="RC/XXX/XXXX/X/XXXXXX"
                        />
                      ) : (
                        <p className="text-gray-900">
                          {profileData.siret}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Coordonnées */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      Coordonnées
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FaMapMarkerAlt className="inline mr-1" /> Adresse
                      </label>
                      {isEditing ? (
                        <textarea
                          value={profileData.ville}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              ville: e.target.value,
                            })
                          }
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Adresse complète de l'entreprise"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.ville}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FaPhone className="inline mr-1" /> Téléphone
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              phone: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="+237 6XX XXX XXX"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FaEnvelope className="inline mr-1" /> Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="contact@entreprise.com"
                          disabled // Email souvent non modifiable directement
                        />
                      ) : (
                        <a
                          href={`mailto:${profileData.email}`}
                          className="text-green-600 hover:underline"
                        >
                          {profileData.email}
                        </a>
                      )}
                    </div>

                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FaGlobe className="inline mr-1" /> Site web
                      </label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={profileData.site_web}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              site_web: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="www.entreprise.com"
                        />
                      ) : (
                        <a
                          href={`https://${profileData.site_web}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline"
                        >
                          {profileData.site_web}
                        </a>
                      )}
                    </div> */}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FaCalendarAlt className="inline mr-1" /> Date de création
                      </label>
                      <p className="text-gray-900">
                        {profileData.created_at
                          ? new Date(profileData.created_at).toLocaleDateString("fr-FR")
                          : "Non renseignée"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Statut du compte
                      </label>
                      <div className="flex items-center">
                        <p className="text-gray-900">
                          {user?.email_verified_at ? "Vérifié" : "Non vérifié"}
                        </p>
                        {!user?.email_verified_at && (
                          <button 
                            className="ml-2 text-sm text-blue-600 hover:underline"
                            onClick={() => {
                              // Fonction pour renvoyer l'email de vérification
                              // À implémenter selon votre logique
                            }}
                          >
                            Renvoyer l'email de vérification
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                      disabled={saving}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                      disabled={saving}
                    >
                      {saving ? (
                        <FaSpinner className="animate-spin mr-2" />
                      ) : (
                        <FaSave className="mr-2" />
                      )}
                      {saving ? "Sauvegarde..." : "Sauvegarder"}
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Dashboardentre stats={stats} />
              </motion.div>
            )}

            {/* Produits Tab */}
            {activeTab === "produits" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Produits onDataChange={fetchStats} />
              </motion.div>
            )}

            {/* Commandes Tab */}
            {activeTab === "commandes" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Toutes les commandes ({recentOrders.length})
                  </h3>
                  <div className="flex space-x-2">
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      onChange={(e) => {
                        const status = e.target.value;
                        if (status === "all") {
                          fetchRecentOrders();
                        }
                      }}
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="en_cours">En cours</option>
                      <option value="livre">Livré</option>
                      <option value="en_preparation">En préparation</option>
                      <option value="annule">Annulé</option>
                    </select>
                    <button
                      onClick={fetchRecentOrders}
                      className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                    >
                      Actualiser
                    </button>
                  </div>
                </div>

                {ordersLoading ? (
                  <div className="text-center py-8">
                    <FaSpinner className="animate-spin text-2xl text-green-600 mx-auto mb-2" />
                    <p className="text-gray-600">Chargement des commandes...</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Commande
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Client
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Produit
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Montant
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Statut
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {recentOrders.length === 0 ? (
                            <tr>
                              <td
                                colSpan="7"
                                className="px-6 py-8 text-center text-gray-500"
                              >
                                Aucune commande trouvée
                              </td>
                            </tr>
                          ) : (
                            recentOrders.map((order) => (
                              <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  #{order.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {order.client || order.client_nom}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {order.produit || order.produit_nom}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                  {parseInt(order.montant).toLocaleString()}{" "}
                                  FCFA
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <select
                                    value={order.statut}
                                    onChange={(e) =>
                                      updateOrderStatus(
                                        order.id,
                                        e.target.value
                                      )
                                    }
                                    className={`px-2 py-1 text-xs font-semibold rounded-full border-0 ${getStatusColor(
                                      order.statut
                                    )}`}
                                  >
                                    <option value="en_preparation">
                                      En préparation
                                    </option>
                                    <option value="en_cours">En cours</option>
                                    <option value="livre">Livré</option>
                                    <option value="annule">Annulé</option>
                                  </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(
                                    order.date || order.created_at
                                  ).toLocaleDateString("fr-FR")}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                  <button
                                    className="text-blue-600 hover:text-blue-800"
                                    onClick={() => {
                                      alert(
                                        `Détails de la commande ${order.id}`
                                      );
                                    }}
                                  >
                                    <FaEye />
                                  </button>
                                  <button
                                    className="text-red-600 hover:text-red-800"
                                    onClick={() => deleteOrder(order.id)}
                                  >
                                    <FaTrash />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompteEntreprise;