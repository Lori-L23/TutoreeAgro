import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

// Composant réutilisable pour les cartes d'information
const ContactCard = ({ icon: Icon, title, children }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="flex items-start p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="p-3 bg-green-100 rounded-full mr-4">
      <Icon className="h-5 w-5 text-green-700" />
    </div>
    <div>
      <h3 className="font-medium text-gray-800 mb-1">{title}</h3>
      <div className="text-gray-600 text-sm">{children}</div>
    </div>
  </motion.div>
);

// Composant pour les questions fréquentes
const FAQItem = ({ question, answer }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0"
  >
    <h3 className="font-medium text-green-700 mb-1">{question}</h3>
    <p className="text-sm text-gray-600">{answer}</p>
  </motion.div>
);

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'question'
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'envoi de formulaire
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
    setIsSubmitting(false);
    
    // Réinitialiser le formulaire après soumission
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'question'
      });
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-green-700 to-green-600 text-white py-16 md:py-24"
      >
        <div className="container mx-auto px-4 mt-20 max-w-6xl">
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Contactez-nous
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl max-w-2xl"
          >
            Une question ? Une suggestion ? Nous sommes à votre écoute pour vous aider dans votre découverte des produits Made in Cameroun.
          </motion.p>
        </div>
      </motion.div>
      
      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colonne de gauche - Informations */}
          <div className="md:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
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
            </motion.div>
            
            {/* Réseaux sociaux */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <h3 className="font-medium text-gray-800 mb-4">Suivez-nous</h3>
              <div className="flex space-x-3">
                {[
                  { icon: Facebook, color: 'bg-blue-100', text: 'text-blue-600' },
                  { icon: Twitter, color: 'bg-sky-100', text: 'text-sky-600' },
                  { icon: Instagram, color: 'bg-pink-100', text: 'text-pink-600' },
                  { icon: Linkedin, color: 'bg-blue-100', text: 'text-blue-700' }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    whileHover={{ y: -3 }}
                    href="#"
                    className={`h-10 w-10 rounded-full ${social.color} flex items-center justify-center transition-colors`}
                  >
                    <social.icon className={`h-5 w-5 ${social.text}`} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
            
            {/* FAQ Rapide */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-800">Questions fréquentes</h2>
              <div className="space-y-4">
                <FAQItem 
                  question="Comment inscrire mon entreprise ?" 
                  answer="Utilisez le formulaire d'inscription dans l'espace entreprise et suivez les étapes." 
                />
                <FAQItem 
                  question="Est-ce que l'inscription est gratuite ?" 
                  answer="Oui, l'inscription de base est entièrement gratuite pour toutes les entreprises camerounaises." 
                />
                <FAQItem 
                  question="Comment contacter une entreprise ?" 
                  answer="Utilisez le formulaire de contact sur la page de l'entreprise concernée." 
                />
              </div>
            </motion.div>
          </div>
          
          {/* Colonne de droite - Formulaire */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2"
          >
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-green-100 rounded-full mr-4">
                  <MessageSquare className="h-5 w-5 text-green-700" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Envoyez-nous un message</h2>
              </div>
              
              {formSubmitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-start"
                >
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Message envoyé avec succès !</p>
                    <p className="text-sm mt-1">Nous vous répondrons dans les plus brefs délais.</p>
                  </div>
                </motion.div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type de demande *</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    required
                  >
                    <option value="question">Question générale</option>
                    <option value="enterprise">Demande pour les entreprises</option>
                    <option value="technical">Problème technique</option>
                    <option value="partnership">Proposition de partenariat</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Sujet *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="Objet de votre message"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="Votre message détaillé..."
                    required
                  ></textarea>
                </div>
                
                <div className="flex items-center">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className={`inline-flex items-center px-6 py-3 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition ${isSubmitting ? 'bg-yellow-600' : 'bg-yellow-500 hover:bg-yellow-600'}`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Envoi en cours...
                      </>
                    ) : (
                      'Envoyer le message'
                    )}
                  </motion.button>
                  
                  {formSubmitted && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="ml-4 text-sm text-green-600"
                    >
                      Message envoyé avec succès !
                    </motion.span>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}