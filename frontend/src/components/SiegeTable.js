import React from 'react';
import { Edit, Trash } from 'lucide-react';

const ALL_COLUMNS = [
  { key: 'nom', label: 'Nom' },
  { key: 'categorie', label: 'Catégorie' },
  { key: 'nomProjet', label: 'Projet' },
  { key: 'adresse', label: 'Adresse' },
  { key: 'pointContact', label: 'Point de Contact' },
  { key: 'horaires', label: 'Horaires' },
  { key: 'description', label: 'Description' },
];

const SiegeTable = ({ sieges, onEdit, onDelete, visibleColumns }) => {
  // Correction : garantir que visibleColumns est toujours un tableau
  const columns = Array.isArray(visibleColumns) && visibleColumns.length > 0
    ? visibleColumns
    : ALL_COLUMNS.map(col => col.key);

  return (
    <div className="overflow-x-auto rounded-2xl border border-blue-100 shadow-xl bg-white">
      <table className="min-w-full divide-y divide-blue-100 text-blue-900 text-sm rounded-2xl overflow-hidden">
        <thead className="sticky top-0 z-10 bg-white shadow-sm">
          <tr>
            {columns.includes('nom') && (
              <th className="px-3 py-2 text-xs font-bold text-blue-900 uppercase tracking-wider text-left whitespace-nowrap">Nom</th>
            )}
            {columns.includes('categorie') && (
              <th className="px-3 py-2 text-xs font-bold text-blue-900 uppercase tracking-wider text-left whitespace-nowrap">Catégorie</th>
            )}
            {columns.includes('nomProjet') && (
              <th className="px-3 py-2 text-xs font-bold text-blue-900 uppercase tracking-wider text-left whitespace-nowrap">Projet</th>
            )}
            {columns.includes('adresse') && (
              <th className="px-3 py-2 text-xs font-bold text-blue-900 uppercase tracking-wider text-left whitespace-nowrap">Adresse</th>
            )}
            {columns.includes('pointContact') && (
              <th className="px-3 py-2 text-xs font-bold text-blue-900 uppercase tracking-wider text-left whitespace-nowrap">Point de Contact</th>
            )}
            {columns.includes('horaires') && (
              <th className="px-3 py-2 text-xs font-bold text-blue-900 uppercase tracking-wider text-left whitespace-nowrap">Horaires</th>
            )}
            {columns.includes('description') && (
              <th className="px-3 py-2 text-xs font-bold text-blue-900 uppercase tracking-wider text-left whitespace-nowrap">Description</th>
            )}
            <th className="px-3 py-2 text-xs font-bold text-blue-900 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sieges.map((siege, idx) => (
            <tr key={siege.id} className={"hover:bg-indigo-50 transition-all " + (idx % 2 === 0 ? 'bg-white' : 'bg-blue-50')} style={{ borderRadius: 12 }}>
              {columns.includes('nom') && (
                <td className="px-3 py-2 font-bold text-blue-900">{siege.nom}</td>
              )}
              {columns.includes('categorie') && (
                <td className="px-3 py-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    siege.categorie === 'national' ? 'bg-blue-100 text-blue-800' :
                    siege.categorie === 'régional' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {siege.categorie || 'social'}
                  </span>
                </td>
              )}
              {columns.includes('nomProjet') && (
                <td className="px-3 py-2">{siege.nomProjet || '-'}</td>
              )}
              {columns.includes('adresse') && (
                <td className="px-3 py-2">{siege.adresse}</td>
              )}
              {columns.includes('pointContact') && (
                <td className="px-3 py-2">
                  <div>
                    <div className="text-sm font-medium">{siege.nomPointContact || '-'}</div>
                    <div className="text-xs text-gray-500">{siege.poste || '-'}</div>
                    <div className="text-xs text-gray-500">{siege.telephone || '-'}</div>
                    <div className="text-xs text-gray-500">{siege.email || '-'}</div>
                  </div>
                </td>
              )}
              {columns.includes('horaires') && (
                <td className="px-3 py-2">
                  <div className="text-xs">
                    <div><span className="font-medium">Matin:</span> {siege.horaireMatin || '-'}</div>
                    <div><span className="font-medium">Après-midi:</span> {siege.horaireApresMidi || '-'}</div>
                  </div>
                </td>
              )}
              {columns.includes('description') && (
                <td className="px-3 py-2">
                  <div className="max-w-xs truncate" title={siege.description || '-'}>
                    {siege.description || '-'}
                  </div>
                </td>
              )}
              <td className="px-3 py-2 whitespace-nowrap flex justify-center items-center gap-2">
                <button
                  onClick={() => onEdit && onEdit(siege)}
                  className="inline-flex items-center px-2 py-1 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition shadow-sm"
                  title="Modifier le local"
                >
                  <Edit size={15} className="mr-1" />
                </button>
                <button
                  onClick={() => onDelete && onDelete(siege)}
                  className="inline-flex items-center px-2 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-bold transition shadow-sm"
                  title="Supprimer le local"
                >
                  <Trash size={15} className="mr-1" />
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SiegeTable; 