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
import Api from "../Services/Api";

// Hook personnalisé pour la recherche
const useSearch = (data, searchTerm, searchFields) => {
  return useMemo(() => {
    if (!Array.isArray(data) || !searchTerm.trim()) return data || [];

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
  <Link to={`/entreprises/${company.id}`}>

  <div
    onClick={() => onClick && onClick(company)}
    className="bg-white rounded-xl shadow p-6 flex items-center hover:shadow-md transition-all cursor-pointer transform hover:scale-102"
  >
    <div className="relative">
      {/* Avatar par défaut si pas de logo */}
      <div className="w-16 h-16 bg-green-100 rounded-full border-2 border-green-200 flex items-center justify-center">
        {company.logo ? (
          <img
            src={company.logo}
            alt={company.nom_entreprise}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span className="text-green-700 font-bold text-xl">
            {company.nom_entreprise?.charAt(0)?.toUpperCase() || "E"}
          </span>
        )}
      </div>
      {/* Badge "Nouveau" pour les 3 dernières entreprises */}
      <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold px-1 rounded-full">
        Nouveau
      </div>
    </div>
    <div className="ml-4">
      <h3 className="font-medium text-lg">{company.nom_entreprise}</h3>
      <p className="text-sm text-gray-600">
        {company.nb_produits || 0} produit{(company.nb_produits || 0) > 1 ? 's' : ''}
      </p>
      <div className="flex items-center text-gray-500 mt-1">
        <MapPin className="h-4 w-4 mr-1" />
        <span className="text-xs">{company.ville || company.region || "Cameroun"}</span>
      </div>
    </div>
  </div>
  </Link>
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
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [products, setProducts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState({
    categories: true,
    regions: true,
    products: true,
    companies: true,
  });
  const [error, setError] = useState({
    categories: null,
    regions: null,
    products: null,
    companies: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      // Récupération des catégories
      try {
        const categoriesResponse = await Api.get("/api/categories");
        setCategories(Array.isArray(categoriesResponse.data) ? categoriesResponse.data : []);
        setLoading((prev) => ({ ...prev, categories: false }));
      } catch (err) {
        setError((prev) => ({ ...prev, categories: err }));
        setLoading((prev) => ({ ...prev, categories: false }));
        setCategories([]);
        console.error("Erreur catégories:", err);
      }

      // Récupération des régions
      try {
        const regionsResponse = await Api.get("/api/regions");
        console.log("Régions reçues:", regionsResponse.data);
        
        // Gestion de la structure de réponse {success: true, data: [...]}
        let regionsData = [];
        if (regionsResponse.data && regionsResponse.data.data && Array.isArray(regionsResponse.data.data)) {
          // Si la réponse a la structure {success: true, data: [...]}
          regionsData = regionsResponse.data.data.map((region, index) => ({
            id: index + 1,
            nom: region
          }));
        } else if (Array.isArray(regionsResponse.data)) {
          // Si la réponse est directement un tableau
          regionsData = regionsResponse.data.map((region, index) => ({
            id: index + 1,
            nom: typeof region === 'string' ? region : region.nom
          }));
        }
        
        setRegions(regionsData);
        setLoading((prev) => ({ ...prev, regions: false }));
      } catch (err) {
        console.error("Détails de l'erreur régions:", err.response);
        setError((prev) => ({ ...prev, regions: err }));
        setLoading((prev) => ({ ...prev, regions: false }));
        setRegions([]);
      }

      // Récupération des produits
      try {
        const productsResponse = await Api.get("/api/public/produits");
        setProducts(Array.isArray(productsResponse.data) ? productsResponse.data : []);
        setLoading((prev) => ({ ...prev, products: false }));
      } catch (err) {
        setError((prev) => ({ ...prev, products: err }));
        setLoading((prev) => ({ ...prev, products: false }));
        setProducts([]);
        console.error("Erreur produits:", err);
      }

      // Récupération des entreprises
      try {
        const companiesResponse = await Api.get("/api/entreprises");
        console.log("Entreprises reçues:", companiesResponse.data);
        
        // Gestion de la structure de réponse avec success
        let companiesData = [];
        if (companiesResponse.data && companiesResponse.data.data && Array.isArray(companiesResponse.data.data)) {
          companiesData = companiesResponse.data.data;
        } else if (Array.isArray(companiesResponse.data)) {
          companiesData = companiesResponse.data;
        }
        
        setCompanies(companiesData);
        setLoading((prev) => ({ ...prev, companies: false }));
      } catch (err) {
        setError((prev) => ({ ...prev, companies: err }));
        setLoading((prev) => ({ ...prev, companies: false }));
        setCompanies([]);
        console.error("Erreur entreprises:", err);
      }
    };

    fetchData();
  }, []);

  // Données filtrées
  const filteredProducts = useMemo(() => {
    if (loading.products || !Array.isArray(products)) return [];

    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (selectedRegion) {
      filtered = filtered.filter((p) => p.region === selectedRegion);
    }

    return filtered;
  }, [products, selectedCategory, selectedRegion, loading.products]);

  const featuredProducts = useMemo(
    () => Array.isArray(filteredProducts) ? filteredProducts.filter((p) => p.featured).slice(0, 4) : [],
    [filteredProducts]
  );

  const popularProducts = useMemo(
    () => Array.isArray(filteredProducts) ? filteredProducts.slice(0, 4) : [],
    [filteredProducts]
  );

  const newCompanies = useMemo(() => {
    if (!Array.isArray(companies) || companies.length === 0) return [];
    
    // Trier les entreprises par ID décroissant pour avoir les plus récentes
    // puis prendre les 3 premières
    return companies
      .sort((a, b) => b.id - a.id)
      .slice(0, 3);
  }, [companies]);

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
              disabled={loading.categories}
            >
              <option value="">Toutes les catégories</option>
              {Array.isArray(categories) && categories.map((cat) => (
                <option key={cat.id} value={cat.nom}>
                  {cat.nom}
                </option>
              ))}
            </select>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading.regions}
            >
              <option value="">Toutes les régions</option>
              {Array.isArray(regions) && regions.map((region) => (
                <option key={region.id} value={region.nom}>
                  {region.nom}
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
        {loading.categories ? (
          <div className="text-center py-8">Chargement des catégories...</div>
        ) : error.categories ? (
          <div className="text-center text-red-500 py-8">
            Erreur lors du chargement des catégories
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
            {Array.isArray(categories) && categories.slice(0, 7).map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.nom)}
                className={`bg-white rounded-xl shadow hover:shadow-md transition-all p-4 flex flex-col items-center justify-center ${
                  selectedCategory === category.nom
                    ? "bg-green-50 border-2 border-green-500"
                    : "hover:bg-green-50"
                }`}
              >
                <span className="text-3xl mb-2">🛒</span>
                <h3 className="font-medium text-center text-sm">
                  {category.nom}
                </h3>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Produits en vedette */}
      {loading.products ? (
        <section className="bg-white py-12">
          <div className="container mx-auto px-4 text-center py-8">
            Chargement des produits...
          </div>
        </section>
      ) : error.products ? (
        <section className="bg-white py-12">
          <div className="container mx-auto px-4 text-center text-red-500 py-8">
            Erreur lors du chargement des produits
          </div>
        </section>
      ) : featuredProducts.length > 0 ? (
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
      ) : null}

      {/* Produits populaires */}
      <section className="container mx-auto py-12 px-4">
        {loading.products ? (
          <div className="text-center py-8">Chargement des produits...</div>
        ) : error.products ? (
          <div className="text-center text-red-500 py-8">
            Erreur lors du chargement des produits
          </div>
        ) : (
          <>
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
          </>
        )}
      </section>

      {/* Nouvelles entreprises */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          {loading.companies ? (
            <div className="text-center py-8">
              Chargement des entreprises...
            </div>
          ) : error.companies ? (
            <div className="text-center text-red-500 py-8">
              Erreur lors du chargement des entreprises
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">
                  Dernières entreprises inscrites
                </h2>
                <Link to="/entreprises">
                  <button className="text-green-700 font-medium flex items-center hover:text-green-800">
                    Voir toutes <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {newCompanies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
              {newCompanies.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Aucune entreprise inscrite récemment</p>
                </div>
              )}
            </>
          )}
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
          products={products}
          companies={companies}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}