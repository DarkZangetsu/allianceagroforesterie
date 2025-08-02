'use client';

import { ApolloProvider } from '@apollo/client';
import { useState, useEffect } from 'react';
import client from '../lib/apollo-client';
import { useToast } from '../lib/useToast';
import Toast from '../components/Toast';
import { Toaster } from "@/components/ui/sonner"
import { useAuth } from '../components/Providers';
import { usePathname, useRouter } from 'next/navigation';
import { getLogoUrl } from '../lib/utils';

export default function LayoutContent({ children }) {
  const { user, isLoading, isLoggingOut, logout } = useAuth();
  const { toasts, removeToast } = useToast();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showGlobalDropdown, setShowGlobalDropdown] = useState(false);
  const [showPersonalDropdown, setShowPersonalDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = pathname === '/login' || pathname === '/register';

  // Fix hydration issue by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fermer les dropdowns quand on clique ailleurs
  useEffect(() => {
    if (!isClient) return; // Only run on client side

    const handleClickOutside = (event) => {
      // Vérifier si l'élément existe encore dans le DOM
      if (!event.target || !document.contains(event.target)) {
        return;
      }
      
      if (!event.target.closest('.dropdown-container')) {
        setShowGlobalDropdown(false);
        setShowPersonalDropdown(false);
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isClient]);

  useEffect(() => {
    setShowMenu(false);
    setShowGlobalDropdown(false);
    setShowPersonalDropdown(false);
    setShowUserDropdown(false);
    setShowLogoutConfirm(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      setShowLogoutConfirm(false);
      setShowUserDropdown(false);
      setShowMenu(false);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await logout();
      
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      setShowLogoutConfirm(false);
      setShowUserDropdown(false);
      setShowMenu(false);
    }
  };

  // Show loading state until client-side hydration is complete
  if (isLoading || !isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-indigo-200 border-t-indigo-600"></div>
          <p className="text-indigo-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        
        {/* Overlay de chargement lors du logout */}
        {isLoggingOut && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-indigo-200 border-t-indigo-600"></div>
              <span className="text-gray-700 font-medium">Déconnexion en cours...</span>
            </div>
          </div>
        )}

        {/* Modal de confirmation de déconnexion */}
        {showLogoutConfirm && !isLoggingOut && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Confirmer la déconnexion</h2>
                <p className="text-gray-600 mb-8">Êtes-vous sûr de vouloir vous déconnecter ?</p>
                <div className="flex gap-4">
                  <button
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold transition-all duration-200 transform hover:scale-105"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    Oui, me déconnecter
                  </button>
                  <button
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold transition-all duration-200 transform hover:scale-105"
                    onClick={() => setShowLogoutConfirm(false)}
                    disabled={isLoggingOut}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header ou flèche retour selon la page */}
        {isAuthPage ? (
          <div className="w-full flex items-center px-6 py-6 bg-white/80 backdrop-blur-sm">
            <a href="/" className="inline-flex items-center text-indigo-600 font-semibold text-lg hover:text-indigo-700 transition-colors group">
              <svg className="w-6 h-6 mr-3 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à la carte générale
            </a>
          </div>
        ) : (
          /* Header moderne */
          <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                
                {/* Logo et titre */}
                <div className="flex items-center min-w-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                       <svg className="h-8 w-8" style={{ color: 'rgb(0,70,144)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                      Alliance-Agroforesterie
                    </h1>
                  </div>
                </div>

                {/* Navigation principale - centrée pour desktop */}
                <div className="hidden lg:flex items-center space-x-2">
                  
                  {/* Dropdown Global */}
                  <div className="relative dropdown-container">
                    <button
                      onClick={() => {
                        setShowGlobalDropdown(!showGlobalDropdown);
                        setShowPersonalDropdown(false);
                        setShowUserDropdown(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white/60 hover:bg-white/80 rounded-xl border border-gray-200/50 transition-all duration-200 hover:shadow-md backdrop-blur-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Vue Globale</span>
                      <svg className={`w-4 h-4 transition-transform duration-200 ${showGlobalDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showGlobalDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 py-2 z-50 transform transition-all duration-200">
                        <a href="/" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors group">
                          <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          Carte générale
                        </a>
                        <a href="/parcelles-globales" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors group">
                          <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Sites de référence
                        </a>
                        <a href="/sieges-globaux" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors group">
                          <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Locaux
                        </a>
                        <a href="/pepinieres-globales" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors group">
                          <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                          Pépinières
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Dropdown Personnel (seulement si connecté) */}
                  {user && (
                    <div className="relative dropdown-container">
                      <button
                        onClick={() => {
                          setShowPersonalDropdown(!showPersonalDropdown);
                          setShowGlobalDropdown(false);
                          setShowUserDropdown(false);
                        }}
                        className="flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white/60 hover:bg-white/80 rounded-xl border border-gray-200/50 transition-all duration-200 hover:shadow-md backdrop-blur-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Mes Données</span>
                        <svg className={`w-4 h-4 transition-transform duration-200 ${showPersonalDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {showPersonalDropdown && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 py-2 z-50">
                          <a href="/parcelles" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors group">
                            <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Mes sites de référence
                          </a>
                          <a href="/sieges" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors group">
                            <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Mes locaux
                          </a>
                          <a href="/pepinieres" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors group">
                            <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            Mes pépinières
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions à droite */}
                <div className="flex items-center space-x-3">
                  {user ? (
                    <div className="flex items-center space-x-3">
                      {/* Bouton menu mobile */}
                      <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                      </button>

                      {/* Profil utilisateur */}
                      <div className="relative dropdown-container">
                        <button
                          onClick={() => {
                            setShowUserDropdown(!showUserDropdown);
                            setShowGlobalDropdown(false);
                            setShowPersonalDropdown(false);
                          }}
                          className="flex items-center space-x-3 p-2 hover:bg-white/60 rounded-xl transition-all duration-200 group"
                        >
                          <div className="flex items-center space-x-2">
                            {user?.logo ? (
                              <img
                                src={getLogoUrl(user.logo)}
                                alt="Logo"
                                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-semibold">
                                  {user?.nomInstitution?.charAt(0) || 'U'}
                                </span>
                              </div>
                            )}
                            <div className="hidden sm:block text-left">
                              <div className="text-sm font-medium text-gray-900">
                                {user?.nomInstitution}
                              </div>
                            </div>
                          </div>
                          <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {showUserDropdown && (
                          <div className="absolute top-full right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 py-2 z-50">
                            <div className="px-4 py-3 border-b border-gray-100">
                              <div className="flex items-center space-x-3">
                                {user?.logo ? (
                                  <img
                                    src={getLogoUrl(user.logo)}
                                    alt="Logo"
                                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold">
                                      {user?.nomInstitution?.charAt(0) || 'U'}
                                    </span>
                                  </div>
                                )}
                                <div>
                                  <div className="font-medium text-gray-900 text-sm">
                                    {user?.nomInstitution}
                                  </div>
                                  <div className="text-xs text-gray-500">Connecté</div>
                                </div>
                              </div>
                            </div>
                            
                            <a href="/profil" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors group">
                              <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Mon profil
                            </a>
                            
                            <div className="border-t border-gray-100 mt-2 pt-2">
                              <button
                                onClick={() => {
                                  setShowUserDropdown(false);
                                  setShowLogoutConfirm(true);
                                }}
                                className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors group"
                                disabled={isLoggingOut}
                              >
                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Déconnexion
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      {/* Bouton menu mobile pour non-connectés */}
                      <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                      </button>
                      
                      <div className="hidden lg:flex items-center space-x-3">
                        <a href="/login" className="px-4 py-2.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border border-indigo-200 rounded-xl transition-all duration-200 hover:shadow-md">
                          Connexion
                        </a>
                        <a href="/register" className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-105">
                          Inscription
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Menu mobile */}
              {showMenu && (
                <div className="lg:hidden border-t border-gray-200/50 bg-white/60 backdrop-blur-sm rounded-b-2xl mt-2 overflow-hidden">
                  <div className="px-4 py-6 space-y-6">
                    
                    {/* Section Vue Globale */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Vue Globale
                      </h3>
                      <div className="space-y-1">
                        <a href="/" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors group">
                          <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          Carte générale
                        </a>
                        <a href="/parcelles-globales" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors group">
                          <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Sites de référence
                        </a>
                        <a href="/sieges-globaux" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors group">
                          <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Locaux
                        </a>
                        <a href="/pepinieres-globales" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors group">
                          <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                          Pépinières
                        </a>
                      </div>
                    </div>

                    {/* Section Mes Données (si connecté) */}
                    {user && (
                      <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Mes Données
                        </h3>
                        <div className="space-y-1">
                          <a href="/parcelles" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors group">
                            <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Mes sites de référence
                          </a>
                          <a href="/sieges" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors group">
                            <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Mes locaux
                          </a>
                          <a href="/pepinieres" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors group">
                            <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            Mes pépinières
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Section Profil (si connecté) */}
                    {user && (
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-xl mb-3">
                          {user?.logo ? (
                            <img
                              src={getLogoUrl(user.logo)}
                              alt="Logo"
                              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {user?.nomInstitution?.charAt(0) || 'U'}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900 text-sm">
                              {user?.nomInstitution}
                            </div>
                            <div className="text-xs text-gray-500">Connecté</div>
                          </div>
                        </div>
                        
                        <a href="/profil" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors group mb-2">
                          <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Mon profil
                        </a>
                        
                        <button
                          onClick={() => {
                            setShowMenu(false);
                            setShowLogoutConfirm(true);
                          }}
                          className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors group"
                          disabled={isLoggingOut}
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Déconnexion
                        </button>
                      </div>
                    )}

                    {/* Section Authentification (si non connecté) */}
                    {!user && (
                      <div className="border-t border-gray-200 pt-4 space-y-3">
                        <a href="/login" className="block w-full px-4 py-3 text-sm font-medium text-center text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border border-indigo-200 rounded-xl transition-all duration-200">
                          Connexion
                        </a>
                        <a href="/register" className="block w-full px-4 py-3 text-sm font-medium text-center text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl transition-all duration-200 shadow-lg">
                          Inscription
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </header>
        )}

        {/* Contenu principal */}
        <main className="h-full">
          {children}
          <Toaster />
        </main>
      </div>

      {/* Toasts */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ApolloProvider>
  );
}