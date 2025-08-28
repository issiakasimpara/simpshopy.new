import React, { useEffect, useState, memo, useMemo, Suspense } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Store, ShoppingBag, ArrowLeft, Home, Loader2, Menu, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import BlockRenderer from '@/components/site-builder/BlockRenderer';
import CartWidget from '@/components/site-builder/blocks/CartWidget';
import { Template } from '@/types/template';
import { supabase } from '@/integrations/supabase/client';
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';
import type { Tables } from '@/integrations/supabase/types';
import VisitorTracker from '@/components/VisitorTracker';

import { useBranding } from '@/hooks/useBranding';

// Composant de chargement sophistiqué
const StorefrontLoader = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
    <div className="text-center animate-fade-in-up">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
        <div className="relative p-4 bg-white rounded-full shadow-lg">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Chargement de votre boutique</h2>
      <p className="text-gray-600">Préparation de l'expérience shopping...</p>
      <div className="mt-4 w-48 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-shimmer"></div>
      </div>
    </div>
  </div>
));

type StoreType = Tables<'stores'>;
type ProductType = Tables<'products'>;

const Storefront = () => {
  const { storeSlug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [store, setStore] = useState<StoreType | null>(null);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { setStoreId } = useCart();

  // Récupérer les données de branding
  const brandingData = useBranding(template);

  console.log('Storefront: Loading store:', storeSlug);

  // Fonction pour récupérer les données de la boutique publique
  const fetchStoreData = async () => {
    if (!storeSlug) {
      setError('Slug de boutique manquant');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Recherche de la boutique:', storeSlug);

      // Domain-router removed, use fallback directly
      console.log('🔍 Domain-router removed, using fallback method');
      await fetchStoreDataFallback();
      return;

    } catch (err) {
      console.error('Erreur domain-router, fallback...', err);
      await fetchStoreDataFallback();
    }
  };

  // Fallback: recherche directe dans la base de données
  const fetchStoreDataFallback = async () => {
    try {
      console.log('🔄 Fallback: recherche directe en base');

      // 1. Récupérer toutes les boutiques actives et trouver celle qui correspond au slug
      const { data: storesData, error: storesError } = await supabase
        .from('stores')
        .select('*')
        .eq('status', 'active');

      if (storesError) throw storesError;

      console.log('Boutiques trouvées:', storesData?.length || 0);

      // Trouver la boutique qui correspond au slug
      const foundStore = storesData?.find(s => {
        const generatedSlug = s.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        console.log(`Boutique "${s.name}" -> slug: "${generatedSlug}"`);
        return generatedSlug === storeSlug;
      });

      if (!foundStore) {
        setError(`Boutique "${storeSlug}" non trouvée ou non active`);
        setLoading(false);
        return;
      }

      console.log('✅ Boutique trouvée:', foundStore.name);
      setStore(foundStore);
      setStoreId(foundStore.id);

      // 2. Récupérer le template publié (toujours chercher la dernière version publiée)
      console.log('🔍 Recherche de templates pour store_id:', foundStore.id);

      // D'abord voir tous les templates pour ce store
      const { data: allTemplates, error: allError } = await supabase
        .from('site_templates')
        .select('id, template_id, is_published, updated_at')
        .eq('store_id', foundStore.id)
        .order('updated_at', { ascending: false });

      console.log('📋 Tous les templates trouvés:', allTemplates);

      // Maintenant chercher spécifiquement les templates publiés
      const { data: templateData, error: templateError } = await supabase
        .from('site_templates')
        .select('template_data, is_published, updated_at')
        .eq('store_id', foundStore.id)
        .eq('is_published', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (templateError && templateError.code !== 'PGRST116') {
        console.error('❌ Erreur template:', templateError);
      }

      console.log('🎯 Template publié trouvé:', templateData);

      if (templateData) {
        console.log('✅ Template publié trouvé (dernière version publiée)');
        setTemplate(templateData.template_data as Template);
      } else {
        console.log('⚠️ Aucun template publié trouvé - utilisation du template par défaut');
        
        // Utiliser un template par défaut au lieu de bloquer l'accès
        const defaultTemplate: Template = {
          id: 'default',
          name: 'Template par défaut',
          category: 'default',
          pages: {
            home: [
              {
                id: 'welcome',
                type: 'hero',
                order: 1,
                data: {
                  title: `Bienvenue sur ${foundStore.name}`,
                  subtitle: 'Votre boutique en ligne',
                  ctaText: 'Voir les produits',
                  ctaLink: '?page=product'
                }
              }
            ],
            product: [
              {
                id: 'products-list',
                type: 'product-grid',
                order: 1,
                data: {
                  title: 'Nos produits',
                  products: productsData || []
                }
              }
            ]
          }
        };
        
        setTemplate(defaultTemplate);
      }

      // 3. Récupérer les produits
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          categories(name)
        `)
        .eq('store_id', foundStore.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Erreur produits:', productsError);
      } else {
        console.log('✅ Produits trouvés:', productsData?.length || 0);
        setProducts(productsData || []);
      }

      setLoading(false);
    } catch (err) {
      console.error('Erreur fallback:', err);
      setError('Erreur lors du chargement de la boutique');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreData();

    // Debug info
    if (storeSlug) {
      console.log('🔧 Debug: Storefront chargé pour le slug:', storeSlug);
    }
  }, [storeSlug]);

  // Effet pour mettre à jour le favicon et le titre de la page
  useEffect(() => {
    console.log('🔄 Mise à jour branding:', {
      favicon: brandingData.favicon ? 'Présent' : 'Absent',
      brandName: brandingData.brandName
    });

    if (brandingData.favicon) {
      try {
        // Supprimer seulement les favicons personnalisés des boutiques (pas le favicon principal SimpShopy)
        const existingCustomFavicons = document.querySelectorAll("link[rel*='icon'][data-custom='true']");
        existingCustomFavicons.forEach(favicon => favicon.remove());

        // Créer un nouveau favicon personnalisé
        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/x-icon';
        link.href = brandingData.favicon;
        link.setAttribute('data-custom', 'true'); // Marquer comme favicon personnalisé

        // Ajouter au head
        document.getElementsByTagName('head')[0].appendChild(link);

        console.log('✅ Favicon personnalisé mis à jour:', brandingData.favicon.substring(0, 50) + '...');
      } catch (error) {
        console.error('❌ Erreur mise à jour favicon personnalisé:', error);
      }
    }

    // Mettre à jour le titre de la page
    if (brandingData.brandName) {
      document.title = brandingData.brandName;
    } else if (store?.name) {
      document.title = store.name;
    }
  }, [brandingData, store]);

  // Gérer les paramètres d'URL pour la navigation
  useEffect(() => {
    const page = searchParams.get('page') || 'home';
    const productId = searchParams.get('product');

    console.log('Storefront: URL params changed', { page, productId, productsLoaded: products.length > 0, loading });

    // Si on est sur une page produit-detail avec un productId
    if (page === 'product-detail' && productId) {
      // Si les produits ne sont pas encore chargés, attendre
      if (loading || products.length === 0) {
        console.log('Storefront: Products not loaded yet, waiting...');
        // Ne pas changer la page, attendre le chargement
        setSelectedProductId(productId);
        return;
      }

      // Vérifier que le produit existe maintenant que les produits sont chargés
      const productExists = products.find(p => p.id === productId);
      if (!productExists) {
        console.log('Storefront: Product not found, redirecting to boutique');
        navigate('?page=product', { replace: true });
        return;
      }
    }

    setCurrentPage(page);
    setSelectedProductId(productId);
  }, [searchParams, products, navigate, loading]);

  // Écouter les changements d'historique (bouton retour du navigateur)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      console.log('Storefront: Browser back/forward detected');
      // Forcer la re-lecture des paramètres URL
      const urlParams = new URLSearchParams(window.location.search);
      const page = urlParams.get('page') || 'home';
      const productId = urlParams.get('product');

      console.log('Storefront: Restoring state from URL', { page, productId });

      setCurrentPage(page);
      setSelectedProductId(productId);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleProductClick = (productId: string) => {
    console.log('Storefront: Product clicked', productId);
    setSelectedProductId(productId);
    setCurrentPage('product-detail');
    // Utiliser navigate pour une meilleure synchronisation avec React Router
    navigate(`?page=product-detail&product=${productId}`, { replace: false });
  };

  const handlePageNavigation = (page: string) => {
    console.log('Storefront: Page navigation', page);
    setCurrentPage(page);
    setSelectedProductId(null);
    navigate(page === 'home' ? '' : `?page=${page}`, { replace: false });
  };

  const handleCartNavigation = () => {
    console.log('Storefront: Cart navigation');
    setCurrentPage('cart');
    setSelectedProductId(null);
    navigate('?page=cart', { replace: false });
  };

  const getPageBlocks = (pageName: string) => {
    if (!template) return [];
    return template.pages[pageName] ? template.pages[pageName].sort((a, b) => a.order - b.order) : [];
  };

  const renderNavigation = () => {
    if (!template) return null;

    const mainPages = ['home', 'product', 'category', 'contact'];
    const logoPosition = brandingData.logoPosition || 'left';

    // Composant Logo réutilisable
    const LogoComponent = () => (
      <div className="flex items-center space-x-3">
        {brandingData.logo ? (
          <img
            src={brandingData.logo}
            alt={brandingData.brandName || store?.name}
            className="h-10 max-w-32 object-contain"
          />
        ) : store?.logo_url ? (
          <img
            src={store.logo_url}
            alt={store.name}
            className="h-10 w-10 rounded-lg object-cover"
          />
        ) : (
          <div className="p-2 rounded-lg" style={{ backgroundColor: template.styles.primaryColor }}>
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
        )}
        <span className="text-xl font-bold">
          {brandingData.brandName || store?.name}
        </span>
      </div>
    );

    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="relative flex items-center justify-between h-16">
            {/* Position gauche */}
            {logoPosition === 'left' && <LogoComponent />}
            {logoPosition !== 'left' && <div></div>} {/* Spacer */}

            {/* Position centre */}
            {logoPosition === 'center' && (
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <LogoComponent />
              </div>
            )}

            {/* Navigation principale */}
            <div className={`hidden md:flex items-center space-x-8 ${logoPosition === 'center' ? 'ml-auto' : ''}`}>
              {mainPages.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageNavigation(page)}
                  className={`text-gray-700 hover:text-gray-900 transition-colors font-medium ${
                    currentPage === page ? 'border-b-2 pb-1' : ''
                  }`}
                  style={{
                    borderColor: currentPage === page ? template.styles.primaryColor : 'transparent'
                  }}
                >
                  {page === 'home' ? 'Accueil' :
                   page === 'product' ? 'Boutique' :
                   page === 'category' ? 'Catégories' : 'Contact'}
                </button>
              ))}
            </div>

            {/* Actions et Position droite */}
            <div className="flex items-center space-x-4">
              {/* Position droite */}
              {logoPosition === 'right' && <LogoComponent />}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleCartNavigation}
                className="relative"
              >
                <ShoppingBag className="h-5 w-5" />
              </Button>

              {/* Menu hamburger mobile */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Menu mobile déroulant */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t bg-white">
              <div className="px-4 py-2 space-y-1">
                {mainPages.map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      handlePageNavigation(page);
                      setMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      currentPage === page
                        ? 'text-white'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    style={{
                      backgroundColor: currentPage === page ? template.styles.primaryColor : 'transparent'
                    }}
                  >
                    {page === 'home' ? 'Accueil' :
                     page === 'product' ? 'Boutique' :
                     page === 'category' ? 'Catégories' : 'Contact'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    );
  };

  const renderBreadcrumb = () => {
    if (currentPage === 'home') return null;

    return (
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button
              onClick={() => handlePageNavigation('home')}
              className="hover:text-gray-900 flex items-center gap-1"
            >
              <Home className="h-3 w-3" />
              Accueil
            </button>
            <span>/</span>
            {currentPage === 'product-detail' && selectedProductId ? (
              <>
                <button
                  onClick={() => handlePageNavigation('product')}
                  className="hover:text-gray-900"
                >
                  Boutique
                </button>
                <span>/</span>
                <span className="text-gray-900 font-medium">Détail du produit</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageNavigation('product')}
                  className="ml-2 h-6 px-2 text-xs"
                >
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Retour
                </Button>
              </>
            ) : (
              <span className="text-gray-900 font-medium">
                {currentPage === 'product' ? 'Boutique' :
                 currentPage === 'category' ? 'Catégories' :
                 currentPage === 'contact' ? 'Contact' :
                 currentPage === 'cart' ? 'Panier' : currentPage}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <StorefrontLoader />;
  }

  if (error || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Boutique non trouvée</h1>
          <p className="text-gray-600 mb-6">
            {error || 'Cette boutique n\'existe pas ou n\'est pas encore publiée.'}
          </p>
          <Button onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  // Si pas de template, utiliser un template par défaut
  if (!template) {
    const defaultTemplate: Template = {
      id: 'default',
      name: 'Template par défaut',
      category: 'default',
      pages: {
        home: [
          {
            id: 'welcome',
            type: 'hero',
            order: 1,
            data: {
              title: `Bienvenue sur ${store.name}`,
              subtitle: 'Votre boutique en ligne',
              ctaText: 'Voir les produits',
              ctaLink: '?page=product'
            }
          }
        ],
        product: [
          {
            id: 'products-list',
            type: 'product-grid',
            order: 1,
            data: {
              title: 'Nos produits',
              products: products || []
            }
          }
        ]
      }
    };
    setTemplate(defaultTemplate);
  }

  const currentPageBlocks = getPageBlocks(currentPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Tracker les visiteurs en temps réel */}
      {store && <VisitorTracker storeId={store.id} storeSlug={storeSlug} />}
      
      {renderNavigation()}
      {renderBreadcrumb()}

      {/* Contenu principal - RENDU SYNCHRONE (rapide comme Shopify) */}
      <div className="min-h-screen">
        {currentPageBlocks.map((block, index) => (
          <div
            key={`${block.id}-${block.order}`}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 20}ms` }} // Réduit de 100ms à 20ms
          >
            <BlockRenderer
              block={block}
              isEditing={false}
              viewMode="desktop"
              selectedStore={store}
              productId={selectedProductId}
              onProductClick={handleProductClick}
              products={products}
            />
          </div>
        ))}
      </div>

      <CartWidget />
    </div>
  );
};

export default Storefront;
