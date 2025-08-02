"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_SIEGES, GET_ALL_USERS } from "../../lib/graphql-queries";
import { useToast } from "../../lib/useToast";
import { siegesColumns } from "./columns";
import SiegeMapModal from "@/components/SiegeMapModal";
import { DataTable } from "@/components/ui/table-data-table";
import MemberFilter from "@/components/MemberFilter";
import CategorieFilter from "@/components/CategorieFilter";
import { exportToCSV } from "../../lib/export-csv";
import { Button } from "@/components/ui/button";

export default function SiegesPage() {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredSieges, setFilteredSieges] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const { showError } = useToast();
  const [ setDetailModal] = useState({ open: false, siege: null });
  const [mapModal, setMapModal] = useState({ open: false, siege: null });
  
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
  const { data: siegesData, loading: siegesLoading, error: siegesError } = useQuery(GET_ALL_SIEGES);
  const { data: usersData, loading: usersLoading, error: usersError } = useQuery(GET_ALL_USERS);

  // Filtrage des sièges selon les critères sélectionnés
  useEffect(() => {
    if (siegesData?.allSieges) {
      let filtered = siegesData.allSieges;
      
      // Filtre par membre
      if (selectedMembers.length > 0) {
        filtered = filtered.filter(siege => selectedMembers.includes(siege.user.id));
      }
      
      // Filtre par catégorie
      if (selectedCategories.length > 0) {
        filtered = filtered.filter(siege =>
          selectedCategories.some(sel =>
            (siege.categorie || "").toLowerCase().replace(/\s+/g, "") === sel.toLowerCase().replace(/\s+/g, "")
          )
        );
      }
      
      // Recherche globale sur toutes les colonnes principales
      if (searchValue.trim() !== "") {
        const lowerSearch = searchValue.toLowerCase();
        filtered = filtered.filter(siege => {
          return [
            siege.nom,
            siege.adresse,
            siege.nomProjet,
            siege.user?.nomInstitution,
            siege.nomPointContact,
            siege.email,
            siege.telephone,
            siege.poste
          ].some(val => (val || "").toString().toLowerCase().includes(lowerSearch));
        });
      }
      
      setFilteredSieges(filtered);
      // Réinitialiser à la première page quand les filtres changent
      setCurrentPage(1);
    }
  }, [siegesData, selectedMembers, selectedCategories, searchValue]);

  // Calcul des données paginées
  const totalItems = filteredSieges.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredSieges.slice(startIndex, endIndex);

  // Gestion des erreurs
  if (siegesError) {
    showError("Erreur lors du chargement des sièges");
    console.error("Sieges error:", siegesError);
  }
  if (usersError) {
    showError("Erreur lors du chargement des utilisateurs");
    console.error("Users error:", usersError);
  }

  // Loader d'authentification
  if (siegesLoading || usersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Handler pour ouvrir le modal de détail
  const handleViewDetails = (siege) => {
    setDetailModal({ open: true, siege });
  };

  // Handler pour ouvrir la modal carte
  const handleViewMap = (siege) => {
    setMapModal({ open: true, siege });
  };

  // Handler pour fermer la modal carte
  const handleCloseMapModal = () => {
    setMapModal({ open: false, siege: null });
  };

  // Handler pour fermer le modal de détail
  const handleCloseDetailModal = () => {
    setDetailModal({ open: false, siege: null });
  };

  // Handler pour le filtre membre
  const handleMemberFilterChange = (memberIds) => {
    setSelectedMembers(memberIds);
  };

  // Handler pour le filtre catégorie
  const handleCategorieFilterChange = (categories) => {
    setSelectedCategories(categories);
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
    const filename = `locaux_export_${today}.csv`;

    const data = filteredSieges.map(siege => ({
      NOM: siege.nom || '',
      INSTITUTION: siege.user?.nomInstitution || '',
      ABREVIATION: siege.user?.abreviation || '',
      PROJET_RATTACHE: siege.nomProjet || '',
      CATEGORIE: siege.categorie || '',
      NOM_POINT_CONTACT: siege.nomPointContact || '',
      POSTE: siege.poste || '',
      TELEPHONE: siege.telephone || '',
      EMAIL: siege.email || '',
      HORAIRE_MATIN: siege.horaireMatin || '',
      HORAIRE_APRES_MIDI: siege.horaireApresMidi || '',
      ADRESSE: siege.adresse || '',
      LATITUDE: siege.latitude || '',
      LONGITUDE: siege.longitude || '',
      DESCRIPTION: siege.description || '',
      DATE_CREATION: siege.createdAt ? new Date(siege.createdAt).toLocaleDateString('fr-FR') : '',
      DERNIERE_MODIFICATION: siege.updatedAt ? new Date(siege.updatedAt).toLocaleDateString('fr-FR') : ''
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
            Liste des locaux
          </h1>
          <p className="text-gray-600">
            Consultez tous les locaux de tous les institutions de la plateforme.
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
              <h3 className="text-lg font-medium midnight-blue-text mb-3">Filtrer par catégorie</h3>
              <CategorieFilter
                selectedCategories={selectedCategories}
                onFilterChange={handleCategorieFilterChange}
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
                  Locaux ({totalItems})
                </h3>
                {(selectedMembers.length > 0 || selectedCategories.length > 0) && (
                  <span className="text-sm text-gray-500">
                    {selectedMembers.length > 0 && `Filtré par ${selectedMembers.length} membre(s)`}
                    {selectedMembers.length > 0 && selectedCategories.length > 0 && " - "}
                    {selectedCategories.length > 0 && `${selectedCategories.length} catégorie(s)`}
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
                  disabled={filteredSieges.length === 0}
                >
                  Exporter CSV
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <DataTable
              columns={siegesColumns(handleViewDetails, handleViewMap)}
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

        {/* Modal carte du siège */}
        {mapModal.open && mapModal.siege && (
          <SiegeMapModal
            open={mapModal.open}
            siege={mapModal.siege}
            onClose={handleCloseMapModal}
          />
        )}
      </div>
    </div>
  );
}