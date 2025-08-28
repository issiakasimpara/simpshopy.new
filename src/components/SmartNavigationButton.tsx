import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useOnboarding } from '@/hooks/useOnboarding';
import { ArrowRight } from 'lucide-react';

interface SmartNavigationButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const SmartNavigationButton: React.FC<SmartNavigationButtonProps> = ({ 
  children, 
  className = '',
  variant = 'default',
  size = 'default'
}) => {
  const { user } = useAuth();
  const { shouldShowOnboarding } = useOnboarding();

  const handleClick = () => {
    const currentHostname = window.location.hostname;

    if (user) {
      // Utilisateur connecté
      if (shouldShowOnboarding) {
        // Rediriger vers l'onboarding sur admin.simpshopy.com
        if (currentHostname === 'admin.simpshopy.com') {
          window.location.href = '/onboarding';
        } else {
          window.location.href = 'https://admin.simpshopy.com/onboarding';
        }
      } else {
        // Rediriger vers le dashboard sur admin.simpshopy.com
        if (currentHostname === 'admin.simpshopy.com') {
          window.location.href = '/dashboard';
        } else {
          window.location.href = 'https://admin.simpshopy.com/dashboard';
        }
      }
    } else {
      // Utilisateur non connecté - rediriger vers l'auth sur admin.simpshopy.com
      if (currentHostname === 'admin.simpshopy.com') {
        window.location.href = '/auth';
      } else {
        window.location.href = 'https://admin.simpshopy.com/auth';
      }
    }
  };

  return (
    <Button 
      onClick={handleClick}
      className={className}
      variant={variant}
      size={size}
    >
      {children}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );
};

export default SmartNavigationButton;
