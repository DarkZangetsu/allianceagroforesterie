import * as React from 'react';
import { DataTable } from './ui/table-data-table';
import { Button } from './ui/button';

export default function UsersTable({ users, onToggleActive, onEditAbreviation, isLoading = false }) {
  const [editingUser, setEditingUser] = React.useState(null);
  const [newAbreviation, setNewAbreviation] = React.useState('');

  const columns = React.useMemo(() => [
    {
      accessorKey: 'nomInstitution',
      header: "Institution/Projet",
      cell: info => (
        <div>
          <div className="font-medium">{info.row.original.nomInstitution || (info.row.original.firstName + ' ' + info.row.original.lastName) || info.row.original.email}</div>
          <div className="text-sm text-gray-500">{info.row.original.nomProjet || '-'}</div>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'role',
      header: 'Rôle',
      cell: info => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${info.getValue() === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>{info.getValue()}</span>
      ),
    },
    {
      accessorKey: 'abreviation',
      header: 'Abréviation',
      cell: info => info.getValue() ? <span className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{info.getValue()}</span> : <span className="text-gray-400 italic">-</span>,
    },
    {
      accessorKey: 'isActive',
      header: 'Statut',
      cell: info => info.getValue() ? (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>Actif</span>
      ) : (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><span className="w-2 h-2 bg-red-400 rounded-full mr-1"></span>Inactif</span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant={row.original.isActive ? 'destructive' : 'default'}
            size="sm"
            onClick={() => onToggleActive && onToggleActive(row.original)}
            disabled={isLoading}
            title={row.original.isActive ? 'Désactiver le compte' : 'Activer le compte'}
          >
            {isLoading ? (
              <span className="flex items-center"><div className="animate-spin rounded-full h-3 w-3 border-b border-current mr-1"></div>{row.original.isActive ? 'Désactivation...' : 'Activation...'}</span>
            ) : (
              row.original.isActive ? 'Désactiver' : 'Activer'
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditingUser(row.original);
              setNewAbreviation(row.original.abreviation || '');
            }}
            disabled={isLoading}
            title="Modifier l'abréviation"
          >
            Modifier abrév.
          </Button>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'dateJoined',
      header: "Date d'inscription",
      cell: info => info.getValue() ? new Date(info.getValue()).toLocaleDateString('fr-FR') : '-',
    },
  ], [onToggleActive, isLoading]);

  // Modal édition abréviation
  const handleSaveAbreviation = () => {
    if (newAbreviation.trim() && onEditAbreviation && editingUser) {
      onEditAbreviation(editingUser, newAbreviation.trim());
      setEditingUser(null);
      setNewAbreviation('');
    }
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={Array.isArray(users) ? users : []}
        filterKey="nomInstitution"
        filterPlaceholder="Rechercher par institution..."
      />
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={e => { if (e.target === e.currentTarget) { setEditingUser(null); setNewAbreviation(''); } }}>
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Modifier l'abréviation</h3>
            <p className="text-sm text-gray-600 mb-4">Modifier l'abréviation pour <strong>{editingUser.nomInstitution || (editingUser.firstName + ' ' + editingUser.lastName) || editingUser.email}</strong></p>
            <div className="mb-4">
              <label htmlFor="abreviation" className="block text-sm font-medium text-gray-700 mb-2">Abréviation</label>
              <input
                type="text"
                id="abreviation"
                value={newAbreviation}
                onChange={e => setNewAbreviation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: JD"
                maxLength={20}
                autoFocus
                disabled={isLoading}
                onKeyDown={e => {
                  if (e.key === 'Escape') { setEditingUser(null); setNewAbreviation(''); }
                  if (e.key === 'Enter' && newAbreviation.trim()) { handleSaveAbreviation(); }
                }}
              />
              <p className="text-xs text-gray-500 mt-1">Maximum 20 caractères • Entrée pour sauvegarder, Échap pour annuler</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setEditingUser(null); setNewAbreviation(''); }} disabled={isLoading}>Annuler</Button>
              <Button onClick={handleSaveAbreviation} disabled={!newAbreviation.trim() || isLoading}>
                {isLoading ? (<><div className="animate-spin rounded-full h-4 w-4 border-b border-white mr-2"></div>Enregistrement...</>) : 'Enregistrer'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 