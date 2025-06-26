import React, { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaBell,
  FaCog,
} from "react-icons/fa";
import Api from "../Services/Api";

const AdminAccount = () => {
  const [admin, setAdmin] = useState({
    noms: "",
    email: "",
    phone: "",
    role: "admin",
    avatar: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
const [showNotificationsModal, setShowNotificationsModal] = useState(false);
const [showPreferencesModal, setShowPreferencesModal] = useState(false);
const [theme, setTheme] = useState('light');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await Api.get("/api/admin/profile");

        // Axios renvoie les données dans response.data
        setAdmin({
          noms: response.data.noms,
          email: response.data.email,
          phone: response.data.phone,
          role: response.data.role || "Admin",
          avatar: response.data.avatar || null,
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Erreur lors de la récupération des données"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // Fonctions de gestion des sauvegardes
const handleSecuritySave = async () => {
  // Logique pour sauvegarder les paramètres de sécurité
  setShowSecurityModal(false);
};

const handleNotificationsSave = async () => {
  // Logique pour sauvegarder les préférences de notifications
  setShowNotificationsModal(false);
};

const handlePreferencesSave = async () => {
  // Logique pour sauvegarder les préférences
  setShowPreferencesModal(false);
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div className="text-center text-red-500">
          <p>Erreur: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-8 mt-16">
        {/* Header */}
        <div className="flex items-center mb-8">
          <div className="text-green-600 text-6xl mr-6">
            {admin.avatar ? (
              <img
                src={admin.avatar}
                alt="Admin avatar"
                className="rounded-full w-20 h-20"
              />
            ) : (
              <FaUserCircle />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {admin.noms}
            </h2>
            <p className="text-gray-500">{admin.role}</p>
          </div>
        </div>

        {/* Informations de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="flex items-center space-x-4">
            <FaEnvelope className="text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-800 font-medium">{admin.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <FaPhone className="text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Téléphone</p>
              <p className="text-gray-800 font-medium">{admin.phone}</p>
            </div>
          </div>
        </div>

        {/* Paramètres du compte */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section Sécurité */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-3">
              <FaLock className="text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Sécurité</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Modifier votre mot de passe ou activer l'authentification à deux
              facteurs.
            </p>
            <button
              onClick={() => setShowSecurityModal(true)}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200"
            >
              Gérer la sécurité
            </button>

            {/* Modal Sécurité */}
            {showSecurityModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-xl font-semibold mb-4">
                    Paramètres de sécurité
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Entrez votre nouveau mot de passe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmer le mot de passe
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Confirmez votre mot de passe"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="twoFactor"
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="twoFactor"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Activer l'authentification à deux facteurs
                      </label>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowSecurityModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSecuritySave}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section Notifications */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-3">
              <FaBell className="text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">
                Notifications
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Choisissez comment vous souhaitez recevoir les alertes.
            </p>
            <button
              onClick={() => setShowNotificationsModal(true)}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200"
            >
              Gérer les notifications
            </button>

            {/* Modal Notifications */}
            {showNotificationsModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-xl font-semibold mb-4">
                    Préférences de notifications
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Email</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="emailAlerts"
                            defaultChecked
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="emailAlerts"
                            className="ml-2 block text-sm text-gray-700"
                          >
                            Alertes importantes
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="emailNewsletter"
                            defaultChecked
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="emailNewsletter"
                            className="ml-2 block text-sm text-gray-700"
                          >
                            Newsletter hebdomadaire
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">
                        Notifications push
                      </h4>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="pushNotifications"
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="pushNotifications"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Activer les notifications push
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowNotificationsModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleNotificationsSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section Préférences */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm md:col-span-2">
            <div className="flex items-center mb-3">
              <FaCog className="text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">
                Préférences du compte
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Mettre à jour les préférences du tableau de bord, la langue, ou le
              thème.
            </p>
            <button
              onClick={() => setShowPreferencesModal(true)}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200"
            >
              Modifier les préférences
            </button>

            {/* Modal Préférences */}
            {showPreferencesModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-xl font-semibold mb-4">
                    Préférences du compte
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Langue
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option>Français</option>
                        <option>English</option>
                        <option>Español</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thème
                      </label>
                      <div className="flex space-x-4">
                        <button
                          className="p-2 border rounded-md"
                          onClick={() => setTheme("light")}
                        >
                          <div className="w-8 h-8 bg-gray-100"></div>
                          <span className="text-xs mt-1">Clair</span>
                        </button>
                        <button
                          className="p-2 border rounded-md"
                          onClick={() => setTheme("dark")}
                        >
                          <div className="w-8 h-8 bg-gray-800"></div>
                          <span className="text-xs mt-1">Sombre</span>
                        </button>
                        <button
                          className="p-2 border rounded-md"
                          onClick={() => setTheme("system")}
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-gray-100 to-gray-800"></div>
                          <span className="text-xs mt-1">Système</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowPreferencesModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handlePreferencesSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAccount;
