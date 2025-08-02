import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { jwtDecode } from 'jwt-decode';

// Créer le lien d'upload pour les fichiers
const uploadLink = createUploadLink({
  uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql/`,
});

// Lien d'authentification
const authLink = setContext((_, { headers }) => {
  // Récupérer le token depuis localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  
  // Vérifier la validité du token si présent
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp < currentTime) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return {
          headers: {
            ...headers,
            authorization: '',
          }
        };
      }
      
    } catch (error) {
      console.error('Apollo Client - Erreur lors du décodage du token:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        headers: {
          ...headers,
          authorization: '',
        }
      };
    }
  }
  
  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : '',
    }
  };
});

// Lien de gestion d'erreur
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      // Gestion des erreurs GraphQL
      if (extensions?.code === 'UNAUTHENTICATED' || 
          message.includes('authentication') || 
          message.includes('decoding signature') ||
          message.includes('token') ||
          message.includes('expired')) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/errors/401';
        }
      }
      // Erreur 400
      if (extensions?.code === 'BAD_REQUEST' || message.includes('bad request') || message.includes('invalid')) {
        if (typeof window !== 'undefined') {
          window.location.href = '/errors/400';
        }
      }
      // Erreur 404
      if (extensions?.code === 'NOT_FOUND' || message.includes('not found')) {
        if (typeof window !== 'undefined') {
          window.location.href = '/errors/404';
        }
      }
      // Erreur 500
      if (extensions?.code === 'INTERNAL_SERVER_ERROR' || message.includes('server error')) {
        if (typeof window !== 'undefined') {
          window.location.href = '/errors/500';
        }
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    // Gestion des erreurs réseau HTTP
    if (typeof window !== 'undefined') {
      if (networkError.statusCode === 400) {
        window.location.href = '/errors/400';
      } else if (networkError.statusCode === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/errors/401';
      } else if (networkError.statusCode === 404) {
        window.location.href = '/errors/404';
      } else if (networkError.statusCode === 500) {
        window.location.href = '/errors/500';
      }
    }
  }
});

// Créer le client Apollo avec tous les liens
const client = new ApolloClient({
  link: from([errorLink, authLink, uploadLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export default client; 