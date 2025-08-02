import React from 'react';
import { Edit, Trash, Map } from 'lucide-react';

const ALL_COLUMNS = [
  { key: 'nom', label: 'Nom' },
  { key: 'adresse', label: 'Adresse' },
  { key: 'nomGestionnaire', label: 'Gestionnaire' },
  { key: 'especesProduites', label: 'Espèces produites' },
];

const PepinieresTable = ({ pepinieres = [], onEdit, onDelete, visibleColumns = [] }) => {
  if (!pepinieres || pepinieres.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucune pépinière trouvée</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-blue-100 shadow-xl bg-white">
      <table className="min-w-full divide-y divide-blue-100 text-blue-900 text-sm rounded-2xl overflow-hidden">
        <thead className="sticky top-0 z-10 bg-white shadow-sm">
          <tr>
            {ALL_COLUMNS.filter(col => visibleColumns.includes(col.key)).map(col => (
              <th key={col.key} className="px-3 py-2 text-xs font-bold text-blue-900 uppercase tracking-wider text-left whitespace-nowrap">{col.label}</th>
            ))}
            <th className="px-3 py-2 text-xs font-bold text-blue-900 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
        <tbody>
          {pepinieres.map((pepiniere, idx) => (
            <tr key={pepiniere.id} className={"hover:bg-indigo-50 transition-all " + (idx % 2 === 0 ? 'bg-white' : 'bg-blue-50')} style={{ borderRadius: 12 }}>
              {visibleColumns.includes('nom') && (
                <td className="px-3 py-2 font-bold text-blue-900">{pepiniere.nom}</td>
              )}
              {visibleColumns.includes('adresse') && (
                <td className="px-3 py-2">{pepiniere.adresse}</td>
              )}
              {visibleColumns.includes('nomGestionnaire') && (
                <td className="px-3 py-2">
                  <div>
                    <div className="text-sm font-medium">{pepiniere.nomGestionnaire || '-'}</div>
                    <div className="text-xs text-gray-500">{pepiniere.posteGestionnaire || '-'}</div>
                  </div>
                  </td>
              )}
              {visibleColumns.includes('especesProduites') && (
                <td className="px-3 py-2">
                  <div className="max-w-xs truncate" title={pepiniere.especesProduites || '-'}>
                    {pepiniere.especesProduites || '-'}
                  </div>
                  </td>
              )}
              <td className="px-3 py-2 whitespace-nowrap flex gap-2 items-center">
                    <button
                  onClick={() => onEdit && onEdit(pepiniere)}
                  className="inline-flex items-center px-2 py-1 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition shadow-sm"
                  title="Modifier la pépinière"
                    >
                  <Edit size={15} className="mr-1" />
                    </button>
                    <button
                  onClick={() => onDelete && onDelete(pepiniere)}
                  className="inline-flex items-center px-2 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-bold transition shadow-sm"
                  title="Supprimer la pépinière"
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

export default PepinieresTable; 