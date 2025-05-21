  import { useState } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import { useAuth } from "../Contexts/Authcontexts";
  import {
    FiUpload,
    FiChevronDown,
    FiUser,
    FiBriefcase,
    FiLock,
    FiCheck,
  } from "react-icons/fi";

  const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [user_type, setUser_type] = useState("client");
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      phone: "",
      // Champs spécifiques entreprise
      siret: "",
      activitySector: "",
      documents: null,
      // Champs spécifiques client
      address: "",
      isWholesaler: false,
    });

    const handleChange = (e) => {
      const { name, value, type, checked, files } = e.target;
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : files ? files[0] : value,
      });
      // Effacer l'erreur du champ lorsqu'il est modifié
      if (fieldErrors[name]) {
        setFieldErrors(prev => {
          const newErrors = {...prev};
          delete newErrors[name];
          return newErrors;
        });
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);
      setFieldErrors({});

      try {
        // Préparation des données pour l'API
        const userData = new FormData();
        
        // Ajout des champs communs
        userData.append('email', formData.email);
        userData.append('password', formData.password);
        userData.append('phone', formData.phone);
        userData.append('user_type', user_type);

        // Ajout des champs spécifiques
        if (user_type === "client") {
          userData.append('address', formData.address);
          userData.append('isWholesaler', formData.isWholesaler);
        } else {
          userData.append('siret', formData.siret);
          userData.append('activitySector', formData.activitySector);
          if (formData.documents) {
            userData.append('documents', formData.documents);
          }
        }

        // Appel à l'API via le contexte d'authentification
        const result = await register(userData);

        if (result.success) {
          // Redirection selon le type d'utilisateur
          const redirectPath = user_type === "client" 
            ? formData.isWholesaler ? "/wholesaler-dashboard" : "/customer-profile"
            : "/seller-dashboard";
          
          navigate(redirectPath);
        } else {
          // Gestion des erreurs
          if (result.errors) {
            setFieldErrors(result.errors);
          }
          setError(result.message || "Erreur lors de l'inscription");
        }
      } catch (err) {
        console.error("Registration error:", err);
        setError(err.message || "Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    };

    const getFieldError = (fieldName) => {
      return fieldErrors[fieldName] ? (
        <span className="text-red-500 text-sm mt-1">{fieldErrors[fieldName][0]}</span>
      ) : null;
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-600 to-green-400 p-4 flex items-center justify-center">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-green-700 mb-2">
                Créer un compte
              </h2>
              <p className="text-gray-600">
                Rejoignez notre plateforme en fonction de votre profil
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Sélecteur de type d'utilisateur */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={() => setUser_type("client")}
                  className={`px-6 py-3 text-sm font-medium rounded-l-lg ${
                    user_type === "client"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FiUser className="inline mr-2" />
                  Je suis un client
                </button>
                <button
                  type="button"
                  onClick={() => setUser_type("entreprise")}
                  className={`px-6 py-3 text-sm font-medium rounded-r-lg ${
                    user_type === "entreprise"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FiBriefcase className="inline mr-2" />
                  Je suis une entreprise
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Champs communs à tous les utilisateurs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    {user_type === "entreprise"
                      ? "Nom de l'entreprise"
                      : "Nom complet"}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      fieldErrors.name ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    required
                  />
                  {getFieldError("name")}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      fieldErrors.email ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    required
                  />
                  {getFieldError("email")}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border ${
                        fieldErrors.password ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      required
                    />
                  </div>
                  {getFieldError("password")}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      fieldErrors.phone ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    required
                  />
                  {getFieldError("phone")}
                </div>
              </div>

              {/* Champs spécifiques aux clients */}
              {user_type === "client" && (
                <>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Adresse
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${
                        fieldErrors.address ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    />
                    {getFieldError("address")}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isWholesaler"
                      checked={formData.isWholesaler}
                      onChange={handleChange}
                      id="isWholesaler"
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isWholesaler"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Je suis un grossiste
                    </label>
                  </div>
                </>
              )}

              {/* Champs spécifiques aux entreprises */}
              {user_type === "entreprise" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      SIRET/NIU
                    </label>
                    <input
                      type="text"
                      name="siret"
                      value={formData.siret}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${
                        fieldErrors.siret ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      required
                    />
                    {getFieldError("siret")}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Secteur d'activité
                    </label>
                    <input
                      type="text"
                      name="activitySector"
                      value={formData.activitySector}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${
                        fieldErrors.activitySector ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      required
                    />
                 

                    {getFieldError("activitySector")}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">
                      Documents (PDF/JPG)
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                          <FiUpload className="text-3xl text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 text-center">
                            <span className="font-medium text-green-600">
                              Cliquez pour uploader
                            </span>{" "}
                            ou glissez-déposez
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Récépissé, logo (max. 5MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          name="documents"
                          onChange={handleChange}
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </label>
                    </div>
                    {formData.documents && (
                      <p className="mt-2 text-sm text-green-600">
                        Fichier sélectionné: {formData.documents.name}
                      </p>
                    )}
                    {getFieldError("documents")}
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full ${
                    isLoading ? "bg-green-500" : "bg-green-600 hover:bg-green-700"
                  } text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Traitement en cours...
                    </>
                  ) : (
                    `Créer mon compte ${user_type === "entreprise" ? "entreprise" : "client"}`
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Déjà inscrit ?{" "}
                <Link
                  to="/login"
                  className="font-medium text-green-600 hover:text-green-700"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Register;