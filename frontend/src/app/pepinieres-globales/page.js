"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_PEPINIERES, GET_ALL_USERS } from "../../lib/graphql-queries";
import { useToast } from "../../lib/useToast";
import { pepinieresColumns } from "./columns";
import PepiniereMapModal from "@/components/PepiniereMapModal";
import { DataTable } from "@/components/ui/table-data-table";
import PepiniereDetailModal from "@/components/PepiniereDetailModal";
import MemberFilter from "@/components/MemberFilter";
import { exportToCSV } from "../../lib/export-csv";
import { Button } from "@/components/ui/button";
import CSVImportExportPepiniere from "../../components/CSVImportExportPepiniere";

export default function PepinieresPage() {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [filteredPepinieres, setFilteredPepinieres] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const { showError, showToast } = useToast();
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [selectedPepiniere, setSelectedPepiniere] = useState(null);
  const [mapModal, setMapModal] = useState({ open: false, pepiniere: null });
  
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
  const { data: pepinieresData, loading: pepinieresLoading, error: pepinieresError } = useQuery(GET_ALL_PEPINIERES);
  const { data: usersData, loading: usersLoading, error: usersError } = useQuery(GET_ALL_USERS);

  // Filtrage des pépinières selon les critères sélectionnés
  useEffect(() => {
    if (pepinieresData?.allPepinieres) {
      let filtered = pepinieresData.allPepinieres;
      
      // Filtre par membre
      if (selectedMembers.length > 0) {
        filtered = filtered.filter(pepin => selectedMembers.includes(pepin.user.id));
      }
      
      // Recherche globale sur toutes les colonnes principales
      if (searchValue.trim() !== "") {
        const lowerSearch = searchValue.toLowerCase();
        filtered = filtered.filter(pepin => {
          return [
            pepin.nom,
            pepin.adresse,
            pepin.user?.nomInstitution,
            pepin.user?.abreviation,
            pepin.nomProjet,
            pepin.nomGestionnaire,
            pepin.posteGestionnaire,
            pepin.telephoneGestionnaire,
            pepin.emailGestionnaire
          ].some(val => (val || "").toString().toLowerCase().includes(lowerSearch));
        });
      }
      
      setFilteredPepinieres(filtered);
      // Réinitialiser à la première page quand les filtres changent
      setCurrentPage(1);
    }
  }, [pepinieresData, selectedMembers, searchValue]);

  // Calcul des données paginées
  const totalItems = filteredPepinieres.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredPepinieres.slice(startIndex, endIndex);

  // Gestion des erreurs
  if (pepinieresError) {
    showError("Erreur lors du chargement des pépinières");
    console.error("Pepinieres error:", pepinieresError);
  }
  if (usersError) {
    showError("Erreur lors du chargement des utilisateurs");
    console.error("Users error:", usersError);
  }

  // Loader d'authentification
  if (pepinieresLoading || usersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Handler pour le filtre membre
  const handleMemberFilterChange = (memberIds) => {
    setSelectedMembers(memberIds);
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
    const filename = `pepiniere_export_${today}.csv`;

    const data = filteredPepinieres.map(pepin => ({
      NOM: pepin.nom || '',
      INSTITUTION: pepin.user?.nomInstitution || '',
      ABREVIATION: pepin.user?.abreviation || '',
      PROJET_RATTACHE: pepin.nomProjet || '',
      ADRESSE: pepin.adresse || '',
      LATITUDE: pepin.latitude || '',
      LONGITUDE: pepin.longitude || '',
      DESCRIPTION: pepin.description || '',
      NOM_GESTIONNAIRE: pepin.nomGestionnaire || '',
      POSTE_GESTIONNAIRE: pepin.posteGestionnaire || '',
      TELEPHONE_GESTIONNAIRE: pepin.telephoneGestionnaire || '',
      EMAIL_GESTIONNAIRE: pepin.emailGestionnaire || '',
      ESPECES_PRODUITES: pepin.especesProduites || '',
      QUANTITE_PRODUCTION_GENERALE: pepin.quantiteProductionGenerale || '',
      DATE_CREATION: pepin.createdAt ? new Date(pepin.createdAt).toLocaleDateString('fr-FR') : '',
      DERNIERE_MODIFICATION: pepin.updatedAt ? new Date(pepin.updatedAt).toLocaleDateString('fr-FR') : ''
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
            Liste des pépinières
          </h1>
          <p className="text-gray-600">
            Consultez toutes les pépinières de tous les institutions de la plateforme.
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 mb-4 lg:mb-0">
              <h3 className="text-lg font-medium midnight-blue-text mb-3">Filtrer par institution</h3>
              <MemberFilter
                users={usersData?.allUsers || []}
                selectedMembers={selectedMembers}
                onFilterChange={handleMemberFilterChange}
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
                  Pépinières ({totalItems})
                </h3>
                {selectedMembers.length > 0 && (
                  <span className="text-sm text-gray-500">
                    Filtré par {selectedMembers.length} Information(s)
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
                  disabled={filteredPepinieres.length === 0}
                >
                  Exporter CSV
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <DataTable
              columns={pepinieresColumns(
                (pepiniere) => setSelectedPepiniere(pepiniere),
                (pepiniere) => setMapModal({ open: true, pepiniere })
              )}
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

        {/* Modal carte de la pépinière */}
        {mapModal.open && mapModal.pepiniere && (
          <PepiniereMapModal
            open={mapModal.open}
            pepiniere={mapModal.pepiniere}
            onClose={() => setMapModal({ open: false, pepiniere: null })}
          />
        )}

        {/* Modal de détails de la pépinière */}
        {selectedPepiniere && (
          <PepiniereDetailModal
            pepiniere={selectedPepiniere}
            onClose={() => setSelectedPepiniere(null)}
          />
        )}

        {/* Modal d'import CSV */}
        {showCSVModal && (
          <CSVImportExportPepiniere
            onClose={() => setShowCSVModal(false)}
            onSuccess={() => {
              setShowCSVModal(false);
              if (typeof refetch === 'function') refetch();
              showToast('Export CSV terminé avec succès', 'success');
            }}
          />
        )}
      </div>
    </div>
  );
}