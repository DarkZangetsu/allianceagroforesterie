import { jwtDecode } from 'jwt-decode';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Fonction pour normaliser les rôles (gérer majuscules/minuscules)
export const isAdmin = (role) => {
  return role === 'ADMIN' || role === 'admin';
};

export const isMember = (role) => {
  return role === 'MEMBRE' || role === 'membre' || role === 'MEMBER' || role === 'member';
};

// Utilitaires pour l'authentification
export const authUtils = {
  // Stocker le token et les données utilisateur
  setAuthData: (token, user) => {
    if (typeof token !== 'string' || !token.trim()) {
      console.error('setAuthData appelé avec un token non string:', token);
      return;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Décoder et afficher les informations du token
      try {
        const decoded = jwtDecode(token);
      } catch (error) {
      }
    }
  },

  // Récupérer le token
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  // Récupérer les données utilisateur
  getUser: () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (error) {
          console.error('Erreur lors du parsing des données utilisateur:', error);
          return null;
        }
      }
    }
    return null;
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    const token = authUtils.getToken();
    const user = authUtils.getUser();
    return !!(token && user && !authUtils.isTokenExpired(token));
  },

  // Nettoyer les données d'authentification
  clearAuthData: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Vérifier si le token est expiré avec jwt-decode
  isTokenExpired: (token) => {
    if (!token) return true;
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
    
      
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  },

  // Décoder et afficher les informations du token
  decodeToken: (token) => {
    if (!token) return null;
    
    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      return null;
    }
  },

  // Vérifier la validité du token
  validateToken: (token) => {
    if (!token || typeof token !== 'string' || token.trim() === '') {
      return false;
    }
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      console.error('Token invalide:', error);
      return false;
    }
  }
};

// Utilitaires pour les dates
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR');
};

// Utilitaires pour les nombres
export const formatNumber = (number, decimals = 2) => {
  if (number === null || number === undefined) return '';
  return Number(number).toFixed(decimals);
};

// Fonction pour valider les emails
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Fonction pour nettoyer les données de formulaire
export const cleanFormData = (data) => {
  const cleaned = {};
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
      cleaned[key] = data[key];
    }
  });
  return cleaned;
}; 

// Utilitaire pour obtenir l'URL absolue du logo utilisateur
export function getLogoUrl(logo) {
  if (!logo) return null;
  if (logo.startsWith('http://') || logo.startsWith('https://')) return logo;
  return `${process.env.NEXT_PUBLIC_API_URL}/media/${logo}`;
} 