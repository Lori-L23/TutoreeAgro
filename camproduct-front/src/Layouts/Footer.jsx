import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaArrowRight } from "react-icons/fa";


function Footer() {
  return (
    <footer className="bg-[#4CAF50] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* À propos */}
        <div>
          <h3 className="text-xl font-semibold mb-4">À propos</h3>
          <p className="text-sm">
            Notre plateforme met en lumière les entreprises agroalimentaires du
            Cameroun, valorisant les produits locaux pour soutenir l'économie et
            les savoir-faire du terroir.
          </p>
        </div>

        {/* Liens utiles */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Liens utiles</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:underline">
                Accueil
              </a>
            </li>
            <li>
              <a href="/entreprises" className="hover:underline">
                Entreprises
              </a>
            </li>
            <li>
              <a href="/produits" className="hover:underline">
                Produits
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Contact
              </a>
            </li>
            <li>
              <a href="/blog" className="hover:underline">
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact</h3>
          <p className="text-sm">📍 Yaoundé, Cameroun</p>
          <p className="text-sm">📞 +237 6 XX XX XX XX</p>
          <p className="text-sm">✉️ info@madeincameroon.cm</p>

          <div className="flex mt-4 space-x-4">
            <a href="#" className="hover:text-yellow-300" title="Facebook">
            <FaFacebook />
            </a>
            <a href="#" className="hover:text-yellow-300" title="Twitter">
            <FaTwitter />
            </a>
            <a href="#" className="hover:text-yellow-300" title="Instagram">
            <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center py-4 text-sm border-t border-green-300 bg-[#388E3C]">
        © {new Date().getFullYear()} Made in Cameroon – Tous droits réservés.
      </div>
    </footer>
  );
}

export default Footer;
