import { useState } from "react";
import { FiMail, FiArrowLeft, FiRefreshCw } from "react-icons/fi";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Veuillez saisir votre adresse email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simuler l'appel API pour réinitialiser le mot de passe
      // Exemple avec API réelle:
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || "Une erreur est survenue");
      }

      // Remplacer par votre logique d'API réelle
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 1500);
    } catch (err) {
      console.error("Reset password error:", err);
      setError(
        "Une erreur est survenue lors de la demande de réinitialisation"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-600 to-green-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-green-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Mot de passe oublié</h1>
          <p className="text-white/90 mt-2">
            Réinitialisez votre mot de passe CamProduct
          </p>
        </div>

        <div className="p-8">
          {success ? (
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
                <FiMail className="text-3xl text-green-600" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-800">
                Email envoyé
              </h2>
              <p className="mt-2 text-gray-600">
                Si un compte existe avec l'adresse {email}, vous recevrez un
                email contenant les instructions pour réinitialiser votre mot de
                passe.
              </p>
              <div className="mt-6">
                <Link
                  to="/login"
                  className="flex items-center justify-center text-green-600 hover:text-green-700 font-medium"
                >
                  <FiArrowLeft className="mr-2" />
                  Retour à la page de connexion
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  Saisissez l'adresse email associée à votre compte et nous vous
                  enverrons un lien pour réinitialiser votre mot de passe.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
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
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FiRefreshCw className="animate-spin h-5 w-5 mr-2" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>Envoyer les instructions</>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="flex items-center justify-center text-green-600 hover:text-green-700 font-medium"
                >
                  <FiArrowLeft className="mr-2" />
                  Retour à la connexion
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
