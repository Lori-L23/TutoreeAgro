import { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaBoxOpen } from 'react-icons/fa';
import ProductTable from '../components/admin/ProductTable';
import ProductModal from '../components/admin/ProductModal';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simuler des appels API
        const mockCategories = ['Fruits', 'Légumes', 'Produits laitiers', 'Viandes', 'Boissons'];
        setCategories(mockCategories);
        
        const mockProducts = Array.from({ length: 25 }, (_, i) => ({
          id: i + 1,
          name: `Produit ${i + 1}`,
          category: mockCategories[i % mockCategories.length],
          enterprise: `Entreprise ${(i % 5) + 1}`,
          price: (Math.random() * 100).toFixed(2),
          stock: Math.floor(Math.random() * 1000),
          status: i % 5 === 0 ? 'inactive' : 'active',
          createdAt: new Date(Date.now() - i * 86400000).toLocaleDateString()
        }));
        
        setProducts(mockProducts);
      } catch (error) {
        console.error("Erreur de chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
           product.enterprise.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (productId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleSave = (product) => {
    if (product.id) {
      // Mise à jour
      setProducts(products.map(p => p.id === product.id ? product : p));
    } else {
      // Ajout
      const newId = Math.max(...products.map(p => p.id)) + 1;
      setProducts([...products, {...product, id: newId}]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Produits</h1>
          <button 
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            onClick={() => {
              setSelectedProduct(null);
              setIsModalOpen(true);
            }}
          >
            <FaPlus className="mr-2" />
            Ajouter un produit
          </button>
        </div>
        
        {/* Recherche */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher produits..."
              className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Tableau des produits */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center p-12">
              <FaBoxOpen className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500">Aucun produit trouvé</p>
            </div>
          ) : (
            <ProductTable 
              products={filteredProducts}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Modal d'édition/ajout */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        categories={categories}
        onSave={handleSave}
      />
    </div>
  );
};

export default AdminProducts;