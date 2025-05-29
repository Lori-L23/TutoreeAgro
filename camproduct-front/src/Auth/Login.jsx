import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Contexts/Authcontexts";
import { toast } from "react-toastify";
import {
  FiLock,
  FiMail,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, resendValidationEmail } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [showResendEmail, setShowResendEmail] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Récupération du message et email depuis l'état de navigation
  const stateMessage = location.state?.message;
  const stateEmail = location.state?.email;

  useEffect(() => {
    if (stateMessage) {
      if (stateMessage.includes("vérifier votre email")) {
        setShowResendEmail(true);
        if (stateEmail) {
          setFormData(prev => ({ ...prev, email: stateEmail }));
        }
      }
      toast.info(stateMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }, [stateMessage, stateEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Effacer l'erreur quand l'utilisateur tape
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success("Connexion réussie !", {
          position: "top-right",
          autoClose: 2000,
        });

        navigate("/");
      } else {
        setError(result.message);
        
        // Si l'erreur indique que l'email n'est pas validé
        if (result.message?.toLowerCase().includes("email") && 
            result.message?.toLowerCase().includes("validé")) {
          setShowResendEmail(true);
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!formData.email) {
      toast.error("Veuillez saisir votre email");
      return;
    }

    setIsResending(true);
    try {
      const result = await resendValidationEmail(formData.email);
      
      if (result.success) {
        toast.success("Email de validation renvoyé ! Vérifiez votre boîte mail.", {
          position: "top-right",
          autoClose: 5000,
        });
        setShowResendEmail(false);
      } else {
        toast.error(result.message || "Erreur lors du renvoi de l'email");
      }
    } catch (error) {
      console.error("Resend email error:", error);
      toast.error("Erreur lors du renvoi de l'email");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-600 to-green-400 p-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-700 mb-2">
              Connexion
            </h2>
            <p className="text-gray-600">
              Accédez à votre espace personnel
            </p>
          </div>

          {/* Message d'état depuis la navigation */}
          {stateMessage && (
            <div className={`mb-6 p-4 rounded-lg border ${
              stateMessage.includes("actif") || stateMessage.includes("succès")
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-blue-50 border-blue-200 text-blue-700"
            }`}>
              <div className="flex items-start">
                {stateMessage.includes("actif") || stateMessage.includes("succès") ? (
                  <FiCheckCircle className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                ) : (
                  <FiAlertCircle className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                )}
                <p className="text-sm">{stateMessage}</p>
              </div>
            </div>
          )}

          {/* Message d'erreur */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              <div className="flex items-start">
                <FiAlertCircle className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Option de renvoi d'email */}
          {showResendEmail && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start mb-3">
                <FiMail className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-yellow-800 font-medium mb-1">
                    Email non validé
                  </p>
                  <p className="text-sm text-yellow-700">
                    Votre compte nécessite une validation par email.
                  </p>
                </div>
              </div>
              <button
                onClick={handleResendEmail}
                disabled={isResending}
                className="w-full bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
              >
                {isResending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.329A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <FiMail className="mr-2 w-4 h-4" />
                    Renvoyer l'email de validation
                  </>
                )}
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Votre mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FiEye className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-green-600 hover:text-green-700"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${
                isLoading ? "bg-green-500" : "bg-green-600 hover:bg-green-700"
              } text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Pas encore de compte ?{" "}
              <Link
                to="/register"
                className="font-medium text-green-600 hover:text-green-700"
              >
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;