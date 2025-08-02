"use client";
import AuthForm from '../../components/AuthForm';
import { useAuth } from '../../components/Providers';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../../lib/graphql-queries';

export default function RegisterPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [createUser, { loading: mutationLoading }] = useMutation(CREATE_USER);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Fonction d'inscription à passer à AuthForm
  const handleRegister = async (userData) => {
    const { data } = await createUser({ variables: userData });
    if (data?.createUser?.success) {
      // Rediriger vers /login après inscription
      router.replace('/login');
      return;
    } else {
      throw new Error(data?.createUser?.message || "Erreur d'inscription");
    }
  };

  return (
    <AuthForm
      mode="register"
      onRegister={handleRegister}
      loading={isLoading || mutationLoading}
    />
  );
} 