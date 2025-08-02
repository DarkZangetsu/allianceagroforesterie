"use client";
import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useAuth } from "../../components/Providers";
import { useRouter } from "next/navigation";
import { GET_MY_SIEGES, DELETE_SIEGE } from "../../lib/graphql-queries";
import { useAuthGuard } from '../../lib/useAuthGuard';
import SiegesMap from "../../components/SiegesMap";
import { Map, Plus, Edit, Trash, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useToast } from '../../lib/useToast';
import CSVImportExportSiege from '../../components/CSVImportExportSiege';
import SiegeModal from '../../components/SiegeModal';
import { DataTable } from '../../components/ui/table-data-table';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import SiegeDetailModal from "@/components/SiegeDetailModal";

// Mapping des catégories pour affichage lisible
const CATEGORIE_LABELS = {
  social: "Siège social",
  regional: "Siège régional",
  technique: "Siège technique",
  provisoire: "Siège provisoire",
};

export default function SiegePage() {
  const { isLoading: authLoading, isAuthorized } = useAuthGuard(true);
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [showMap, setShowMap] = useState(false);
  const [mapFullscreen, setMapFullscreen] = useState(false);
  const [mapStyle, setMapStyle] = useState('street');
  const [search] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visibleColumns] = useState([
    "nom",
    "categorie",
    "adresse",
    "pointContact",
    "horaires",
    "nomProjet"
  ]);
  const { showSuccess, showError } = useToast();
  const [editingSiege, setEditingSiege] = useState(null);
  const [deleteSiege] = useMutation(DELETE_SIEGE);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showSiegeModal, setShowSiegeModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSiege, setSelectedSiege] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [siegeToDelete, setSiegeToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { data: siegesData, loading: siegesLoading, refetch: refetchSieges } = useQuery(GET_MY_SIEGES, {
    skip: !isAuthenticated || (user && (user.role === "ADMIN" || user.role === "admin")),
  });
  const sieges = siegesData?.mySieges || [];

  // Afficher un loader pendant la vérification d'authentification
  if (authLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {authLoading ? 'Vérification de l\'authentification...' : 'Redirection vers la page de connexion...'}
          </p>
        </div>
      </div>
    );
  }

  // Redirection si non membre
  if (!isLoading && (!isAuthenticated || !user || user.role === "ADMIN" || user.role === "admin")) {
    router.push("/");
    return null;
  }

  const handleSiegeSuccess = () => {
    setShowSiegeModal(false);
    setEditingSiege(null);
    refetchSieges();
  };

  const handleSiegeClick = (siege) => {

  };


  // Recherche et pagination
  const filteredSieges = useMemo(() => {
    let data = sieges;
    if (search) {
      const lowerSearch = search.toLowerCase();
      data = data.filter(row =>
        visibleColumns.some(col => {
          const value = row[col];
          if (value === undefined || value === null) return false;
          return String(value).toLowerCase().includes(lowerSearch);
        })
      );
    }
    return data;
  }, [sieges, search, visibleColumns]);

  const paginatedSieges = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredSieges.slice(start, start + rowsPerPage);
  }, [filteredSieges, page, rowsPerPage]);

  const totalPages = Math.ceil(filteredSieges.length / rowsPerPage);

  const handleEditSiege = (siege) => {
    setEditingSiege(siege);
    setShowSiegeModal(true);
  };

  const handleAddSiege = () => {
    setEditingSiege(null);
    setShowSiegeModal(true);
  };

  const handleDeleteSiege = (siege) => {
    setSiegeToDelete(siege);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteSiege = async () => {
    if (!siegeToDelete) return;
    setDeleteLoading(true);
    try {
      const { data } = await deleteSiege({ variables: { id: siegeToDelete.id } });
      if (data.deleteSiege.success) {
        showSuccess('Local supprimé avec succès');
        refetchSieges();
      } else {
        showError(data.deleteSiege.message);
      }
    } catch (e) {
      showError('Erreur lors de la suppression');
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
      setSiegeToDelete(null);
    }
  };

  const handleShowDetails = (siege) => {
    setSelectedSiege(siege);
    setShowDetailsModal(true);
  };

  // Colonnes DataTable shadcn/ui
  const columns = useMemo(() => [
    visibleColumns.includes('nom') && {
      id: 'nom',
      header: 'Locaux',
      cell: info => info.row.original.nom || '-',
    },
    visibleColumns.includes('categorie') && {
      id: 'Catégorie',
      header: 'Catégorie',
      cell: info => {
        const cat = info.row.original.categorie;
        return CATEGORIE_LABELS[(cat || '').toLowerCase()] || cat || '-';
      },
    },
    visibleColumns.includes('adresse') && {
      id: 'Adresse',
      header: 'Adresse',
      cell: info => info.row.original.adresse || '-',
    },
    visibleColumns.includes('pointContact') && {
      id: 'Point de Contact',
      header: 'Point de Contact',
      cell: info => {
        const s = info.row.original;
        return (
          <div>
            <div className="text-sm font-medium">{s.nomPointContact || '-'}</div>
            <div className="text-xs text-gray-500">{s.poste || '-'}</div>
            <div className="text-xs text-gray-500">{s.telephone || '-'}</div>
            <div className="text-xs text-gray-500">{s.email || '-'}</div>
          </div>
        );
      },
    },
    visibleColumns.includes('horaires') && {
      id: 'Horaires',
      header: 'Horaires',
      cell: info => {
        const s = info.row.original;
        return (
          <div className="text-xs">
            <div><span className="font-medium">Matin:</span> {s.horaireMatin || '-'}</div>
            <div><span className="font-medium">Après-midi:</span> {s.horaireApresMidi || '-'}</div>
          </div>
        );
      },
    },
    visibleColumns.includes('nomProjet') && {
      id: 'Projet rattaché',
      header: 'Projet rattaché',
      cell: info => info.row.original.nomProjet || '-',
    },
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
            onClick={() => handleEditSiege(row.original)}
            title="Modifier le local"
          >
            <Edit size={15} />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteSiege(row.original)}
            title="Supprimer le local"
          >
            <Trash size={15} />
          </Button>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ].filter(Boolean), [visibleColumns]);

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



  // Ajout d'une variable CSS pour la couleur midnight blue
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        --midnight-blue: rgb(0,70,144);
      }
      .midnight-blue-bg {
        background-color: var(--midnight-blue) !important;
        color: #fff !important;
      }
      .midnight-blue-text {
        color: var(--midnight-blue) !important;
      }
      .midnight-blue-border {
        border-color: var(--midnight-blue) !important;
      }
      .midnight-blue-btn {
        background-color: var(--midnight-blue) !important;
        color: #fff !important;
        border: 1px solid var(--midnight-blue) !important;
      }
      .midnight-blue-btn:hover {
        background-color: #003366 !important;
        color: #fff !important;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
          {/* Titre et statistiques */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl lg:text-3xl font-extrabold midnight-blue-text drop-shadow-sm">Mes locaux</h1>
            <p className="text-gray-700 mt-1 font-medium text-sm lg:text-base">{sieges.length} local{sieges.length !== 1 ? "s" : ""} au total</p>
          </div>

          {/* Contrôles principaux */}
          {/* Masquer les boutons Ajouter/Export quand la carte est affichée */}
          {!(showMap || mapFullscreen) && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Bouton principal d'ajout */}
              <Button
                onClick={handleAddSiege}
                className="midnight-blue-btn rounded-md flex items-center justify-center gap-2 font-bold transition text-sm"
                title="Ajouter un nouveau local"
              >
                <Plus size={16} /> Ajouter un local
              </Button>
              <Button
                onClick={() => setShowCSVModal(true)}
                className="midnight-blue-btn rounded-md flex items-center justify-center gap-2 font-bold transition text-sm"
                title="Import/Export CSV"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Import/Export CSV
              </Button>
            </div>
          )}
        </div>
        {/* Affichage conditionnel : Carte ou Tableau */}
        {showMap ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Bouton pour revenir au tableau au-dessus de la carte */}
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
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Carte des locaux</h2>
                  <p className="text-sm text-gray-600">
                    {sieges.length} local{sieges.length !== 1 ? "s" : ""} affiché{sieges.length !== 1 ? "s" : ""} sur la carte
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={mapStyle}
                    onChange={e => setMapStyle(e.target.value)}
                    className="px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-blue-900 font-semibold shadow-sm text-sm"
                  >
                    <option value="street">Carte routière</option>
                    <option value="satellite">Satellite</option>
                    <option value="hybrid">Hybride</option>
                  </select>
                  <button
                    onClick={() => setMapFullscreen(true)}
                    className="px-3 py-2 midnight-blue-btn rounded-md font-semibold shadow-sm transition text-sm"
                    title="Afficher la carte en plein écran"
                  >
                    Plein écran
                  </button>
                </div>
              </div>
              <div style={{ height: '600px', width: '100%' }}>
                <SiegesMap
                  sieges={sieges}
                  onSiegeClick={handleSiegeClick}
                  mapStyle={mapStyle}
                  style={{ height: '100%', minHeight: 400 }}
                  center={[-18.7669, 46.8691]} // Centre Madagascar
                />
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
                columns={columns}
                data={paginatedSieges}
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
        <SiegeModal
          open={showSiegeModal}
          onClose={() => { setShowSiegeModal(false); setEditingSiege(null); }}
          initialData={editingSiege}
          mode={editingSiege ? 'edit' : 'add'}
          siegeId={editingSiege ? editingSiege.id : null}
          onSuccess={handleSiegeSuccess}
        />
        {/* Carte en plein écran (overlay) */}
        {mapFullscreen && (
          <div className="fixed inset-0 z-50 bg-white bg-opacity-95 flex items-center justify-center">
            <div className="w-full h-full flex flex-col bg-white rounded-none shadow-none relative">
              <Button
                onClick={() => setMapFullscreen(false)}
                className="absolute top-4 right-4 z-50 px-4 py-2 bg-gray-700 text-white rounded-xl shadow-lg hover:bg-gray-900 font-bold transition"
                title="Fermer la carte"
              >
                Fermer la carte
              </Button>
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Carte des locaux</h2>
                <p className="text-sm text-gray-600">
                  {sieges.length} local{sieges.length !== 1 ? "s" : ""} affiché{sieges.length !== 1 ? "s" : ""} sur la carte
                </p>
              </div>
              <div style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
                <SiegesMap
                  sieges={sieges}
                  onSiegeClick={handleSiegeClick}
                  mapStyle={mapStyle}
                  style={{ height: '100%', minHeight: 400 }}
                  center={[-18.7669, 46.8691]} // Centre Madagascar
                />
              </div>
            </div>
          </div>
        )}
        {/* Modal Import/Export CSV */}
        {showCSVModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 relative">
              <Button
                onClick={() => setShowCSVModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
                title="Fermer"
              >
                ×
              </Button>
              <CSVImportExportSiege onImportSuccess={() => { setShowCSVModal(false); refetchSieges(); }} />
            </div>
          </div>
        )}

        {/* Modal de détails du siège */}
        {showDetailsModal && selectedSiege && (
          <SiegeDetailModal
            siege={selectedSiege}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedSiege(null);
            }}
          />
        )}

        {/* Modal de confirmation suppression */}
        <ConfirmationDialog
          open={showDeleteConfirm}
          title="Confirmer la suppression"
          description={siegeToDelete ? `Êtes-vous sûr de vouloir supprimer le local « ${siegeToDelete.nom} » ? Cette action est irréversible.` : ''}
          confirmLabel={deleteLoading ? 'Suppression...' : 'Supprimer'}
          cancelLabel="Annuler"
          onCancel={() => { setShowDeleteConfirm(false); setSiegeToDelete(null); }}
          onConfirm={confirmDeleteSiege}
          loading={deleteLoading}
          variant="destructive"
        />
      </div>
    </div>
  );
}