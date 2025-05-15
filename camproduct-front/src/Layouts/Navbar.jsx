import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-[#4CAF50] text-white shadow-md fixed w-full z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          CamProduct
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:underline">
            Accueil
          </Link>
          <Link to="/products" className="hover:underline">
            Produits
          </Link>
          <Link to="/entreprises" className="hover:underline">
            Entreprises
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
          <Link to="/about" className="hover:underline">
            À propos
          </Link>
          <div className=" items-center space-x-4">
            <Link
              to="/login"
              className="text-white font-medium hover:underline transition duration-200"
            >
              Connexion
            </Link>

            <Link
              to="/register"
              className="bg-white text-[#4CAF50] border border-[#4CAF50] px-4 py-2 rounded-lg font-semibold hover:bg-[#4CAF50] hover:text-white transition duration-200"
            >
              Inscription
            </Link>
          </div>
        </nav>

        {/* Bouton Mobile */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-cameroon-green px-4 pb-4">
          <nav className="flex flex-col space-y-3">
            <Link to="/" className="hover:underline py-1">
              Accueil
            </Link>
            <Link to="/products" className="hover:underline py-1">
              Produits
            </Link>
            <Link to="/entreprises" className="hover:underline py-1">
              Entreprises
            </Link>
            <Link to="/contact" className="hover:underline py-1">
              Contact
            </Link>
            <Link to="/about" className="hover:underline py-1">
              À propos
            </Link>
            <Link
              to="/login"
              className="text-white font-medium hover:underline transition duration-200 py-1"
            >
                Connexion
               </Link>
            <Link
              to="/register"
              className="bg-white text-[#4CAF50] border border-[#4CAF50] px-4  rounded-lg font-semibold hover:bg-[#4CAF50] hover:text-white transition duration-200 py-1"
            >
              Inscription
              </Link>
          </nav>
        </div>
      )}
    </header>
  );
}


export default Navbar;
