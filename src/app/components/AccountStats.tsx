'use client';

// ---------------------------------------|
//                                        |
// TODO: Fetch from user data in supabase |
//                                        |
// ---------------------------------------|

import { FaCalendarAlt, FaEye, FaHeart, FaMusic } from 'react-icons/fa';

export default function AccountStats() {
  const stats = [
    {
      icon: FaCalendarAlt,
      label: 'Member since',
      value: '2025-08-28',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: FaEye,
      label: 'Artist page views',
      value: '666',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: FaHeart,
      label: 'Total Likes',
      value: '69',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: FaMusic,
      label: 'Songs click',
      value: '420',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Account stats</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.bgColor} mb-2`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}