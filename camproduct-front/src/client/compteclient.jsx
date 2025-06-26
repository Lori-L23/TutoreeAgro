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
import Api from "../Services/Api";

const MonCompte = () => {
  const { user, profileType, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nom_complet: "",
    email: "",
    phone: "",
    address: "",
    ville: "",
    region: "",
  });

  // Récupération des données de l'utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await Api.get("/api/clients/profile");

        if (response.data) {
          // Vérification plus approfondie de la structure
          const profile = response.data.profile || {};
          const user = response.data.user || {};

          // Mettre à jour userData avec toutes les informations
          setUserData({
            id: user.id || null, // Ajout d'une valeur par défaut
            nom_complet: profile.nom_complet || "",
            email: user.email || "",
            phone: user.phone || "",
            address: profile.address || "",
            is_wholesaler: profile.is_wholesaler || false,
            profile_type: profile.profile_type || "client",
            user_type: user.user_type || "client",
            created_at: user.created_at || new Date().toISOString(),
            updated_at: user.updated_at || new Date().toISOString(),
          });

          // Mettre à jour formData pour l'édition
          setFormData({
            nom_complet: profile.nom_complet || "",
            email: user.email || "",
            phone: user.phone || "",
            address: profile.address || "",
            ville: "",
            region: "",
          });
        } else {
          setError("Données utilisateur non disponibles");
        }
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        setError(
          err.response?.data?.message ||
            "Erreur lors du chargement des données utilisateur"
        );
      } finally {
        setLoading(false);
      }
    };
    // Vérifier si l'utilisateur est authentifié avant de charger les données
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

  // Fonction pour gérer la mise à jour du profil
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await Api.put("/api/clients/profile", formData);

      if (response.data.success) {
        setUserData((prev) => ({
          ...prev,
          ...response.data.user,
          ...response.data.profile,
        }));
        setEditMode(false);
        // Afficher un message de succès
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (currentPassword, newPassword) => {
    try {
      const response = await Api.post("/api/clients/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });

      return response.data;
    } catch (err) {
      console.error("Erreur lors du changement de mot de passe:", err);
      throw err;
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await Api.get("/api/clients/orders");
      return response.data;
    } catch (err) {
      console.error("Erreur lors de la récupération des commandes:", err);
      throw err;
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await Api.get("/api/clients/favorites");
      return response.data;
    } catch (err) {
      console.error("Erreur lors de la récupération des favoris:", err);
      throw err;
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await Api.get("/api/clients/addresses");
      return response.data;
    } catch (err) {
      console.error("Erreur lors de la récupération des adresses:", err);
      throw err;
    }
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  name="nom_complet"
                  value={formData.nom_complet}
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
                  name="phone"
                  value={formData.phone}
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
                  name="address"
                  value={formData.address}
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
                <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl border-2 border-gray-200">
                  {userData?.nom_complet?.charAt(0)}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800">
                  {userData?.nom_complet}
                </h3>
                <p className="text-gray-500 text-sm">
                  {userData?.profile_type === "client" ? "Client" : "Vendeur"}{" "}
                  depuis {userData && formatDate(userData.created_at)}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {userData?.is_wholesaler
                    ? "Compte Grossiste"
                    : "Compte Détaillant"}
                </p>
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
                      {userData?.email || "Non renseigné"}
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
                      {userData?.phone || "Non renseigné"}
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
                      {userData?.address || "Non renseignée"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                onClick={() => {
                  const currentPassword = prompt(
                    "Entrez votre mot de passe actuel:"
                  );
                  if (!currentPassword) return;

                  const newPassword = prompt(
                    "Entrez votre nouveau mot de passe:"
                  );
                  if (!newPassword) return;

                  const confirmPassword = prompt(
                    "Confirmez votre nouveau mot de passe:"
                  );
                  if (newPassword !== confirmPassword) {
                    alert("Les mots de passe ne correspondent pas!");
                    return;
                  }

                  handlePasswordChange(currentPassword, newPassword)
                    .then((response) => {
                      if (response.success) {
                        alert("Mot de passe changé avec succès!");
                      } else {
                        alert(
                          response.message ||
                            "Erreur lors du changement de mot de passe"
                        );
                      }
                    })
                    .catch(() => {
                      alert(
                        "Une erreur est survenue lors du changement de mot de passe"
                      );
                    });
                }}
              >
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
                    defaultChecked={
                      userData?.notification_preferences?.email || false
                    }
                    onChange={async (e) => {
                      try {
                        await axios.put(
                          "/api/user/notification-preferences",
                          {
                            email: e.target.checked,
                          },
                          {
                            headers: {
                              Authorization: `Bearer ${user.token}`,
                            },
                          }
                        );
                      } catch (err) {
                        console.error("Erreur mise à jour préférences:", err);
                      }
                    }}
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
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked={userData?.two_factor_enabled || false}
                    onChange={async (e) => {
                      try {
                        await axios.put(
                          "/api/user/two-factor",
                          {
                            enabled: e.target.checked,
                          },
                          {
                            headers: {
                              Authorization: `Bearer ${user.token}`,
                            },
                          }
                        );
                      } catch (err) {
                        console.error("Erreur mise à jour 2FA:", err);
                      }
                    }}
                  />
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
              <button
                className="bg-white border border-red-500 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                onClick={async () => {
                  if (
                    confirm(
                      "Êtes-vous sûr de vouloir supprimer votre compte? Cette action est irréversible."
                    )
                  ) {
                    try {
                      await axios.delete("/api/user", {
                        headers: {
                          Authorization: `Bearer ${user.token}`,
                        },
                      });
                      // Déconnecter l'utilisateur et rediriger
                      window.location.href = "/logout";
                    } catch (err) {
                      alert("Erreur lors de la suppression du compte");
                      console.error(err);
                    }
                  }
                }}
              >
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
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 flex items-center"
            onClick={() => {
              // Logique pour ajouter une nouvelle adresse
              const newAddress = {
                type: prompt("Type d'adresse (Domicile/Travail/etc):"),
                address: prompt("Adresse complète:"),
                city: prompt("Ville:"),
                region: prompt("Région:"),
                is_default: confirm("Définir comme adresse par défaut?"),
              };

              axios
                .post("/api/user/addresses", newAddress, {
                  headers: {
                    Authorization: `Bearer ${user.token}`,
                  },
                })
                .then((response) => {
                  if (response.data.success) {
                    setUserData((prev) => ({
                      ...prev,
                      addresses: [...prev.addresses, response.data.address],
                    }));
                  }
                })
                .catch((err) => {
                  console.error("Erreur ajout adresse:", err);
                  alert("Erreur lors de l'ajout de l'adresse");
                });
            }}
          >
            <FaPlus className="mr-2" />+ Ajouter une adresse
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userData?.addresses && userData.addresses.length > 0 ? (
            userData.addresses.map((address) => (
              <div
                key={address.id}
                className="border border-gray-200 rounded-lg p-5 relative hover:shadow-md transition duration-200"
              >
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    className="text-gray-500 hover:text-green-600"
                    onClick={() => {
                      // Logique pour modifier l'adresse
                      const updatedAddress = {
                        type: prompt("Type:", address.type),
                        address: prompt("Adresse:", address.address),
                        city: prompt("Ville:", address.city),
                        region: prompt("Région:", address.region),
                        is_default: confirm(
                          "Définir comme adresse par défaut?",
                          address.is_default
                        ),
                      };

                      axios
                        .put(
                          `/api/user/addresses/${address.id}`,
                          updatedAddress,
                          {
                            headers: {
                              Authorization: `Bearer ${user.token}`,
                            },
                          }
                        )
                        .then((response) => {
                          if (response.data.success) {
                            setUserData((prev) => ({
                              ...prev,
                              addresses: prev.addresses.map((a) =>
                                a.id === address.id ? response.data.address : a
                              ),
                            }));
                          }
                        })
                        .catch((err) => {
                          console.error("Erreur modification adresse:", err);
                          alert("Erreur lors de la modification de l'adresse");
                        });
                    }}
                  >
                    <FaRegEdit />
                  </button>
                  <button
                    className="text-gray-500 hover:text-red-600"
                    onClick={() => {
                      if (confirm("Supprimer cette adresse?")) {
                        axios
                          .delete(`/api/user/addresses/${address.id}`, {
                            headers: {
                              Authorization: `Bearer ${user.token}`,
                            },
                          })
                          .then((response) => {
                            if (response.data.success) {
                              setUserData((prev) => ({
                                ...prev,
                                addresses: prev.addresses.filter(
                                  (a) => a.id !== address.id
                                ),
                              }));
                            }
                          })
                          .catch((err) => {
                            console.error("Erreur suppression adresse:", err);
                            alert("Erreur lors de la suppression de l'adresse");
                          });
                      }
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1 pr-16">
                  {address.type}
                </h3>
                <div className="space-y-1 text-gray-600">
                  <p>{userData?.nom_complet}</p>
                  <p>{address.address}</p>

                  <p>{userData?.phone}</p>
                </div>
                {address.is_default && (
                  <div className="mt-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <FaCheck className="mr-1" /> Adresse par défaut
                    </span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="md:col-span-2">
              <div className="border border-gray-200 rounded-lg p-5 flex flex-col items-center justify-center text-center h-48 hover:bg-gray-50 cursor-pointer transition duration-200">
                <FaPlus className="text-green-600 text-xl mb-2" />
                <p className="font-medium text-gray-700">
                  Aucune adresse enregistrée
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Cliquez sur "Ajouter une adresse" pour commencer
                </p>
              </div>
            </div>
          )}
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
                onChange={async (e) => {
                  try {
                    const response = await axios.get(
                      `/api/user/orders?search=${e.target.value}`,
                      {
                        headers: {
                          Authorization: `Bearer ${user.token}`,
                        },
                      }
                    );
                    setUserData((prev) => ({
                      ...prev,
                      orders: response.data.orders,
                    }));
                  } catch (err) {
                    console.error("Erreur recherche commandes:", err);
                  }
                }}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaSearch />
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {userData?.orders && userData.orders.length > 0 ? (
              userData.orders.map((commande) => (
                <div
                  key={commande.id}
                  className="p-4 hover:bg-gray-50 transition duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800">
                          {commande.reference}
                        </h3>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                            commande.status
                          )}`}
                        >
                          {commande.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        Commandé le {formatDate(commande.created_at)}
                      </p>
                      <p className="font-medium text-gray-900">
                        Total: {formatPrice(commande.total)}
                      </p>
                    </div>
                    <div className="ml-4 flex space-x-2">
                      <Link
                        to={`/commandes/${commande.id}`}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition duration-200"
                      >
                        Détails
                      </Link>
                      {commande.status === "livré" && (
                        <button
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm font-medium transition duration-200"
                          onClick={async () => {
                            try {
                              await axios.post(
                                `/api/orders/${commande.id}/reorder`,
                                {},
                                {
                                  headers: {
                                    Authorization: `Bearer ${user.token}`,
                                  },
                                }
                              );
                              alert("Commande recréée dans votre panier!");
                            } catch (err) {
                              console.error("Erreur reorder:", err);
                              alert(
                                "Erreur lors de la recréation de la commande"
                              );
                            }
                          }}
                        >
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

        {userData?.favorites && userData.favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userData.favorites.map((produit) => (
              <div
                key={produit.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition duration-200"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  <img
                    src={
                      produit.image
                        ? `/storage/${produit.image}`
                        : "/placeholder-product.jpg"
                    }
                    alt={produit.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800 text-sm">
                      {produit.name}
                    </h3>
                    <button
                      className="text-red-500 hover:text-red-600 ml-2"
                      onClick={async () => {
                        try {
                          await axios.delete(
                            `/api/user/favorites/${produit.id}`,
                            {
                              headers: {
                                Authorization: `Bearer ${user.token}`,
                              },
                            }
                          );
                          setUserData((prev) => ({
                            ...prev,
                            favorites: prev.favorites.filter(
                              (p) => p.id !== produit.id
                            ),
                          }));
                        } catch (err) {
                          console.error("Erreur suppression favori:", err);
                        }
                      }}
                    >
                      <FaHeart />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    {produit.seller?.company_name}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-green-600">
                      {formatPrice(produit.price)}
                    </span>
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition duration-200"
                      onClick={async () => {
                        try {
                          await axios.post(
                            "/api/cart",
                            {
                              product_id: produit.id,
                              quantity: 1,
                            },
                            {
                              headers: {
                                Authorization: `Bearer ${user.token}`,
                              },
                            }
                          );
                          alert("Produit ajouté au panier!");
                        } catch (err) {
                          console.error("Erreur ajout panier:", err);
                          alert("Erreur lors de l'ajout au panier");
                        }
                      }}
                    >
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
            to="/login"
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
                      {userData?.nom_complet?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {userData?.nom_complet}
                      </p>
                      <p className="text-sm text-gray-500">
                        {userData?.user_type === "client"
                          ? "Client"
                          : "Vendeur"}
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
