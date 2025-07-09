import { useState, useEffect } from 'react';
import { FaSearch, FaCheck, FaTimes, FaChartLine } from 'react-icons/fa';
import AdminBusinessTable from '../components/admin/AdminBusinessTable';
import BusinessStats from '../components/admin/BusinessStats';

const AdminBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0
  });

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      try {
        // Simuler un appel API
        const mockBusinesses = Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          name: `Entreprise ${i + 1}`,
          owner: `Propriétaire ${i + 1}`,
          email: `contact@entreprise${i + 1}.com`,
          siret: `123456789${i.toString().padStart(4, '0')}`,
          sector: i % 3 === 0 ? 'Agriculture' : i % 2 === 0 ? 'Transformation' : 'Distribution',
          status: i % 4 === 0 ? 'pending' : 'active',
          products: Math.floor(Math.random() * 100),
          joinedDate: new Date(Date.now() - i * 86400000).toLocaleDateString()
        }));
        
        setBusinesses(mockBusinesses);
        
        // Calculer les stats
        setStats({
          total: mockBusinesses.length,
          active: mockBusinesses.filter(b => b.status === 'active').length,
          pending: mockBusinesses.filter(b => b.status === 'pending').length
        });
      } catch (error) {
        console.error("Erreur de chargement des entreprises:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  const filteredBusinesses = businesses.filter(business => {
    return business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           business.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
           business.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           business.siret.includes(searchTerm);
  });

  const handleApprove = (businessId) => {
    setBusinesses(businesses.map(b => 
      b.id === businessId ? {...b, status: 'active'} : b
    ));
    setStats({
      ...stats,
      active: stats.active + 1,
      pending: stats.pending - 1
    });
  };

  const handleReject = (businessId) => {
    if (window.confirm("Êtes-vous sûr de vouloir rejeter cette entreprise ?")) {
      setBusinesses(businesses.filter(b => b.id !== businessId));
      setStats({
        ...stats,
        total: stats.total - 1,
        pending: stats.pending - 1
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestion des Entreprises</h1>
        
        {/* Statistiques */}
        <BusinessStats stats={stats} loading={loading} />
        
        {/* Recherche et filtres */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher entreprises..."
                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2">
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                <FaChartLine className="mr-2" />
                Exporter
              </button>
            </div>
          </div>
        </div>
        
        {/* Tableau des entreprises */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <AdminBusinessTable 
            businesses={filteredBusinesses} 
            loading={loading}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminBusinesses;