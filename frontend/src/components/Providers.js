'use client';

import { ApolloProvider } from '@apollo/client';
import { useEffect } from 'react';
import client from '../lib/apollo-client';
import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authUtils } from '../lib/utils';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = authUtils.getToken();
      const savedUser = authUtils.getUser();
      const path = typeof window !== 'undefined' ? window.location.pathname : '';
      if (token && savedUser && !authUtils.isTokenExpired(token)) {
        setUser(savedUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        authUtils.clearAuthData();

        const publicPaths = ['/', '/login', '/register', '/pepinieres-globales', '/parcelles-globales', '/sieges-globaux'];
        if (typeof window !== 'undefined' && !publicPaths.includes(path)) {
          router.push('/login');
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [router]);

  const login = (userData, token) => {
    if (typeof token !== 'string' || !token.trim()) {
      console.error('Tentative de login avec un token invalide:', token);
      return;
    }
    authUtils.setAuthData(token, userData);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    setIsLoggingOut(true);
    await new Promise(res => setTimeout(res, 700));
    authUtils.clearAuthData();
    setUser(null);
    setIsAuthenticated(false);
    setIsLoggingOut(false);
    // Rediriger vers / (carte générale) sauf si déjà sur /login ou /register
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    if (path !== '/' && path !== '/login' && path !== '/register') {
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, isLoggingOut, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default function Providers({ children }) {
  useEffect(() => {
    // Charger le CSS Leaflet côté client
    import('leaflet/dist/leaflet.css');
  }, []);

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
} 