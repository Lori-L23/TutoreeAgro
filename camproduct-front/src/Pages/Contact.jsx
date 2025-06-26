import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Api from "../Services/Api";
import back from "../assets/back1.avif";

// Service API corrigé
const contactAPI = {
  async sendMessage(data) {
    try {
      const response = await Api.post('/api/contact', data);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw {
          status: error.response.status,
          message: error.response.data?.message || "Une erreur est survenue",
          errors: error.response.data?.errors || {},
        };
      }
      throw {
        message: error.message || "Erreur de connexion au serveur",
      };
    }
  },
};

// Composants réutilisables (inchangés)
const ContactCard = ({ icon: Icon, title, children }) => (
  <div className="flex items-start p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <div className="p-3 bg-green-100 rounded-full mr-4">
      <Icon className="h-5 w-5 text-green-700" />
    </div>
    <div>
      <h3 className="font-medium text-gray-800 mb-1">{title}</h3>
      <div className="text-gray-600 text-sm">{children}</div>
    </div>
  </div>
);

const FAQItem = ({ question, answer }) => (
  <div className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
    <h3 className="font-medium text-green-700 mb-1">{question}</h3>
    <p className="text-sm text-gray-600">{answer}</p>
  </div>
);

const Alert = ({ type, title, message, onClose }) => {
  const styles = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      icon: CheckCircle,
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      icon: AlertCircle,
    },
  };

  const style = styles[type] || styles.error;
  const Icon = style.icon;

  return (
    <div className={`${style.bg} ${style.border} ${style.text} px-4 py-3 rounded-lg mb-6 flex items-start`}>
      <Icon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
      <div className="flex-grow">
        <p className="font-medium">{title}</p>
        <p className="text-sm mt-1">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="ml-4 text-sm hover:underline">
          ×
        </button>
      )}
    </div>
  );
};

// Composant principal Contact
export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "question",
  });

  const [formState, setFormState] = useState({
    isSubmitting: false,
    submitted: false,
    error: null,
    validationErrors: {},
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (formState.validationErrors[name]) {
      setFormState(prev => ({
        ...prev,
        validationErrors: { ...prev.validationErrors, [name]: undefined },
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      type: "question",
    });
    setFormState({
      isSubmitting: false,
      submitted: false,
      error: null,
      validationErrors: {},
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState(prev => ({ ...prev, isSubmitting: true, error: null, validationErrors: {} }));

    try {
      await contactAPI.sendMessage(formData);
      
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        submitted: true,
      }));

      setTimeout(resetForm, 5000);
    } catch (error) {
      console.error("Erreur API:", error);
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        error: error.message,
        validationErrors: error.errors || {},
      }));
    }
  };

  const getFieldError = (fieldName) => {
    return formState.validationErrors[fieldName]?.[0];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-green-800 text-white h-96 overflow-hidden">
        <img src={back} alt="contactez nous" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contactez-nous</h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Une question ? Une suggestion ? Nous sommes à votre écoute.
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colonne de gauche - Informations */}
          <div className="md:col-span-1 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-6 text-gray-800">Nos informations</h2>
              <div className="space-y-4">
                <ContactCard icon={MapPin} title="Adresse">
                  <p>123 Avenue de l'Indépendance</p>
                  <p>Yaoundé, Cameroun</p>
                </ContactCard>
                <ContactCard icon={Phone} title="Téléphone">
                  <p>+237 6XX XX XX XX</p>
                  <p>+237 2XX XX XX XX</p>
                </ContactCard>
                <ContactCard icon={Mail} title="Email">
                  <p>contact@madeincameroun.cm</p>
                  <p>info@madeincameroun.cm</p>
                </ContactCard>
                <ContactCard icon={Clock} title="Horaires">
                  <p>Lundi - Vendredi: 8h30 - 17h30</p>
                  <p>Samedi: 9h - 13h</p>
                </ContactCard>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-800 mb-4">Suivez-nous</h3>
              <div className="flex space-x-3">
                {[
                  { icon: Facebook, color: "bg-blue-100", text: "text-blue-600" },
                  { icon: Twitter, color: "bg-sky-100", text: "text-sky-600" },
                  { icon: Instagram, color: "bg-pink-100", text: "text-pink-600" },
                  { icon: Linkedin, color: "bg-blue-100", text: "text-blue-700" },
                ].map((social, index) => (
                  <a key={index} href="#" className={`h-10 w-10 rounded-full ${social.color} flex items-center justify-center transition-colors hover:scale-110`}>
                    <social.icon className={`h-5 w-5 ${social.text}`} />
                  </a>
                ))}
              </div>
            </div>

            {/* FAQ Rapide */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Questions fréquentes</h2>
              <div className="space-y-4">
                <FAQItem
                  question="Comment inscrire mon entreprise ?"
                  answer="Utilisez le formulaire d'inscription dans l'espace entreprise."
                />
                <FAQItem
                  question="Est-ce que l'inscription est gratuite ?"
                  answer="Oui, l'inscription de base est entièrement gratuite."
                />
                <FAQItem
                  question="Comment contacter une entreprise ?"
                  answer="Utilisez le formulaire de contact sur la page de l'entreprise."
                />
              </div>
            </div>
          </div>

          {/* Colonne de droite - Formulaire */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-green-100 rounded-full mr-4">
                  <MessageSquare className="h-5 w-5 text-green-700" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Envoyez-nous un message</h2>
              </div>

              {/* Messages d'alerte */}
              {formState.submitted && (
                <Alert
                  type="success"
                  title="Message envoyé avec succès !"
                  message="Nous vous répondrons dans les plus brefs délais."
                />
              )}

              {formState.error && (
                <Alert
                  type="error"
                  title="Erreur lors de l'envoi"
                  message={formState.error}
                  onClose={() => setFormState(prev => ({ ...prev, error: null }))}
                />
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={formState.isSubmitting}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                        getFieldError("name") ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                    />
                    {getFieldError("name") && (
                      <p className="text-sm text-red-600 mt-1">{getFieldError("name")}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={formState.isSubmitting}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                        getFieldError("email") ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                    />
                    {getFieldError("email") && (
                      <p className="text-sm text-red-600 mt-1">{getFieldError("email")}</p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={formState.isSubmitting}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                      getFieldError("subject") ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                  />
                  {getFieldError("subject") && (
                    <p className="text-sm text-red-600 mt-1">{getFieldError("subject")}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    disabled={formState.isSubmitting}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                      getFieldError("message") ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                  ></textarea>
                  {getFieldError("message") && (
                    <p className="text-sm text-red-600 mt-1">{getFieldError("message")}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Type de message
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    disabled={formState.isSubmitting}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  >
                    <option value="question">Question</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="complaint">Réclamation</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={formState.isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 disabled:opacity-50"
                >
                  {formState.isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}