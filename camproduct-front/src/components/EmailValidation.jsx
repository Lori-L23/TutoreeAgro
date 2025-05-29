import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Contexts/Authcontexts";
import { toast } from "react-toastify";
import {
  FiCheckCircle,
  FiXCircle,
  FiLoader,
  FiMail,
  FiArrowRight,
} from "react-icons/fi";

const EmailValidation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { validateEmail } = useAuth();
  const [validationState, setValidationState] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const validateEmailToken = async () => {
      if (!token) {
        setValidationState("error");
        setMessage("Token de validation manquant");
        return;
      }

      try {
        const result = await validateEmail(token);
        
        if (result.success) {
          setValidationState("success");
          setMessage(result.message || "Email validé avec succès !");
          
          // Toast de succès
          toast.success("Votre compte entreprise a été activé avec succès !", {
            position: "top-right",
            autoClose: 3000,
          });
          
          // Redirection automatique après 3 secondes
          setTimeout(() => {
            navigate("/login", { 
              state: { 
                message: "Votre compte est maintenant actif, vous pouvez vous connecter" 
              }
            });
          }, 3000);
        } else {
          setValidationState("error");
          setMessage(result.message || "Erreur lors de la validation");
        }
      } catch (error) {
        console.error("Erreur validation:", error);
        setValidationState("error");
        setMessage("Une erreur est survenue lors de la validation");
      }
    };

    validateEmailToken();
  }, [token, validateEmail, navigate]);

  const renderContent = () => {
    switch (validationState) {
      case "loading":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiLoader className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Validation en cours...
            </h2>
            <p className="text-gray-600">
              Nous vérifions votre email, veuillez patienter.
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Email validé !
            </h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800">{message}</p>
            </div>
            <p className="text-gray-600 mb-6">
              Votre compte entreprise est maintenant actif. Vous allez être redirigé vers la page de connexion.
            </p>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <FiLoader className="w-4 h-4 animate-spin mr-2" />
              Redirection automatique dans quelques secondes...
            </div>
          </div>
        );

      case "error":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiXCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Validation échouée
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{message}</p>
            </div>
            <div className="space-y-3">
              <p className="text-gray-600 text-sm">
                Le lien de validation peut être expiré ou invalide.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200"
                >
                  Créer un nouveau compte
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition duration-200"
                >
                  Aller à la connexion
                  <FiArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-600 to-green-400 p-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          {renderContent()}
          
          {validationState !== "loading" && (
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500 mb-2">
                Besoin d'aide ?
              </p>
              <p className="text-xs text-gray-500">
                Contactez notre support si vous rencontrez des difficultés.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailValidation;