'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/Providers';
import { authUtils } from './utils';

export function useAuthGuard(requireAuth = true) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Ne vérifier que si le chargement est terminé
    if (!isLoading) {
      const token = authUtils.getToken();
      const savedUser = authUtils.getUser();
      const path = typeof window !== 'undefined' ? window.location.pathname : '';
      // Vérifier si l'authentification est requise et si l'utilisateur n'est pas connecté
      if (requireAuth && (!token || !savedUser || authUtils.isTokenExpired(token))) {
        authUtils.clearAuthData();
        if (path !== '/login' && path !== '/register') {
          router.push('/login');
        }
        return;
      }
    }
  }, [isLoading, isAuthenticated, requireAuth, router]);

  return {
    user,
    isAuthenticated,
    isLoading,
    isAuthorized: !requireAuth || isAuthenticated
  };
} 