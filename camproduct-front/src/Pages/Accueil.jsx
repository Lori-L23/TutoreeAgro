import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  Star,
  MapPin,
  ArrowRight,
  Filter,
  X,
} from "lucide-react";
import back from "../assets/2.avif";
import ananas from "../assets/ananas.avif";
import piment from "../assets/piment.avif";
import miel from "../assets/miel1.avif";
import cacao from "../assets/cacao2.avif";
import fruits from "../assets/3.avif";
import epices from "../assets/epices.png";
import api from "../assets/api.png";
// Images importées du code original
// const back = '../assets/2.avif';
// const ananas = '../assets/ananas.avif';
// const piment = '../assets/piment.avif';
// const miel = '../assets/miel1.avif';
// const cacao = '../assets/cacao2.avif';
// const fruits = '../assets/3.avif';
// const epices = '../assets/epices.png';
// const api = '../assets/api.png';

// Simulation d'une base de données avec vos images originales
const DATABASE = {
  products: [
    {
      id: 1,
      name: "Jus d'Ananas Bio",
      price: "2500 FCFA",
      rating: 4.8,
      image: ananas,
      company: "Fruits du Pays",
      companyId: 1,
      region: "Littoral",
      category: "Boissons",
      featured: true,
      keywords: ["jus", "ananas", "bio", "fruits", "boisson", "naturel"],
    },
    {
      id: 2,
      name: "Poudre de Piment Rouge",
      price: "1200 FCFA",
      rating: 4.5,
      image: piment,
      company: "Épices du Cameroun",
      companyId: 2,
      region: "Ouest",
      category: "Épices",
      keywords: ["piment", "épices", "rouge", "condiment", "cuisine"],
    },
    {
      id: 3,
      name: "Miel de Fleurs Sauvages",
      price: "3500 FCFA",
      rating: 5.0,
      image: miel,
      company: "Apiculture Durable",
      companyId: 3,
      region: "Adamaoua",
      category: "Miel",
      featured: true,
      keywords: ["miel", "fleurs", "sauvage", "naturel", "sucrant"],
    },
    {
      id: 4,
      name: "Cacao en Poudre Premium",
      price: "1800 FCFA",
      rating: 4.7,
      image: cacao,
      company: "Cacao Excellence",
      companyId: 4,
      region: "Centre",
      category: "Cacao & Café",
      keywords: ["cacao", "poudre", "chocolat", "premium", "café"],
    },
    {
      id: 5,
      name: "Café Arabica des Montagnes",
      price: "4200 FCFA",
      rating: 4.9,
      image: cacao,
      company: "Café des Hauts Plateaux",
      companyId: 5,
      region: "Ouest",
      category: "Cacao & Café",
      keywords: ["café", "arabica", "montagne", "grain", "torréfié"],
    },
    {
      id: 6,
      name: "Huile de Palme Rouge Bio",
      price: "2800 FCFA",
      rating: 4.6,
      image: fruits,
      company: "Palmeraie Durable",
      companyId: 6,
      region: "Littoral",
      category: "Huiles",
      keywords: ["huile", "palme", "rouge", "bio", "cuisine"],
    },
    {
      id: 7,
      name: "Plantain Chips Épicés",
      price: "800 FCFA",
      rating: 4.3,
      image: ananas,
      company: "Snacks Tropicaux",
      companyId: 7,
      region: "Centre",
      category: "Fruits",
      keywords: ["plantain", "chips", "épicé", "snack", "croustillant"],
    },
    {
      id: 8,
      name: "Gingembre en Poudre",
      price: "1500 FCFA",
      rating: 4.4,
      image: piment,
      company: "Épices du Cameroun",
      companyId: 2,
      region: "Ouest",
      category: "Épices",
      keywords: ["gingembre", "poudre", "épices", "santé", "digestif"],
    },
  ],
  companies: [
    {
      id: 1,
      name: "Fruits du Pays",
      logo: fruits,
      products: 12,
      region: "Littoral",
      new: true,
      keywords: ["fruits", "jus", "bio", "naturel"],
    },
    {
      id: 2,
      name: "Épices du Cameroun",
      logo: epices,
      products: 8,
      region: "Ouest",
      keywords: ["épices", "condiments", "piment", "gingembre"],
    },
    {
      id: 3,
      name: "Apiculture Durable",
      logo: api,
      products: 5,
      region: "Adamaoua",
      new: true,
      keywords: ["miel", "apiculture", "abeilles", "naturel"],
    },
    {
      id: 4,
      name: "Cacao Excellence",
      logo: cacao,
      products: 6,
      region: "Centre",
      keywords: ["cacao", "chocolat", "premium"],
    },
    {
      id: 5,
      name: "Café des Hauts Plateaux",
      logo: cacao,
      products: 4,
      region: "Ouest",
      new: true,
      keywords: ["café", "arabica", "montagne", "torréfaction"],
    },
    {
      id: 6,
      name: "Palmeraie Durable",
      logo: fruits,
      products: 3,
      region: "Littoral",
      keywords: ["huile", "palme", "bio", "durable"],
    },
    {
      id: 7,
      name: "Snacks Tropicaux",
      logo: ananas,
      products: 7,
      region: "Centre",
      keywords: ["snacks", "plantain", "chips", "tropical"],
    },
  ],
  categories: [
    { name: "Boissons", icon: "🥤", count: 45 },
    { name: "Épices", icon: "🌶️", count: 32 },
    { name: "Céréales", icon: "🌾", count: 28 },
    { name: "Miel", icon: "🍯", count: 15 },
    { name: "Fruits", icon: "🍍", count: 37 },
    { name: "Cacao & Café", icon: "☕", count: 22 },
    { name: "Huiles", icon: "🫒", count: 18 },
  ],
};

