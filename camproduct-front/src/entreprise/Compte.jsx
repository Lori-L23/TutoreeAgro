import React, { useState, useEffect } from "react";
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
  FaCalendarAlt
} from "react-icons/fa";
import { motion } from "framer-motion";

const CompteEntreprise = () => {
  const [activeTab, setActiveTab] = useState("profil");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    nom_entreprise: "TechCorp Solutions",
    secteur: "Technologie",
    description: "Entreprise spécialisée dans les solutions technologiques innovantes pour les entreprises modernes.",
    adresse: "123 Avenue des Affaires, Douala",
    telephone: "+237 6XX XXX XXX",
    email: "contact@techcorp.cm",
    site_web: "www.techcorp.cm",
    logo: "/api/placeholder/150/150",
    date_creation: "2020-01-15",
    numero_rccm: "RC/DLA/2020/A/123456"
  });

  const [stats] = useState({
    total_produits: 45,
    commandes_recues: 128,
    chiffre_affaires: "2,450,000",
    clients_actifs: 67,
    note_moyenne: 4.5,
    taux_satisfaction: 92
  });

  const [recentOrders] = useState([
    {
      id: "CMD001",
      client: "Jean Dupont",
      produit: "Ordinateur Portable HP",
      montant: "750,000",
      statut: "En cours",
      date: "2024-05-20"
    },
    {
      id: "CMD002",
      client: "Marie Kamga",
      produit: "Smartphone Samsung",
      montant: "350,000",
      statut: "Livré",
      date: "2024-05-18"
    },
    {
      id: "CMD003",
      client: "Paul Nkomo",
      produit: "Tablette iPad",
      montant: "480,000",
      statut: "En préparation",
      date: "2024-05-19"
    }
  ]);

  const [topProducts] = useState([
    {
      id: 1,
      nom: "Ordinateur Portable HP Pavilion",
      prix: "750,000",
      ventes: 23,
      stock: 12,
      image: "/api/placeholder/80/80"
    },
    {
      id: 2,
      nom: "Smartphone Samsung Galaxy",
      prix: "350,000",
      ventes: 18,
      stock: 8,
      image: "/api/placeholder/80/80"
    },
    {
      id: 3,
      nom: "Tablette iPad Air",
      prix: "480,000",
      ventes: 15,
      stock: 5,
      image: "/api/placeholder/80/80"
    }
  ]);

  const handleSaveProfile = () => {
    // Logique de sauvegarde
    setIsEditing(false);
    console.log("Profil sauvegardé:", profileData);
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case "Livré": return "bg-green-100 text-green-800";
      case "En cours": return "bg-blue-100 text-blue-800";
      case "En préparation": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const tabs = [
    { id: "profil", label: "Profil", icon: <FaBuilding /> },
    { id: "dashboard", label: "Tableau de bord", icon: <FaChartLine /> },
    { id: "produits", label: "Mes Produits", icon: <FaBox /> },
    { id: "commandes", label: "Commandes", icon: <FaShoppingCart /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="relative">
                <img 
                  src={profileData.logo} 
                  alt="Logo entreprise" 
                  className="w-20 h-20 rounded-full object-cover border-4 border-green-200"
                />
                <button className="absolute -bottom-2 -right-2 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors">
                  <FaCamera className="w-3 h-3" />
                </button>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{profileData.nom_entreprise}</h1>
                <p className="text-gray-600">{profileData.secteur}</p>
                <div className="flex items-center mt-1">
                  <FaStar className="text-yellow-400 w-4 h-4" />
                  <span className="ml-1 text-sm text-gray-600">{stats.note_moyenne}/5</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <FaEdit className="mr-2" />
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
                          onChange={(e) => setProfileData({...profileData, nom_entreprise: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.nom_entreprise}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Secteur d'activité
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.secteur}
                          onChange={(e) => setProfileData({...profileData, secteur: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.secteur}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      {isEditing ? (
                        <textarea
                          value={profileData.description}
                          onChange={(e) => setProfileData({...profileData, description: e.target.value})}
                          rows="4"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.description}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Numéro RCCM
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.numero_rccm}
                          onChange={(e) => setProfileData({...profileData, numero_rccm: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.numero_rccm}</p>
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
                        <input
                          type="text"
                          value={profileData.adresse}
                          onChange={(e) => setProfileData({...profileData, adresse: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.adresse}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FaPhone className="inline mr-1" /> Téléphone
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profileData.telephone}
                          onChange={(e) => setProfileData({...profileData, telephone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.telephone}</p>
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
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FaGlobe className="inline mr-1" /> Site web
                      </label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={profileData.site_web}
                          onChange={(e) => setProfileData({...profileData, site_web: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      ) : (
                        <a href={`https://${profileData.site_web}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                          {profileData.site_web}
                        </a>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FaCalendarAlt className="inline mr-1" /> Date de création
                      </label>
                      <p className="text-gray-900">{new Date(profileData.date_creation).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                    >
                      <FaSave className="mr-2" />
                      Sauvegarder
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
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Total Produits</p>
                        <p className="text-2xl font-bold text-blue-800">{stats.total_produits}</p>
                      </div>
                      <FaBox className="text-blue-500 text-2xl" />
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Commandes reçues</p>
                        <p className="text-2xl font-bold text-green-800">{stats.commandes_recues}</p>
                      </div>
                      <FaShoppingCart className="text-green-500 text-2xl" />
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-600 text-sm font-medium">Chiffre d'affaires</p>
                        <p className="text-2xl font-bold text-yellow-800">{stats.chiffre_affaires} FCFA</p>
                      </div>
                      <FaDollarSign className="text-yellow-500 text-2xl" />
                    </div>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 text-sm font-medium">Clients actifs</p>
                        <p className="text-2xl font-bold text-purple-800">{stats.clients_actifs}</p>
                      </div>
                      <FaUsers className="text-purple-500 text-2xl" />
                    </div>
                  </div>

                  <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-600 text-sm font-medium">Note moyenne</p>
                        <p className="text-2xl font-bold text-orange-800">{stats.note_moyenne}/5</p>
                      </div>
                      <FaStar className="text-orange-500 text-2xl" />
                    </div>
                  </div>

                  <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-600 text-sm font-medium">Satisfaction</p>
                        <p className="text-2xl font-bold text-red-800">{stats.taux_satisfaction}%</p>
                      </div>
                      <FaCheck className="text-red-500 text-2xl" />
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg border">
                  <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">Commandes récentes</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {recentOrders.map((order) => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {order.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.client}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.produit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.montant} FCFA
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.statut)}`}>
                                {order.statut}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(order.date).toLocaleDateString('fr-FR')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Produits Tab */}
            {activeTab === "produits" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Mes produits les plus vendus</h3>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                    <FaPlus className="mr-2" />
                    Ajouter un produit
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {topProducts.map((product) => (
                    <div key={product.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4 mb-4">
                        <img 
                          src={product.image} 
                          alt={product.nom}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm">{product.nom}</h4>
                          <p className="text-green-600 font-bold">{product.prix} FCFA</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ventes:</span>
                          <span className="font-medium">{product.ventes}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Stock:</span>
                          <span className={`font-medium ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                            {product.stock}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center">
                          <FaEye className="mr-1" />
                          Voir
                        </button>
                        <button className="flex-1 bg-gray-600 text-white py-2 px-3 rounded text-sm hover:bg-gray-700 transition-colors flex items-center justify-center">
                          <FaEdit className="mr-1" />
                          Modifier
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
                  <h3 className="text-lg font-semibold text-gray-800">Toutes les commandes</h3>
                  <div className="flex space-x-2">
                    <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                      <option>Tous les statuts</option>
                      <option>En cours</option>
                      <option>Livré</option>
                      <option>En préparation</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white rounded-lg border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commande</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {order.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.client}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.produit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              {order.montant} FCFA
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.statut)}`}>
                                {order.statut}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(order.date).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <FaEye />
                              </button>
                              <button className="text-green-600 hover:text-green-800">
                                <FaEdit />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompteEntreprise;