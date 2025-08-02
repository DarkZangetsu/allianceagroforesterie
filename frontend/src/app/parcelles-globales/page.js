"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_PARCELLES, GET_ALL_USERS } from "../../lib/graphql-queries";
import { useToast } from "../../lib/useToast";
import { parcellesColumns } from "./columns";
import { DataTable } from "@/components/ui/table-data-table";
import MemberFilter from "@/components/MemberFilter";
import PratiqueFilter from "@/components/PratiqueFilter";
import { exportToCSV } from "../../lib/export-csv";

import { Button } from "@/components/ui/button";
import ParcelleDetailModal from "@/components/ParcelleDetailModal";
import ParcelleMapModal from "@/components/ParcelleMapModal";

export default function ParcellesPage() {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [filteredParcelles, setFilteredParcelles] = useState([]);
  const [selectedPratiques, setSelectedPratiques] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const { showError } = useToast();
  const [detailModal, setDetailModal] = useState({ open: false, parcelle: null });
  // Ajout pour la modal carte
  const [mapModal, setMapModal] = useState({ open: false, parcelle: null });
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
      .pagination-btn {
        padding: 8px 12px;
        margin: 0 2px;
        border: 1px solid #d1d5db;
        background: white;
        color: #374151;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .pagination-btn:hover {
        background-color: #f3f4f6;
        border-color: var(--midnight-blue);
      }
      .pagination-btn.active {
        background-color: var(--midnight-blue);
        color: white;
        border-color: var(--midnight-blue);
      }
      .pagination-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .pagination-btn:disabled:hover {
        background: white;
        border-color: #d1d5db;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // Récupération des données
  const { data: parcellesData, loading: parcellesLoading, error: parcellesError } = useQuery(GET_ALL_PARCELLES);
  const { data: usersData, loading: usersLoading, error: usersError } = useQuery(GET_ALL_USERS);

  // Filtrage des parcelles selon les membres sélectionnés

  useEffect(() => {
    if (parcellesData?.allParcelles) {
      let filtered = parcellesData.allParcelles;
      
      // Filtre par membre
      if (selectedMembers.length > 0) {
        filtered = filtered.filter(parcelle => selectedMembers.includes(parcelle.user.id));
      }
      
      // Filtre par pratique - CORRECTION ICI
      if (selectedPratiques.length > 0) {
        filtered = filtered.filter(parcelle => {
          if (!parcelle.pratique) return false;
          
          // Diviser les pratiques de la parcelle par virgule et nettoyer les espaces
          const parcellesPratiques = parcelle.pratique
            .split(',')
            .map(p => p.trim().toLowerCase().replace(/\s+/g, ""));
          
          // Vérifier si au moins une pratique sélectionnée correspond
          return selectedPratiques.some(selectedPratique => {
            const cleanSelected = selectedPratique.toLowerCase().replace(/\s+/g, "");
            return parcellesPratiques.some(parcellePratique => 
              parcellePratique.includes(cleanSelected) || cleanSelected.includes(parcellePratique)
            );
          });
        });
      }
      
      // Recherche globale sur toutes les colonnes principales
      if (searchValue.trim() !== "") {
        const lowerSearch = searchValue.toLowerCase();
        filtered = filtered.filter(parcelle => {
          return [
            parcelle.nom,
            parcelle.nomProjet,
            parcelle.pratique,
            parcelle.nomPersonneReferente,
            parcelle.poste,
            parcelle.telephone,
            parcelle.email
          ].some(val => (val || "").toString().toLowerCase().includes(lowerSearch));
        });
      }
      
      setFilteredParcelles(filtered);
      // Réinitialiser à la première page quand les filtres changent
      setCurrentPage(1);
    }
  }, [parcellesData, selectedMembers, selectedPratiques, searchValue]);

  // Calcul des données paginées
  const totalItems = filteredParcelles.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredParcelles.slice(startIndex, endIndex);

  // Gestion des erreurs
  if (parcellesError) {
    showError("Erreur lors du chargement des parcelles");
    console.error("Parcelles error:", parcellesError);
  }
  if (usersError) {
    showError("Erreur lors du chargement des utilisateurs");
    console.error("Users error:", usersError);
  }

  // Loader d'authentification
  if (parcellesLoading || usersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Handler pour ouvrir le modal de détail
  const handleViewDetails = (parcelle) => {
    setDetailModal({ open: true, parcelle });
  };

  // Handler pour fermer le modal de détail
  const handleCloseDetailModal = () => {
    setDetailModal({ open: false, parcelle: null });
  };

  // Handler pour ouvrir la modal carte
  const handleViewMap = (parcelle) => {
    setMapModal({ open: true, parcelle });
  };

  // Handler pour fermer la modal carte
  const handleCloseMapModal = () => {
    setMapModal({ open: false, parcelle: null });
  };

  // Handler pour le filtre membre
  const handleMemberFilterChange = (memberIds) => {
    setSelectedMembers(memberIds);
  };

  // Handler pour le filtre pratique
  const handlePratiqueFilterChange = (pratiques) => {
    setSelectedPratiques(pratiques);
  };

  // Handler pour la recherche globale
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  // Handler pour changer le nombre d'éléments par page
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Retour à la première page
  };

  // Handler pour changer de page
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handler pour l'export CSV
  const handleExportCSV = () => {
    const today = new Date().toISOString().slice(0, 10); 
    const filename = `Sites_de_reference_export_${today}.csv`;

    const data = filteredParcelles.map(parcelle => ({
      NOM: parcelle.nom || '',
      INSTITUTION: parcelle.user?.nomInstitution || '',
      ABREVIATION: parcelle.user?.abreviation || '',
      PROJET_RATTACHE: parcelle.nomProjet || '',
      NOM_PERSONNE_REFERENTE: parcelle.nomPersonneReferente || '',
      POSTE: parcelle.poste || '',
      TELEPHONE: parcelle.telephone || '',
      EMAIL: parcelle.email || '',
      SUPERFICIE: parcelle.superficie || '',
      PRATIQUE: parcelle.pratique || '',
      GEOJSON: JSON.stringify(parcelle.geojson) || '',
      DESCRIPTION: parcelle.description || '',
      DATE_CREATION: parcelle.createdAt ? new Date(parcelle.createdAt).toLocaleDateString('fr-FR') : '',
      DERNIERE_MODIFICATION: parcelle.updatedAt ? new Date(parcelle.updatedAt).toLocaleDateString('fr-FR') : ''
    }));

    exportToCSV(data, filename);
  };


  // Génération des numéros de pages à afficher
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold midnight-blue-text mb-2">
            Liste des sites de référence
          </h1>
          <p className="text-gray-600">
            Consultez tous les sites de référence tous les institution de la plateforme.
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 mb-4 lg:mb-0">
              <h3 className="text-lg font-medium midnight-blue-text mb-3">Filtrer par membre</h3>
              <MemberFilter
                users={usersData?.allUsers || []}
                selectedMembers={selectedMembers}
                onFilterChange={handleMemberFilterChange}
              />
            </div>
            <div className="flex-1 mb-4 lg:mb-0">
              <h3 className="text-lg font-medium midnight-blue-text mb-3">Filtrer par pratique</h3>
              <PratiqueFilter
                selectedPratiques={selectedPratiques}
                onFilterChange={handlePratiqueFilterChange}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium midnight-blue-text mb-3">Recherche globale</h3>
              <input
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Rechercher dans toutes les colonnes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* DataTable */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-medium midnight-blue-text">
                  Sites de référence ({totalItems})
                </h3>
                {selectedMembers.length > 0 && (
                  <span className="text-sm text-gray-500">
                    Filtré par {selectedMembers.length} membre(s)
                  </span>
                )}
              </div>
              
              {/* Sélecteur d'éléments par page */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
                    Afficher:
                  </label>
                  <select
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-sm text-gray-600">lignes</span>
                </div>
                
                <Button 
                  className="midnight-blue-btn px-4 py-2 rounded-md font-bold text-sm" 
                  onClick={handleExportCSV} 
                  disabled={filteredParcelles.length === 0}
                >
                  Exporter CSV
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <DataTable
              columns={parcellesColumns(handleViewDetails, handleViewMap)}
              data={paginatedData}
            />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="text-sm text-gray-600">
                  Affichage de {startIndex + 1} à {Math.min(endIndex, totalItems)} sur {totalItems} résultats
                </div>
                
                <div className="flex items-center gap-1">
                  {/* Bouton Précédent */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    ← Précédent
                  </button>

                  {/* Numéros de pages */}
                  {getPageNumbers().map((pageNumber, index) => (
                    <button
                      key={index}
                      onClick={() => typeof pageNumber === 'number' ? handlePageChange(pageNumber) : null}
                      disabled={pageNumber === '...'}
                      className={`pagination-btn ${currentPage === pageNumber ? 'active' : ''}`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  {/* Bouton Suivant */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    Suivant →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Modal de détails de la parcelle */}
        {detailModal.open && detailModal.parcelle && (
          <ParcelleDetailModal
            parcelle={detailModal.parcelle}
            onClose={handleCloseDetailModal}
          />
        )}
        
        {/* Modal carte de la parcelle */}
        {mapModal.open && mapModal.parcelle && (
          <ParcelleMapModal
            open={mapModal.open}
            parcelle={mapModal.parcelle}
            onClose={handleCloseMapModal}
          />
        )}
      </div>
    </div>
  );
}