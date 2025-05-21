import React, { useState } from 'react';
import { Search, Filter, MapPin, Phone, Mail, BarChart2, List, Grid, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownUp } from 'lucide-react';
import fruits from '../assets/3.avif';
import epices from '../assets/epices.png';
import api from '../assets/api.png';
import cacao from '../assets/cacao1.jpg';
import saveur from '../assets/saveur.avif';
import cereales from '../assets/cereales.jpg';

// Composant réutilisable pour les cartes d'entreprise
const EnterpriseCard = ({ enterprise, viewMode }) => {
  if (viewMode === 'grid') {
    return (
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
      >
        <div className="h-32 bg-gray-100 relative">
          <img 
            src={enterprise.cover} 
            alt={`${enterprise.name} banner`} 
            className="w-full h-full object-cover"
          />
          <div className="absolute -bottom-10 left-4">
            <motion.img 
              whileHover={{ scale: 1.05 }}
              src={enterprise.logo} 
              alt={enterprise.name} 
              className="w-20 h-20 rounded-xl object-cover border-4 border-white shadow-md"
            />
          </div>
        </div>
        
        <div className="p-4 pt-12">
          <h3 className="font-bold text-lg mb-1">{enterprise.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{enterprise.category}</p>
          
          <div className="flex items-center mb-3">
            <MapPin className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-sm text-gray-600">{enterprise.city}, {enterprise.region}</span>
          </div>
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{enterprise.description}</p>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {enterprise.certifications.map((cert, idx) => (
              <motion.span 
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
              >
                {cert}
              </motion.span>
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{enterprise.products} produits</span>
            <motion.a 
              whileHover={{ x: 3 }}
              href="#" 
              className="text-green-700 hover:text-green-800 text-sm font-medium flex items-center"
            >
              Voir le profil <ChevronRight className="h-4 w-4 ml-1" />
            </motion.a>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all p-6 flex flex-col md:flex-row"
    >
      <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
        <motion.img 
          whileHover={{ scale: 1.05 }}
          src={enterprise.logo} 
          alt={enterprise.name} 
          className="w-24 h-24 rounded-xl object-cover shadow-sm"
        />
      </div>
      
      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div>
            <h3 className="font-bold text-lg">{enterprise.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{enterprise.category}</p>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-sm text-gray-600">{enterprise.city}, {enterprise.region}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 my-3 line-clamp-2">{enterprise.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {enterprise.certifications.map((cert, idx) => (
            <motion.span 
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
            >
              {cert}
            </motion.span>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col justify-between items-start md:items-end">
        <span className="text-sm font-medium mb-2 md:mb-0">{enterprise.products} produits</span>
        <motion.a 
          whileHover={{ x: 3 }}
          href="#" 
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
        >
          Voir le profil <ChevronRight className="h-4 w-4 ml-1" />
        </motion.a>
      </div>
    </motion.div>
  );
};

// Composant réutilisable pour les sections de filtre
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

export default function Entreprises() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [activeFilters, setActiveFilters] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Données factices pour la démo
  const enterprises = [
    { 
      id: 1, 
      name: "Fruits du Pays", 
      logo: fruits, 
      cover: fruits,
      description: "Spécialiste des jus de fruits naturels et confitures artisanales du Cameroun depuis 2010.",
      products: 12, 
      region: "Littoral", 
      city: "Douala",
      category: "Boissons et Conserves",
      certifications: ["Bio", "HACCP"],
      contact: {
        email: "contact@fruitsdupays.cm",
        phone: "+237 6XX XX XX XX",
      },
      featured: true
    },
    { 
      id: 2, 
      name: "Épices du Cameroun", 
      logo: epices, 
      cover: epices,
      description: "Production et commercialisation d'épices traditionnelles camerounaises cultivées de manière durable.",
      products: 8, 
      region: "Ouest", 
      city: "Bafoussam",
      category: "Épices et Condiments",
      certifications: ["Sans conservateurs"],
      contact: {
        email: "info@epicesducameroun.cm",
        phone: "+237 6XX XX XX XX",
      }
    },
    { 
      id: 3, 
      name: "Apiculture Durable", 
      logo: api, 
      cover: api,
      description: "Coopérative d'apiculteurs produisant du miel et produits dérivés selon des méthodes respectueuses de l'environnement.",
      products: 5, 
      region: "Adamaoua", 
      city: "Ngaoundéré",
      category: "Miel et Produits de la ruche",
      certifications: ["Bio", "Commerce équitable"],
      contact: {
        email: "cooperation@apidurable.cm",
        phone: "+237 6XX XX XX XX",
      },
      featured: true
    },
    { 
      id: 4, 
      name: "Cacao Excellence", 
      logo: cacao, 
      cover: cacao,
      description: "Transformation du cacao en poudre, chocolat et produits dérivés. Fournisseur privilégié des pâtissiers professionnels.",
      products: 10, 
      region: "Centre", 
      city: "Yaoundé",
      category: "Cacao & Chocolat",
      certifications: ["HACCP", "ISO 9001"],
      contact: {
        email: "commercial@cacaoexcellence.cm",
        phone: "+237 6XX XX XX XX",
      }
    },
    { 
      id: 5, 
      name: "Saveurs du Cameroun", 
      logo: saveur, 
      cover: saveur,
      description: "Production artisanale de sauces et condiments typiquement camerounais, inspirés des recettes traditionnelles.",
      products: 15, 
      region: "Centre", 
      city: "Yaoundé",
      category: "Sauces et Conserves",
      certifications: ["Sans conservateurs"],
      contact: {
        email: "hello@saveurscameroun.cm",
        phone: "+237 6XX XX XX XX",
      }
    },
    { 
      id: 6, 
      name: "Céréales du Sud", 
      logo: cereales, 
      cover: cereales,
      description: "Transformation des céréales locales en farines et produits dérivés. Spécialiste du manioc et du maïs.",
      products: 7, 
      region: "Sud", 
      city: "Ebolowa",
      category: "Céréales et Farines",
      certifications: ["HACCP"],
      contact: {
        email: "info@cerealesdusud.cm",
        phone: "+237 6XX XX XX XX",
      }
    },
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

  const categories = [
    { name: "Boissons", count: 22 },
    { name: "Épices et Condiments", count: 18 },
    { name: "Céréales et Farines", count: 15 },
    { name: "Miel et Produits de la ruche", count: 8 },
    { name: "Cacao & Chocolat", count: 12 },
    { name: "Sauces et Conserves", count: 14 },
    { name: "Huiles et Oléagineux", count: 10 },
  ];

  const certifications = [
    { name: "Bio", count: 28 },
    { name: "HACCP", count: 42 },
    { name: "Commerce équitable", count: 15 },
    { name: "Sans conservateurs", count: 35 },
  ];

  const toggleFilter = (filter) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
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
            Annuaire des Entreprises Agroalimentaires
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl max-w-2xl"
          >
            Découvrez les entreprises camerounaises qui valorisent les ressources locales et contribuent à l'économie nationale.
          </motion.p>
          
          {/* Barre de recherche */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="relative max-w-xl mt-6"
          >
            <input 
              type="text" 
              placeholder="Rechercher une entreprise..." 
              className="w-full p-4 rounded-xl pl-12 text-gray-800 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" 
            />
            <Search className="absolute left-4 top-4 text-gray-500" size={20} />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="absolute right-2 top-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Rechercher
            </motion.button>
          </motion.div>
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

                    <FilterSection title="Spécialités" icon={<Filter />}>
                      {categories.map((category, index) => (
                        <div key={index} className="flex items-center">
                          <input 
                            type="checkbox"
                            id={`cat-mobile-${index}`}
                            className="mr-2 rounded text-green-600 focus:ring-green-500"
                            onChange={() => toggleFilter(`cat-${category.name}`)}
                            checked={activeFilters.includes(`cat-${category.name}`)}
                          />
                          <label htmlFor={`cat-mobile-${index}`} className="text-sm flex justify-between w-full">
                            <span>{category.name}</span>
                            <span className="text-gray-500">({category.count})</span>
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
            
            <FilterSection title="Spécialités" icon={<Filter />}>
              {categories.map((category, index) => (
                <div key={index} className="flex items-center">
                  <input 
                    type="checkbox"
                    id={`cat-${index}`}
                    className="mr-2 rounded text-green-600 focus:ring-green-500"
                    onChange={() => toggleFilter(`cat-${category.name}`)}
                    checked={activeFilters.includes(`cat-${category.name}`)}
                  />
                  <label htmlFor={`cat-${index}`} className="text-sm flex justify-between w-full">
                    <span>{category.name}</span>
                    <span className="text-gray-500">({category.count})</span>
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
          </div>
          
          {/* Liste des entreprises */}
          <div className="flex-1">
            {/* Barre de tri et filtres actifs */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow p-4 mb-6"
            >
              <div className="flex flex-wrap justify-between items-center">
                <p className="text-sm text-gray-600">{enterprises.length} entreprises trouvées</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <span className="mr-2 text-sm text-gray-600">Trier par:</span>
                    <div className="relative">
                      <select className="appearance-none p-2 pr-8 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option>Alphabétique</option>
                        <option>Nombre de produits</option>
                        <option>Date d'inscription</option>
                      </select>
                      <ArrowDownUp className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid size={18} />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}
                      onClick={() => setViewMode('list')}
                    >
                      <List size={18} />
                    </motion.button>
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
                      {filter.replace('region-', '').replace('cat-', '').replace('cert-', '')}
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
            
            {/* Affichage des entreprises */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {enterprises.map((enterprise, index) => (
                  <motion.div
                    key={enterprise.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <EnterpriseCard enterprise={enterprise} viewMode={viewMode} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {enterprises.map((enterprise, index) => (
                  <motion.div
                    key={enterprise.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <EnterpriseCard enterprise={enterprise} viewMode={viewMode} />
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Pagination */}
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
          </div>
        </div>
      </div>
    </div>
  );
}