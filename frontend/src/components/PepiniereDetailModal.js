'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PEPINIERE } from '../lib/graphql-queries';
import { getLogoUrl } from '../lib/utils';

const PepiniereDetailModal = ({ pepiniere, onClose }) => {
  const [activeTab, setActiveTab] = useState('info');

  // Charger les données complètes de la pépinière
  const { data: pepiniereData, loading: pepiniereLoading, error: pepiniereError } = useQuery(GET_PEPINIERE, {
    variables: { id: pepiniere?.id },
    skip: !pepiniere?.id,
    fetchPolicy: 'cache-and-network'
  });

  // Utiliser les données complètes si disponibles, sinon les données de base
  const pepiniereComplete = pepiniereData?.pepiniere || pepiniere;

  if (!pepiniere) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const exportToCsv = () => {
    const data = [pepiniereComplete];
    const csv = [
      ['Nom', 'Adresse', 'Description', 'Latitude', 'Longitude', 'Gestionnaire', 'Téléphone', 'Email', 'Espèces produites', 'Production générale', 'Membre', 'Créé le', 'Modifié le'],
      [
        pepiniereComplete?.nom || '',
        pepiniereComplete?.adresse || '',
        pepiniereComplete?.description || '',
        pepiniereComplete?.latitude || '',
        pepiniereComplete?.longitude || '',
        pepiniereComplete?.nomGestionnaire || '',
        pepiniereComplete?.telephoneGestionnaire || '',
        pepiniereComplete?.emailGestionnaire || '',
        pepiniereComplete?.especesProduites || '',
        pepiniereComplete?.quantiteProductionGenerale || '',
        pepiniereComplete?.user ? `${pepiniereComplete.user.firstName || ''} ${pepiniereComplete.user.lastName || ''}` : '',
        pepiniereComplete?.createdAt || '',
        pepiniereComplete?.updatedAt || ''
      ]
    ];
    const blob = new Blob([
      csv.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
    ], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pepiniere_${pepiniereComplete?.nom || 'detail'}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const tabs = [
    { id: 'info', label: 'Informations', icon: '📋' },
    { 
      id: 'photos', 
      label: 'Photos', 
      icon: '📷',
      count: Array.isArray(pepiniereComplete?.photos) ? pepiniereComplete.photos.length : 0
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop avec effet de flou */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Container principal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-5xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300 flex flex-col">
          
          {/* Header avec gradient subtil - Fixe */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50/30 px-8 py-6 border-b border-green-200/50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">31</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    {pepiniereComplete?.nom || 'Pépinière'}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium">Détails de la pépinière</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Export Button */}
                <button
                  onClick={exportToCsv}
                  className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  title="Exporter en CSV"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="hidden sm:inline">Exporter</span>
                </button>
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="group relative w-10 h-10 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {pepiniereLoading && (
            <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-emerald-50 to-teal-50 flex-1">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-emerald-200 rounded-full animate-spin border-t-emerald-600"></div>
                <div className="w-8 h-8 border-4 border-transparent border-t-emerald-400 rounded-full animate-spin absolute top-2 left-2"></div>
              </div>
              <p className="mt-4 text-slate-600 font-medium">Chargement des détails...</p>
            </div>
          )}

          {/* Error State */}
          {pepiniereError && (
            <div className="m-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-lg">⚠️</span>
                </div>
                <div>
                  <h4 className="text-red-800 font-semibold">Erreur de chargement</h4>
                  <p className="text-red-600 text-sm">{pepiniereError.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          {!pepiniereLoading && !pepiniereError && (
            <div className="flex flex-col flex-1 min-h-0">
              {/* Navigation Tabs */}
              <div className="px-8 pt-6 flex-shrink-0">
                <div className="flex gap-2 bg-slate-100/60 p-1.5 rounded-2xl backdrop-blur-sm">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 relative overflow-hidden ${
                        activeTab === tab.id
                          ? 'bg-white text-emerald-600 shadow-lg shadow-emerald-500/10 border border-emerald-100'
                          : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                      }`}
                    >
                      <span className="text-base">{tab.icon}</span>
                      <span>{tab.label}</span>
                      {tab.count !== undefined && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          activeTab === tab.id 
                            ? 'bg-emerald-100 text-emerald-600' 
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content - Zone scrollable */}
              <div className="px-8 py-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                {activeTab === 'info' && (
                  <div className="space-y-8">
                    {/* Informations principales */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Informations générales */}
                      <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 rounded-2xl p-6 border border-blue-100/50">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">📍</span>
                          </div>
                          <h4 className="text-lg font-bold text-slate-800">Informations générales</h4>
                        </div>
                        <div className="space-y-4">
                          {[
                            { label: 'Nom', value: pepiniereComplete?.nom },
                            { label: 'Adresse', value: pepiniereComplete?.adresse },
                            { label: 'Latitude', value: pepiniereComplete?.latitude },
                            { label: 'Longitude', value: pepiniereComplete?.longitude },
                            { label: 'Nom du projet', value: pepiniereComplete?.nomProjet }
                          ].map((item, index) => (
                            <div key={index} className="flex justify-between items-start py-2 border-b border-blue-100/50 last:border-b-0">
                              <span className="text-slate-600 font-medium text-sm">{item.label}</span>
                              <span className="text-slate-800 font-semibold text-sm text-right max-w-[60%]">
                                {item.value || '-'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Gestionnaire */}
                      <div className="bg-gradient-to-br from-purple-50/50 to-violet-50/30 rounded-2xl p-6 border border-purple-100/50">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">👤</span>
                          </div>
                          <h4 className="text-lg font-bold text-slate-800">Gestionnaire</h4>
                        </div>
                        <div className="space-y-4">
                          {[
                            { label: 'Nom', value: pepiniereComplete?.nomGestionnaire },
                            { label: 'Poste', value: pepiniereComplete?.posteGestionnaire },
                            { label: 'Téléphone', value: pepiniereComplete?.telephoneGestionnaire },
                            { label: 'Email', value: pepiniereComplete?.emailGestionnaire }
                          ].map((item, index) => (
                            <div key={index} className="flex justify-between items-start py-2 border-b border-purple-100/50 last:border-b-0">
                              <span className="text-slate-600 font-medium text-sm">{item.label}</span>
                              <span className="text-slate-800 font-semibold text-sm text-right max-w-[60%]">
                                {item.value || '-'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Production */}
                      <div className="bg-gradient-to-br from-emerald-50/50 to-teal-50/30 rounded-2xl p-6 border border-emerald-100/50">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">🌿</span>
                          </div>
                          <h4 className="text-lg font-bold text-slate-800">Production</h4>
                        </div>
                        <div className="space-y-4">
                          {[
                            { label: 'Espèces produites', value: pepiniereComplete?.especesProduites },
                            { label: 'Production générale', value: pepiniereComplete?.quantiteProductionGenerale }
                          ].map((item, index) => (
                            <div key={index} className="flex flex-col py-2 border-b border-emerald-100/50 last:border-b-0">
                              <span className="text-slate-600 font-medium text-sm mb-1">{item.label}</span>
                              <span className="text-slate-800 font-semibold text-sm whitespace-pre-wrap break-words bg-white/60 p-2 rounded-lg">
                                {item.value || '-'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Membre */}
                      <div className="bg-gradient-to-br from-orange-50/50 to-amber-50/30 rounded-2xl p-6 border border-orange-100/50">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">🏛️</span>
                          </div>
                          <h4 className="text-lg font-bold text-slate-800">Membre</h4>
                        </div>
                        <div className="flex items-center gap-4">
                          {pepiniereComplete?.user?.logo && (
                            <div className="relative">
                              <img
                                src={getLogoUrl(pepiniereComplete.user.logo)}
                                alt="Logo"
                                className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-white"
                              />
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="text-lg font-bold text-slate-800">
                              {pepiniereComplete?.user?.nomInstitution || '-'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {pepiniereComplete?.description && pepiniereComplete.description.trim() !== '' && (
                      <div className="bg-gradient-to-br from-indigo-50/50 to-blue-50/30 rounded-2xl p-6 border border-indigo-100/50">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">📄</span>
                          </div>
                          <h4 className="text-lg font-bold text-slate-800">Description</h4>
                        </div>
                        <p className="text-slate-700 leading-relaxed bg-white/60 p-4 rounded-xl border border-indigo-100/50 whitespace-pre-wrap break-words">
                          {pepiniereComplete.description}
                        </p>
                      </div>
                    )}

                    {/* Dates */}
                    <div className="bg-gradient-to-br from-slate-50/50 to-gray-50/30 rounded-2xl p-6 border border-slate-100/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-slate-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm">📅</span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-800">Informations temporelles</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex justify-between items-center py-2">
                          <span className="text-slate-600 font-medium text-sm">Date de création</span>
                          <span className="text-slate-800 font-semibold text-sm">
                            {formatDate(pepiniereComplete?.createdAt)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-slate-600 font-medium text-sm">Dernière modification</span>
                          <span className="text-slate-800 font-semibold text-sm">
                            {formatDate(pepiniereComplete?.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'photos' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">📷</span>
                      </div>
                      <h4 className="text-xl font-bold text-slate-800">Galerie photos</h4>
                    </div>
                    
                    {Array.isArray(pepiniereComplete?.photos) && pepiniereComplete.photos.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pepiniereComplete.photos.map((photo, index) => (
                          <div key={photo.id || index} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_URL}/media/${photo.image}`}
                              alt={photo.titre || `Photo ${index + 1}`}
                              className="w-full h-56 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-slate-800 text-sm font-semibold px-3 py-1.5 rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                              {photo.titre || `Photo ${index + 1}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <span className="text-4xl text-slate-400">📷</span>
                        </div>
                        <p className="text-slate-500 font-medium">Aucune photo disponible</p>
                        <p className="text-slate-400 text-sm mt-1">Les photos apparaîtront ici une fois ajoutées</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer - Fixe */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50/30 px-8 py-4 border-t border-emerald-200/50 flex-shrink-0">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <span>Fermer</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PepiniereDetailModal;