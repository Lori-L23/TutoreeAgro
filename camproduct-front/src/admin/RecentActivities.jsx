import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaUserPlus } from 'react-icons/fa';

const activities = [
  { id: 1, icon: <FaUserPlus />, text: "Nouvel utilisateur inscrit", date: "Il y a 2 heures" },
  { id: 2, icon: <FaCheckCircle />, text: "Entreprise validée", date: "Hier" },
  { id: 3, icon: <FaExclamationTriangle />, text: "Avis signalé", date: "Il y a 3 jours" },
];

const RecentActivities = () => {
  return (
    <ul className="divide-y divide-gray-200">
      {activities.map((activity) => (
        <li key={activity.id} className="py-4 flex items-start space-x-4">
          <div className="text-green-600 text-lg">
            {activity.icon}
          </div>
          <div>
            <p className="text-sm text-gray-700">{activity.text}</p>
            <p className="text-xs text-gray-400">{activity.date}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default RecentActivities;
