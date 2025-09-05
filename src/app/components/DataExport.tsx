'use client';

// ---------------------------------------|
//                                        |
// TODO: Fetch from user data in supabase |
//                                        |
// ---------------------------------------|

import { useState } from 'react';
import { FaDownload, FaFileExport, FaSpinner } from 'react-icons/fa';

export default function DataExport() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    // TODO: Export data
    const userData = {
      profile: {
        name: 'João Teste da Silva',
        email: 'joaotestedasilva@example.com',
        bio: 'Amante da música',
        location: 'São Paulo, Brasil',
        joinDate: '2024-01-15'
      },
      settings: {
        notifications: { email: true, push: true, marketing: false },
        privacy: { profilePublic: true, showEmail: false },
        theme: 'light',
        language: 'pt-BR'
      },
      activity: {
        songsShared: 999,
        profileViews: 999,
        totalLikes: 999
      }
    };

    // Json export
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'groovetree-data.json';
    link.click();
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-6">
      <div className="flex items-center mb-4">
        <FaFileExport className="text-blue-600 dark:text-blue-400 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Export Data</h3>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Download a copy of all your data stored in Groovetree.
        This includes profile information, settings, and activity.
      </p>

      <div className="space-y-4">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center cursor-pointer"
        >
          {isExporting ? (
            <>
              <FaSpinner className="mr-2 animate-spin" />
              Preparing download...
            </>
          ) : (
            <>
              <FaDownload className="mr-2" />
              Download Data
            </>
          )}
        </button>
      </div>
    </div>
  );
}