'use client';

import { useState } from 'react';
import { useToast } from '../lib/useToast';

const CSVExport = ({ data, filename, onExport, disabled = false }) => {
  const [isExporting, setIsExporting] = useState(false);
  const { showSuccess, showError } = useToast();

  const exportToCSV = async () => {
    if (!data || data.length === 0) {
      showError('Aucune donnée à exporter');
      return;
    }

    setIsExporting(true);
    try {
      // Traiter les données si une fonction de traitement est fournie
      const processedData = onExport ? onExport(data) : data;
      
      // Générer les en-têtes CSV
      const headers = Object.keys(processedData[0]);
      
      // Créer le contenu CSV
      const csvContent = [
        headers.join(','),
        ...processedData.map(row => 
          headers.map(header => {
            const value = row[header];
            // Gérer les valeurs spéciales
            if (value === null || value === undefined) return '';
            if (typeof value === 'object') return JSON.stringify(value);
            // Échapper les virgules et guillemets
            const stringValue = String(value);
            if (stringValue && (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n'))) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue || '';
          }).join(',')
        )
      ].join('\n');

      // Créer et télécharger le fichier
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showSuccess(`Export CSV réussi : ${processedData.length} enregistrement(s)`);
    } catch (error) {
      showError('Erreur lors de l\'export CSV');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={exportToCSV}
      disabled={disabled || isExporting}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors duration-200"
    >
      {isExporting ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Export en cours...
        </>
      ) : (
        <>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exporter en CSV ({data?.length || 0})
        </>
      )}
    </button>
  );
};

export default CSVExport; 