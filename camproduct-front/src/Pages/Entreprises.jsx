import { useState, useMemo, useEffect } from "react";
import Api from "../Services/Api";
import {
  Search,
  Filter,
  MapPin,
  BarChart2,
  List,
  Grid,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
  Loader,
} from "lucide-react";
import EnterpriseCard from "../components/EntrepriseCard";

// EnterpriseService class
class EnterpriseService {
  static async fetchEnterprises(filters = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (filters.search) queryParams.append("search", filters.search);
      if (filters.region) queryParams.append("region", filters.region);
      if (filters.category)
        queryParams.append("activity_sector", filters.category);
      if (filters.certification)
        queryParams.append("certification", filters.certification);
      if (filters.sort) queryParams.append("sort", filters.sort);
      if (filters.page) queryParams.append("page", filters.page);

      const response = await Api.get(`/api/entreprises?${queryParams}`);

      const data = response.data || response; // Selon la structure de votre réponse

      if (!data || (!Array.isArray(data) && !data.data)) {
        throw new Error("Invalid response format from API");
      }

      console.log("API Response (fetchEnterprises):", data);

      return Array.isArray(data) ? { data, last_page: 1 } : data;
    } catch (error) {
      console.error("Erreur lors de la récupération des entreprises:", error);
      throw error;
    }
  }

  static async fetchCategories() {
    try {
      const response = await Api.get(`/api/categories`);
      const data = response.data || response;
      console.log("API Response (fetchCategories):", data);
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      console.error("Erreur catégories:", error);
      return [];
    }
  }

  static async fetchRegions() {
    try {
      const response = await Api.get(`/api/regions`);
      const data = response.data || response;
      console.log("API Response (fetchRegions):", data);
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      console.error("Erreur régions:", error);
      return [];
    }
  }

  static async fetchActivitySectors() {
    try {
      const response = await Api.get(`/api/activity-sectors`);
      const data = response.data || response;
      console.log("API Response (fetchActivitySectors):", data);
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      console.error("Erreur secteurs d'activité:", error);
      return [];
    }
  }

  static formatEnterpriseData(enterprise) {
    return {
      id: enterprise.id,
      name: enterprise.nom_entreprise || enterprise.name || "Nom inconnu",
      logo: enterprise.logo ? `/storage/${enterprise.logo}` : null,
      cover: enterprise.logo ? `/storage/${enterprise.logo}` : null,
      description: enterprise.description || "Aucune description disponible",
      products: enterprise.produits_count || enterprise.products || 0,
      region: enterprise.region || "Région inconnue",
      ville: enterprise.ville || "Ville inconnue",
      category:
        enterprise.activity_sector || enterprise.category || "Non spécifié",
      certifications: enterprise.certifications || [],
      contact: {
        email: enterprise.user?.email || enterprise.contact?.email || "",
        phone: enterprise.user?.phone || enterprise.contact?.phone || "",
      },
      status: enterprise.status || "unknown",
    };
  }
}

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
        const [regionsData, categoriesData, activitySectorsData] =
          await Promise.all([
            EnterpriseService.fetchRegions(),
            EnterpriseService.fetchCategories(),
            EnterpriseService.fetchActivitySectors(),
          ]);

        setRegions(regionsData);
        setCategories(categoriesData);
        setCertifications(activitySectorsData);

        await loadEnterprises();
      } catch (err) {
        console.error("Erreur lors du chargement initial:", err);
        setError("Erreur de connexion à l'API. Veuillez réessayer plus tard.");
        setEnterprises([]);
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
      // Gestion des différentes structures de réponse
      let enterprisesData = [];
      if (Array.isArray(response)) {
        enterprisesData = response;
      } else if (response.data && Array.isArray(response.data)) {
        enterprisesData = response.data;
      } else if (Array.isArray(response.enterprises)) {
        enterprisesData = response.enterprises;
      }

      const formattedEnterprises = enterprisesData.map(
        EnterpriseService.formatEnterpriseData
      );

      setEnterprises(formattedEnterprises);
      setTotalPages(response.last_page || 1);
    } catch (err) {
      console.error("Erreur lors du chargement des entreprises:", err);
      setError("Impossible de charger les entreprises. Veuillez réessayer.");
      setEnterprises([]);
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
  }, [searchTerm, activeFilters, sortBy, currentPage, loading]);

  // Fonction de filtrage côté client (fallback)
  const filteredEnterprises = useMemo(() => {
    let filtered = enterprises;

    // Fonction pour normaliser les chaînes (enlever accents et mettre en minuscule)
    const normalizeString = (str) => {
      return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    };

    if (searchTerm.trim()) {
      const searchLower = normalizeString(searchTerm);
      filtered = filtered.filter(
        (enterprise) =>
          normalizeString(enterprise.name).includes(searchLower) ||
          normalizeString(enterprise.description).includes(searchLower) ||
          normalizeString(enterprise.category).includes(searchLower) ||
          normalizeString(enterprise.ville).includes(searchLower) ||
          normalizeString(enterprise.region).includes(searchLower) ||
          enterprise.certifications.some((cert) =>
            normalizeString(cert).includes(searchLower)
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
            const categoryName = filter.replace("cat-", "");
            const normalizedCategory = normalizeString(categoryName);
            const normalizedEnterpriseCategory = normalizeString(
              enterprise.category
            );

            const categoryKeywords = normalizedCategory.split(/[\s,;/]+/);

            // Vérifie si le secteur d'activité contient le nom de la catégorie
            return categoryKeywords.some(
              (keyword) =>
                keyword && normalizedEnterpriseCategory.includes(keyword)
            );
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
      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white py-12 md:py-16">
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
                      <span className="text-gray-500">
                        ({region.count || 0})
                      </span>
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
                      onChange={() => toggleFilter(`cat-${category.nom}`)}
                      checked={activeFilters.includes(`cat-${category.nom}`)}
                    />
                    <label
                      htmlFor={`cat-${index}`}
                      className="text-sm flex justify-between w-full cursor-pointer"
                    >
                      <span>{category.nom}</span>
                      <span className="text-gray-500">
                        ({category.count || 0})
                      </span>
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
                      <span className="text-gray-500">({cert.count || 0})</span>
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
                  />
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
                {activeFilters.length > 0 || searchTerm ? (
                  <button
                    onClick={() => {
                      setActiveFilters([]);
                      setSearchTerm("");
                    }}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                  >
                    Réinitialiser tous les filtres
                  </button>
                ) : null}
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
                      : "bg-white text-gray-700 hover:bg-gray-100"
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
                      : "bg-white text-gray-700 hover:bg-gray-100"
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

                {/* Contenu des filtres mobiles */}
                <div className="space-y-6">
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
                              ({region.count || 0})
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

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
                              ({category.count || 0})
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

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
                              ({cert.count || 0})
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
    </div>
  );
}
