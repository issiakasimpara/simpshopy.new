import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, Eye, Sparkles, Grid, Star, Zap, Check } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { preBuiltTemplates } from "@/data/preBuiltTemplates";
import { templateCategories } from "@/data/templateCategories";
import TemplateCategoriesSection from "@/components/site-builder/TemplateCategoriesSection";
import { useStores } from "@/hooks/useStores";
import { useSiteTemplates } from "@/hooks/useSiteTemplates";
import { useToast } from "@/hooks/use-toast";
import { siteTemplateService } from "@/services/siteTemplateService";

const SiteBuilder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { store, hasStore } = useStores();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isChangingTheme, setIsChangingTheme] = useState<string | null>(null);

  // Redirection conditionnelle selon le contexte
  useEffect(() => {
    // Si on vient de /store-config/site-builder ET qu'on a une boutique, rediriger vers l'éditeur
    if (location.pathname === '/store-config/site-builder' && store) {
      const defaultTemplate = preBuiltTemplates[0];
      navigate(`/store-config/site-builder/editor/${defaultTemplate.id}`, { replace: true });
    }
    // Si on vient de /store-config/site-builder SANS boutique, rediriger vers la création
    else if (location.pathname === '/store-config/site-builder' && !store) {
      navigate('/store-config', { replace: true });
    }
  }, [location.pathname, store, navigate]);

  // Déterminer le contexte : galerie de thèmes ou personnalisation boutique
  const isThemeGallery = location.pathname === '/themes/gallery';
  const isStoreCustomization = location.pathname.includes('/store-config/site-builder');

  const filteredTemplates = selectedCategory === 'all' 
    ? preBuiltTemplates 
    : preBuiltTemplates.filter(template => template.category === selectedCategory);

  const getCategoryName = (categoryId: string) => {
    const category = templateCategories.find(cat => cat.id === categoryId);
    return category?.name || categoryId;
  };

  // Function to get icon based on category
  const getTemplateIcon = (category: string) => {
    const categoryData = templateCategories.find(cat => cat.id === category);
    return categoryData?.icon || '🎨';
  };

  // Function to get preview image based on template category
  const getPreviewImage = (category: string) => {
    const previewImages = {
      fashion: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop", // Fashion boutique
      electronics: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop", // Electronics/tech
      beauty: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=250&fit=crop", // Beauty products
      food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=250&fit=crop", // Food/restaurant
      sports: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop", // Sports equipment
      home: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop", // Home decor
      art: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=250&fit=crop", // Art gallery
      default: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop"
    };
    return previewImages[category] || previewImages.default;
  };

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

  // Si on est en train de rediriger, afficher un loading
  if (location.pathname === '/store-config/site-builder' && store) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Ouverture de l'éditeur de personnalisation...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Header moderne */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-blue-600/5 rounded-3xl" />
          <div className="relative p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-background via-background to-muted/20 rounded-3xl border border-border/50 shadow-lg">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-0">
              <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                <div className="relative p-3 sm:p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-2xl shadow-inner">
                  <Palette className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
                  <div className="absolute -top-1 -right-1 p-1 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-pulse">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
                    {isThemeGallery ? 'Galerie de Thèmes' : 'Créateur de Site'}
                  </h1>
                  <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-medium mt-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
                    <span className="text-xs sm:text-sm lg:text-base">{isThemeGallery
                      ? hasStore 
                        ? 'Choisissez un nouveau thème pour votre boutique'
                        : 'Choisissez un thème pour créer votre boutique'
                      : 'Choisissez un template et personnalisez votre boutique'
                    }</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Catégories avec design modernisé */}
        <TemplateCategoriesSection 
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        {/* Templates Grid avec design amélioré */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl" />
          <div className="relative p-4 sm:p-6 bg-gradient-to-br from-background via-background to-muted/20 rounded-2xl border border-border/50 shadow-lg">
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-xl">
                    <Grid className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    Templates Disponibles
                  </h2>
                </div>
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg text-xs sm:text-sm">
                  {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                {selectedCategory === 'all' 
                  ? "Tous les templates disponibles" 
                  : `Templates pour ${getCategoryName(selectedCategory)}`
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 bg-gradient-to-br from-background via-background to-muted/10 cursor-pointer">
                  {/* Gradient border effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-60" />
                  
                  <CardHeader className="relative pb-3 sm:pb-4">
                    <div className="flex items-center justify-between">
                      <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <span className="text-lg sm:text-2xl">{getTemplateIcon(template.category)}</span>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400 fill-current" />
                        <span className="text-xs sm:text-sm font-medium text-amber-600 dark:text-amber-400">
                          4.8
                        </span>
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-lg sm:text-xl font-bold text-foreground group-hover:text-purple-600 transition-colors duration-300">
                        {template.name}
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2">
                        {template.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative pt-0">
                    {/* Preview Image */}
                    <div className="relative w-full h-24 sm:h-32 rounded-xl mb-3 sm:mb-4 overflow-hidden shadow-inner group-hover:shadow-lg transition-shadow duration-300">
                      <img 
                        src={getPreviewImage(template.category)} 
                        alt={`Aperçu ${template.name}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 group-hover:opacity-80 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 dark:bg-gray-900/90 rounded-full p-1.5 sm:p-2">
                          <Eye className="h-4 w-4 sm:h-6 sm:w-6 text-purple-500" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Template Info */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50 text-xs sm:text-sm">
                        {getCategoryName(template.category)}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-medium">
                        Gratuit
                      </span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 group/btn bg-gradient-to-r from-white to-blue-50/30 dark:from-gray-950 dark:to-blue-950/20 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30 border-border/60 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 text-xs sm:text-sm"
                        onClick={() => {
                          if (isThemeGallery) {
                            // Si on est dans la galerie de thèmes, aller à l'aperçu
                            navigate(`/store-config/site-builder/preview/${template.id}`);
                          } else {
                            // Si on est dans la personnalisation, ouvrir l'aperçu dans l'éditeur
                            console.log('Aperçu dans l\'éditeur:', template.id);
                          }
                        }}
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
                        <span className="text-xs sm:text-sm">Aperçu</span>
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 group/btn text-xs sm:text-sm"
                        onClick={() => {
                          if (isThemeGallery) {
                            if (hasStore) {
                              // Si on a une boutique, changer le thème
                              handleThemeChange(template.id);
                            } else {
                              // Si pas de boutique, ouvrir le formulaire de création
                              console.log('Créer boutique avec thème:', template.id);
                            }
                          } else {
                            // Si on est dans la personnalisation, aller à l'éditeur
                            navigate(`/store-config/site-builder/editor/${template.id}`);
                          }
                        }}
                        disabled={isChangingTheme === template.id}
                      >
                        {isChangingTheme === template.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-1 sm:mr-2" />
                            <span className="text-xs sm:text-sm">Changement...</span>
                          </>
                        ) : (
                          <>
                            {isThemeGallery && hasStore ? (
                              <>
                                <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
                                <span className="text-xs sm:text-sm">Utiliser ce thème</span>
                              </>
                            ) : (
                              <>
                                <Palette className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
                                <span className="text-xs sm:text-sm">{isThemeGallery ? 'Utiliser ce thème' : 'Utiliser'}</span>
                              </>
                            )}
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                <div className="p-3 sm:p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg mb-4 sm:mb-6">
                  <Palette className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                  Aucun template disponible
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground text-center mb-4 sm:mb-6 max-w-md">
                  Aucun template n'est disponible pour la catégorie "{getCategoryName(selectedCategory)}" pour le moment.
                </p>
                <Button 
                  onClick={() => setSelectedCategory('all')} 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                >
                  Voir tous les templates
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SiteBuilder;
