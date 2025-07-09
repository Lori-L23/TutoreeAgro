import React, { useState } from 'react';
import { Search, Filter, Star, MapPin, ArrowDownUp, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ananas from '../assets/ananas.avif';
import piment from '../assets/piment.avif';
import miel from '../assets/miel1.avif';
import cacao from '../assets/cacao2.avif';
import tomate from '../assets/tomate.avif';
import palme from '../assets/palme.jpg';
import manioc from '../assets/manioc.avif';
import cafe from '../assets/cafe.avif';

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
        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          Nouveau
        </div>
      )}
    </div>
    <div className="p-4">
      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-2">
        {product.category}
      </span>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{product.name}</h3>
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

const FilterSection = ({ title, icon, children }) => (
  <div className="mb-6">
    <div className="flex items-center mb-3">
      {icon && React.cloneElement(icon, { className: "h-4 w-4 mr-2 text-green-700" })}
      <h3 className="font-medium text-gray-800">{title}</h3>
    </div>
    <div className="space-y-2">
      {children}
    </div>
  </div>
);

export default function Produits() {
  const [activeFilters, setActiveFilters] = useState([]);
  const [priceRange, setPriceRange] = useState([500, 10000]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Données factices pour la démo
  const allProducts = [
    { 
      id: 1, 
      name: "Jus d'Ananas Bio", 
      price: "2500 FCFA", 
      rating: 4.8, 
      image: ananas, 
      company: "Fruits du Pays", 
      region: "Littoral", 
      category: "Boissons",
      featured: true
    },
    { 
      id: 2, 
      name: "Poudre de Piment", 
      price: "1200 FCFA", 
      rating: 4.5, 
      image: piment, 
      company: "Épices du Cameroun", 
      region: "Ouest", 
      category: "Épices" 
    },
    { 
      id: 3, 
      name: "Miel de Fleurs", 
      price: "3500 FCFA", 
      rating: 5.0, 
      image: miel, 
      company: "Apiculture Durable", 
      region: "Adamaoua", 
      category: "Miel",
      featured: true
    },
    { 
      id: 4, 
      name: "Cacao en Poudre", 
      price: "1800 FCFA", 
      rating: 4.7, 
      image: cacao, 
      company: "Cacao Excellence", 
      region: "Centre", 
      category: "Cacao & Café" 
    },
    { 
      id: 5, 
      name: "Sauce Tomate Épicée", 
      price: "1500 FCFA", 
      rating: 4.3, 
      image: tomate, 
      company: "Saveurs du Cameroun", 
      region: "Centre", 
      category: "Sauces" 
    },
    { 
      id: 6, 
      name: "Farine de Manioc", 
      price: "2200 FCFA", 
      rating: 4.6, 
      image: manioc, 
      company: "Céréales du Sud", 
      region: "Sud", 
      category: "Céréales" 
    },
    { 
      id: 7, 
      name: "Huile de Palme Bio", 
      price: "3000 FCFA", 
      rating: 4.9, 
      image: palme, 
      company: "Huiles Naturelles", 
      region: "Littoral", 
      category: "Huiles",
      featured: true
    },
    { 
      id: 8, 
      name: "Café Moulu Arabica", 
      price: "2800 FCFA", 
      rating: 4.8, 
      image: cafe, 
      company: "Café des Montagnes", 
      region: "Ouest", 
      category: "Cacao & Café" 
    },
  ];

  // Filtrer les produits en fonction de la recherche
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilters = activeFilters.length === 0 || 
      activeFilters.some(filter => 
        product.category.includes(filter.replace('region-', '').replace('cert-', '')) ||
        product.region.includes(filter.replace('region-', '').replace('cert-', '')));

    return matchesSearch && matchesFilters;
  });

  const categories = [
    { name: "Boissons", count: 45 },
    { name: "Épices", count: 32 },
    { name: "Céréales", count: 28 },
    { name: "Miel", count: 15 },
    { name: "Huiles", count: 12 },
    { name: "Sauces", count: 24 },
    { name: "Cacao & Café", count: 22 },
  ];

  const regions = [
    { name: "Centre", count: 38 },
    { name: "Littoral", count: 45 },
    { name: "Ouest", count: 29 },
    { name: "Sud", count: 18 },
    { name: "Adamaoua", count: 12 },
    { name: "Est", count: 8 },
    { name: "Nord", count: 6 },
  ];

  const certifications = [
    { name: "Bio", count: 28 },
    { name: "HACCP", count: 42 },
    { name: "Sans conservateurs", count: 35 },
  ];

  const toggleFilter = (filter) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const handlePriceChange = (e, index) => {
    const newPriceRange = [...priceRange];
    newPriceRange[index] = parseInt(e.target.value);
    setPriceRange(newPriceRange);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // La recherche est déjà gérée par le state searchQuery
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-green-700 to-green-600 text-white py-12 md:py-16"
      >
        <div className="container mx-auto px-4 mt-20">
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Catalogue des Produits Made in Cameroun
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl max-w-2xl"
          >
            Découvrez notre sélection de produits agroalimentaires camerounais de qualité.
          </motion.p>
          
          {/* Barre de recherche améliorée */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="relative max-w-xl mt-6"
          >
            <div className="relative">
              <input 
                type="text" 
                placeholder="Rechercher un produit, une marque ou une catégorie..." 
                className="w-full p-4 rounded-xl pl-12 text-gray-800 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm pr-32" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-4 text-gray-500" size={20} />
              <div className="absolute right-2 top-2 flex">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={18} />
                  </button>
                )}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium ml-2"
                >
                  Rechercher
                </motion.button>
              </div>
            </div>
            {searchQuery && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200"
              >
                {filteredProducts.slice(0, 3).map(product => (
                  <div 
                    key={product.id}
                    className="p-3  hover:bg-gray-50 cursor-pointer flex items-center"
                    onClick={() => {
                      setSearchQuery(product.name);
                      // Vous pourriez ajouter une navigation vers le produit ici
                        navigate(`/produit/${product.id}`);
                    }}
                  >
                    <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded mr-3 " />
                    <div>
                      <p className="font-medium text-gray-700">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.company}</p>
                    </div>
                  </div>
                ))}
                {filteredProducts.length > 3 && (
                  <div className="p-3 text-sm text-center text-gray-500 border-t">
                    {filteredProducts.length - 3} autres résultats...
                  </div>
                )}
                {filteredProducts.length === 0 && (
                  <div className="p-3 text-sm text-center text-gray-500">
                    Aucun résultat trouvé
                  </div>
                )}
              </motion.div>
            )}
          </motion.form>
        </div>
      </motion.div>

      {/* Bouton filtre mobile */}
      <div className="md:hidden container mx-auto px-4 py-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center bg-white px-4 py-2 rounded-lg shadow text-sm font-medium"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </motion.button>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar des filtres - Mobile */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween' }}
                className="fixed inset-0 z-50 md:hidden"
              >
                <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMobileFiltersOpen(false)} />
                <div className="relative h-full w-4/5 max-w-sm bg-white overflow-y-auto">
                  <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                    <h2 className="font-bold text-lg">Filtres</h2>
                    <button onClick={() => setMobileFiltersOpen(false)}>
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <FilterSection title="Catégories" icon={<Filter />}>
                      {categories.map((category, index) => (
                        <div key={index} className="flex items-center">
                          <input 
                            type="checkbox"
                            id={`cat-mobile-${index}`}
                            className="mr-2 rounded text-green-600 focus:ring-green-500"
                            onChange={() => toggleFilter(category.name)}
                            checked={activeFilters.includes(category.name)}
                          />
                          <label htmlFor={`cat-mobile-${index}`} className="text-sm flex justify-between w-full">
                            <span>{category.name}</span>
                            <span className="text-gray-500">({category.count})</span>
                          </label>
                        </div>
                      ))}
                    </FilterSection>

                    <FilterSection title="Régions" icon={<MapPin />}>
                      {regions.map((region, index) => (
                        <div key={index} className="flex items-center">
                          <input 
                            type="checkbox"
                            id={`reg-mobile-${index}`}
                            className="mr-2 rounded text-green-600 focus:ring-green-500"
                            onChange={() => toggleFilter(`region-${region.name}`)}
                            checked={activeFilters.includes(`region-${region.name}`)}
                          />
                          <label htmlFor={`reg-mobile-${index}`} className="text-sm flex justify-between w-full">
                            <span>{region.name}</span>
                            <span className="text-gray-500">({region.count})</span>
                          </label>
                        </div>
                      ))}
                    </FilterSection>

                    <FilterSection title="Certifications">
                      {certifications.map((cert, index) => (
                        <div key={index} className="flex items-center">
                          <input 
                            type="checkbox"
                            id={`cert-mobile-${index}`}
                            className="mr-2 rounded text-green-600 focus:ring-green-500"
                            onChange={() => toggleFilter(`cert-${cert.name}`)}
                            checked={activeFilters.includes(`cert-${cert.name}`)}
                          />
                          <label htmlFor={`cert-mobile-${index}`} className="text-sm flex justify-between w-full">
                            <span>{cert.name}</span>
                            <span className="text-gray-500">({cert.count})</span>
                          </label>
                        </div>
                      ))}
                    </FilterSection>

                    <FilterSection title="Prix">
                      <div className="flex flex-col space-y-4">
                        <div className="flex justify-between">
                          <input
                            type="number"
                            min="500"
                            max="10000"
                            value={priceRange[0]}
                            onChange={(e) => handlePriceChange(e, 0)}
                            className="w-24 p-2 border rounded text-sm"
                          />
                          <span className="self-center">à</span>
                          <input
                            type="number"
                            min="500"
                            max="10000"
                            value={priceRange[1]}
                            onChange={(e) => handlePriceChange(e, 1)}
                            className="w-24 p-2 border rounded text-sm"
                          />
                        </div>
                        <input 
                          type="range" 
                          min="500" 
                          max="10000" 
                          step="500" 
                          value={priceRange[0]}
                          onChange={(e) => handlePriceChange(e, 0)}
                          className="w-full"
                        />
                        <input 
                          type="range" 
                          min="500" 
                          max="10000" 
                          step="500" 
                          value={priceRange[1]}
                          onChange={(e) => handlePriceChange(e, 1)}
                          className="w-full"
                        />
                      </div>
                    </FilterSection>

                    <div className="mt-6">
                      <button 
                        className="w-full bg-green-600 text-white py-2 rounded-lg font-medium"
                        onClick={() => setMobileFiltersOpen(false)}
                      >
                        Appliquer les filtres
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sidebar des filtres - Desktop */}
          <div className="hidden md:block w-64 bg-white rounded-xl shadow p-4 h-fit sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Filtres</h2>
              <Filter className="h-5 w-5 text-green-700" />
            </div>
            
            <FilterSection title="Catégories" icon={<Filter />}>
              {categories.map((category, index) => (
                <div key={index} className="flex items-center">
                  <input 
                    type="checkbox"
                    id={`cat-${index}`}
                    className="mr-2 rounded text-green-600 focus:ring-green-500"
                    onChange={() => toggleFilter(category.name)}
                    checked={activeFilters.includes(category.name)}
                  />
                  <label htmlFor={`cat-${index}`} className="text-sm flex justify-between w-full">
                    <span>{category.name}</span>
                    <span className="text-gray-500">({category.count})</span>
                  </label>
                </div>
              ))}
            </FilterSection>
            
            <FilterSection title="Régions" icon={<MapPin />}>
              {regions.map((region, index) => (
                <div key={index} className="flex items-center">
                  <input 
                    type="checkbox"
                    id={`reg-${index}`}
                    className="mr-2 rounded text-green-600 focus:ring-green-500"
                    onChange={() => toggleFilter(`region-${region.name}`)}
                    checked={activeFilters.includes(`region-${region.name}`)}
                  />
                  <label htmlFor={`reg-${index}`} className="text-sm flex justify-between w-full">
                    <span>{region.name}</span>
                    <span className="text-gray-500">({region.count})</span>
                  </label>
                </div>
              ))}
            </FilterSection>
            
            <FilterSection title="Certifications">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center">
                  <input 
                    type="checkbox"
                    id={`cert-${index}`}
                    className="mr-2 rounded text-green-600 focus:ring-green-500"
                    onChange={() => toggleFilter(`cert-${cert.name}`)}
                    checked={activeFilters.includes(`cert-${cert.name}`)}
                  />
                  <label htmlFor={`cert-${index}`} className="text-sm flex justify-between w-full">
                    <span>{cert.name}</span>
                    <span className="text-gray-500">({cert.count})</span>
                  </label>
                </div>
              ))}
            </FilterSection>
            
            <FilterSection title="Prix">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between">
                  <input
                    type="number"
                    min="500"
                    max="10000"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(e, 0)}
                    className="w-24 p-2 border rounded text-sm"
                  />
                  <span className="self-center">à</span>
                  <input
                    type="number"
                    min="500"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(e, 1)}
                    className="w-24 p-2 border rounded text-sm"
                  />
                </div>
                <input 
                  type="range" 
                  min="500" 
                  max="10000" 
                  step="500" 
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  className="w-full"
                />
                <input 
                  type="range" 
                  min="500" 
                  max="10000" 
                  step="500" 
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                  className="w-full"
                />
              </div>
            </FilterSection>
          </div>
          
          {/* Liste des produits */}
          <div className="flex-1">
            {/* Barre de tri et filtres actifs */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow p-4 mb-6"
            >
              <div className="flex flex-wrap justify-between items-center">
                <p className="text-sm text-gray-600">{filteredProducts.length} produits trouvés</p>
                <div className="flex items-center">
                  <span className="mr-2 text-sm text-gray-600">Trier par:</span>
                  <div className="relative">
                    <select className="appearance-none p-2 pr-8 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option>Popularité</option>
                      <option>Prix croissant</option>
                      <option>Prix décroissant</option>
                      <option>Nouveautés</option>
                    </select>
                    <ArrowDownUp className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              
              {/* Filtres actifs */}
              {activeFilters.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeFilters.map((filter, index) => (
                    <motion.span 
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full flex items-center"
                    >
                      {filter.replace('region-', '').replace('cert-', '')}
                      <button 
                        className="ml-1 hover:text-green-600"
                        onClick={() => toggleFilter(filter)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.span>
                  ))}
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    className="text-xs text-blue-600 hover:underline ml-2" 
                    onClick={() => setActiveFilters([])}
                  >
                    Effacer tous
                  </motion.button>
                </div>
              )}
            </motion.div>
            
            {/* Grille de produits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
            
            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-8 flex justify-center"
              >
                <nav className="inline-flex rounded-md shadow">
                  <button className="py-2 px-3 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 flex items-center">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button className="py-2 px-4 bg-green-700 text-white border border-green-700">1</button>
                  <button className="py-2 px-4 bg-white border border-gray-300 hover:bg-gray-50">2</button>
                  <button className="py-2 px-4 bg-white border border-gray-300 hover:bg-gray-50">3</button>
                  <button className="py-2 px-3 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 flex items-center">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </nav>
              </motion.div>
            )}
            
            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-gray-500 text-lg">Aucun produit ne correspond à votre recherche</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilters([]);
                  }}
                  className="mt-4 text-green-600 hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}