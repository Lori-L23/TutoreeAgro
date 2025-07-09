import React, { useState, useEffect } from "react";
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
  FaUpload,
  FaTimes,
  FaSave,
  FaSpinner,
} from "react-icons/fa";

// Simulation d'une API backend
const API = {
  async getProduits() {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));

    const produits = JSON.parse(localStorage.getItem('produits') || '[]');
    if (produits.length === 0) {
      // Données par défaut si aucun produit n'existe
      const defaultProduits = [
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
          dateCreation: new Date().toISOString(),
          derniereModification: new Date().toISOString(),
          images: ["https://via.placeholder.com/300/300"],
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
          dateCreation: new Date().toISOString(),
          derniereModification: new Date().toISOString(),
          images: ["https://via.placeholder.com/300/300"],
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
        }
      ];
      localStorage.setItem('produits', JSON.stringify(defaultProduits));
      return defaultProduits;
    }
    return produits;
  },
  async createProduit(produit) {
    await new Promise(resolve => setTimeout(resolve, 500));

    const produits = JSON.parse(localStorage.getItem('produits') || '[]');
    const newProduit = {
      ...produit,
      id: Date.now(),
      dateCreation: new Date().toISOString(),
      derniereModification: new Date().toISOString(),
      ventes: 0,
      vues: 0,
      favoris: 0,
      notation: 0,
      nombreAvis: 0
    };

    produits.push(newProduit);
    localStorage.setItem('produits', JSON.stringify(produits));
    return newProduit;
  },
  async updateProduit(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 500));

    const produits = JSON.parse(localStorage.getItem('produits') || '[]');
    const index = produits.findIndex(p => p.id === id);

    if (index !== -1) {
      produits[index] = {
        ...produits[index],
        ...updates,
        derniereModification: new Date().toISOString()
      };
      localStorage.setItem('produits', JSON.stringify(produits));
      return produits[index];
    }
    throw new Error('Produit non trouvé');
  },
  async deleteProduit(id) {
    await new Promise(resolve => setTimeout(resolve, 500));

    const produits = JSON.parse(localStorage.getItem('produits') || '[]');
    const filteredProduits = produits.filter(p => p.id !== id);
    localStorage.setItem('produits', JSON.stringify(filteredProduits));
    return true;
  },
  async bulkUpdate(ids, updates) {
    await new Promise(resolve => setTimeout(resolve, 500));

    const produits = JSON.parse(localStorage.getItem('produits') || '[]');
    const updatedProduits = produits.map(p =>
      ids.includes(p.id)
        ? { ...p, ...updates, derniereModification: new Date().toISOString() }
        : p
    );
    localStorage.setItem('produits', JSON.stringify(updatedProduits));
    return updatedProduits;
  }
};

