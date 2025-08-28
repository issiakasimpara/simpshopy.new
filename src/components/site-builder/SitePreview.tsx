import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Template, TemplateBlock } from '@/types/template';
import BlockRenderer from './BlockRenderer';
import CartWidget from './blocks/CartWidget';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, Home, Package, Grid, Phone, Eye, ShoppingBag, Search, User, Heart } from 'lucide-react';
import { useStores } from '@/hooks/useStores';
import { useStoreDomains } from '@/hooks/useDomains';
import { generateSimpshopyUrl } from '@/utils/domainUtils';
import type { Tables } from '@/integrations/supabase/types';

type Store = Tables<'stores'>;

interface SitePreviewProps {
  template: Template;
  currentPage: string;
  blocks: TemplateBlock[];
  open: boolean;
  onClose: () => void;
}

// Composant interne qui utilise le CartContext
const SitePreviewContent = ({
  template,
  currentPage,
  blocks,
  open,
  onClose
}: SitePreviewProps) => {
  const [activePreviewPage, setActivePreviewPage] = useState<string>(currentPage);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
  const { stores } = useStores();
  const { getTotalItems, setStoreId, storeId, items } = useCart();
  const selectedStore = Array.isArray(stores) && stores.length > 0 ? stores[0] : null;

  // Récupérer les domaines pour afficher la bonne URL
  const { domains } = useStoreDomains(selectedStore?.id);

  // Initialiser le panier avec le storeId de la boutique sélectionnée
  useEffect(() => {
    if (selectedStore?.id && open) {
      setStoreId(selectedStore.id);
    }
  }, [selectedStore?.id, open, setStoreId, storeId]);

  // Synchroniser la page active avec la page courante de l'éditeur
  useEffect(() => {
    setActivePreviewPage(currentPage);
    setSelectedProductId(null);
    setNavigationHistory([]);
  }, [currentPage]);

  // Écouter les messages de la page de succès de paiement
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'CLOSE_PREVIEW') {
        // Retourner à la page d'accueil de la boutique dans l'aperçu
        setActivePreviewPage('home');
        setSelectedProductId(null);
        setNavigationHistory([]);
      } else if (event.data.type === 'PREVIEW_HOME_LOADED') {
        // Confirmer que nous sommes bien revenus à l'accueil
        setActivePreviewPage('home');
        setSelectedProductId(null);
        setNavigationHistory([]);
      } else if (event.data.type === 'NAVIGATE_TO_CUSTOMER_ORDERS') {
        // Dans l'aperçu, on peut simuler la page de suivi des commandes
        // ou simplement afficher un message informatif
        setActivePreviewPage('customer-orders-preview');
        setSelectedProductId(null);
        setNavigationHistory([]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [activePreviewPage]);

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setActivePreviewPage('product-detail');
    setNavigationHistory(prev => [...prev, activePreviewPage]);
  };

  const handlePageNavigation = (pageName: string) => {
    setNavigationHistory(prev => [...prev, activePreviewPage]);
    setActivePreviewPage(pageName);
    setSelectedProductId(null);
  };

  const handleBackNavigation = () => {
    if (navigationHistory.length > 0) {
      const previousPage = navigationHistory[navigationHistory.length - 1];
      setActivePreviewPage(previousPage);
      setNavigationHistory(prev => prev.slice(0, -1));
      setSelectedProductId(null);
    }
  };

  const getPageBlocks = (pageName: string): TemplateBlock[] => {
    // Utiliser directement le template au lieu des blocs passés en props
    const pageBlocks = template.pages[pageName] ? template.pages[pageName].sort((a, b) => a.order - b.order) : [];
    
    // Si pas de blocs, créer des blocs par défaut selon le type de page
    if (pageBlocks.length === 0) {
      const defaultBlocks: TemplateBlock[] = [];
      
      switch (pageName) {
        case 'product':
          defaultBlocks.push({
            id: 'default-product-hero',
            type: 'hero',
            content: {
              title: 'Nos Produits',
              subtitle: 'Découvrez notre collection complète',
              showBreadcrumb: true,
              showSearch: true
            },
            styles: {
              backgroundColor: '#f8f9fa',
              textColor: '#000000',
              padding: '60px 0',
            },
            order: 1
          });
          defaultBlocks.push({
            id: 'default-product-listing',
            type: 'products',
            content: {
              title: 'Collection Complète',
              layout: 'grid',
              productsToShow: 12,
              showPrice: true,
              showAddToCart: true,
              showFilters: true,
              showSorting: true
            },
            styles: {
              backgroundColor: '#ffffff',
              textColor: '#000000',
              padding: '80px 0',
            },
            order: 2
          });
          break;
          
        case 'category':
          defaultBlocks.push({
            id: 'default-category-hero',
            type: 'hero',
            content: {
              title: 'Catégories',
              subtitle: 'Explorez nos différentes collections',
              showBreadcrumb: true
            },
            styles: {
              backgroundColor: '#f8f9fa',
              textColor: '#000000',
              padding: '60px 0',
            },
            order: 1
          });
          defaultBlocks.push({
            id: 'default-category-gallery',
            type: 'gallery',
            content: {
              title: 'Nos Collections',
              layout: 'grid',
              showOverlay: true,
              images: [
                {
                  url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
                  title: 'Collection 1',
                  link: '/category/1'
                },
                {
                  url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1',
                  title: 'Collection 2',
                  link: '/category/2'
                },
                {
                  url: 'https://images.unsplash.com/photo-1506629905496-f43d8e5d8b6d',
                  title: 'Collection 3',
                  link: '/category/3'
                }
              ]
            },
            styles: {
              backgroundColor: '#ffffff',
              textColor: '#000000',
              padding: '80px 0',
            },
            order: 2
          });
          break;
          
        case 'contact':
          defaultBlocks.push({
            id: 'default-contact-hero',
            type: 'hero',
            content: {
              title: 'Contactez-nous',
              subtitle: 'Nous sommes là pour vous aider',
              showBreadcrumb: true
            },
            styles: {
              backgroundColor: '#f8f9fa',
              textColor: '#000000',
              padding: '60px 0',
            },
            order: 1
          });
          defaultBlocks.push({
            id: 'default-contact-form',
            type: 'contact',
            content: {
              title: 'Envoyez-nous un message',
              showMap: true,
              showPhone: true,
              showEmail: true
            },
            styles: {
              backgroundColor: '#ffffff',
              textColor: '#000000',
              padding: '80px 0',
            },
            order: 2
          });
          break;
      }
      
      return defaultBlocks;
    }
    
    return pageBlocks;
  };

  const getPageDisplayName = (pageName: string): string => {
    const names: { [key: string]: string } = {
      'home': 'Accueil',
      'product': 'Produits',
      'category': 'Catégories',
      'contact': 'Contact',
      'cart': 'Panier',
      'product-detail': 'Détail Produit',
      'customer-orders-preview': 'Suivi Commandes'
    };
    return names[pageName] || pageName;
  };

  const getDisplayUrl = (): string => {
    if (selectedStore && domains && Array.isArray(domains) && domains.length > 0) {
      const primaryDomain = domains.find(d => d.is_primary);
      if (primaryDomain) {
        return `https://${primaryDomain.domain_name}${activePreviewPage === 'home' ? '' : `/${activePreviewPage}`}`;
      }
    }
    
    const storeSlug = selectedStore?.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'ma-boutique';
    return generateSimpshopyUrl(storeSlug);
  };

  const renderProfessionalNavigation = () => {
    const navigationItems = [
      { name: 'Accueil', page: 'home', icon: Home },
      { name: 'Produits', page: 'product', icon: Package },
      { name: 'Catégories', page: 'category', icon: Grid },
      { name: 'Contact', page: 'contact', icon: Phone }
    ];

    return (
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-lg sm:text-xl font-bold text-gray-900">
                {selectedStore?.name || template.name}
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-4 sm:gap-6">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.page}
                    onClick={() => handlePageNavigation(item.page)}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                      activePreviewPage === item.page
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{item.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button className="p-1 sm:p-2 text-gray-600 hover:text-gray-900">
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button className="p-1 sm:p-2 text-gray-600 hover:text-gray-900">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button 
                onClick={() => handlePageNavigation('cart')}
                className="relative p-1 sm:p-2 text-gray-600 hover:text-gray-900"
              >
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
              <button className="p-1 sm:p-2 text-gray-600 hover:text-gray-900">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  };

  const renderBreadcrumb = () => {
    if (activePreviewPage === 'home') return null;

    return (
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => handlePageNavigation('home')}
              className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <Home className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Accueil</span>
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-xs sm:text-sm text-gray-900 font-medium">
              {getPageDisplayName(activePreviewPage)}
            </span>
            {navigationHistory.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackNavigation}
                className="ml-2 h-6 sm:h-8 px-2 text-xs sm:text-sm"
              >
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">Retour</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderProductDetail = () => {
    if (!selectedProductId) return null;

    const productDetailBlock: TemplateBlock = {
      id: 'product-detail-preview-temp',
      type: 'product-detail',
      content: {
        productId: selectedProductId,
        showAddToCart: true,
        showQuantity: true,
        showRelatedProducts: true
      },
      styles: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
        padding: '0',
      },
      order: 1
    };

    return (
      <div className="min-h-screen">
        <BlockRenderer
          key={`product-detail-${selectedProductId}`}
          block={productDetailBlock}
          isEditing={false}
          viewMode="desktop"
          selectedStore={selectedStore}
          productId={selectedProductId}
          onProductClick={handleProductClick}
        />
      </div>
    );
  };

  const renderCartPreview = () => {
    const cartBlock: TemplateBlock = {
      id: 'cart-preview-temp',
      type: 'cart',
      content: {
        title: 'Mon Panier',
        subtitle: 'Vérifiez vos articles avant de passer commande',
        showContinueShopping: true,
        showClearCart: true
      },
      styles: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
        padding: '40px 0',
      },
      order: 1
    };

    return (
      <div className="min-h-screen">
        <BlockRenderer
          key="cart-preview-block"
          block={cartBlock}
          isEditing={false}
          viewMode="desktop"
          selectedStore={selectedStore}
          productId={null}
          onProductClick={handleProductClick}
          onNavigate={handlePageNavigation}
        />
      </div>
    );
  };

  const renderCustomerOrdersPreview = () => {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md p-4 sm:p-6">
          <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📦</div>
          <h3 className="text-lg sm:text-xl font-bold mb-2">Suivi des commandes</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
            Cette page permettra à vos clients de suivre leurs commandes en utilisant leur email ou numéro de commande.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm text-blue-800">
              <strong>Mode Aperçu :</strong> Cette fonctionnalité sera disponible sur votre vraie boutique une fois publiée.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => handlePageNavigation('home')}
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
          >
            <Home className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Retour à l'accueil</span>
            <span className="sm:hidden">Accueil</span>
          </Button>
        </div>
      </div>
    );
  };

  const renderEmptyPageState = (pageName: string) => {
    const pageDisplayName = getPageDisplayName(pageName);
    
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md p-4 sm:p-6">
          <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📄</div>
          <h3 className="text-lg sm:text-xl font-bold mb-2">Page "{pageDisplayName}" en construction</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
            Cette page est en cours de préparation. Revenez bientôt !
          </p>
          <Button 
            variant="outline" 
            onClick={() => handlePageNavigation('home')}
            disabled={activePreviewPage === 'home'}
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
          >
            <Home className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Retour à l'accueil</span>
            <span className="sm:hidden">Accueil</span>
          </Button>
        </div>
      </div>
    );
  };

  const currentPageBlocks = getPageBlocks(activePreviewPage);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl sm:max-w-5xl lg:max-w-6xl h-[85vh] sm:h-[90vh] p-0">
        <DialogHeader className="p-3 sm:p-4 lg:p-6 pb-0 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
              >
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Retour à l'éditeur</span>
                <span className="sm:hidden">Retour</span>
              </Button>
              <DialogTitle className="text-sm sm:text-base lg:text-lg">
                Aperçu Professionnel - {selectedStore?.name || template.name}
              </DialogTitle>
            </div>
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 lg:gap-3">
              <Badge variant="outline" className="text-xs">
                Page: {getPageDisplayName(activePreviewPage)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {currentPageBlocks.length} bloc{currentPageBlocks.length !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                ✓ Mode Aperçu Client
              </Badge>
              <Badge variant="outline" className="text-xs">
                Store: {storeId || 'Non défini'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Items: {items.length}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const storeSlug = selectedStore?.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'ma-boutique';
                  
                  // Ouvrir la boutique sur le bon domaine
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
                }}
                className="text-xs h-6 sm:h-8 px-2 sm:px-3"
              >
                <span className="hidden sm:inline">Ouvrir la vraie boutique</span>
                <span className="sm:hidden">Vraie boutique</span>
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto bg-white relative">
          {/* Barre d'adresse simulée du navigateur */}
          <div className="bg-gray-100 border-b px-3 sm:px-4 lg:px-6 py-2">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-400"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-400"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 bg-white rounded-lg px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-gray-700 border">
                {getDisplayUrl()}
              </div>
            </div>
          </div>

          {renderProfessionalNavigation()}
          {renderBreadcrumb()}
          
          {/* Contenu principal */}
          {activePreviewPage === 'product-detail' && selectedProductId ? (
            renderProductDetail()
          ) : activePreviewPage === 'cart' ? (
            renderCartPreview()
          ) : activePreviewPage === 'customer-orders-preview' ? (
            renderCustomerOrdersPreview()
          ) : currentPageBlocks.length === 0 ? (
            renderEmptyPageState(activePreviewPage)
          ) : (
            <div className="min-h-screen">
              {currentPageBlocks.map((block) => {
                return (
                  <BlockRenderer
                    key={`${block.id}-${block.order}`}
                    block={block}
                    isEditing={false}
                    viewMode="desktop"
                    selectedStore={selectedStore}
                    productId={null}
                    onProductClick={handleProductClick}
                  />
                );
              })}
            </div>
          )}

          <CartWidget />
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Composant principal - utilise le CartProvider global
const SitePreview = (props: SitePreviewProps) => {
  return <SitePreviewContent {...props} />;
};

export default SitePreview;
