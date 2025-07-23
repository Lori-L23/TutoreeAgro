import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  ArrowLeft,
  Star,
  ShoppingCart,
} from "lucide-react";
import Api from "../Services/Api";
import { useAuth } from "../Contexts/Authcontexts";

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [company, setCompany] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [products, setProducts] = React.useState([]);
  const [showLoginModal, setShowLoginModal] = React.useState(false);

  // Fonction pour corriger les chemins d'images
  const getImageUrl = (path) => {
    if (!path) return "/placeholder-company.png";

    // Si c'est un chemin Windows, utiliser un placeholder
    if (path.startsWith("C:\\")) {
      return "/placeholder-company.png";
    }

    // Si c'est un chemin de stockage Laravel, construire l'URL complète
    if (path.startsWith("/storage/")) {
      return `${import.meta.env.VITE_API_URL || "http://localhost:8000"}${path}`;
    }

    // Si c'est déjà une URL complète, l'utiliser telle quelle
    if (path.startsWith("http")) {
      return path;
    }

    // Par défaut, retourner le chemin tel quel
    return path;
  };

  React.useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        
        // 1. Récupérer les détails de l'entreprise
        const companyResponse = await Api.get(`/api/entreprises/${id}`);
        let companyData = companyResponse.data.data || companyResponse.data;

        // Corriger l'URL du logo
        companyData.logo = getImageUrl(companyData.logo);

        // 2. Récupérer les données utilisateur associées
        // Selon votre structure de données, user peut être directement dans la réponse
        // ou vous devrez peut-être faire une requête séparée
        if (companyData.user) {
          // Si les données utilisateur sont déjà incluses dans la réponse
          companyData.userData = companyData.user;
        } else if (companyData.user_id) {
          // Si vous devez faire une requête séparée pour les données utilisateur
          try {
            const userResponse = await Api.get(`/api/users/${companyData.user_id}`);
            companyData.userData = userResponse.data;
          } catch (userError) {
            console.error("Erreur lors de la récupération des données utilisateur:", userError);
          }
        }

        setCompany(companyData);

        // 3. Récupérer les produits de l'entreprise
        const productsResponse = await Api.get(`/api/entreprises/${id}/produits`);
        let productsData = productsResponse?.data?.data || productsResponse?.data || [];

        if (!Array.isArray(productsData)) {
          console.warn("Produits reçus non valides :", productsData);
          productsData = [];
        }

        // Corriger les URLs des images des produits
        productsData = productsData.map((product) => ({
          ...product,
          image: getImageUrl(product.image || product.image_principale),
        }));

        setProducts(productsData);
      } catch (err) {
        setError(err.message || "Erreur lors du chargement des données");
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [id]);

  const handleOrderProduct = (productId) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }
    navigate(`/commander/${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Chargement des détails de l'entreprise...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center ">
        <div className="text-center text-red-500">
          <p>Erreur: {error}</p>
          <Link
            to="/entreprises"
            className="mt-4 inline-flex items-center text-green-600 hover:text-green-800"
          >
            <ArrowLeft className="mr-2" size={16} />
            Retour à la liste des entreprises
          </Link>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center ">
        <div className="text-center mt-20">
          <p>Entreprise non trouvée</p>
          <Link
            to="/entreprises"
            className="mt-4 inline-flex items-center text-green-600 hover:text-green-800"
          >
            <ArrowLeft className="mr-2" size={16} />
            Retour à la liste des entreprises
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec bouton retour */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 ">
          <Link
            to="/entreprises"
            className="inline-flex items-center text-green-600 hover:text-green-800 mt-20"
          >
            <ArrowLeft className="mr-2" size={20} />
            Retour aux entreprises
          </Link>
        </div>
      </div>

      {/* Section principale */}
      <div className="container mx-auto px-4 py-8">
        {/* Carte de présentation de l'entreprise */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            {/* Logo/Image de l'entreprise */}
            <div className="md:w-1/3 bg-gray-100 flex items-center justify-center p-8">
              <img
                src={company.logo || "/placeholder-company.png"}
                alt={company.nom_entreprise}
                className="w-48 h-48 object-contain rounded-lg"
                onError={(e) => {
                  e.target.src = "/placeholder-company.png";
                  e.target.onerror = null;
                }}
              />
            </div>

            {/* Détails de l'entreprise */}
            <div className="md:w-2/3 p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {company.nom_entreprise}
                  </h1>
                  <p className="text-green-600 font-medium mb-4">
                    {company.siret}
                  </p>
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {company.status || "Approuvee"}
                </div>
              </div>

              <p className="text-gray-600 mb-6">{company.description}</p>

              {/* Métriques */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {products.length}
                  </p>
                  <p className="text-sm text-gray-500">Produits</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm font-bold text-green-600">
                    {new Date(company.created_at).toLocaleDateString() || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Année d'incription</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm font-bold text-green-600">
                    {company.activity_sector || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Secteur d'activite</p>
                </div>
              </div>

              {/* Informations de contact */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Informations de contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-green-600 mt-1 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Adresse</p>
                      <p className="text-gray-600">
                        {company.ville && `${company.ville}`}
                        {company.region && `, ${company.region}`}
                        {!company.ville && !company.region && "Non renseigné"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-green-600 mt-1 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Téléphone</p>
                      <p className="text-gray-600">
                        {company.userData?.phone || company.user?.phone || "Non renseigné"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-green-600 mt-1 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">
                        {company.userData?.email || company.user?.email || "Non renseigné"}
                      </p>
                    </div>
                  </div>
                  {company.site_web && (
                    <div className="flex items-start">
                      <Globe className="h-5 w-5 text-green-600 mt-1 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Site web</p>
                        <p className="text-gray-600">
                          <a
                            href={company.site_web.startsWith('http') ? company.site_web : `http://${company.site_web}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:underline"
                          >
                            {company.site_web}
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Produits de l'entreprise */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Produits de {company.nom_entreprise}
          </h2>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.image || "/placeholder-product.jpg"}
                      alt={product.nom}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "/placeholder-product.jpg";
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-lg">{product.nom}</h3>
                      <span className="font-bold text-green-700">
                        {product.prix} FCFA
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm ml-1">
                          {product.rating || "4"}
                        </span>
                      </div>
                      <button
                        onClick={() => handleOrderProduct(product.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md flex items-center text-sm"
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Commander
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500">
                Cette entreprise n'a pas encore de produits enregistrés.
              </p>
            </div>
          )}
        </div>

        {/* Section supplémentaire pour les certifications ou autres informations */}
        {company.certifications && company.certifications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Certifications
            </h2>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.certifications.map((cert, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <svg
                        className="h-5 w-5 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{cert.nom}</h3>
                      <p className="text-sm text-gray-600">{cert.organisme}</p>
                      {cert.date && (
                        <p className="text-xs text-gray-500">
                          Obtenu le: {new Date(cert.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Modal de connexion */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Connexion requise</h3>
            <p className="mb-6">
              Vous devez être connecté pour commander ce produit.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Annuler
              </button>
              <Link
                to="/login"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={() => setShowLoginModal(false)}
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetails;