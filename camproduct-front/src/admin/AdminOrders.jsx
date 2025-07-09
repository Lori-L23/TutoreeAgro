import { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaFileInvoiceDollar, 
  FaCheckCircle,
  FaTimesCircle,
  FaTruck
} from 'react-icons/fa';
import OrderTable from '../components/admin/OrderTable';
import OrderDetailsModal from '../components/admin/OrderDetailsModal';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all'
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Simuler un appel API
        const mockOrders = Array.from({ length: 15 }, (_, i) => {
          const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
          const status = statuses[i % statuses.length];
          
          return {
            id: `CMD-${1000 + i}`,
            customer: `Client ${i + 1}`,
            enterprise: `Entreprise ${(i % 5) + 1}`,
            date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
            amount: (Math.random() * 500 + 50).toFixed(2),
            status,
            items: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
              id: j + 1,
              name: `Produit ${j + 1}`,
              quantity: Math.floor(Math.random() * 10) + 1,
              price: (Math.random() * 100 + 5).toFixed(2)
            }))
          };
        });
        
        setOrders(mockOrders);
      } catch (error) {
        console.error("Erreur de chargement des commandes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.enterprise.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filters.status === 'all' || order.status === filters.status;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? {...order, status: newStatus} : order
    ));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaFileInvoiceDollar className="text-yellow-500" />;
      case 'processing': return <FaFileInvoiceDollar className="text-blue-500" />;
      case 'shipped': return <FaTruck className="text-purple-500" />;
      case 'delivered': return <FaCheckCircle className="text-green-500" />;
      case 'cancelled': return <FaTimesCircle className="text-red-500" />;
      default: return <FaFileInvoiceDollar className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestion des Commandes</h1>
        
        {/* Filtres et recherche */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher commandes..."
                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-500" />
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="processing">En traitement</option>
                <option value="shipped">Expédiée</option>
                <option value="delivered">Livrée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-500" />
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={filters.dateRange}
                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
              >
                <option value="all">Toutes les dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {filteredOrders.length} commande(s) trouvée(s)
            </p>
          </div>
        </div>
        
        {/* Tableau des commandes */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <OrderTable 
            orders={filteredOrders} 
            loading={loading}
            onViewDetails={handleViewDetails}
            onUpdateStatus={handleUpdateStatus}
            getStatusIcon={getStatusIcon}
          />
        </div>
      </div>

      {/* Modal de détails */}
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
        getStatusIcon={getStatusIcon}
      />
    </div>
  );
};

export default AdminOrders;