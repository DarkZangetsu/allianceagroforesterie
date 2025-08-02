"use client";
import AuthForm from '../../components/AuthForm';
import { useAuth } from '../../components/Providers';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { TOKEN_AUTH_WITH_USER } from '../../lib/graphql-queries';
import { authUtils } from '../../lib/utils';

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [tokenAuth, { loading: mutationLoading }] = useMutation(TOKEN_AUTH_WITH_USER);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace('/parcelles');
    }
  }, [isAuthenticated, isLoading, router]);

  // Fonction de login à passer à AuthForm
  const handleLogin = async (credentials) => {
    const { data } = await tokenAuth({ variables: credentials });
    if (data?.tokenAuthWithUser?.success) {
      const { token, user: userData } = data.tokenAuthWithUser;
      if (typeof token === 'string' && token && authUtils.validateToken(token)) {
        login(userData, token);
        return;
      } else {
        throw new Error('Token reçu mais invalide');
      }
    } else {
      throw new Error(data?.tokenAuthWithUser?.message || 'Erreur de connexion');
    }
  };

  return (
    <AuthForm
      mode="login"
      onLogin={handleLogin}
      loading={isLoading || mutationLoading}
    />
  );
} 