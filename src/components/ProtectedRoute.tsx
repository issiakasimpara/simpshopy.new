
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingFallback from './LoadingFallback';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return <LoadingFallback />;
  }

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!user) {
    const currentHostname = window.location.hostname;
    
    // Si on est déjà sur admin.simpshopy.com, rediriger vers /auth
    if (currentHostname === 'admin.simpshopy.com') {
      return <Navigate to="/auth" replace />;
    }
    
    // Sinon, rediriger vers admin.simpshopy.com/auth
    window.location.href = 'https://admin.simpshopy.com/auth';
    return null;
  }

  // Si l'utilisateur est connecté, afficher le contenu
  return <>{children}</>;
};

export default ProtectedRoute;
