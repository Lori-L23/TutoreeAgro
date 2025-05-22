import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaSignInAlt,
  FaUserPlus,
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaStore,
  FaBuilding,
  FaEnvelope,
  FaInfoCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../Contexts/Authcontexts";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profileType, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Utilisation de useCallback pour améliorer les performances
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  console.log("user", user);
  // Ferme le menu mobile lorsque l'URL change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    try {
      logout();
      navigate("/login");
      closeMenu();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  // Définition des icônes pour chaque lien
  const icons = {
    "/": <FaHome className="mr-2" />,
    "/produits": <FaStore className="mr-2" />,
    "/entreprises": <FaBuilding className="mr-2" />,
    "/contact": <FaEnvelope className="mr-2" />,
    "/apropos": <FaInfoCircle className="mr-2" />,
  };

  const firstLetter = profileType ? profileType.charAt(0).toLowerCase() : "";

  const dynamicRoutes = {
    c: [{ to: "/commandes", text: "Mes commandes" }],
    e: [
      { to: "/dashboard", text: "Tableau de bord" },
      { to: "/mesproduits", text: "Mes produits" },
    ],
    a: [
      { to: "/dashboardadmin", text: "Administration" },
      { to: "/adminusers", text: "Utilisateurs" },
    ],
  };

  const commonLinks = [
    { to: "/", text: "Accueil", icon: icons["/"] },
    { to: "/produits", text: "Produits", icon: icons["/produits"] },
    { to: "/entreprises", text: "Entreprises", icon: icons["/entreprises"] },
  ];

  const getRoleSpecificLinks = () => {
    if (!isAuthenticated || !firstLetter) return [];
    return dynamicRoutes[firstLetter] || [];
  };

  // Construire la liste de liens complète
  const allLinks = [
    ...commonLinks,
    ...getRoleSpecificLinks(),
    { to: "/contact", text: "Contact", icon: icons["/contact"] },
    { to: "/apropos", text: "À propos", icon: icons["/apropos"] },
  ];

  // Déterminer la page de profil selon le type d'utilisateur
  const getProfilePath = () => {
    if (!profileType) return "/moncompte";

    switch (profileType.toLowerCase()) {
      case "client":
        return "/moncompte";
      case "entreprise":
        return "/compteentreprise";
      case "admin":
        return "/admincompte";
      default:
        return "/moncompte";
    }
  };

  // Animation pour le menu mobile
  const menuVariants = {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      x: "100%",
      transition: {
        ease: "easeInOut",
        duration: 0.3,
      },
    },
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 bg-green-600 text-white shadow-md ${
        isScrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="z-40" onClick={closeMenu}>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-transparent bg-clip-text">
              CamProduct
            </h1>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {allLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`hover:underline text-white font-medium transition-colors duration-200 flex items-center ${
                  location.pathname === link.to ? "text-yellow-300" : ""
                }`}
              >
                {link.icon}
                {link.text}
              </Link>
            ))}

            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-white/30">
              {isAuthenticated ? (
                <>
                  <Link
                    to={getProfilePath()}
                    className="flex items-center text-white font-medium hover:text-yellow-300 transition-colors duration-200"
                  >
                    <FaUser className="mr-2" />
                    {user?.profile?.nom_entreprise || "Mon compte"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 hover:text-white transition duration-200"
                    aria-label="Déconnexion"
                  >
                    <FaSignOutAlt className="mr-2" /> Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center text-white font-medium hover:text-yellow-300 transition-colors duration-200"
                    aria-label="Connexion"
                  >
                    <FaSignInAlt className="mr-2" /> Connexion
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition duration-200"
                    aria-label="Inscription"
                  >
                    <FaUserPlus className="inline mr-2" /> Inscription
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white p-2 focus:outline-none"
              aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
              className="fixed inset-0 bg-green-600 z-30 pt-20 px-6 overflow-y-auto md:hidden text-white"
            >
              <div className="flex flex-col space-y-2">
                {allLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={closeMenu}
                    className={`text-lg font-medium py-3 border-b border-white/30 flex items-center ${
                      location.pathname === link.to ? "text-yellow-300" : ""
                    }`}
                  >
                    {link.icon}
                    {link.text}
                  </Link>
                ))}

                <div className="pt-4">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to={getProfilePath()}
                        onClick={closeMenu}
                        className="flex items-center text-lg font-medium py-3 border-b border-white/30"
                      >
                        <FaUser className="mr-2" />
                        {user?.email?.nom_entreprise || "Mon compte"}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full justify-center text-lg font-medium py-3 mt-4 bg-white text-green-600 rounded-lg hover:bg-red-500 hover:text-white transition duration-200"
                      >
                        <FaSignOutAlt className="mr-2" /> Déconnexion
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col space-y-3 pt-2">
                      <button
                        onClick={() => {
                          navigate("/login");
                          closeMenu();
                        }}
                        className="flex items-center justify-center text-lg font-medium py-3 bg-white/20 rounded-lg hover:bg-white/30 transition duration-200"
                      >
                        <FaSignInAlt className="mr-2" /> Connexion
                      </button>
                      <button
                        onClick={() => {
                          navigate("/register");
                          closeMenu();
                        }}
                        className="flex items-center justify-center bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition duration-200"
                      >
                        <FaUserPlus className="mr-2" /> Inscription
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