// Hook personnalisé pour la recherche
const useSearch = (data, searchTerm, searchFields) => {
  return useMemo(() => {
    if (!searchTerm.trim()) return data;

    const term = searchTerm.toLowerCase();
    return data.filter((item) => {
      return searchFields.some((field) => {
        const value = item[field];
        if (Array.isArray(value)) {
          return value.some((keyword) => keyword.toLowerCase().includes(term));
        }
        return value && value.toString().toLowerCase().includes(term);
      });
    });
  }, [data, searchTerm, searchFields]);
};

// Composant réutilisable pour les cartes de produits
const ProductCard = ({ product, onClick }) => (
  <div
    onClick={() => onClick && onClick(product)}
    className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1"
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
  </div>
);

// Composant réutilisable pour les cartes d'entreprise
const CompanyCard = ({ company, onClick }) => (
  <div
    onClick={() => onClick && onClick(company)}
    className="bg-white rounded-xl shadow p-6 flex items-center hover:shadow-md transition-all cursor-pointer transform hover:scale-102"
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
  </div>
);

// Composant pour les résultats de recherche
const SearchResults = ({ searchTerm, products, companies, onClose }) => {
  const searchedProducts = useSearch(products, searchTerm, [
    "name",
    "company",
    "category",
    "region",
    "keywords",
  ]);
  const searchedCompanies = useSearch(companies, searchTerm, [
    "name",
    "region",
    "keywords",
  ]);

  if (!searchTerm.trim()) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-96 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">
            Résultats pour "{searchTerm}" (
            {searchedProducts.length + searchedCompanies.length} résultats)
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-80">
          {searchedProducts.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium mb-3 text-green-700">
                Produits ({searchedProducts.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchedProducts.slice(0, 4).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="ml-3">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        {product.company} - {product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchedCompanies.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 text-green-700">
                Entreprises ({searchedCompanies.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchedCompanies.slice(0, 4).map((company) => (
                  <div
                    key={company.id}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                    <div className="ml-3">
                      <p className="font-medium">{company.name}</p>
                      <p className="text-sm text-gray-600">
                        {company.products} produits - {company.region}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchedProducts.length === 0 && searchedCompanies.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun résultat trouvé pour "{searchTerm}"</p>
              <p className="text-sm mt-2">Essayez avec d'autres mots-clés</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Accueil() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  // Données filtrées
  const filteredProducts = useMemo(() => {
    let products = DATABASE.products;

    if (selectedCategory) {
      products = products.filter((p) => p.category === selectedCategory);
    }

    if (selectedRegion) {
      products = products.filter((p) => p.region === selectedRegion);
    }

    return products;
  }, [selectedCategory, selectedRegion]);

  const featuredProducts = filteredProducts
    .filter((p) => p.featured)
    .slice(0, 4);
  const popularProducts = filteredProducts.slice(0, 4);

  // Gestion de la recherche
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowResults(true);
    }
  };

  const handleSearchInput = (value) => {
    setSearchTerm(value);
    if (value.trim() && value.length > 2) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const regions = [...new Set(DATABASE.products.map((p) => p.region))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-green-800 text-white h-96 overflow-hidden">
        <img
          src={back}
          alt="Produits camerounais"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-center">
            Découvrez le Meilleur du Made in Cameroun
          </h1>
          <p className="text-lg md:text-xl mb-6 text-center max-w-2xl">
            La plateforme de référence pour les produits agroalimentaires de
            qualité fabriqués au Cameroun
          </p>

          {/* Barre de recherche principale */}
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
              placeholder="Rechercher un produit, une entreprise..."
              className="w-full p-4 rounded-xl pl-12 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
            />
            <Search className="absolute left-4 top-4 text-gray-500" size={20} />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
            >
              Rechercher
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <section className="bg-white py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center">
              <Filter className="h-5 w-5 mr-2 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Filtrer par:
              </span>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Toutes les catégories</option>
              {DATABASE.categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Toutes les régions</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>

            {(selectedCategory || selectedRegion) && (
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setSelectedRegion("");
                }}
                className="text-sm text-red-600 hover:text-red-800 flex items-center"
              >
                <X className="h-4 w-4 mr-1" />
                Effacer les filtres
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Catégories populaires */}
      <section className="container mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Explorez par catégorie
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
          {DATABASE.categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category.name)}
              className={`bg-white rounded-xl shadow hover:shadow-md transition-all p-4 flex flex-col items-center justify-center ${
                selectedCategory === category.name
                  ? "bg-green-50 border-2 border-green-500"
                  : "hover:bg-green-50"
              }`}
            >
              <span className="text-3xl mb-2">{category.icon}</span>
              <h3 className="font-medium text-center text-sm">
                {category.name}
              </h3>
              <p className="text-gray-500 text-xs">{category.count} produits</p>
            </button>
          ))}
        </div>
      </section>

      {/* Produits en vedette */}
      {featuredProducts.length > 0 && (
        <section className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">
                Produits en vedette
              </h2>
              <Link
                to="/produits"
                className="text-green-700 font-medium flex items-center hover:text-green-800"
              >
                Voir tous <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Produits populaires */}
      <section className="container mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">
            {selectedCategory || selectedRegion
              ? "Produits filtrés"
              : "Produits les plus consultés"}
          </h2>
          <Link
            to="/produits"
            className="text-green-700 font-medium flex items-center hover:text-green-800"
          >
            Voir tous <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Nouvelles entreprises */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              Nouvelles entreprises inscrites
            </h2>
            <Link to="/entreprises">
            <button className="text-green-700 font-medium flex items-center hover:text-green-800">
              Voir toutes <ArrowRight className="ml-1 h-4 w-4" />
            </button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DATABASE.companies
              .filter((c) => c.new)
              .map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
          </div>
        </div>
      </section>

      {/* Appel à l'action */}
      <section className="bg-yellow-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Vous êtes une entreprise agroalimentaire camerounaise ?
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Rejoignez notre plateforme pour augmenter votre visibilité et
            développer votre réseau commercial.
          </p>
          <button className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg font-medium shadow-md transition-colors">
            Inscrire mon entreprise
          </button>
        </div>
      </section>

      {/* Résultats de recherche */}
      {showResults && (
        <SearchResults
          searchTerm={searchTerm}
          products={DATABASE.products}
          companies={DATABASE.companies}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
