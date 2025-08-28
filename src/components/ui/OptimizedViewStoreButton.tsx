import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2, Store } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useStores } from '@/hooks/useStores';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface OptimizedViewStoreButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const OptimizedViewStoreButton = ({ 
  className, 
  variant = 'outline', 
  size = 'sm' 
}: OptimizedViewStoreButtonProps) => {
  const [isOpening, setIsOpening] = useState(false);
  const { user } = useAuth();
  const { store, hasStore, isLoading } = useStores();
  const { toast } = useToast();

  const handleViewStore = useCallback(async () => {
    if (!user || !hasStore || !store) {
      toast({
        title: "Erreur",
        description: !user 
          ? "Vous devez être connecté pour voir votre boutique."
          : "Vous devez d'abord créer une boutique pour la voir.",
        variant: "destructive"
      });
      return;
    }

    setIsOpening(true);

    try {
      // Créer le slug de la boutique
      const storeSlug = store.name
        ?.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '') || 'ma-boutique';

      // Ouvrir la boutique dans une nouvelle fenêtre sur le bon domaine
      const currentHostname = window.location.hostname;
      let storeUrl;
      
      if (currentHostname === 'localhost' || currentHostname.includes('localhost')) {
        // En développement, rester sur localhost
        storeUrl = `http://localhost:8080/store/${storeSlug}`;
      } else if (currentHostname === 'admin.simpshopy.com') {
        // En production, rediriger vers simpshopy.com
        storeUrl = `https://simpshopy.com/store/${storeSlug}`;
      } else {
        // Fallback pour autres cas
        storeUrl = `/store/${storeSlug}`;
      }
      
      window.open(storeUrl, '_blank');
      
      // Feedback positif
      toast({
        title: "Boutique ouverte",
        description: "Votre boutique s'ouvre dans un nouvel onglet.",
      });

    } catch (error) {
      console.error('Erreur lors de l\'ouverture de la boutique:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir la boutique.",
        variant: "destructive"
      });
    } finally {
      // Délai minimal pour l'animation
      setTimeout(() => setIsOpening(false), 300);
    }
  }, [user, hasStore, store, toast]);

  // État de chargement des données
  if (isLoading) {
    return (
      <Button
        variant={variant}
        size={size}
        disabled
        className={cn(
          "transition-all duration-200 border-border/60 flex items-center gap-2",
          className
        )}
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        Chargement...
      </Button>
    );
  }

  // État sans boutique
  if (!hasStore) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={() => {
          toast({
            title: "Créer une boutique",
            description: "Redirection vers la création de boutique...",
          });
          // Rediriger vers la création de boutique
          window.location.href = '/store-config';
        }}
        className={cn(
          "hover:bg-primary hover:text-primary-foreground transition-all duration-200 border-border/60 flex items-center gap-2",
          className
        )}
      >
        <Store className="h-4 w-4" />
        Créer une boutique
      </Button>
    );
  }

  // État normal avec boutique
  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleViewStore}
      disabled={isOpening}
      className={cn(
        "hover:bg-primary hover:text-primary-foreground transition-all duration-200 border-border/60 flex items-center gap-2",
        isOpening && "animate-pulse",
        className
      )}
    >
      {isOpening ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ExternalLink className="h-4 w-4" />
      )}
      {isOpening ? 'Ouverture...' : 'Voir le site'}
    </Button>
  );
};

export default OptimizedViewStoreButton;
