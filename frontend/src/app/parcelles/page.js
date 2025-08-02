"use client";
import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { GET_MY_PARCELLES, DELETE_PARCELLE} from '../../lib/graphql-queries';
import { toast } from 'sonner';
import ParcellesMap from '../../components/ParcellesMap';
import ParcelleModal from '../../components/ParcelleModal';
import CSVImportExport from '../../components/CSVImportExport';
import { DataTable } from '../../components/ui/table-data-table';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Edit, Trash, Plus, ChevronLeft, ChevronRight, Map, Eye } from 'lucide-react';
import { useAuth } from '../../components/Providers';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import ParcelleDetailModal from '@/components/ParcelleDetailModal'

export default function ParcellesPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  // toast de sonner utilisé pour les notifications
  const [showForm, setShowForm] = useState(false);
  const [setSelectedParcelle] = useState(null);
  const [mapFullscreen, setMapFullscreen] = useState(false);
  const [editingParcelle, setEditingParcelle] = useState(null);
  const [mapStyle, setMapStyle] = useState('street');
  const [search ] = useState('');
  const [sortBy ] = useState('nom');
  const [sortDir ] = useState('asc');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showMap, setShowMap] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedParcelleDetails, setSelectedParcelleDetails] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [parcelleToDelete, setParcelleToDelete] = useState(null);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const { data: parcellesData, loading: parcellesLoading, refetch: refetchParcelles } = useQuery(GET_MY_PARCELLES, {
    skip: !isAuthenticated,
  });


  const [deleteParcelle] = useMutation(DELETE_PARCELLE);

  const columns = [
    { key: 'nom', label: 'Site de référence' },
    { key: 'superficie', label: 'Superficie' },
    { key: 'personneReferente', label: 'Personne référente' },
    { key: 'nomProjet', label: 'Projet rattaché' },
  ];
  // On retire 'pratique' des colonnes visibles
  const [visibleColumns] = useState(columns.map(c => c.key));


  const columnsDT = [
    ...visibleColumns.map(colKey => {
      const col = columns.find(c => c.key === colKey);
      if (!col) return null;
      if (col.key === 'personneReferente') {
        return {
          accessorKey: 'Personne référente',
          header: 'Personne référente',
          cell: info => {
            const p = info.row.original;
            return (
              <div>
                <div className="text-sm font-medium">{p.nomPersonneReferente || '-'}</div>
                <div className="text-xs text-gray-500">{p.poste || '-'}</div>
                <div className="text-xs text-gray-500">{p.telephone || '-'}</div>
                <div className="text-xs text-gray-500">{p.email || '-'}</div>
              </div>
            );
          },
        };
      }
      return {
        accessorKey: col.key,
        header: col.label,
        cell: info => {
          const parcelle = info.row.original;
          if (col.key === 'superficie') return parcelle.superficie ? `${parcelle.superficie} ha` : '-';
          if (col.key === 'createdAt') return parcelle.createdAt ? new Date(parcelle.createdAt).toLocaleDateString('fr-FR') : '';
          return parcelle[col.key] || '-';
        },
      };
    }).filter(Boolean),
    {
      id: 'actions',
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => (
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShowDetails(row.original)}
            title="Voir les détails"
            className="text-blue-600 hover:text-blue-800"
          >
            <Eye size={15} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditParcelle(row.original)}
            title="Modifier le site de référence"
          >
            <Edit size={15} />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteParcelle(row.original.id)}
            title="Supprimer le site de référence"
          >
            <Trash size={15} />
          </Button>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const filteredParcelles = useMemo(() => {
    let data = parcellesData?.myParcelles || [];
    if (search) {
      const lowerSearch = search.toLowerCase();
      data = data.filter(row =>
        visibleColumns.some(col => {
          if (col === 'personneReferente') {
            return (
              (row.nomPersonneReferente && row.nomPersonneReferente.toLowerCase().includes(lowerSearch)) ||
              (row.poste && row.poste.toLowerCase().includes(lowerSearch)) ||
              (row.telephone && row.telephone.toLowerCase().includes(lowerSearch)) ||
              (row.email && row.email.toLowerCase().includes(lowerSearch))
            );
          }
          let value = row[col];
          if (value === undefined || value === null) return false;
          return String(value).toLowerCase().includes(lowerSearch);
        })
      );
    }
    data = [...data].sort((a, b) => {
      let vA = a[sortBy] || '';
      let vB = b[sortBy] || '';
      if (typeof vA === 'string' && typeof vB === 'string') {
        if (vA < vB) return sortDir === 'asc' ? -1 : 1;
        if (vA > vB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      }
      return 0;
    });
    return data;
  }, [parcellesData?.myParcelles, search, sortBy, sortDir, visibleColumns]);

  const paginatedParcelles = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredParcelles.slice(start, start + rowsPerPage);
  }, [filteredParcelles, page, rowsPerPage]);


  const handleDeleteParcelle = (id) => {
    setParcelleToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteParcelle = async () => {
    if (!parcelleToDelete) return;
    try {
      const { data } = await deleteParcelle({
        variables: { id: parcelleToDelete }
      });
      if (data.deleteParcelle.success) {
        toast.success('Site de référence supprimé avec succès');
        refetchParcelles();
      } else {
        toast.error(data.deleteParcelle.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
      console.error('Delete error:', error);
    } finally {
      setShowDeleteConfirm(false);
      setParcelleToDelete(null);
    }
  };

  const handleEditParcelle = (parcelle) => {
    setEditingParcelle(parcelle);
    setShowForm(true);
  };

  const handleShowDetails = (parcelle) => {
    setSelectedParcelleDetails(parcelle);
    setShowDetailsModal(true);
  };

  const totalPages = Math.ceil(filteredParcelles.length / rowsPerPage);
  const rowsPerPageOptions = [10, 25, 50];
  const dataTableActions = (
    <div className="flex items-center gap-2">
      <Select
        value={String(rowsPerPage)}
        onValueChange={v => { setRowsPerPage(Number(v)); setPage(1); }}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Lignes par page" />
        </SelectTrigger>
        <SelectContent>
          {rowsPerPageOptions.map(opt => (
            <SelectItem key={opt} value={String(opt)}>{opt} par page</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  if (isLoading || parcellesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const parcelles = parcellesData?.myParcelles || [];
  const loading = parcellesLoading;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
          <div className="flex-shrink-0">
            <h1 className="text-2xl lg:text-3xl font-extrabold midnight-blue-text drop-shadow-sm">
              Mes sites de référence
            </h1>
            <p className="text-gray-700 mt-1 font-medium text-sm lg:text-base">
              {parcelles.length} site{parcelles.length !== 1 ? 's' : ''} de référence au total
            </p>
          </div>
          {/* Masquer les boutons Ajouter/Export quand la carte est affichée */}
          {!(showMap || mapFullscreen) && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => { setEditingParcelle(null); setShowForm(true); }}
                className="px-4 py-2 midnight-blue-btn rounded-md shadow font-bold transition flex items-center justify-center gap-2 text-sm"
                title="Ajouter un nouveau site de référence"
              >
                <Plus size={16} /> Ajouter un site
              </button>
              <button
                onClick={() => setShowCSVModal(true)}
                className="px-4 py-2 midnight-blue-btn rounded-md shadow font-bold transition flex items-center justify-center gap-2 text-sm"
                title="Import/Export CSV"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Import/Export CSV
              </button>
            </div>
          )}
          {(showMap || mapFullscreen) && (
            <div className="flex items-center gap-2">
              <select
                value={mapStyle}
                onChange={(e) => setMapStyle(e.target.value)}
                className="px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-blue-900 font-semibold shadow-sm text-sm"
              >
                <option value="street">Carte routière</option>
                <option value="satellite">Satellite</option>
                <option value="hybrid">Hybride</option>
              </select>
              {!mapFullscreen && (
                <button
                  onClick={() => setMapFullscreen(true)}
                  className="px-3 py-2 midnight-blue-btn rounded-md font-semibold shadow-sm transition text-sm"
                  title="Afficher la carte en plein écran"
                >
                  Plein écran
                </button>
              )}
              {mapFullscreen && (
                <button
                  onClick={() => setMapFullscreen(false)}
                  className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-semibold shadow-sm transition text-sm"
                  title="Quitter le plein écran"
                >
                  Quitter
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Affichage conditionnel : Carte ou Tableau */}
      {showMap || mapFullscreen ? (
        <div
          className={mapFullscreen ? "fixed inset-0 z-50 bg-white bg-opacity-95 flex flex-col" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}
          style={mapFullscreen ? {height: '100vh', width: '100vw', margin: 0, padding: 0} : {}}
        >
          {/* Bouton pour revenir au tableau au-dessus de la carte */}
          {!mapFullscreen && (
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setShowMap(false)}
                className="px-3 py-2 rounded-md border midnight-blue-border bg-white midnight-blue-text hover:bg-blue-50 flex items-center gap-2 shadow-sm transition font-semibold text-sm"
              >
                <Map size={16} />
                <span className="hidden sm:inline">Voir le tableau</span>
                <span className="sm:hidden">Tableau</span>
              </button>
            </div>
          )}
          <div
            className={mapFullscreen ? "flex-1 flex flex-col relative" : "bg-white rounded-lg shadow-lg overflow-hidden"}
            style={mapFullscreen ? {height: '100%', width: '100%', maxWidth: '100vw', maxHeight: '100vh', margin: 0, padding: 0} : {}}
          >
            {/* Quitter plein écran visible en overlay en haut à droite en mode plein écran */}
            {mapFullscreen && (
              <button
                onClick={() => setMapFullscreen(false)}
                className="absolute top-4 right-4 z-50 px-4 py-2 bg-gray-700 text-white rounded-xl shadow-lg hover:bg-gray-900 font-bold transition"
                title="Quitter le plein écran"
              >
                Quitter plein écran
              </button>
            )}
            <div className={mapFullscreen ? "p-4 border-b" : "p-4 border-b"}>
              <h2 className="text-lg font-semibold text-gray-900">Carte des sites de référence</h2>
              <p className="text-sm text-gray-600">
                {parcelles.length} site{parcelles.length !== 1 ? 's' : ''} de référence affiché{parcelles.length !== 1 ? 's' : ''} sur la carte
              </p>
            </div>
            <div
              className={mapFullscreen ? "flex-1 flex" : ""}
              style={mapFullscreen ? {height: '100%', width: '100%', minHeight: 0, minWidth: 0, margin: 0, padding: 0} : { height: '600px', width: '100%' }}
            >
              {loading ? (
                <div className="flex items-center justify-center w-full h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Chargement de la carte...</p>
                  </div>
                </div>
              ) : (
                <ParcellesMap
                  parcelles={parcelles}
                  sieges={[]}
                  pepinieres={[]}
                  onParcelleClick={setSelectedParcelle}
                  mapStyle={mapStyle}
                  style={mapFullscreen ? { height: '100%', width: '100%' } : { height: '100%', minHeight: 400 }}
                  mode="parcelle"
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Bouton Voir la carte au-dessus du tableau, aligné à droite */}
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setShowMap(true)}
              className="px-3 py-2 rounded-md border midnight-blue-border bg-white midnight-blue-text hover:bg-blue-50 flex items-center gap-2 shadow-sm transition font-semibold text-sm"
            >
              <Map size={16} />
              <span className="hidden sm:inline">Voir la carte</span>
              <span className="sm:hidden">Carte</span>
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <DataTable
              columns={columnsDT}
              data={paginatedParcelles}
              filterKey="nom"
              filterPlaceholder="Rechercher par nom..."
              actions={dataTableActions}
            />
            {/* Pagination sous le DataTable (footer unique) */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-b-2xl border-t border-blue-100">
              <div className="text-sm text-blue-900 font-semibold">
                Page {page} sur {totalPages}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)} className="flex items-center gap-1">
                  <ChevronLeft size={14} /> <span className="hidden sm:inline">Précédent</span>
                </Button>
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)} className="flex items-center gap-1">
                  <span className="hidden sm:inline">Suivant</span> <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout/modification */}
      <ParcelleModal
        open={showForm}
        onClose={() => { setShowForm(false); setEditingParcelle(null); }}
        parcelle={editingParcelle}
        onSuccess={() => { setShowForm(false); setEditingParcelle(null); refetchParcelles(); }}
        title={editingParcelle ? 'Modifier le site de référence' : 'Ajouter un nouveau site de référence'}
        description={editingParcelle ? 'Modifiez les informations du site.' : 'Remplissez le formulaire pour ajouter un nouveau site.'}
      />

      {/* Modal Import/Export CSV */}
      {showCSVModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 relative">
            <button
              onClick={() => setShowCSVModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
              title="Fermer"
            >
              ×
            </button>
            <CSVImportExport onImportSuccess={() => { setShowCSVModal(false); refetchParcelles(); }} />
          </div>
        </div>
      )}

      {/* Modal de détails du site de référence */}
      {showDetailsModal && selectedParcelleDetails && (
        <ParcelleDetailModal 
          parcelle={selectedParcelleDetails}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedParcelleDetails(null);
          }}
          onEdit={() => {
            setShowDetailsModal(false);
            setSelectedParcelleDetails(null);
            handleEditParcelle(selectedParcelleDetails);
          }}
        />
      )}

      {/* Modal de confirmation suppression */}
      {showDeleteConfirm && (
        <ConfirmationDialog
          isOpen={showDeleteConfirm}
          onClose={() => { setShowDeleteConfirm(false); setParcelleToDelete(null); }}
          onConfirm={confirmDeleteParcelle}
          title="Confirmer la suppression"
          message="Êtes-vous sûr de vouloir supprimer ce site de référence ?"
          confirmText="Supprimer"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
        />
      )}
    </div>
  );
} 