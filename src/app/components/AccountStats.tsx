'use client';

// ---------------------------------------|
//                                        |
// TODO: Fetch from user data in supabase |
//                                        |
// ---------------------------------------|

import { FaCalendarAlt, FaEye, FaHeart, FaMusic } from 'react-icons/fa';

interface AccountStatsProps {
  joinDate?: string;
  profileViews?: number;
  totalLikes?: number;
  songsShared?: number;
}

export default function AccountStats({
  joinDate = '2025-08-28',
  profileViews = 69,
  totalLikes = 666,
  songsShared = 420
}: AccountStatsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const stats = [
    {
      icon: FaCalendarAlt,
      label: 'Member since',
      value: formatDate(joinDate),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: FaEye,
      label: 'Artist page views',
      value: formatNumber(profileViews),
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: FaHeart,
      label: 'Total Likes',
      value: formatNumber(totalLikes),
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: FaMusic,
      label: 'Songs click',
      value: formatNumber(songsShared),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Estatísticas da Conta</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.bgColor} mb-2`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}