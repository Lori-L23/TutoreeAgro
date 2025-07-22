// components/admin/RecentActivities.jsx
import { FaUser, FaStore, FaShoppingCart, FaFileAlt } from 'react-icons/fa';

const RecentActivities = ({ activities, loading }) => {
  const getActivityIcon = (type) => {
    switch(type) {
      case 'user':
        return <FaUser className="text-blue-500" />;
      case 'company':
        return <FaStore className="text-green-500" />;
      case 'order':
        return <FaShoppingCart className="text-purple-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.length > 0 ? (
        activities.map((activity) => (
          <div key={activity.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
            <div className="p-2 rounded-full bg-gray-50 mr-3">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {activity.user?.name || 'Système'} • {activity.description}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(activity.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 py-4">Aucune activité récente</p>
      )}
    </div>
  );
};

export default RecentActivities;