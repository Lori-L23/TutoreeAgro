import { useState, useEffect } from 'react';
import { FaSave, FaCog, FaInfoCircle, FaShieldAlt, FaBell } from 'react-icons/fa';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    general: {
      siteName: 'CamProduct',
      maintenanceMode: false,
      defaultCurrency: 'XAF'
    },
    notifications: {
      emailAdmin: true,
      emailNewOrder: true,
      emailNewBusiness: true
    },
    security: {
      require2FA: false,
      loginAttempts: 5,
      passwordExpiry: 90
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 800));
        // Ici vous récupéreriez les paramètres depuis votre API
      } catch (error) {
        console.error("Erreur de chargement des paramètres:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (section, key, value) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simuler un appel API pour sauvegarder
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Paramètres sauvegardés avec succès !");
    } catch (error) {
      console.error("Erreur de sauvegarde:", error);
      alert("Une erreur est survenue lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Paramètres Administrateur</h1>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
            <TabList className="flex border-b">
              <Tab className="px-4 py-3 flex items-center cursor-pointer focus:outline-none">
                <FaCog className="mr-2" />
                Général
              </Tab>
              <Tab className="px-4 py-3 flex items-center cursor-pointer focus:outline-none">
                <FaBell className="mr-2" />
                Notifications
              </Tab>
              <Tab className="px-4 py-3 flex items-center cursor-pointer focus:outline-none">
                <FaShieldAlt className="mr-2" />
                Sécurité
              </Tab>
            </TabList>
            
            <TabPanel>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaCog className="mr-2 text-green-600" />
                  Paramètres Généraux
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom du site
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      value={settings.general.siteName}
                      onChange={(e) => handleChange('general', 'siteName', e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="maintenanceMode"
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      checked={settings.general.maintenanceMode}
                      onChange={(e) => handleChange('general', 'maintenanceMode', e.target.checked)}
                    />
                    <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700">
                      Mode maintenance
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Devise par défaut
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      value={settings.general.defaultCurrency}
                                            onChange={(e) => handleChange('general', 'defaultCurrency', e.target.value)}
                    >
                      <option value="XAF">XAF - Franc CFA</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="USD">USD - Dollar</option>
                    </select>
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaBell className="mr-2 text-green-600" />
                  Notifications
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="emailAdmin"
                      className="h-4 w-4 text-green-600 border-gray-300 rounded"
                      checked={settings.notifications.emailAdmin}
                      onChange={(e) => handleChange('notifications', 'emailAdmin', e.target.checked)}
                    />
                    <label htmlFor="emailAdmin" className="ml-2 text-sm text-gray-700">
                      Recevoir les emails administrateurs
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="emailNewOrder"
                      className="h-4 w-4 text-green-600 border-gray-300 rounded"
                      checked={settings.notifications.emailNewOrder}
                      onChange={(e) => handleChange('notifications', 'emailNewOrder', e.target.checked)}
                    />
                    <label htmlFor="emailNewOrder" className="ml-2 text-sm text-gray-700">
                      Notification pour nouvelle commande
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="emailNewBusiness"
                      className="h-4 w-4 text-green-600 border-gray-300 rounded"
                      checked={settings.notifications.emailNewBusiness}
                      onChange={(e) => handleChange('notifications', 'emailNewBusiness', e.target.checked)}
                    />
                    <label htmlFor="emailNewBusiness" className="ml-2 text-sm text-gray-700">
                      Notification pour nouveau commerçant
                    </label>
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaShieldAlt className="mr-2 text-green-600" />
                  Sécurité
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="require2FA"
                      className="h-4 w-4 text-green-600 border-gray-300 rounded"
                      checked={settings.security.require2FA}
                      onChange={(e) => handleChange('security', 'require2FA', e.target.checked)}
                    />
                    <label htmlFor="require2FA" className="ml-2 text-sm text-gray-700">
                      Activer la double authentification (2FA)
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tentatives de connexion autorisées
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      value={settings.security.loginAttempts}
                      onChange={(e) => handleChange('security', 'loginAttempts', parseInt(e.target.value))}
                      min={1}
                      max={10}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Durée de validité du mot de passe (jours)
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      value={settings.security.passwordExpiry}
                      onChange={(e) => handleChange('security', 'passwordExpiry', parseInt(e.target.value))}
                      min={30}
                      max={365}
                    />
                  </div>
                </div>
              </div>
            </TabPanel>
          </Tabs>

          <div className="border-t p-6 flex justify-end bg-gray-50">
            <button
              onClick={handleSave}
              className="inline-flex items-center px-5 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 focus:outline-none disabled:opacity-50"
              disabled={saving}
            >
              {saving ? (
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              ) : (
                <FaSave className="mr-2" />
              )}
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
