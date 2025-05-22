import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter,
  FaSortAmountUp,
  FaSortAmountDown,
  FaBoxOpen,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaImage,
  FaChartLine,
  FaShoppingCart,
  FaStar,
  FaHeart,
  FaToggleOn,
  FaToggleOff,
  FaCopy,
  FaDownload,
  FaUpload
} from "react-icons/fa";
import { useAuth } from "../Contexts/Authcontexts";

const Produits = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [produits, setProduits] = useState([]);
  const [filteredProduits, setFilteredProduits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedProduits, setSelectedProduits] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        setLoading(true);
        
        // Simulation des données des produits
        setTimeout(() => {
          const mockProduits = [
            {
              id: 1,
              nom: "Ananas Victoria Bio",
              description: "Ananas frais et bio cultivé localement dans le Littoral",
              prix: 1500,
              prixPromo: null,
              stock: 25,
              stockAlerte: 10,
              categorie: "Fruits",
              sousCategorie: "Fruits tropicaux",
              statut: "actif",
              dateCreation: "2024-01-10T08:00:00Z",
              derniereModification: "2024-01-15T14:30:00Z",
              images: ["/api/placeholder/300/300"],
              ventes: 89,
              vues: 1250,
              favoris: 45,
              notation: 4.8,
              nombreAvis: 23,
              visible: true,
              enPromotion: false,
              poids: "1.5kg",
              origine: "Littoral, Cameroun",
              certifications: ["Bio", "Commerce équitable"]
            },
            {
              id: 2,
              nom: "Mangues Kent Premium",
              description: "Mangues Kent de qualité premium, sucrées et juteuses",
              prix: 2000,
              prixPromo: 1750,
              stock: 12,
              stockAlerte: 15,
              categorie: "Fruits",
              sousCategorie: "Fruits tropicaux",
              statut: "actif",
              dateCreation: "2024-01-08T10:15:00Z",
              derniereModification: "2024-01-14T09:45:00Z",
              images: ["/api/placeholder/300/300"],
              ventes: 76,
              vues: 980,
              favoris: 32,
              notation: 4.6,
              nombreAvis: 18,
              visible: true,
              enPromotion: true,
              poids: "500g",
              origine: "Nord, Cameroun",
              certifications: ["Premium"]
            },
            {
              id: 3,
              nom: "Avocats Hass Bio",
              description: "Avocats Hass biologiques, parfaits pour vos salades",
              prix: 1200,
              prixPromo: null,
              stock: 8,
              stockAlerte: 10,
              categorie: "Fruits",
              sousCategorie: "Fruits exotiques",
              statut: "rupture",
              dateCreation: "2024-01-05T16:20:00Z",
              derniereModification: "2024-01-12T11:10:00Z",
              images: ["/api/placeholder/300/300"],
              ventes: 64,
              vues: 750,
              favoris: 28,
              notation: 4.9,
              nombreAvis: 15,
              visible: false,
              enPromotion: false,
              poids: "200g",
              origine: "Ouest, Cameroun",
              certifications: ["Bio"]
            },
            {
              id: 4,
              nom: "Huile de palme rouge artisanale",
              description: "Huile de palme rouge pure, extraite artisanalement",
              prix: 3500,
              prixPromo: null,
              stock: 45,
              stockAlerte: 20,
              categorie: "Huiles",
              sousCategorie: "Huiles végétales",
              statut: "actif",
              dateCreation: "2024-01-03T12:00:00Z",
              derniereModification: "2024-01-10T15:20:00Z",
              images: ["/api/placeholder/300/300"],
              ventes: 43,
              vues: 650,
              favoris: 19,
              notation: 4.7,
              nombreAvis: 12,
              visible: true,
              enPromotion: false,
              poids: "1L",
              origine: "Sud-Ouest, Cameroun",
              certifications: ["Artisanal", "Naturel"]
            },
            {
              id: 5,
              nom: "Cacao en poudre pur",
              description: "Poudre de cacao 100% pur, idéal pour vos desserts",
              prix: 2800,
              prixPromo: null,
              stock: 0,
              stockAlerte: 5,
              categorie: "Épices & Condiments",
              sousCategorie: "Cacao",
              statut: "rupture",
              dateCreation: "2023-12-28T09:30:00Z",
              derniereModification: "2024-01-08T13:45:00Z",
              images: ["/api/placeholder/300/300"],
              ventes: 38,
              vues: 420,
              favoris: 22,
              notation: 4.9,
              nombreAvis: 9,
              visible: true,
              enPromotion: false,
              poids: "500g",
              origine: "Sud, Cameroun",
              certifications: ["Pur", "Artisanal"]
            }
          ];
          
          setProduits(mockProduits);
          setFilteredProduits(mockProduits);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProduits();
    }
  }, [isAuthenticated]);

  // Filtrage et tri des produits
  useEffect(() => {
    let filtered = [...produits];

    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter(produit =>
        produit.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produit.categorie.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrage par catégorie
    if (selectedCategory !== "all") {
      filtered = filtered.filter(produit => produit.categorie === selectedCategory);
    }

    // Filtrage par statut
    if (selectedStatus !== "all") {
      filtered = filtered.filter(produit => produit.statut === selectedStatus);
    }

    // Tri
    filtered.sort((a, b) => {
      let compareValue = 0;
      
      switch (sortBy) {
        case "nom":
          compareValue = a.nom.localeCompare(b.nom);
          break;
        case "prix":
          compareValue = a.prix - b.prix;
          break;
        case "stock":
          compareValue = a.stock - b.stock;
          break;
        case "ventes":
          compareValue = a.ventes - b.ventes;
          break;
        case "date":
          compareValue = new Date(a.dateCreation) - new Date(b.dateCreation);
          break;
        default:
          compareValue = 0;
      }
      
      return sortOrder === "asc" ? compareValue : -compareValue;
    });

    setFilteredProduits(filtered);
  }, [produits, searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('fr-FR', options);
  };

  const getStatutClass = (statut) => {
    switch (statut) {
      case "actif":
        return "bg-green-100 text-green-800";
      case "inactif":
        return "bg-gray-100 text-gray-800";
      case "rupture":
        return "bg-red-100 text-red-800";
      case "brouillon":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStockClass = (stock, stockAlerte) => {
    if (stock === 0) return "text-red-600 font-semibold";
    if (stock <= stockAlerte) return "text-orange-600 font-semibold";
    return "text-green-600";
  };

  const handleSelectProduit = (produitId) => {
    setSelectedProduits(prev => {
      const newSelection = prev.includes(produitId)
        ? prev.filter(id => id !== produitId)
        : [...prev, produitId];
      
      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    const allIds = filteredProduits.map(p => p.id);
    const allSelected = selectedProduits.length === allIds.length;
    
    setSelectedProduits(allSelected ? [] : allIds);
    setShowBulkActions(!allSelected && allIds.length > 0);
  };

  const handleToggleVisibility = (produitId) => {
    setProduits(prev => prev.map(produit => 
      produit.id === produitId 
        ? { ...produit, visible: !produit.visible }
        : produit
    ));
  };

  const handleDeleteProduit = (produitId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      setProduits(prev => prev.filter(produit => produit.id !== produitId));
      setSelectedProduits(prev => prev.filter(id => id !== produitId));
    }
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case "delete":
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedProduits.length} produits ?`)) {
          setProduits(prev => prev.filter(produit => !selectedProduits.includes(produit.id)));
          setSelectedProduits([]);
          setShowBulkActions(false);
        }
        break;
      case "activate":
        setProduits(prev => prev.map(produit => 
          selectedProduits.includes(produit.id)
            ? { ...produit, statut: "actif", visible: true }
            : produit
        ));
        break;
      case "deactivate":
        setProduits(prev => prev.map(produit => 
          selectedProduits.includes(produit.id)
            ? { ...produit, statut: "inactif", visible: false }
            : produit
        ));
        break;
      default:
        break;
    }
  };

  const categories = [...new Set(produits.map(p => p.categorie))];
  const statuts = [...new Set(produits.map(p => p.statut))];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour gérer vos produits</p>
          <Link
            to="/connexion"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Mes produits</h1>
              <p className="text-gray-600">
                Gérez votre catalogue de {produits.length} produits
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition duration-200 flex items-center">
                <FaDownload className="mr-2" />
                Exporter
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition duration-200 flex items-center">
                <FaUpload className="mr-2" />
                Importer
              </button>
              <Link
                to="/mes-produits/nouveau"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200 flex items-center"
              >
                <FaPlus className="mr-2" />
                Nouveau produit
              </Link>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Produits actifs</p>
              <p className="text-2xl font-bold text-green-600">
                {produits.filter(p => p.statut === "actif").length}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Stock faible</p>
              <p className="text-2xl font-bold text-orange-600">
                {produits.filter(p => p.stock <= p.stockAlerte && p.stock > 0).length}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Rupture de stock</p>
              <p className="text-2xl font-bold text-red-600">
                {produits.filter(p => p.stock === 0).length}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Total ventes</p>
              <p className="text-2xl font-bold text-blue-600">
                {produits.reduce((acc, p) => acc + p.ventes, 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Recherche */}
            <div className="lg:col-span-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtre par catégorie */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Filtre par statut */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                {statuts.map(statut => (
                  <option key={statut} value={statut}>
                    {statut.charAt(0).toUpperCase() + statut.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Tri */}
            <div>
              <div className="flex">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="date">Date de création</option>
                  <option value="nom">Nom</option>
                  <option value="prix">Prix</option>
                  <option value="stock">Stock</option>
                  <option value="ventes">Ventes</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-50 transition duration-200"
                >
                  {sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions en lot */}
        {showBulkActions && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-blue-800">
                {selectedProduits.length} produit(s) sélectionné(s)
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction("activate")}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition duration-200"
                >
                  Activer
                </button>
                <button
                  onClick={() => handleBulkAction("deactivate")}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium transition duration-200"
                >
                  Désactiver
                </button>
                <button
                  onClick={() => handleBulkAction("delete")}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition duration-200"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Liste des produits */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {filteredProduits.length > 0 ? (
            <>
              {/* En-tête du tableau */}
              <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedProduits.length === filteredProduits.length && filteredProduits.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    Sélectionner tout
                  </span>
                </div>
              </div>

              {/* Produits */}
              <div className="divide-y divide-gray-200">
                {filteredProduits.map((produit) => (
                  <div key={produit.id} className="px-6 py-4 hover:bg-gray-50 transition duration-200">
                    <div className="flex items-center">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedProduits.includes(produit.id)}
                        onChange={() => handleSelectProduit(produit.id)}
                        className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />

                      {/* Image */}
                      <div className="ml-4 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {produit.images && produit.images.length > 0 ? (
                          <img
                            src="/api/placeholder/64/64"
                            alt={produit.nom}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FaImage />
                          </div>
                        )}
                      </div>

                      {/* Informations produit */}
                      <div className="ml-4 flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {produit.nom}
                              </h3>
                              {produit.enPromotion && (
                                <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                                  PROMO
                                </span>
                              )}
                              {!produit.visible && (
                                <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                                  MASQUÉ
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {produit.description}
                            </p>
                            <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                              <span>Catégorie: {produit.categorie}</span>
                              <span>•</span>
                              <span>Créé le {formatDate(produit.dateCreation)}</span>
                              {produit.certifications && produit.certifications.length > 0 && (
                                <>
                                  <span>•</span>
                                  <span>{produit.certifications.join(", ")}</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Prix et statut */}
                          <div className="ml-6 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              {produit.prixPromo ? (
                                <div>
                                  <span className="text-lg font-bold text-green-600">
                                    {formatPrice(produit.prixPromo)}
                                  </span>
                                  <span className="text-sm text-gray-500 line-through ml-2">
                                    {formatPrice(produit.prix)}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-lg font-bold text-gray-900">
                                  {formatPrice(produit.prix)}
                                </span>
                              )}
                            </div>
                            <div className="mt-1">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutClass(produit.statut)}`}>
                                {produit.statut}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Métriques */}
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Stock</p>
                            <p className={`font-semibold ${getStockClass(produit.stock, produit.stockAlerte)}`}>
                              {produit.stock} {produit.poids && `(${produit.poids})`}
                              {produit.stock <= produit.stockAlerte && produit.stock > 0 && (
                                <FaExclamationTriangle className="inline ml-1 text-orange-500" />
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Ventes</p>
                            <p className="font-semibold text-blue-600 flex items-center">
                              <FaShoppingCart className="mr-1" />
                              {produit.ventes}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Vues</p>
                            <p className="font-semibold text-purple-600 flex items-center">
                              <FaEye className="mr-1" />
                              {produit.vues}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Favoris</p>
                            <p className="font-semibold text-red-600 flex items-center">
                              <FaHeart className="mr-1" />
                              {produit.favoris}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Note</p>
                            <p className="font-semibold text-yellow-600 flex items-center">
                              <FaStar className="mr-1" />
                              {produit.notation} ({produit.nombreAvis})
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Link
                              to={`/mes-produits/${produit.id}`}
                              className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                            >
                              <FaEye className="mr-1" />
                              Voir
                            </Link>
                            <Link
                              to={`/mes-produits/${produit.id}/modifier`}
                              className="text-green-600 hover:text-green-800 flex items-center text-sm"
                            >
                              <FaEdit className="mr-1" />
                              Modifier
                            </Link>
                            <button
                              onClick={() => handleToggleVisibility(produit.id)}
                              className="text-gray-600 hover:text-gray-800 flex items-center text-sm"
                            >
                              {produit.visible ? (
                                <>
                                  <FaToggleOn className="mr-1" />
                                  Masquer
                                </>
                              ) : (
                                <>
                                  <FaToggleOff className="mr-1" />
                                  Afficher
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => navigator.clipboard.writeText(`${window.location.origin}/produits/${produit.id}`)}
                              className="text-gray-600 hover:text-gray-800 flex items-center text-sm"
                            >
                              <FaCopy className="mr-1" />
                              Copier lien
                            </button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/mes-produits/${produit.id}/statistiques`}
                              className="text-purple-600 hover:text-purple-800"
                            >
                              <FaChartLine />
                            </Link>
                            <button
                              onClick={() => handleDeleteProduit(produit.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <FaBoxOpen className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || selectedCategory !== "all" || selectedStatus !== "all" 
                  ? "Aucun produit trouvé"
                  : "Aucun produit dans votre catalogue"
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory !== "all" || selectedStatus !== "all"
                  ? "Essayez de modifier vos filtres de recherche"
                  : "Commencez par ajouter votre premier produit à votre catalogue"
                }
              </p>
              {!searchTerm && selectedCategory === "all" && selectedStatus === "all" && (
                <Link
                  to="/mes-produits/nouveau"
                  className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
                >
                  <FaPlus className="mr-2" />
                  Ajouter mon premier produit
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Pagination (si nécessaire) */}
        {filteredProduits.length > 10 && (
          <div className="mt-6 flex justify-center">
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200">
                Précédent
              </button>
              <button className="px-3 py-2 bg-green-600 text-white rounded-lg">1</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200">2</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200">3</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200">
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Produits;