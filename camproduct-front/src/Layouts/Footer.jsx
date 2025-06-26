import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaArrowRight, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { useState } from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // Ici, vous implémenteriez l'envoi réel à une API
      console.log(`Souscription avec l'email: ${email}`);
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const links = [
    { text: "Accueil", url: "/" },
    { text: "Entreprises", url: "/entreprises" },
    { text: "Produits", url: "/produits" },
    { text: "Contact", url: "/contact" },
    { text: "Blog", url: "/blog" }
  ];

  const socialLinks = [
    { icon: <FaFacebook size={20} />, url: "#", title: "Facebook" },
    { icon: <FaTwitter size={20} />, url: "#", title: "Twitter" },
    { icon: <FaInstagram size={20} />, url: "#", title: "Instagram" },
    { icon: <FaLinkedin size={20} />, url: "#", title: "LinkedIn" }
  ];

  const contactInfo = [
    { icon: <FaMapMarkerAlt />, text: "Yaoundé, Cameroun" },
    { icon: <FaPhone />, text: "+237 6 XX XX XX XX" },
    { icon: <FaEnvelope />, text: "info@madeincameroon.cm" }
  ];

  return (
    <footer className="bg-green-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* À propos */}
          <div>
            <h3 className="text-xl font-bold mb-4">À propos</h3>
            <p className="text-sm mb-4">
              Notre plateforme met en lumière les entreprises agroalimentaires du
              Cameroun, valorisant les produits locaux pour soutenir l'économie et
              les savoir-faire du terroir.
            </p>
            <a 
              href="/apropos" 
              className="inline-flex items-center text-sm font-medium text-yellow-200 hover:text-white"
            >
              En savoir plus <FaArrowRight className="ml-2" />
            </a>
          </div>

          {/* Liens utiles */}
          <div>
            <h3 className="text-xl font-bold mb-4">Liens utiles</h3>
            <ul className="space-y-2 text-sm">
              {links.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url} 
                    className="hover:text-yellow-200 transition-colors duration-200 flex items-center"
                  >
                    <FaArrowRight className="mr-2 text-xs" />
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <p className="text-sm mb-4">
              Restez informé des dernières actualités et découvrez les nouveaux produits du terroir camerounais.
            </p>
            <form onSubmit={handleSubscribe} className="mt-2">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email"
                  className="px-3 py-2 w-full text-gray-800 bg-white rounded-l focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="bg-yellow-500 px-4 py-2 rounded-r hover:bg-yellow-600 transition-colors duration-200"
                >
                  OK
                </button>
              </div>
            </form>
            {subscribed && (
              <p className="text-yellow-200 text-sm mt-2">
                Merci pour votre inscription !
              </p>
            )}
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2">{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>

            <div className="flex mt-6 space-x-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index} 
                  href={social.url} 
                  className="hover:text-yellow-200 transition-colors duration-200" 
                  title={social.title}
                  aria-label={social.title}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center py-4 text-sm border-t border-green-500 bg-green-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© {currentYear} Made in Cameroon – Tous droits réservés.</p>
            <div className="mt-2 md:mt-0">
              <a href="/politique-confidentialite" className="hover:text-yellow-200 mx-2 text-sm">
                Politique de confidentialité
              </a>
              <a href="/mentions-legales" className="hover:text-yellow-200 mx-2 text-sm">
                Mentions légales
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;