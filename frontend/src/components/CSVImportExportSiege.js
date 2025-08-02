'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { EXPORT_SIEGES_CSV, IMPORT_SIEGES_CSV } from '../lib/graphql-queries';
import { useToast } from '../lib/useToast';

const CSVImportExportSiege = ({ onImportSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importErrors, setImportErrors] = useState([]);
  const { showSuccess, showError } = useToast();

  const [exportSiegesCSV] = useMutation(EXPORT_SIEGES_CSV);
  const [importSiegesCSV] = useMutation(IMPORT_SIEGES_CSV);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setImportErrors([]);
    } else {
      showError('Veuillez sélectionner un fichier CSV valide.');
      setSelectedFile(null);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { data } = await exportSiegesCSV();
      if (data.exportSiegesCsv.success) {
        const blob = new Blob([data.exportSiegesCsv.csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `locaux_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showSuccess(data.exportSiegesCsv.message);
      } else {
        showError(data.exportSiegesCsv.message);
      }
    } catch (error) {
      showError('Erreur lors de l\'export CSV');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      showError('Veuillez sélectionner un fichier CSV à importer.');
      return;
    }
    setIsImporting(true);
    try {
      const { data } = await importSiegesCSV({
        variables: {
          csvFile: selectedFile
        }
      });
      if (data.importSiegesCsv.success) {
        showSuccess(data.importSiegesCsv.message);
        setSelectedFile(null);
        setImportErrors(data.importSiegesCsv.errors || []);
        const fileInput = document.getElementById('csv-siege-file-input');
        if (fileInput) fileInput.value = '';
        if (onImportSuccess) onImportSuccess();
      } else {
        showError(data.importSiegesCsv.message);
        setImportErrors(data.importSiegesCsv.errors || []);
      }
    } catch (error) {
      showError('Erreur lors de l\'import CSV');
      console.error('Import error:', error);
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
  // En-têtes correspondant exactement aux champs attendus par la mutation
  const templateHeaders = [
    'Nom',
    'Adresse', 
    'Latitude', 
    'Longitude', 
    'Description',
    'Catégorie',
    'Nom Point Contact',
    'Poste',
    'Téléphone',
    'Email',
    'Nom Projet',
    'Horaire Matin',
    'Horaire Après-midi'
  ];
  
  // Données d'exemple avec des coordonnées correctement formatées
  const templateData = [
    '"Siège Principal Paris"',
    '"123 Avenue des Champs-Élysées, 75008 Paris"',
    '48.866667',  // Format décimal sans guillemets
    '2.333333',   // Format décimal sans guillemets
    '"Siège social principal de l\'entreprise"',
    'social',
    '"Jean Dupont"',
    '"Directeur Général"',
    '"+33 1 23 45 67 89"',
    'jean.dupont@entreprise.com',
    '"Projet Alpha"',
    '"08:00 - 12:00"',
    '"14:00 - 18:00"'
  ];
  
  // Exemple avec différents formats de coordonnées pour montrer la flexibilité
  const templateData2 = [
    '"Siège Régional Lyon"',
    '"Place Bellecour, 69002 Lyon"',
    '45,764043',  
    '4,835659', 
    '"Siège régional pour le Sud-Est"',
    'regional',
    '"Marie Martin"',
    '"Responsable Régionale"',
    '"+33 4 78 90 12 34"',
    'marie.martin@entreprise.com',
    '"Projet Beta"',
    '"09:00 - 12:30"',
    '"13:30 - 17:30"'
  ];
  
  const csvContent = [
    templateHeaders.join(','),
    templateData.join(','),
    templateData2.join(',')
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'template_locaux.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6 text-gray-800 text-center">Import/Export CSV des locaux</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-700">Exporter les locaux</h4>
          <p className="text-sm text-gray-600">
            Téléchargez tous vos locaux au format CSV pour sauvegarder ou partager vos données.
          </p>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
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
                Exporter en CSV
              </>
            )}
          </button>
        </div>
        {/* Import Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-700">Importer des locaux</h4>
          <p className="text-sm text-gray-600">
            Importez des locaux depuis un fichier CSV. Téléchargez d'abord le modèle pour voir le format attendu.
          </p>
          <div className="space-y-3">
            <button
              onClick={downloadTemplate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Télécharger le modèle CSV
            </button>
            <div>
              <label htmlFor="csv-siege-file-input" className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionner un fichier CSV
              </label>
              <input
                id="csv-siege-file-input"
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <button
              onClick={handleImport}
              disabled={!selectedFile || isImporting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
            >
              {isImporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Import en cours...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Importer le CSV
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Error Display */}
      {importErrors.length > 0 && (
        <div className="mt-6">
          <h5 className="text-sm font-medium text-red-700 mb-2">Erreurs d'import :</h5>
          <div className="bg-red-50 border border-red-200 rounded-md p-3 max-h-40 overflow-y-auto">
            {importErrors.map((error, index) => (
              <div key={index} className="text-sm text-red-600 mb-1">
                • {error}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h5 className="text-sm font-medium text-gray-700 mb-2">Instructions :</h5>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Les champs <strong>Nom</strong>, <strong>Adresse</strong>, <strong>Latitude</strong> et <strong>Longitude</strong> sont obligatoires</li>
          <li>• Les coordonnées doivent être des nombres (ex: 48.8566, 2.3522)</li>
          <li>• Les champs optionnels : Description, Catégorie, Nom Point Contact, Poste, Téléphone, Email, Nom Projet, Horaire Matin, Horaire Après-midi</li>
          <li>• Catégories possibles : social, regional, technique, provisoire (défaut: social)</li>
          <li>• L'utilisateur sera automatiquement associé lors de l'enregistrement</li>
        </ul>
      </div>
    </div>
  );
};

export default CSVImportExportSiege;