// Composant Modal pour le formulaire de création
const CreateProductModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    prixPromo: '',
    stock: '',
    stockAlerte: '',
    categorie: '',
    sousCategorie: '',
    statut: 'actif',
    visible: true,
    enPromotion: false,
    poids: '',
    origine: '',
    certifications: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    'Fruits',
    'Légumes',
    'Huiles',
    'Épices & Condiments',
    'Céréales',
    'Produits Laitiers',
    'Viandes & Poissons',
    'Boissons'
  ];

  const certificationOptions = [
    'Bio',
    'Commerce équitable',
    'Premium',
    'Artisanal',
    'Naturel',
    'Pur'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleCertificationChange = (certification) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(certification)
        ? prev.certifications.filter(c => c !== certification)
        : [...prev.certifications, certification]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.prix || parseFloat(formData.prix) <= 0) newErrors.prix = 'Le prix doit être supérieur à 0';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Le stock ne peut pas être négatif';
    if (!formData.stockAlerte || parseInt(formData.stockAlerte) < 0) newErrors.stockAlerte = 'Le stock d\'alerte ne peut pas être négatif';
    if (!formData.categorie) newErrors.categorie = 'La catégorie est requise';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const dataToSubmit = {
        ...formData,
        prix: parseFloat(formData.prix),
        prixPromo: formData.prixPromo ? parseFloat(formData.prixPromo) : null,
        stock: parseInt(formData.stock),
        stockAlerte: parseInt(formData.stockAlerte),
        images: ["https://via.placeholder.com/300/300"] // Image par défaut
      };

      await onSubmit(dataToSubmit);

      // Reset form
      setFormData({
        nom: '',
        description: '',
        prix: '',
        prixPromo: '',
        stock: '',
        stockAlerte: '',
        categorie: '',
        sousCategorie: '',
        statut: 'actif',
        visible: true,
        enPromotion: false,
        poids: '',
        origine: '',
        certifications: []
      });

      onClose();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Nouveau Produit</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition duration-200"
          >
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du produit *
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.nom ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Ananas Victoria Bio"
              />
              {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
            </div>
            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Décrivez votre produit..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
            {/* Prix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix (FCFA) *
              </label>
              <input
                type="number"
                name="prix"
                value={formData.prix}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.prix ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="1500"
                min="0"
                step="0.01"
              />
              {errors.prix && <p className="text-red-500 text-sm mt-1">{errors.prix}</p>}
            </div>
            {/* Prix Promo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix promo (FCFA)
              </label>
              <input
                type="number"
                name="prixPromo"
                value={formData.prixPromo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="1200"
                min="0"
                step="0.01"
              />
            </div>
            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.stock ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="25"
                min="0"
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
            </div>
            {/* Stock Alerte */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock d'alerte *
              </label>
              <input
                type="number"
                name="stockAlerte"
                value={formData.stockAlerte}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.stockAlerte ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="10"
                min="0"
              />
              {errors.stockAlerte && <p className="text-red-500 text-sm mt-1">{errors.stockAlerte}</p>}
            </div>
            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                name="categorie"
                value={formData.categorie}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.categorie ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.categorie && <p className="text-red-500 text-sm mt-1">{errors.categorie}</p>}
            </div>
            {/* Sous-catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sous-catégorie
              </label>
              <input
                type="text"
                name="sousCategorie"
                value={formData.sousCategorie}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: Fruits tropicaux"
              />
            </div>
            {/* Poids */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poids/Volume
              </label>
              <input
                type="text"
                name="poids"
                value={formData.poids}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: 1.5kg, 500ml"
              />
            </div>
            {/* Origine */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Origine
              </label>
              <input
                type="text"
                name="origine"
                value={formData.origine}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: Littoral, Cameroun"
              />
            </div>
            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                name="statut"
                value={formData.statut}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
                <option value="brouillon">Brouillon</option>
              </select>
            </div>
            {/* Certifications */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certifications
              </label>
              <div className="flex flex-wrap gap-2">
                {certificationOptions.map(cert => (
                  <label key={cert} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.certifications.includes(cert)}
                      onChange={() => handleCertificationChange(cert)}
                      className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{cert}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Options */}
            <div className="md:col-span-2">
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="visible"
                    checked={formData.visible}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Visible sur le site</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="enPromotion"
                    checked={formData.enPromotion}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">En promotion</span>
                </label>
              </div>
            </div>
          </div>
          {/* Boutons */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition duration-200 flex items-center disabled:opacity-50"
            >
              {isSubmitting ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaSave className="mr-2" />
              )}
              {isSubmitting ? 'Création...' : 'Créer le produit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Composant de modification de produit (EditProductModal)
const EditProductModal = ({ isOpen, onClose, product, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        prix: product.prix !== null ? product.prix.toString() : '',
        prixPromo: product.prixPromo !== null ? product.prixPromo.toString() : '',
        stock: product.stock.toString(),
        stockAlerte: product.stockAlerte.toString(),
      });
    }
  }, [product]);

  const categories = [
    'Fruits', 'Légumes', 'Huiles', 'Épices & Condiments', 'Céréales',
    'Produits Laitiers', 'Viandes & Poissons', 'Boissons'
  ];
  const certificationOptions = [
    'Bio', 'Commerce équitable', 'Premium', 'Artisanal', 'Naturel', 'Pur'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleCertificationChange = (certification) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(certification)
        ? prev.certifications.filter(c => c !== certification)
        : [...prev.certifications, certification]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.prix || parseFloat(formData.prix) <= 0) newErrors.prix = 'Le prix doit être supérieur à 0';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Le stock ne peut pas être négatif';
    if (!formData.stockAlerte || parseInt(formData.stockAlerte) < 0) newErrors.stockAlerte = 'Le stock d\'alerte ne peut pas être négatif';
    if (!formData.categorie) newErrors.categorie = 'La catégorie est requise';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const dataToSubmit = {
        ...formData,
        prix: parseFloat(formData.prix),
        prixPromo: formData.prixPromo ? parseFloat(formData.prixPromo) : null,
        stock: parseInt(formData.stock),
        stockAlerte: parseInt(formData.stockAlerte),
      };
      await onSubmit(product.id, dataToSubmit);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Modifier Produit</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition duration-200"
          >
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du produit *
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.nom ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Ananas Victoria Bio"
              />
              {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
            </div>
            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Décrivez votre produit..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
            {/* Prix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix (FCFA) *
              </label>
              <input
                type="number"
                name="prix"
                value={formData.prix}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.prix ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="1500"
                min="0"
                step="0.01"
              />
              {errors.prix && <p className="text-red-500 text-sm mt-1">{errors.prix}</p>}
            </div>
            {/* Prix Promo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix promo (FCFA)
              </label>
              <input
                type="number"
                name="prixPromo"
                value={formData.prixPromo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="1200"
                min="0"
                step="0.01"
              />
            </div>
            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.stock ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="25"
                min="0"
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
            </div>
            {/* Stock Alerte */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock d'alerte *
              </label>
              <input
                type="number"
                name="stockAlerte"
                value={formData.stockAlerte}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.stockAlerte ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="10"
                min="0"
              />
              {errors.stockAlerte && <p className="text-red-500 text-sm mt-1">{errors.stockAlerte}</p>}
            </div>
            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                name="categorie"
                value={formData.categorie}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.categorie ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.categorie && <p className="text-red-500 text-sm mt-1">{errors.categorie}</p>}
            </div>
            {/* Sous-catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sous-catégorie
              </label>
              <input
                type="text"
                name="sousCategorie"
                value={formData.sousCategorie}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: Fruits tropicaux"
              />
            </div>
            {/* Poids */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poids/Volume
              </label>
              <input
                type="text"
                name="poids"
                value={formData.poids}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: 1.5kg, 500ml"
              />
            </div>
            {/* Origine */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Origine
              </label>
              <input
                type="text"
                name="origine"
                value={formData.origine}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: Littoral, Cameroun"
              />
            </div>
            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                name="statut"
                value={formData.statut}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
                <option value="brouillon">Brouillon</option>
              </select>
            </div>
            {/* Certifications */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certifications
              </label>
              <div className="flex flex-wrap gap-2">
                {certificationOptions.map(cert => (
                  <label key={cert} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.certifications?.includes(cert) || false}
                      onChange={() => handleCertificationChange(cert)}
                      className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{cert}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Options */}
            <div className="md:col-span-2">
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="visible"
                    checked={formData.visible}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Visible sur le site</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="enPromotion"
                    checked={formData.enPromotion}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">En promotion</span>
                </label>
              </div>
            </div>
          </div>
          {/* Boutons */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition duration-200 flex items-center disabled:opacity-50"
            >
              {isSubmitting ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaSave className="mr-2" />
              )}
              {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Composant principal
const Produits = () => {
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAuthenticated] = useState(true); // Simulation d'authentification

  // Chargement des produits
  useEffect(() => {
    const fetchProduits = async () => {
      try {
        setLoading(true);
        const data = await API.getProduits();
        setProduits(data);
        setFilteredProduits(data);
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
      } finally {
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

  const handleCreateProduit = async (produitData) => {
    try {
      const newProduit = await API.createProduit(produitData);
      setProduits(prev => [newProduit, ...prev]);
      alert("Produit créé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      alert("Erreur lors de la création du produit");
    }
  };

  const handleUpdateProduit = async (id, produitData) => {
    try {
      const updatedProduit = await API.updateProduit(id, produitData);
      setProduits(prev => prev.map(p => p.id === id ? updatedProduit : p));
      alert("Produit mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour du produit");
    }
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

  const handleToggleVisibility = async (produitId) => {
    try {
      const produit = produits.find(p => p.id === produitId);
      await API.updateProduit(produitId, { visible: !produit.visible });
      setProduits(prev => prev.map(produit =>
        produit.id === produitId
          ? { ...produit, visible: !produit.visible }
          : produit
      ));
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour de la visibilité.");
    }
  };

  const handleDeleteProduit = async (produitId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await API.deleteProduit(produitId);
        setProduits(prev => prev.filter(produit => produit.id !== produitId));
        setSelectedProduits(prev => prev.filter(id => id !== produitId));
        alert("Produit supprimé avec succès !");
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression du produit.");
      }
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedProduits.length === 0) return;

    try {
      let confirmationMessage = "";
      let updates = {};

      switch (action) {
        case "delete":
          confirmationMessage = `Êtes-vous sûr de vouloir supprimer ${selectedProduits.length} produits sélectionnés ?`;
          break;
        case "activate":
          confirmationMessage = `Êtes-vous sûr de vouloir activer ${selectedProduits.length} produits sélectionnés ?`;
          updates = { statut: "actif", visible: true };
          break;
        case "deactivate":
          confirmationMessage = `Êtes-vous sûr de vouloir désactiver ${selectedProduits.length} produits sélectionnés ?`;
          updates = { statut: "inactif", visible: false };
          break;
        default:
          return;
      }

      if (window.confirm(confirmationMessage)) {
        if (action === "delete") {
          await Promise.all(selectedProduits.map(id => API.deleteProduit(id)));
          setProduits(prev => prev.filter(produit => !selectedProduits.includes(produit.id)));
          alert(`${selectedProduits.length} produits supprimés avec succès.`);
        } else {
          await API.bulkUpdate(selectedProduits, updates);
          setProduits(prev => prev.map(produit =>
            selectedProduits.includes(produit.id)
              ? { ...produit, ...updates }
              : produit
          ));
          alert(`${selectedProduits.length} produits mis à jour avec succès.`);
        }
        setSelectedProduits([]);
        setShowBulkActions(false);
      }
    } catch (error) {
      console.error("Erreur lors de l'action en lot:", error);
      alert("Erreur lors de l'exécution de l'action en lot.");
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };


  const categoriesList = [...new Set(produits.map(p => p.categorie))];
  const statutsList = [...new Set(produits.map(p => p.statut))];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour gérer vos produits</p>
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
            <p className="ml-4 text-gray-600">Chargement des produits...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Gestion des Produits</h1>

        {/* Barre de recherche et filtres */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2 lg:col-span-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                <FaSearch className="inline-block mr-2 text-gray-500" /> Recherche
              </label>
              <input
                type="text"
                id="search"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="Rechercher par nom, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-2">
                <FaFilter className="inline-block mr-2 text-gray-500" /> Catégorie
              </label>
              <select
                id="categoryFilter"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Toutes les catégories</option>
                {categoriesList.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-2">
                <FaFilter className="inline-block mr-2 text-gray-500" /> Statut
              </label>
              <select
                id="statusFilter"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
                <option value="rupture">Rupture de stock</option>
                <option value="brouillon">Brouillon</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <div>
                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
                  <FaSortAmountUp className="inline-block mr-2 text-gray-500" /> Trier par
                </label>
                <select
                  id="sortBy"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Date de création</option>
                  <option value="nom">Nom</option>
                  <option value="prix">Prix</option>
                  <option value="stock">Stock</option>
                  <option value="ventes">Ventes</option>
                </select>
              </div>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200 mt-auto"
                title="Changer l'ordre de tri"
              >
                {sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
              </button>
            </div>
          </div>
        </div>

        {/* Actions en bloc et bouton d'ajout */}
        <div className="flex justify-between items-center mb-6">
          {showBulkActions && (
            <div className="flex items-center space-x-3 bg-gray-100 p-3 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-700">
                {selectedProduits.length} produit(s) sélectionné(s)
              </span>
              <select
                onChange={(e) => handleBulkAction(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                defaultValue=""
              >
                <option value="" disabled>Actions groupées</option>
                <option value="activate">Activer</option>
                <option value="deactivate">Désactiver</option>
                <option value="delete">Supprimer</option>
              </select>
            </div>
          )}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 shadow-md ml-auto"
          >
            <FaPlus className="mr-2" /> Nouveau Produit
          </button>
        </div>

        {/* Tableau des produits */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      checked={selectedProduits.length === filteredProduits.length && filteredProduits.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visibilité
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ventes
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProduits.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      <FaBoxOpen className="inline-block text-4xl text-gray-400 mb-2" />
                      <p>Aucun produit trouvé. Essayez d'ajuster vos filtres.</p>
                    </td>
                  </tr>
                ) : (
                  filteredProduits.map((produit) => (
                    <tr key={produit.id} className={selectedProduits.includes(produit.id) ? "bg-green-50" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          checked={selectedProduits.includes(produit.id)}
                          onChange={() => handleSelectProduit(produit.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full object-cover" src={produit.images[0]} alt={produit.nom} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{produit.nom}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">{produit.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {produit.categorie}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {produit.enPromotion && produit.prixPromo ? (
                          <div className="flex flex-col">
                            <span className="text-red-500 font-semibold">{formatPrice(produit.prixPromo)}</span>
                            <span className="text-gray-400 line-through text-xs">{formatPrice(produit.prix)}</span>
                          </div>
                        ) : (
                          formatPrice(produit.prix)
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={getStockClass(produit.stock, produit.stockAlerte)}>
                          {produit.stock} {produit.stock === 0 && <FaExclamationTriangle className="inline ml-1" />}
                        </span>
                        {produit.stock <= produit.stockAlerte && produit.stock > 0 && (
                          <span className="ml-2 text-xs text-orange-500"> (Alerte)</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatutClass(produit.statut)}`}>
                          {produit.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleToggleVisibility(produit.id)}
                          className={`p-2 rounded-full transition-colors duration-200 ${
                            produit.visible ? 'text-green-600 hover:bg-green-100' : 'text-gray-400 hover:bg-gray-100'
                          }`}
                          title={produit.visible ? "Rendre invisible" : "Rendre visible"}
                        >
                          {produit.visible ? <FaToggleOn className="text-xl" /> : <FaToggleOff className="text-xl" />}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {produit.ventes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleEditClick(produit)}
                            className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition duration-200"
                            title="Modifier"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteProduit(produit.id)}
                            className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition duration-200"
                            title="Supprimer"
                          >
                            <FaTrash />
                          </button>
                          <button
                            className="text-purple-600 hover:text-purple-900 p-2 rounded-full hover:bg-purple-50 transition duration-200"
                            title="Voir les détails"
                          >
                            <FaEye />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateProductModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProduit}
      />
      <EditProductModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        product={editingProduct}
        onSubmit={handleUpdateProduit}
      />
    </div>
  );
};

export default Produits;