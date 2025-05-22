import { useState, useEffect } from "react";
import { FiMail, FiLock, FiUserPlus, FiArrowRight } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "../Contexts/Authcontexts";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const { login, user, profileType, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && profileType) {
      switch (profileType) {
        case "admin":
          navigate("/");
          break;
        case "client":
          navigate("/", { state: { isLoggedIn: true } });
          break;
        case "entreprise":
          navigate("/", { state: { isLoggedIn: true } });
          break;
        default:
          break;
      }
    }
  }, [isAuthenticated, profileType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    const errors = {};
    if (!email.trim()) errors.email = "Email requis";
    if (!password) errors.password = "Mot de passe requis";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const { success, message } = await login(email, password);
      if (!success) {
        setError(message || "Échec de la connexion");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Une erreur est survenue lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-600 to-green-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-green-600 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">
            Bienvenue sur <span className="text-yellow-300">CamProduct</span>
          </h1>
          <p className="text-white/90 mt-2">
            Connectez-vous à votre espace personnel
          </p>
        </div>

        <div className="p-8">
          {/* Message de chargement */}
          {loading && (
            <div className="flex justify-center items-center mb-4">
              <span className="text-green-600 font-medium animate-pulse">
                Connexion en cours...
              </span>
            </div>
          )}

          {error && (
            <div className="mb-4 text-red-600 text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Adresse Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="votre@email.com"
                  required
                />
              </div>
              {fieldErrors.email && (
                <p className="text-sm text-red-500 mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
              {fieldErrors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Se souvenir de moi
                </label>
              </div>

              <Link
                to="/forgotpassword"
                className="text-sm font-medium text-green-600 hover:text-green-500"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton de connexion */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
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
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Connexion...
                  </>
                ) : (
                  <>
                    Se connecter
                    <FiArrowRight className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Séparateur */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou</span>
            </div>
          </div>

          {/* Lien d'inscription */}
          <div className="text-center">
            <p className="text-gray-600">
              Nouveau sur notre plateforme ?{" "}
              <Link
                to="/register"
                className="font-medium text-green-600 hover:text-green-500 inline-flex items-center"
              >
                Créer un compte <FiUserPlus className="ml-1" />
              </Link>
            </p>
          </div>

          {/* Connexion sociale */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <FaGoogle className="text-red-500 mr-2" />
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                alt="Facebook"
                className="h-5 w-5 mr-2"
              />
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
