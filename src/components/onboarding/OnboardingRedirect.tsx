import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOnboarding } from '@/hooks/useOnboarding';

interface OnboardingRedirectProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

const OnboardingRedirect: React.FC<OnboardingRedirectProps> = ({ 
  children, 
  fallbackPath = '/dashboard' 
}) => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { 
    isOnboardingCompleted, 
    shouldShowOnboarding, 
    isLoading: onboardingLoading 
  } = useOnboarding();

  // Si l'authentification est en cours de chargement, afficher un loader
  if (authLoading || onboardingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de votre configuration...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, afficher le contenu normal
  if (!user) {
    return <>{children}</>;
  }

  // Si l'utilisateur doit passer par l'onboarding, rediriger
  if (shouldShowOnboarding) {
    navigate('/onboarding');
    return null;
  }

  // Si l'onboarding est terminé, afficher le contenu normal
  return <>{children}</>;
};

export default OnboardingRedirect;
