import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaBoxOpen, 
  FaShippingFast, 
  FaCheckCircle, 
  FaTimesCircle,
  FaSearch,
  FaFilter,
  FaFileInvoice,
  FaEye,
  FaCalendarAlt
} from "react-icons/fa";
import { useAuth } from "../Contexts/Authcontexts";

const Commandes = () => {
  const { user } = useAuth();
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    // Simuler le chargement des commandes depuis une API
    const fetchCommandes = async () => {
      try {
        setLoading(true);
        // Remplacer par un vrai appel API
        setTimeout(() => {
          const mockData = [
            {
              id: "CMD-2023-001",
              date: "2023-05-15",
              montant: 12500,
              statut: "livré",
              produits: [
                { id: 1, nom: "Ananas frais bio", quantite: 5, prix_unitaire: 1500 },
                { id: 2, nom: "Bananes plantains", quantite: 2, prix_unitaire: 1750 }
              ]
            },
            {
              id: "CMD-2023-002",
              date: "2023-05-20",
              montant: 18000,
              statut: "en cours",
              produits: [
                { id: 3, nom: "Manioc frais", quantite: 10, prix_unitaire: 800 },
                { id: 4, nom: "Huile de palme (1L)", quantite: 2, prix_unitaire: 4000 }
              ]
            },
            {
              id: "CMD-2023-003",
              date: "2023-05-25",
              montant: 9500,
              statut: "en préparation",
              produits: [
                { id: 5, nom: "Arachides grillées (500g)", quantite: 3, prix_unitaire: 2000 },
                { id: 6, nom: "Piment fort", quantite: 1, prix_unitaire: 1500 },
                { id: 7, nom: "Gingembre frais", quantite: 2, prix_unitaire: 1000 }
              ]
            },
            {
              id: "CMD-2023-004",
              date: "2023-06-01",
              montant: 22000,
              statut: "annulé",
              produits: [
                { id: 8, nom: "Igname de qualité export", quantite: 4, prix_unitaire: 5500 }
              ]
            }
          ];
          setCommandes(mockData);
          setLoading(false);
        }, 1000);
        
        // Exemple avec API réelle:
        // const response = await fetch('/api/commandes', {
        //   headers: { 
        //     'Authorization': `Bearer ${user.token}` 
        //   }
        // });
        // const data = await response.json();
        // if (data.success) {
        //   setCommandes(data.commandes);
        // } else {
        //   setError(data.message || "Impossible de récupérer vos commandes");
        // }
      } catch (err) {
        console.error("Erreur lors du chargement des commandes:", err);
        setError("Une erreur est survenue lors du chargement de vos commandes");
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();
  }, [user]);

  const getStatusIcon = (statut) => {
    switch (statut) {
      case "livré":
        return <FaCheckCircle className="text-green-500" />;
      case "en cours":
        return <FaShippingFast className="text-blue-500" />;
      case "en préparation":
        return <FaBoxOpen className="text-yellow-500" />;
      case "annulé":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusClass = (statut) => {
    switch (statut) {
      case "livré":
        return "bg-green-100 text-green-800";
      case "en cours":
        return "bg-blue-100 text-blue-800";
      case "en préparation":
        return "bg-yellow-100 text-yellow-800";
      case "annulé":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredCommandes = commandes
    .filter(commande => {
      if (filterStatus === "all") return true;
      return commande.statut === filterStatus;
    })
    .filter(commande => 
      commande.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commande.produits.some(produit => 
        produit.nom.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('fr-FR', options);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-500">
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center">
              <FaBoxOpen className="mr-3" /> Mes Commandes
            </h1>
            <p className="text-white/90 mt-1">
              Consultez l'historique et le statut de vos commandes CamProduct
            </p>
          </div>
          
          {/* Filtres et recherche */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher une commande..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <FaFilter className="text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="en préparation">En préparation</option>
                  <option value="en cours">En cours</option>
                  <option value="livré">Livré</option>
                  <option value="annulé">Annulé</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Contenu principal */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-lg text-red-700">
                <p>{error}</p>
                <button 
                  className="mt-2 text-sm font-medium text-red-700 hover:text-red-900"
                  onClick={() => window.location.reload()}
                >
                  Réessayer
                </button>
              </div>
            ) : filteredCommandes.length === 0 ? (
              <div className="text-center py-12">
                <FaBoxOpen className="text-gray-300 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">Aucune commande trouvée</h3>
                <p className="text-gray-500 mt-1">
                  {searchTerm || filterStatus !== "all" 
                    ? "Essayez de modifier vos filtres de recherche" 
                    : "Vous n'avez pas encore passé de commande"}
                </p>
                {(searchTerm || filterStatus !== "all") && (
                  <button 
                    onClick={() => { setSearchTerm(""); setFilterStatus("all"); }}
                    className="mt-4 text-green-600 hover:underline font-medium"
                  >
                    Réinitialiser les filtres
                  </button>
                )}
                {!searchTerm && filterStatus === "all" && (
                  <Link 
                    to="/produits" 
                    className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                  >
                    Découvrir nos produits
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredCommandes.map((commande) => (
                  <div 
                    key={commande.id} 
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition duration-200"
                  >
                    <div className="p-4 bg-white">
                      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4">
                        <div>
                          <div className="flex items-center">
                            <span className="font-bold text-lg text-gray-900">
                              {commande.id}
                            </span>
                            <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(commande.statut)}`}>
                              {getStatusIcon(commande.statut)}
                              <span className="ml-1">{commande.statut.charAt(0).toUpperCase() + commande.statut.slice(1)}</span>
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <FaCalendarAlt className="mr-1" /> 
                            <span>Commandé le {formatDate(commande.date)}</span>
                          </div>
                        </div>
                        <div className="mt-3 md:mt-0 flex items-center space-x-2">
                          <span className="font-bold text-lg text-gray-900">
                            {formatPrice(commande.montant)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Produits commandés</h4>
                        <ul className="space-y-2">
                          {commande.produits.map((produit) => (
                            <li key={produit.id} className="flex items-center justify-between text-sm py-2 px-1 border-b border-dashed border-gray-100 last:border-0">
                              <span className="flex-1 font-medium text-gray-800">{produit.nom}</span>
                              <span className="text-gray-500 mx-2">{produit.quantite} x {formatPrice(produit.prix_unitaire)}</span>
                              <span className="font-medium">{formatPrice(produit.quantite * produit.prix_unitaire)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4 pt-3 flex flex-wrap gap-2">
                        <Link 
                          to={`/commandes/${commande.id}`}
                          className="flex items-center text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded transition duration-200"
                        >
                          <FaEye className="mr-1" /> Détails
                        </Link>
                        <button 
                          className="flex items-center text-sm border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded transition duration-200"
                        >
                          <FaFileInvoice className="mr-1" /> Facture
                        </button>
                        {commande.statut === "livré" && (
                          <button 
                            className="flex items-center text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded transition duration-200"
                          >
                            <FaCheckCircle className="mr-1" /> Évaluer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Pagination (à implémenter si nécessaire) */}
          {filteredCommandes.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-center">
              <nav className="flex items-center space-x-1">
                <button className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50">Précédent</button>
                <button className="px-3 py-1 rounded bg-green-600 text-white">1</button>
                <button className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50">2</button>
                <button className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50">3</button>
                <button className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50">Suivant</button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Commandes;