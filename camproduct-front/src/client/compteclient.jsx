import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  FaUser,
  FaKey,
  FaAddressCard,
  FaBoxOpen,
  FaHeart,
  FaShoppingBasket,
  FaRegEdit,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaShieldAlt,
  FaCamera,
  FaExclamationTriangle,
  FaCheck,
  FaTrash,
  FaSearch,
  FaPlus,
  FaChevronRight,
} from "react-icons/fa";
import { useAuth } from "../Contexts/Authcontexts";

const MonCompte = () => {
  const { user, profileType, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "",
    region: "",
  });

  // Simuler la récupération des données de l'utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Simuler un appel API
        setTimeout(() => {
          const mockUserData = {
            id: "USR12345",
            nom: "Kamga",
            prenom: "Jean",
            email: "jean.kamga@example.com",
            telephone: "+237 691234567",
            adresse: "123 Rue de l'Indépendance",
            ville: "Douala",
            region: "Littoral",
            dateInscription: "2022-10-15",
            avatar: null, // URL de l'avatar si disponible
            favoris: [
              {
                id: 1,
                nom: "Ananas frais bio",
                prix: 1500,
                entreprise: "FruitsCam",
              },
              {
                id: 2,
                nom: "Huile de palme (1L)",
                prix: 4000,
                entreprise: "PalmiOil",
              },
            ],
            dernieresCommandes: [
              {
                id: "CMD-2023-001",
                date: "2023-05-15",
                statut: "livré",
                montant: 12500,
              },
              {
                id: "CMD-2023-002",
                date: "2023-05-20",
                statut: "en cours",
                montant: 18000,
              },
            ],
          };

          setUserData(mockUserData);
          setFormData({
            nom: mockUserData.nom,
            prenom: mockUserData.prenom,
            email: mockUserData.email,
            telephone: mockUserData.telephone,
            adresse: mockUserData.adresse,
            ville: mockUserData.ville,
            region: mockUserData.region,
          });
          setLoading(false);
        }, 1000);

        // Exemple avec API réelle:
        // const response = await fetch('/api/user/profile', {
        //   headers: {
        //     'Authorization': `Bearer ${user.token}`
        //   }
        // });
        // const data = await response.json();
        // if (data.success) {
        //   setUserData(data.user);
        //   setFormData({
        //     nom: data.user.nom,
        //     prenom: data.user.prenom,
        //     email: data.user.email,
        //     telephone: data.user.telephone,
        //     adresse: data.user.adresse,
        //     ville: data.user.ville,
        //     region: data.user.region
        //   });
        // } else {
        //   setError(data.message || "Impossible de récupérer vos informations");
        // }
      } catch (err) {
        console.error(
          "Erreur lors du chargement des données utilisateur:",
          err
        );
        setError(
          "Une erreur est survenue lors du chargement de vos informations"
        );
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();

    // Simulation de mise à jour
    setLoading(true);

    setTimeout(() => {
      setUserData((prev) => ({
        ...prev,
        ...formData,
      }));
      setEditMode(false);
      setLoading(false);
    }, 1000);

    // Exemple avec API réelle:
    // const updateProfile = async () => {
    //   try {
    //     const response = await fetch('/api/user/profile', {
    //       method: 'PUT',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${user.token}`
    //       },
    //       body: JSON.stringify(formData)
    //     });
    //     const data = await response.json();
    //     if (data.success) {
    //       setUserData(prev => ({
    //         ...prev,
    //         ...formData
    //       }));
    //       setEditMode(false);
    //     } else {
    //       setError(data.message || "Échec de la mise à jour du profil");
    //     }
    //   } catch (err) {
    //     console.error("Erreur lors de la mise à jour du profil:", err);
    //     setError("Une erreur est survenue lors de la mise à jour");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // updateProfile();
  };

  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateStr).toLocaleDateString("fr-FR", options);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(price);
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

  const tabContent = {
    profile: (
      <div>
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Informations personnelles
          </h2>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center text-sm bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-lg transition duration-200"
            >
              <FaRegEdit className="mr-1" /> Modifier
            </button>
          )}
        </div>

        {editMode ? (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <input
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <input
                  type="text"
                  name="ville"
                  value={formData.ville}
                  onChange={handleInputChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Région
                </label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-3">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition duration-200 font-medium"
                disabled={loading}
              >
                {loading
                  ? "Enregistrement..."
                  : "Enregistrer les modifications"}
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition duration-200 font-medium"
                disabled={loading}
              >
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex items-start p-5 border-b border-gray-100">
              <div className="relative mr-4">
                {userData?.avatar ? (
                  <img
                    src={userData.avatar}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl border-2 border-gray-200">
                    {userData?.prenom.charAt(0)}
                    {userData?.nom.charAt(0)}
                  </div>
                )}
                <button className="absolute bottom-0 right-0 bg-gray-800 text-white p-1 rounded-full shadow-md hover:bg-gray-700">
                  <FaCamera size={12} />
                </button>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800">
                  {userData?.prenom} {userData?.nom}
                </h3>
                <p className="text-gray-500 text-sm">
                  Client depuis{" "}
                  {userData && formatDate(userData.dateInscription)}
                </p>
                <p className="text-gray-500 text-sm mt-1">ID: {userData?.id}</p>
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                <div className="flex items-start">
                  <div className="text-green-600 mr-3">
                    <FaEnvelope />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">
                      {userData?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-green-600 mr-3">
                    <FaPhone />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-medium text-gray-800">
                      {userData?.telephone || "Non renseigné"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-green-600 mr-3">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Adresse</p>
                    <p className="font-medium text-gray-800">
                      {userData?.adresse ? (
                        <>
                          {userData.adresse}, {userData.ville},{" "}
                          {userData.region}
                        </>
                      ) : (
                        "Non renseignée"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Activité récente
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dernières commandes */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-gray-700 flex items-center">
                  <FaBoxOpen className="mr-2 text-green-600" /> Dernières
                  commandes
                </h3>
                <Link
                  to="/mes-commandes"
                  className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center"
                >
                  Voir tout <FaChevronRight className="ml-1 text-xs" />
                </Link>
              </div>
              <div className="p-4">
                {userData?.dernieresCommandes &&
                userData.dernieresCommandes.length > 0 ? (
                  <div className="space-y-3">
                    {userData.dernieresCommandes.map((commande) => (
                      <Link
                        key={commande.id}
                        to={`/commandes/${commande.id}`}
                        className="block p-3 border border-gray-100 rounded hover:bg-gray-50 transition duration-200"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium text-gray-800">
                              {commande.id}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(commande.date)}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(
                                commande.statut
                              )}`}
                            >
                              {commande.statut}
                            </span>
                            <span className="ml-2 font-medium text-gray-900">
                              {formatPrice(commande.montant)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Aucune commande récente
                  </div>
                )}
              </div>
            </div>

            {/* Produits favoris */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-gray-700 flex items-center">
                  <FaHeart className="mr-2 text-red-500" /> Produits favoris
                </h3>
                <Link
                  to="/favoris"
                  className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center"
                >
                  Voir tout <FaChevronRight className="ml-1 text-xs" />
                </Link>
              </div>
              <div className="p-4">
                {userData?.favoris && userData.favoris.length > 0 ? (
                  <div className="space-y-3">
                    {userData.favoris.map((produit) => (
                      <Link
                        key={produit.id}
                        to={`/produits/${produit.id}`}
                        className="block p-3 border border-gray-100 rounded hover:bg-gray-50 transition duration-200"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium text-gray-800">
                              {produit.nom}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              {produit.entreprise}
                            </p>
                          </div>
                          <span className="font-medium text-gray-900">
                            {formatPrice(produit.prix)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Aucun produit favori
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    security: (
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Sécurité & Confidentialité
          </h2>
          <p className="text-gray-600 mt-1">
            Gérez vos informations de connexion et sécurisez votre compte
          </p>
        </div>

        <div className="space-y-6">
          {/* Changer le mot de passe */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <FaKey className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    Changer de mot de passe
                  </h3>
                  <p className="text-sm text-gray-500">
                    Pour votre sécurité, utilisez un mot de passe fort que vous
                    n'utilisez pas ailleurs
                  </p>
                </div>
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200">
                Modifier
              </button>
            </div>
          </div>

          {/* Paramètres de compte */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <FaShieldAlt className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    Paramètres de confidentialité
                  </h3>
                  <p className="text-sm text-gray-500">
                    Gérez comment vos informations sont utilisées sur CamProduct
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">
                    Recevoir des notifications par email
                  </p>
                  <p className="text-sm text-gray-500">
                    Offres promotionnelles et nouveautés
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">
                    Connexion à double facteur
                  </p>
                  <p className="text-sm text-gray-500">
                    Sécurité renforcée pour votre compte
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">
                    Partager mes achats
                  </p>
                  <p className="text-sm text-gray-500">
                    Permettre aux vendeurs de voir votre historique
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Supprimer le compte */}
          <div className="bg-white rounded-lg border border-red-200 overflow-hidden">
            <div className="p-5 border-b border-red-100 flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <FaExclamationTriangle className="text-red-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    Supprimer mon compte
                  </h3>
                  <p className="text-sm text-gray-500">
                    Cette action est irréversible et supprimera toutes vos
                    données
                  </p>
                </div>
              </div>
              <button className="bg-white border border-red-500 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition duration-200">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    ),
    addresses: (
      <div>
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Mes adresses
            </h2>
            <p className="text-gray-600 mt-1">
              Gérez vos adresses de livraison et de facturation
            </p>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 flex items-center">
            <FaPlus className="mr-2" />+ Ajouter une adresse
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-5 relative hover:shadow-md transition duration-200">
            <div className="absolute top-4 right-4 flex space-x-2">
              <button className="text-gray-500 hover:text-green-600">
                <FaRegEdit />
              </button>
              <button className="text-gray-500 hover:text-red-600">
                <FaTrash />
              </button>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1 pr-16">Domicile</h3>
            <div className="space-y-1 text-gray-600">
              <p>
                {userData?.prenom} {userData?.nom}
              </p>
              <p>{userData?.adresse}</p>
              <p>
                {userData?.ville}, {userData?.region}
              </p>
              <p>{userData?.telephone}</p>
            </div>
            <div className="mt-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <FaCheck className="mr-1" /> Adresse par défaut
              </span>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-5 flex flex-col items-center justify-center text-center h-48 hover:bg-gray-50 cursor-pointer transition duration-200">
            <FaPlus className="text-green-600 text-xl mb-2" />
            <p className="font-medium text-gray-700">
              Ajouter une nouvelle adresse
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Cliquez ici pour ajouter une adresse de livraison
            </p>
          </div>
        </div>
      </div>
    ),
    orders: (
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Mes commandes</h2>
          <p className="text-gray-600 mt-1">
            Suivez et gérez toutes vos commandes
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher une commande..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaSearch />
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {userData?.dernieresCommandes &&
            userData.dernieresCommandes.length > 0 ? (
              userData.dernieresCommandes.map((commande) => (
                <div
                  key={commande.id}
                  className="p-4 hover:bg-gray-50 transition duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800">
                          {commande.id}
                        </h3>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                            commande.statut
                          )}`}
                        >
                          {commande.statut}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        Commandé le {formatDate(commande.date)}
                      </p>
                      <p className="font-medium text-gray-900">
                        Total: {formatPrice(commande.montant)}
                      </p>
                    </div>
                    <div className="ml-4 flex space-x-2">
                      <Link
                        to={`/commandes/${commande.id}`}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition duration-200"
                      >
                        Détails
                      </Link>
                      {commande.statut === "livré" && (
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm font-medium transition duration-200">
                          Recommander
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <FaBoxOpen className="mx-auto text-4xl mb-4 text-gray-300" />
                <p className="font-medium mb-1">Aucune commande trouvée</p>
                <p className="text-sm">
                  Vous n'avez pas encore passé de commande
                </p>
                <Link
                  to="/produits"
                  className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                >
                  Découvrir nos produits
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    favorites: (
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Mes favoris</h2>
          <p className="text-gray-600 mt-1">
            Retrouvez tous vos produits préférés
          </p>
        </div>

        {userData?.favoris && userData.favoris.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userData.favoris.map((produit) => (
              <div
                key={produit.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition duration-200"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  <img
                    src="/api/placeholder/300/200"
                    alt={produit.nom}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800 text-sm">
                      {produit.nom}
                    </h3>
                    <button className="text-red-500 hover:text-red-600 ml-2">
                      <FaHeart />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    {produit.entreprise}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-green-600">
                      {formatPrice(produit.prix)}
                    </span>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition duration-200">
                      <FaShoppingBasket className="inline mr-1" />
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <FaHeart className="mx-auto text-4xl mb-4 text-gray-300" />
            <p className="font-medium text-gray-700 mb-1">
              Aucun produit favori
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Explorez notre catalogue et ajoutez vos produits préférés à vos
              favoris
            </p>
            <Link
              to="/produits"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
            >
              Découvrir nos produits
            </Link>
          </div>
        )}
      </div>
    ),
  };

  // Composants d'icônes simples pour les fonctionnalités manquantes
  //   const FaPlus = () => <span className="text-lg">+</span>;
  //   const FaTrash = () => <span className="text-lg">🗑️</span>;
  //   const FaSearch = () => <span className="text-lg">🔍</span>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Accès non autorisé
          </h1>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour accéder à cette page
          </p>
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

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Mon Compte</h1>
          <p className="text-gray-600">
            Gérez vos informations personnelles et préférences
          </p>
        </div>

        {loading && !userData ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg text-red-800 border border-red-200 mb-6">
            <div className="flex items-center">
              <FaExclamationTriangle className="mr-2" />
              <span>{error}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Menu de navigation */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-lg font-semibold mr-3">
                      {userData?.prenom.charAt(0)}
                      {userData?.nom.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {userData?.prenom} {userData?.nom}
                      </p>
                      <p className="text-sm text-gray-500">
                        Membre depuis{" "}
                        {userData &&
                          new Date(userData.dateInscription).getFullYear()}
                      </p>
                    </div>
                  </div>
                </div>

                <nav className="p-2">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition duration-200 ${
                      activeTab === "profile"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <FaUser className="mr-3" />
                    Profil
                  </button>

                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition duration-200 ${
                      activeTab === "orders"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <FaBoxOpen className="mr-3" />
                    Mes commandes
                  </button>

                  <button
                    onClick={() => setActiveTab("favorites")}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition duration-200 ${
                      activeTab === "favorites"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <FaHeart className="mr-3" />
                    Mes favoris
                  </button>

                  <button
                    onClick={() => setActiveTab("addresses")}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition duration-200 ${
                      activeTab === "addresses"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <FaAddressCard className="mr-3" />
                    Mes adresses
                  </button>

                  <button
                    onClick={() => setActiveTab("security")}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition duration-200 ${
                      activeTab === "security"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <FaShieldAlt className="mr-3" />
                    Sécurité
                  </button>
                </nav>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                {tabContent[activeTab]}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonCompte;
