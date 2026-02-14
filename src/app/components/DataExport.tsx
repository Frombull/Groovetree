'use client';

import { useState } from 'react';
import { FaDownload, FaFileExport, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function DataExport() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Fetch user data from API
      const response = await fetch('/api/user/export');

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();

      // Criar nome do arquivo com data atual
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const fileName = `groovetree-data-${dateStr}.json`;

      // Criar e baixar o arquivo JSON
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);

      toast.success('Done!');
    } catch (error) {
      console.error('Error exporting user data:', error);
      toast.error('Error exporting data. Try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-6">
      <div className="flex items-center mb-4">
        <FaFileExport className="text-blue-600 dark:text-blue-400 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Export Data</h3>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Download a complete copy of all your data stored in Groovetree.
      </p>

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
            Download Data (JSON)
          </>
        )}
      </button>
    </div>
  );
}