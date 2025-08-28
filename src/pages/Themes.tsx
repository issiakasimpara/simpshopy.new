// 🎨 PAGE GALERIE DE THÈMES (SEULEMENT POUR CHOISIR)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { useStores } from '@/hooks/useStores';
import { useAuth } from '@/hooks/useAuth';
import { preBuiltTemplates } from '@/data/preBuiltTemplates';
import CreateStoreDialog from '@/components/CreateStoreDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Eye, Sparkles, Layout, ShoppingBag, Check } from 'lucide-react';
import { useSiteTemplates } from '@/hooks/useSiteTemplates';
import { useToast } from '@/hooks/use-toast';
import { siteTemplateService } from '@/services/siteTemplateService';

const Themes = () => {
  const navigate = useNavigate();
  const [showCreateStore, setShowCreateStore] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [isChangingTheme, setIsChangingTheme] = useState<string | null>(null);
  const { store, hasStore, isLoading, refetchStores } = useStores();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  // Fonction pour changer le thème d'une boutique existante
  const handleThemeChange = async (templateId: string) => {
    if (!store) {
      toast({
        title: "Erreur",
        description: "Aucune boutique trouvée. Veuillez créer une boutique d'abord.",
        variant: "destructive"
      });
      return;
    }

    setIsChangingTheme(templateId);

    try {
      // Récupérer le template sélectionné
      const templateData = preBuiltTemplates.find(t => t.id === templateId);
      if (!templateData) {
        throw new Error('Template non trouvé');
      }

      // Sauvegarder le nouveau template et le publier
      await siteTemplateService.saveTemplate(
        store.id,
        templateId,
        templateData,
        true // Publier directement
      );

      // Invalider le cache pour forcer le rechargement
      const cacheKey = `${store.id}_${templateId}`;
      localStorage.removeItem(`template_cache_${cacheKey}`);
      
      // Nettoyer tous les caches de templates pour cette boutique
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('template_cache_') && key.includes(store.id)) {
          localStorage.removeItem(key);
        }
      });

      toast({
        title: "Thème changé avec succès !",
        description: `Votre boutique utilise maintenant le thème "${templateData.name}". Redirection vers l'éditeur...`,
      });

      // Attendre un peu pour que la base de données se synchronise
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Rediriger vers l'éditeur pour personnaliser le nouveau thème
      navigate(`/store-config/site-builder/editor/${templateId}`);

    } catch (error) {
      console.error('Erreur lors du changement de thème:', error);
      toast({
        title: "Erreur",
        description: "Impossible de changer le thème. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsChangingTheme(null);
    }
  };

  const handleThemeSelect = (themeId: string) => {
    if (hasStore) {
      // Si on a une boutique, changer le thème
      handleThemeChange(themeId);
    } else {
      // Si pas de boutique, ouvrir le formulaire de création
      setSelectedTheme(themeId);
      setShowCreateStore(true);
    }
  };

  const handleStoreCreated = () => {
    setShowCreateStore(false);
    setSelectedTheme(null);
    refetchStores();
  };

  if (authLoading || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* En-tête */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Galerie de Thèmes
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Choisissez parmi nos thèmes professionnels et personnalisez votre boutique en ligne
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span className="text-xs sm:text-sm font-medium">{preBuiltTemplates.length} thèmes disponibles</span>
            </div>
            <div className="w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              <span className="text-xs sm:text-sm font-medium">100% personnalisables</span>
            </div>
          </div>
        </div>

        {/* Grille des thèmes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {preBuiltTemplates.map((template) => (
            <Card 
              key={template.id} 
              className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-200"
              onClick={() => handleThemeSelect(template.id)}
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-32 sm:h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Badge de catégorie */}
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs bg-white/90 backdrop-blur-sm">
                    {template.category}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <div className="space-y-2">
                  <CardTitle className="text-sm sm:text-base font-semibold group-hover:text-blue-600 transition-colors">
                    {template.name}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm line-clamp-2">
                    {template.description}
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layout className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {template.blocks?.length || 0} blocs
                    </span>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isChangingTheme === template.id}
                  >
                    {isChangingTheme === template.id ? (
                      <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white" />
                    ) : (
                      <>
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {hasStore ? 'Utiliser' : 'Créer'}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dialog de création de boutique */}
        <CreateStoreDialog
          open={showCreateStore}
          onOpenChange={setShowCreateStore}
          onStoreCreated={handleStoreCreated}
          hasExistingStore={hasStore}
        />
      </div>
    </DashboardLayout>
  );
};

export default Themes;
