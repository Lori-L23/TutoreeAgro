import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/Authcontexts";
import { toast } from "react-toastify";
import {
  FiUpload,
  FiUser,
  FiBriefcase,
  FiLock,
  FiCheck,
  FiMapPin,
  FiImage,
  FiMail,
  FiCheckCircle,
} from "react-icons/fi";

const USER_TYPES = {
  CLIENT: "client",
  ENTREPRISE: "entreprise",
};

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [userType, setUserType] = useState(USER_TYPES.CLIENT);
  const [showEmailValidationMessage, setShowEmailValidationMessage] =
    useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    // Champs entreprise
    siret: "",
    logo: null,
    ville: "",
    region: "",
    activitySector: "",
    documents: null,
    // Champs client
    address: "",
    isWholesaler: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    });

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) errors.email = ["L'email est requis"];
    if (!formData.password) errors.password = ["Le mot de passe est requis"];
    if (!formData.phone) errors.phone = ["Le téléphone est requis"];
    if (!formData.name) errors.name = ["Le nom est requis"];

    if (userType === USER_TYPES.ENTREPRISE) {
      if (!formData.siret) errors.siret = ["Le SIRET est requis"];
      if (!formData.documents) errors.documents = ["Les documents sont requis"];
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("user_type", userType);

      if (userType === USER_TYPES.CLIENT) {
        formDataToSend.append("address", formData.address);
        formDataToSend.append("isWholesaler", formData.isWholesaler);
        formDataToSend.append("nom_complet", formData.name);
      } else {
        formDataToSend.append("nom_entreprise", formData.name);
        formDataToSend.append("siret", formData.siret);
        formDataToSend.append("ville", formData.ville);
        formDataToSend.append("region", formData.region);
        formDataToSend.append("activity_sector", formData.activitySector);
        if (formData.documents)
          formDataToSend.append("documents", formData.documents);
        if (formData.logo) formDataToSend.append("logo", formData.logo);
      }

      const result = await register(formDataToSend);

      if (!result) {
        throw new Error("Pas de réponse du serveur");
      }

      if (result.success) {
        if (result.autoLogin && userType === USER_TYPES.CLIENT) {
          toast.success("Inscription réussie ! Redirection...", {
            onClose: () => navigate("/", { replace: true }),
          });
        } else if (
          result.requiresEmailValidation &&
          userType === USER_TYPES.ENTREPRISE
        ) {
          setRegisteredEmail(formData.email);
          setShowEmailValidationMessage(true);
          toast.success("Vérifiez votre email pour activer votre compte");
        } else {
          toast.success("Inscription réussie !", {
            onClose: () => navigate("/login", { replace: true }),
          });
        }
      } else {
        setError(result.message || "Erreur lors de l'inscription");
        if (result.errors) {
          setFieldErrors(result.errors);
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  if (showEmailValidationMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-600 to-green-400 p-4 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMail className="w-8 h-8 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Vérifiez votre email
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <FiCheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm text-green-800 font-medium mb-1">
                    Inscription réussie !
                  </p>
                  <p className="text-sm text-green-700">
                    Email envoyé à <strong>{registeredEmail}</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="text-gray-600 text-sm mb-6">
              <p>Votre compte sera activé après validation de votre email.</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() =>
                  navigate("/login", {
                    state: { email: registeredEmail },
                  })
                }
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                Aller à la connexion
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-600 to-green-400 p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
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

          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => setUserType(USER_TYPES.CLIENT)}
                className={`px-6 py-3 text-sm font-medium rounded-l-lg ${
                  userType === USER_TYPES.CLIENT
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FiUser className="inline mr-2" />
                Client
              </button>
              <button
                type="button"
                onClick={() => setUserType(USER_TYPES.ENTREPRISE)}
                className={`px-6 py-3 text-sm font-medium rounded-r-lg ${
                  userType === USER_TYPES.ENTREPRISE
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FiBriefcase className="inline mr-2" />
                Entreprise
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {userType === USER_TYPES.ENTREPRISE
                    ? "Nom entreprise"
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
                {fieldErrors.name && (
                  <span className="text-red-500 text-sm mt-1">
                    {fieldErrors.name[0]}
                  </span>
                )}
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
                {fieldErrors.email && (
                  <span className="text-red-500 text-sm mt-1">
                    {fieldErrors.email[0]}
                  </span>
                )}
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
                      fieldErrors.password
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    required
                  />
                </div>
                {fieldErrors.password && (
                  <span className="text-red-500 text-sm mt-1">
                    {fieldErrors.password[0]}
                  </span>
                )}
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
                {fieldErrors.phone && (
                  <span className="text-red-500 text-sm mt-1">
                    {fieldErrors.phone[0]}
                  </span>
                )}
              </div>
            </div>

            {userType === USER_TYPES.CLIENT && (
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
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isWholesaler"
                    checked={formData.isWholesaler}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Je suis un grossiste
                  </label>
                </div>
              </>
            )}

            {userType === USER_TYPES.ENTREPRISE && (
              <>
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
                    {fieldErrors.siret && (
                      <span className="text-red-500 text-sm mt-1">
                        {fieldErrors.siret[0]}
                      </span>
                    )}
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
                        fieldErrors.activitySector
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      required
                    />
                    {fieldErrors.activitySector && (
                      <span className="text-red-500 text-sm mt-1">
                        {fieldErrors.activitySector[0]}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <FiMapPin className="inline mr-1" />
                      Ville
                    </label>
                    <input
                      type="text"
                      name="ville"
                      value={formData.ville}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${
                        fieldErrors.ville ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <FiMapPin className="inline mr-1" />
                      Région
                    </label>
                    <input
                      type="text"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${
                        fieldErrors.region
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <FiImage className="inline mr-1" />
                    Logo de l'entreprise
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                        <FiImage className="text-3xl text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 text-center">
                          <span className="font-medium text-green-600">
                            Cliquez pour uploader
                          </span>{" "}
                          ou glissez-déposez
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PNG, JPG, JPEG (max. 2MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        name="logo"
                        onChange={handleChange}
                        className="hidden"
                        accept=".png,.jpg,.jpeg"
                      />
                    </label>
                  </div>
                  {formData.logo && (
                    <p className="mt-2 text-sm text-green-600">
                      <FiCheck className="inline mr-1" />
                      {formData.logo.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <FiUpload className="inline mr-1" />
                    Documents officiels
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
                          PDF, JPG, JPEG, PNG (max. 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        name="documents"
                        onChange={handleChange}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        required
                      />
                    </label>
                  </div>
                  {formData.documents && (
                    <p className="mt-2 text-sm text-green-600">
                      <FiCheck className="inline mr-1" />
                      {formData.documents.name}
                    </p>
                  )}
                  {fieldErrors.documents && (
                    <span className="text-red-500 text-sm mt-1">
                      {fieldErrors.documents[0]}
                    </span>
                  )}
                </div>
              </>
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
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Traitement...
                  </>
                ) : (
                  `S'inscrire en tant que ${
                    userType === USER_TYPES.ENTREPRISE ? "entreprise" : "client"
                  }`
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Déjà un compte ?{" "}
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
