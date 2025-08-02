import React from 'react';
import { Edit } from 'lucide-react';

const ParcellesTable = ({ parcelles, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pratique</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom Projet</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Personne Référente</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Superficie</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {parcelles.map((parcelle) => (
              <tr key={parcelle.id}>
                <td className="px-4 py-2 whitespace-nowrap">{parcelle.nom}</td>
                <td className="px-4 py-2 whitespace-nowrap">{parcelle.pratique || '-'}</td>
                <td className="px-4 py-2 whitespace-nowrap">{parcelle.nomProjet || '-'}</td>
              <td className="px-4 py-2 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium">{parcelle.nomPersonneReferente || '-'}</div>
                  <div className="text-xs text-gray-500">{parcelle.poste || '-'}</div>
                </div>
              </td>
              <td className="px-4 py-2 whitespace-nowrap">{parcelle.superficie}</td>
              <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                <button
                  onClick={() => onEdit && onEdit(parcelle)}
                  className="text-indigo-600 hover:text-indigo-900"
                  title="Modifier le site de référence"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete && onDelete(parcelle)}
                  className="text-red-600 hover:text-red-900"
                  title="Supprimer le site de référence"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParcellesTable; 