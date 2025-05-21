import React from 'react';
import { Search, ShoppingBag, Star, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import back from '../assets/2.avif';
import ananas from '../assets/ananas.avif';
import piment from '../assets/piment.avif';
import miel from '../assets/miel1.avif';
import cacao from '../assets/cacao2.avif';
import fruits from '../assets/3.avif';
import epices from '../assets/epices.png';
import api from '../assets/api.png';

// Composant réutilisable pour les cartes de produits
const ProductCard = ({ product }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
  >
    <div className="relative h-48 overflow-hidden">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
      {product.featured && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
          Nouveau
        </div>
      )}
    </div>
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-lg">{product.name}</h3>
        <span className="font-bold text-green-700">{product.price}</span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{product.company}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm ml-1">{product.rating}</span>
        </div>
        <div className="flex items-center text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-xs">{product.region}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

// Composant réutilisable pour les cartes d'entreprise
const CompanyCard = ({ company }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-xl shadow p-6 flex items-center hover:shadow-md transition-all"
  >
    <div className="relative">
      <img 
        src={company.logo} 
        alt={company.name} 
        className="w-16 h-16 object-cover rounded-full border-2 border-green-100"
      />
      {company.new && (
        <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold px-1 rounded-full">
          Nouveau
        </div>
      )}
    </div>
    <div className="ml-4">
      <h3 className="font-medium text-lg">{company.name}</h3>
      <p className="text-sm text-gray-600">{company.products} produits</p>
      <div className="flex items-center text-gray-500 mt-1">
        <MapPin className="h-4 w-4 mr-1" />
        <span className="text-xs">{company.region}</span>
      </div>
    </div>
  </motion.div>
);

export default function Accueil() {
  // Données factices pour la démo
  const featuredProducts = [
    { 
      id: 1, 
      name: "Jus d'Ananas Bio", 
      price: "2500 FCFA", 
      rating: 4.8, 
      image: ananas, 
      company: "Fruits du Pays", 
      region: "Littoral",
      featured: true
    },
    { 
      id: 2, 
      name: "Poudre de Piment", 
      price: "1200 FCFA", 
      rating: 4.5, 
      image: piment, 
      company: "Épices du Cameroun", 
      region: "Ouest" 
    },
    { 
      id: 3, 
      name: "Miel de Fleurs", 
      price: "3500 FCFA", 
      rating: 5.0, 
      image: miel, 
      company: "Apiculture Durable", 
      region: "Adamaoua",
      featured: true
    },
    { 
      id: 4, 
      name: "Cacao en Poudre", 
      price: "1800 FCFA", 
      rating: 4.7, 
      image: cacao, 
      company: "Cacao Excellence", 
      region: "Centre" 
    },
  ];

  const newCompanies = [
    { 
      id: 1, 
      name: "Fruits du Pays", 
      logo: fruits, 
      products: 12, 
      region: "Littoral",
      new: true 
    },
    { 
      id: 2, 
      name: "Épices du Cameroun", 
      logo: epices, 
      products: 8, 
      region: "Ouest" 
    },
    { 
      id: 3, 
      name: "Apiculture Durable", 
      logo: api, 
      products: 5, 
      region: "Adamaoua",
      new: true 
    },
  ];

  const categories = [
    { name: "Boissons", icon: "🥤", count: 45 },
    { name: "Épices", icon: "🌶️", count: 32 },
    { name: "Céréales", icon: "🌾", count: 28 },
    { name: "Miel", icon: "🍯", count: 15 },
    { name: "Fruits", icon: "🍍", count: 37 },
    { name: "Cacao & Café", icon: "☕", count: 22 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-green-800 text-white h-96 overflow-hidden">
        <motion.img 
          src={back} 
          alt="Produits camerounais" 
          className="w-full h-full object-cover opacity-60"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 5, ease: "easeOut" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-center"
          >
            Découvrez le Meilleur du Made in Cameroun
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl mb-6 text-center max-w-2xl"
          >
            La plateforme de référence pour les produits agroalimentaires de qualité fabriqués au Cameroun
          </motion.p>
          
          {/* Barre de recherche */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="relative w-full max-w-xl"
          >
            <input 
              type="text" 
              placeholder="Rechercher un produit, une entreprise..." 
              className="w-full p-4 rounded-xl pl-12 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm" 
            />
            <Search className="absolute left-4 top-4 text-gray-500" size={20} />
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="absolute right-2 top-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium flex items-center"
            >
              Rechercher
              <ArrowRight className="ml-2 h-4 w-4" />
            </motion.button>
          </motion.div>
        </div>
      </div>
      
      {/* Catégories populaires */}
      <section className="container mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Explorez par catégorie</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.a 
                key={index} 
                href="#"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow hover:shadow-md transition-all p-4 flex flex-col items-center justify-center hover:bg-green-50"
              >
                <span className="text-3xl mb-2">{category.icon}</span>
                <h3 className="font-medium text-center">{category.name}</h3>
                <p className="text-gray-500 text-sm">{category.count} produits</p>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </section>
      
      {/* Produits populaires */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">Produits les plus consultés</h2>
              <motion.a
                whileHover={{ x: 5 }}
                href="#"
                className="text-green-700 font-medium flex items-center"
              >
                Voir tous <ArrowRight className="ml-1 h-4 w-4" />
              </motion.a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Nouvelles entreprises */}
      <section className="container mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Nouvelles entreprises inscrites</h2>
            <motion.a
              whileHover={{ x: 5 }}
              href="#"
              className="text-green-700 font-medium flex items-center"
            >
              Voir toutes <ArrowRight className="ml-1 h-4 w-4" />
            </motion.a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newCompanies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <CompanyCard company={company} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
      
      {/* Appel à l'action */}
      <section className="bg-yellow-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Vous êtes une entreprise agroalimentaire camerounaise ?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Rejoignez notre plateforme pour augmenter votre visibilité et développer votre réseau commercial.
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/login"
              className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg inline-block font-medium shadow-md"
            >
              Inscrire mon entreprise
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}