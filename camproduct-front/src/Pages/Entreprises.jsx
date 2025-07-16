import { useState, useMemo, useEffect } from "react";
import Api from "../Services/Api";
import {
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  BarChart2,
  List,
  Grid,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
  Loader,
} from "lucide-react";

// import entreprisesection from '../components/EntrepriseCard'

// Images par défaut depuis Unsplash
const DEFAULT_IMAGES = {
  fruits:
    "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop",
  epices:
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
  cacao:
    "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=300&fit=crop",
  cereales:
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
  miel: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=300&fit=crop",
  sauces:
    "https://images.unsplash.com/photo-1596909190503-90dc2c4aaa92?w=400&h=300&fit=crop",
  default:
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
};

// Composant pour gérer les images avec fallback
const ImageWithFallback = ({
  src,
  alt,
  className,
  fallbackKey = "default",
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
    setImgSrc(DEFAULT_IMAGES[fallbackKey] || DEFAULT_IMAGES.default);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <Loader className="h-6 w-6 text-gray-400 animate-spin" />
        </div>
      )}
      <img
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        className={`${className} ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
      />
      {hasError && (
        <div className="absolute bottom-1 right-1">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
        </div>
      )}
    </div>
  );
};

class EnterpriseService {
  static async fetchEnterprises(filters = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (filters.search) queryParams.append("search", filters.search);
      if (filters.region) queryParams.append("region", filters.region);
      if (filters.activitySector) queryParams.append("activity_sector", filters.activitySector);
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.sort) queryParams.append("sort", filters.sort);
      if (filters.page) queryParams.append("page", filters.page);

      const response = await Api.get(`/api/entreprise?${queryParams}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des entreprises:", error);
      throw error;
    }
  }

  static async fetchRegions() {
    try {
      const response = await Api.get(`/api/entreprise/regions`);
      if (response.data) {
        // Extraire les régions uniques depuis les entreprises
        return [...new Set(response.data.map(e => e.region))].map(region => ({
          name: region,
          count: response.data.filter(e => e.region === region).length
        }));
      }
      throw new Error("Erreur de format de réponse");
    } catch (error) {
      console.error("Erreur régions:", error);
      return [];
    }
  }

  static async fetchVilles() {
    try {
      const response = await Api.get(`/api/entreprise/villes`);
      if (response.data) {
        // Extraire les villes uniques depuis les entreprises
        return [...new Set(response.data.map(e => e.ville))].map(ville => ({
          name: ville,
          count: response.data.filter(e => e.ville === ville).length
        }));
      }
      throw new Error("Erreur de format de réponse");
    } catch (error) {
      console.error("Erreur villes:", error);
      return [];
    }
  }

  static async fetchActivitySectors() {
    try {
      const response = await Api.get(`/api/entreprises/activity-sectors`);
      if (response.data) {
        // Extraire les secteurs d'activité uniques
        return [...new Set(response.data.map(e => e.activity_sector))].map(sector => ({
          name: sector,
          count: response.data.filter(e => e.activity_sector === sector).length
        }));
      }
      throw new Error("Erreur de format de réponse");
    } catch (error) {
      console.error("Erreur secteurs d'activité:", error);
      return [];
    }
  }

  // Formatte les données d'entreprise pour correspondre à l'interface attendue
  static formatEnterpriseData(enterprise) {
    return {
      id: enterprise.id,
      name: enterprise.nom_entreprise,
      logo: enterprise.logo,
      cover: enterprise.logo, // Vous pourriez ajouter un champ cover séparé dans la table
      description: enterprise.description || "Aucune description disponible",
      products: 0, // À remplacer par le nombre réel de produits si disponible
      region: enterprise.region,
      ville: enterprise.ville,
      category: enterprise.activity_sector || "Non spécifié",
      certifications: [], // À remplir avec les certifications si disponibles
      contact: {
        email: "", // À remplir avec le contact si disponible
        phone: ""  // À remplir avec le contact si disponible
      },
      status: enterprise.status
    };
  }
  static async fetchCategories() {
    try {
      const response = await Api.get(`/api/entreprise/categories`);
      if (response.data) {
        return [...new Set(response.data.map(e => e.category))].map(category => ({
          name: category,
          count: response.data.filter(e => e.category === category).length
        }));
      }
      throw new Error("Erreur de format de réponse");
    } catch (error) {
      console.error("Erreur catégories:", error);
      return this.getDefaultCategories();
    }
  }

  static async fetchCertifications() {
    try {
      const response = await Api.get(`/api/entreprise/certifications`);
      if (response.data) {
        return response.data.map(cert => ({
          name: cert,
          count: response.data.filter(c => c === cert).length
        }));
      }
      throw new Error("Erreur de format de réponse");
    } catch (error) {
      console.error("Erreur certifications:", error);
      return this.getDefaultCertifications();
    }
  }

  // Méthodes de fallback (données par défaut)
  static getDefaultRegions() {
    return [
      { name: "Adamaoua", count: 12 },
      { name: "Centre", count: 45 },
      { name: "Est", count: 18 },
      { name: "Extrême-Nord", count: 22 },
      { name: "Littoral", count: 38 },
      { name: "Nord", count: 25 },
      { name: "Nord-Ouest", count: 30 },
      { name: "Ouest", count: 28 },
      { name: "Sud", count: 15 },
      { name: "Sud-Ouest", count: 20 }
    ];
  }

  static getDefaultCategories() {
    return [
      { name: "Boissons", count: 35 },
      { name: "Épices", count: 28 },
      { name: "Cacao", count: 42 },
      { name: "Céréales", count: 39 },
      { name: "Miel", count: 25 },
      { name: "Sauces", count: 18 }
    ];
  }

  static getDefaultCertifications() {
    return [
      { name: "Bio", count: 15 },
      { name: "Fairtrade", count: 8 },
      { name: "ISO 22000", count: 5 },
      { name: "HACCP", count: 12 }
    ];
  }

  static getDefaultEnterprises() {
    return [
      {
        id: 1,
        name: "Entreprise Agricole du Centre",
        logo: "",
        cover: "",
        description: "Producteur de cacao biologique",
        products: 12,
        region: "Centre",
        ville: "Yaoundé",
        category: "Cacao",
        certifications: ["Bio", "Fairtrade"],
        contact: {
          email: "contact@eac.com",
          phone: "+237 6 94 85 74 12"
        },
        status: "active"
      },
    ];

}
}

// Composant réutilisable pour les cartes d'entreprise
const EnterpriseCard = ({ enterprise, viewMode }) => {
  const getImageFallbackKey = (category) => {
    const categoryMap = {
      Boissons: "fruits",
      Épices: "epices",
      Cacao: "cacao",
      Céréales: "cereales",
      Miel: "miel",
      Sauces: "sauces",
    };

    for (const [key, fallback] of Object.entries(categoryMap)) {
      if (category.includes(key)) return fallback;
    }
    return "default";
  };

  if (viewMode === "grid") {
    return (
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
        <div className="h-32 bg-gray-100 relative overflow-hidden">
          <ImageWithFallback
            src={enterprise.cover || "/placeholder.svg"}
            alt={`${enterprise.name} banner`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            fallbackKey={getImageFallbackKey(enterprise.category)}
          />
          <div className="absolute -bottom-10 left-4">
            <ImageWithFallback
              src={enterprise.logo || "/placeholder.svg"}
              alt={enterprise.name}
              className="w-20 h-20 rounded-xl object-cover border-4 border-white shadow-md"
              fallbackKey={getImageFallbackKey(enterprise.category)}
            />
          </div>
        </div>

        <div className="p-4 pt-12">
          <h3 className="font-bold text-lg mb-1">{enterprise.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{enterprise.category}</p>

          <div className="flex items-center mb-3">
            <MapPin className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-sm text-gray-600">
              {enterprise.ville}, {enterprise.region}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {enterprise.description}
          </p>

          <div className="flex flex-wrap gap-1 mb-4">
            {enterprise.certifications.map((cert, idx) => (
              <span
                key={idx}
                className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full hover:bg-green-200 transition-colors"
              >
                {cert}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              {enterprise.products} produits
            </span>
            <a
              href={`#enterprise-${enterprise.id}`}
              className="text-green-700 hover:text-green-800 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform"
            >
              Voir le profil <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all p-6 flex flex-col md:flex-row group">
      <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
        <ImageWithFallback
          src={enterprise.logo || "/placeholder.svg"}
          alt={enterprise.name}
          className="w-24 h-24 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform"
          fallbackKey={getImageFallbackKey(enterprise.category)}
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
            <span className="text-sm text-gray-600">
              {enterprise.ville}, {enterprise.region}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 my-3 line-clamp-2">
          {enterprise.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {enterprise.certifications.map((cert, idx) => (
            <span
              key={idx}
              className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full hover:bg-green-200 transition-colors"
            >
              {cert}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-between items-start md:items-end">
        <span className="text-sm font-medium mb-2 md:mb-0">
          {enterprise.products} produits
        </span>
        <a
          href={`#enterprise-${enterprise.id}`}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center group-hover:translate-x-1 transition-all"
        >
          Voir le profil <ChevronRight className="h-4 w-4 ml-1" />
        </a>
      </div>
    </div>
  );
};

// Composant principal
export default function Entreprises() {
  const [viewMode, setViewMode] = useState("grid");
  const [activeFilters, setActiveFilters] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("alphabetic");
  const [currentPage, setCurrentPage] = useState(1);

  // États pour les données API
  const [enterprises, setEnterprises] = useState([]);
  const [regions, setRegions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  // Chargement initial des données
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [regionsData, categoriesData, certificationsData] =
          await Promise.all([
            EnterpriseService.fetchRegions(),
            EnterpriseService.fetchCategories(),
            EnterpriseService.fetchCertifications(),
            EnterpriseService.fetchVilles(), // Charger les villes si nécessaire
          ]);

        setRegions(regionsData);
        setCategories(categoriesData);
        setCertifications(certificationsData);

        // Charger les entreprises
        await loadEnterprises();
      } catch (err) {
        console.error("Erreur lors du chargement initial:", err);
        setError(
          "Erreur de connexion à l'API. Utilisation des données par défaut."
        );

        // Fallback aux données par défaut
        setRegions(EnterpriseService.getDefaultRegions());
        setCategories(EnterpriseService.getDefaultCategories());
        setCertifications(EnterpriseService.getDefaultCertifications());
        setEnterprises(EnterpriseService.getDefaultEnterprises());
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Fonction pour charger les entreprises avec filtres
  const loadEnterprises = async (filters = {}) => {
    try {
      const response = await EnterpriseService.fetchEnterprises({
        search: searchTerm,
        region: activeFilters
          .find((f) => f.startsWith("region-"))
          ?.replace("region-", ""),
        category: activeFilters
          .find((f) => f.startsWith("cat-"))
          ?.replace("cat-", ""),
        certification: activeFilters
          .find((f) => f.startsWith("cert-"))
          ?.replace("cert-", ""),
        sort: sortBy,
        page: currentPage,
        ...filters,
      });

      if (response.data) {
        setEnterprises(response.data);
        setTotalPages(response.last_page || 1);
      } else {
        setEnterprises(response);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des entreprises:", err);
      if (enterprises.length === 0) {
        setEnterprises(EnterpriseService.getDefaultEnterprises());
      }
    }
  };

  // Effet pour recharger les entreprises quand les filtres changent
  useEffect(() => {
    if (!loading) {
      const timeoutId = setTimeout(() => {
        loadEnterprises();
      }, 300); // Debounce de 300ms

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, activeFilters, sortBy, currentPage]);

  // Fonction de filtrage côté client (fallback)
  const filteredEnterprises = useMemo(() => {
    let filtered = enterprises;

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (enterprise) =>
          enterprise.name.toLowerCase().includes(searchLower) ||
          enterprise.description.toLowerCase().includes(searchLower) ||
          enterprise.category.toLowerCase().includes(searchLower) ||
          enterprise.ville.toLowerCase().includes(searchLower) ||
          enterprise.region.toLowerCase().includes(searchLower) ||
          enterprise.certifications.some((cert) =>
            cert.toLowerCase().includes(searchLower)
          )
      );
    }

    if (activeFilters.length > 0) {
      filtered = filtered.filter((enterprise) => {
        return activeFilters.every((filter) => {
          if (filter.startsWith("region-")) {
            return enterprise.region === filter.replace("region-", "");
          }
          if (filter.startsWith("cat-")) {
            return enterprise.category.includes(filter.replace("cat-", ""));
          }
          if (filter.startsWith("cert-")) {
            return enterprise.certifications.includes(
              filter.replace("cert-", "")
            );
          }
          return true;
        });
      });
    }

    switch (sortBy) {
      case "alphabetic":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "products":
        filtered.sort((a, b) => b.products - a.products);
        break;
      case "date":
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.id - a.id;
        });
        break;
    }

    return filtered;
  }, [enterprises, searchTerm, activeFilters, sortBy]);

  const toggleFilter = (filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const getImageFallbackKey = (category) => {
    const categoryMap = {
      Boissons: "fruits",
      Épices: "epices",
      Cacao: "cacao",
      Céréales: "cereales",
      Miel: "miel",
      Sauces: "sauces",
    };

    for (const [key, fallback] of Object.entries(categoryMap)) {
      if (category.includes(key)) return fallback;
    }
    return "default";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Chargement des entreprises...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Alerte d'erreur */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white py-12 md:py-16 ">
        <div className="container mx-auto px-4 mt-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Annuaire des Entreprises Agroalimentaires
          </h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Découvrez les entreprises camerounaises qui valorisent les
            ressources locales et contribuent à l'économie nationale.
          </p>

          {/* Barre de recherche */}
          <form onSubmit={handleSearch} className="relative max-w-xl mt-6">
            <input
              type="text"
              placeholder="Rechercher une entreprise, catégorie, ville..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 rounded-xl pl-12 pr-24 text-gray-800 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
            />
            <Search className="absolute left-4 top-4 text-gray-500" size={20} />

            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-16 top-4 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}

            <button
              type="submit"
              className="absolute right-2 top-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Rechercher
            </button>
          </form>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar des filtres - Desktop */}
          <div className="hidden md:block w-64 bg-white rounded-xl shadow p-4 h-fit sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Filtres</h2>
              <Filter className="h-5 w-5 text-green-700" />
            </div>

            {/* Bouton pour effacer tous les filtres */}
            {(activeFilters.length > 0 || searchTerm) && (
              <button
                onClick={clearAllFilters}
                className="w-full mb-4 px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors border border-red-200 flex items-center justify-center"
              >
                <X className="h-4 w-4 mr-1" />
                Effacer tout
              </button>
            )}

            {/* Filtres par région */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <MapPin className="h-4 w-4 mr-2 text-green-700" />
                <h3 className="font-medium text-gray-800">Régions</h3>
              </div>
              <div className="space-y-2">
                {regions.map((region, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`reg-${index}`}
                      className="mr-2 rounded text-green-600 focus:ring-green-500"
                      onChange={() => toggleFilter(`region-${region.name}`)}
                      checked={activeFilters.includes(`region-${region.name}`)}
                    />
                    <label
                      htmlFor={`reg-${index}`}
                      className="text-sm flex justify-between w-full cursor-pointer"
                    >
                      <span>{region.name}</span>
                      <span className="text-gray-500">({region.count})</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtres par catégorie */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <Filter className="h-4 w-4 mr-2 text-green-700" />
                <h3 className="font-medium text-gray-800">Spécialités</h3>
              </div>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`cat-${index}`}
                      className="mr-2 rounded text-green-600 focus:ring-green-500"
                      onChange={() => toggleFilter(`cat-${category.name}`)}
                      checked={activeFilters.includes(`cat-${category.name}`)}
                    />
                    <label
                      htmlFor={`cat-${index}`}
                      className="text-sm flex justify-between w-full cursor-pointer"
                    >
                      <span>{category.name}</span>
                      <span className="text-gray-500">({category.count})</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtres par certification */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">Certifications</h3>
              <div className="space-y-2">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`cert-${index}`}
                      className="mr-2 rounded text-green-600 focus:ring-green-500"
                      onChange={() => toggleFilter(`cert-${cert.name}`)}
                      checked={activeFilters.includes(`cert-${cert.name}`)}
                    />
                    <label
                      htmlFor={`cert-${index}`}
                      className="text-sm flex justify-between w-full cursor-pointer"
                    >
                      <span>{cert.name}</span>
                      <span className="text-gray-500">({cert.count})</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1">
            {/* Filtres mobiles */}
            <div className="md:hidden mb-4">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center justify-center"
              >
                <Filter className="h-5 w-5 mr-2" />
                Filtres
                {activeFilters.length > 0 && (
                  <span className="ml-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    {activeFilters.length}
                  </span>
                )}
              </button>
            </div>

            {/* Contrôles d'affichage */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md ${
                    viewMode === "grid"
                      ? "bg-green-100 text-green-700"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md ${
                    viewMode === "list"
                      ? "bg-green-100 text-green-700"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-sm text-gray-600">
                  Trier par:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-md border-gray-300 py-1 pl-2 pr-8 text-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                >
                  <option value="alphabetic">Alphabétique</option>
                  <option value="products">Nombre de produits</option>
                  <option value="date">Plus récent</option>
                </select>
              </div>
            </div>

            {/* Affichage des entreprises */}
            {filteredEnterprises.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {filteredEnterprises.map((enterprise) => (
                  <EnterpriseCard
                    key={enterprise.id}
                    enterprise={enterprise}
                    viewMode={viewMode}
                  /> || <entreprisesection />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow p-8 text-center">
                <BarChart2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  Aucun résultat trouvé
                </h3>
                <p className="text-gray-500">
                  Essayez d'ajuster vos filtres ou votre recherche pour trouver
                  ce que vous cherchez.
                </p>
                {activeFilters.length > 0 && (
                  <button
                    onClick={() => {
                      setActiveFilters([]);
                      setSearchTerm("");
                    }}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                  >
                    Réinitialiser tous les filtres
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`flex items-center px-4 py-2 border border-gray-300 rounded-md ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  Précédent
                </button>

                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === pageNum
                              ? "bg-green-600 text-white"
                              : "text-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <span className="px-2 text-gray-500">...</span>
                    )}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="px-3 py-1 text-gray-500 hover:bg-gray-100 rounded-md"
                      >
                        {totalPages}
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`flex items-center px-4 py-2 border border-gray-300 rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Suivant
                  <ChevronRight className="h-5 w-5 ml-1" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal des filtres mobiles */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity md:hidden">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg">Filtres</h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Contenu des filtres mobiles - même structure que desktop */}
                <div className="space-y-6">
                  {/* Filtres par région */}
                  <div>
                    <div className="flex items-center mb-3">
                      <MapPin className="h-4 w-4 mr-2 text-green-700" />
                      <h3 className="font-medium text-gray-800">Régions</h3>
                    </div>
                    <div className="space-y-2">
                      {regions.map((region, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`mobile-reg-${index}`}
                            className="mr-2 rounded text-green-600 focus:ring-green-500"
                            onChange={() =>
                              toggleFilter(`region-${region.name}`)
                            }
                            checked={activeFilters.includes(
                              `region-${region.name}`
                            )}
                          />
                          <label
                            htmlFor={`mobile-reg-${index}`}
                            className="text-sm flex justify-between w-full cursor-pointer"
                          >
                            <span>{region.name}</span>
                            <span className="text-gray-500">
                              ({region.count})
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Filtres par catégorie */}
                  <div>
                    <div className="flex items-center mb-3">
                      <Filter className="h-4 w-4 mr-2 text-green-700" />
                      <h3 className="font-medium text-gray-800">Spécialités</h3>
                    </div>
                    <div className="space-y-2">
                      {categories.map((category, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`mobile-cat-${index}`}
                            className="mr-2 rounded text-green-600 focus:ring-green-500"
                            onChange={() =>
                              toggleFilter(`cat-${category.name}`)
                            }
                            checked={activeFilters.includes(
                              `cat-${category.name}`
                            )}
                          />
                          <label
                            htmlFor={`mobile-cat-${index}`}
                            className="text-sm flex justify-between w-full cursor-pointer"
                          >
                            <span>{category.name}</span>
                            <span className="text-gray-500">
                              ({category.count})
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Filtres par certification */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">
                      Certifications
                    </h3>
                    <div className="space-y-2">
                      {certifications.map((cert, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`mobile-cert-${index}`}
                            className="mr-2 rounded text-green-600 focus:ring-green-500"
                            onChange={() => toggleFilter(`cert-${cert.name}`)}
                            checked={activeFilters.includes(
                              `cert-${cert.name}`
                            )}
                          />
                          <label
                            htmlFor={`mobile-cert-${index}`}
                            className="text-sm flex justify-between w-full cursor-pointer"
                          >
                            <span>{cert.name}</span>
                            <span className="text-gray-500">
                              ({cert.count})
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-green-600 px-4 py-2 text-white shadow-sm hover:bg-green-700 sm:mt-0 sm:ml-3 sm:w-auto"
                >
                  Appliquer les filtres
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Détail d'une entreprise - Modal */}
      {typeof window !== "undefined" &&
        window.location.hash.startsWith("#enterprise-") && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                <button
                  onClick={() => (window.location.hash = " ")}
                  className="absolute top-4 right-4 rounded-md bg-white text-gray-400 hover:text-gray-500 z-10"
                >
                  <X className="h-6 w-6" />
                </button>

                {(() => {
                  const enterpriseId = Number.parseInt(
                    window.location.hash.replace("#enterprise-", "")
                  );
                  const enterprise = enterprises.find(
                    (e) => e.id === enterpriseId
                  );

                  if (!enterprise)
                    return (
                      <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="text-center">
                          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                          <h3 className="mt-3 text-lg font-medium text-gray-900">
                            Entreprise non trouvée
                          </h3>
                        </div>
                      </div>
                    );

                  return (
                    <>
                      <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                          <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                            {/* En-tête */}
                            <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden mb-6">
                              <ImageWithFallback
                                src={enterprise.cover || "/placeholder.svg"}
                                alt={`Bannière ${enterprise.name}`}
                                className="w-full h-full object-cover"
                                fallbackKey={getImageFallbackKey(
                                  enterprise.category
                                )}
                              />
                              <div className="absolute -bottom-12 left-6">
                                <ImageWithFallback
                                  src={enterprise.logo || "/placeholder.svg"}
                                  alt={`Logo ${enterprise.name}`}
                                  className="w-24 h-24 rounded-xl object-cover border-4 border-white shadow-lg"
                                  fallbackKey={getImageFallbackKey(
                                    enterprise.category
                                  )}
                                />
                              </div>
                            </div>

                            <div className="mt-16 pl-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-2xl font-bold text-gray-900">
                                    {enterprise.name}
                                  </h3>
                                  <p className="text-gray-500">
                                    {enterprise.category}
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {enterprise.certifications.map(
                                    (cert, idx) => (
                                      <span
                                        key={idx}
                                        className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                                      >
                                        {cert}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>

                              <div className="mt-4 flex items-center text-gray-600">
                                <MapPin className="h-5 w-5 mr-1" />
                                <span>
                                  {enterprise.ville}, {enterprise.region}
                                </span>
                              </div>

                              <div className="mt-6">
                                <h4 className="font-medium text-gray-900 mb-2">
                                  Description
                                </h4>
                                <p className="text-gray-600">
                                  {enterprise.description}
                                </p>
                              </div>

                              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2">
                                    Produits
                                  </h4>
                                  <p className="text-gray-600">
                                    {enterprise.products} produits référencés
                                  </p>
                                </div>

                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2">
                                    Contact
                                  </h4>
                                  <div className="space-y-1">
                                    <div className="flex items-center text-gray-600">
                                      <Mail className="h-4 w-4 mr-2" />
                                      <a
                                        href={`mailto:${enterprise.contact.email}`}
                                        className="hover:text-green-700"
                                      >
                                        {enterprise.contact.email}
                                      </a>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                      <Phone className="h-4 w-4 mr-2" />
                                      <a
                                        href={`tel:${enterprise.contact.phone.replace(
                                          /\s/g,
                                          ""
                                        )}`}
                                        className="hover:text-green-700"
                                      >
                                        {enterprise.contact.phone}
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                          type="button"
                          onClick={() => (window.location.hash = "")}
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-green-600 px-4 py-2 text-white shadow-sm hover:bg-green-700 sm:mt-0 sm:ml-3 sm:w-auto"
                        >
                          Fermer
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
