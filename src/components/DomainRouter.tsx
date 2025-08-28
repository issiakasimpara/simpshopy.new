import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useStoreCurrency } from '@/hooks/useStoreCurrency';

interface StoreData {
  store: any;
  products: any[];
  siteTemplate: any;
}

interface DomainRouterProps {
  children: React.ReactNode;
}

const DomainRouter: React.FC<DomainRouterProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [isMainDomain, setIsMainDomain] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { formatPrice } = useStoreCurrency(storeData?.store?.id);

  useEffect(() => {
    const handleDomainRouting = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const hostname = window.location.hostname;
        console.log('🔍 Domain Router - Checking hostname:', hostname);

        // Skip routing for localhost during development
        if (hostname === 'localhost' || hostname.includes('localhost')) {
          console.log('🔍 Development mode - skipping routing');
          setIsMainDomain(true);
          setIsLoading(false);
          return;
        }

        // Check if this is the main domain
        if (hostname === 'simpshopy.com' || hostname === 'www.simpshopy.com') {
          console.log('🔍 Main domain detected');
          setIsMainDomain(true);
          setIsLoading(false);
          return;
        }

        // Check if this is the admin subdomain - treat as main domain
        if (hostname === 'admin.simpshopy.com') {
          console.log('🔍 Admin subdomain detected - treating as main domain');
          
          // Redirection automatique pour les routes de boutiques
          const currentPath = window.location.pathname;
          if (currentPath.startsWith('/store/')) {
            const storeSlug = currentPath.replace('/store/', '');
            console.log('🔍 Redirecting store route from admin to main domain:', storeSlug);
            window.location.href = `https://simpshopy.com/store/${storeSlug}`;
            return;
          }
          
          setIsMainDomain(true);
          setIsLoading(false);
          return;
        }

        console.log('🔍 Checking for custom domain:', hostname);

        // Check for custom domain
        const { data: customDomain, error: domainError } = await supabase
          .from('custom_domains')
          .select(`
            id,
            custom_domain,
            verified,
            store_id,
            stores (
              id,
              name,
              description,
              logo_url,
              settings,
              status,
              slug
            )
          `)
          .eq('custom_domain', hostname)
          .eq('verified', true)
          .single();

        if (!domainError && customDomain) {
          console.log('🔍 Custom domain found:', customDomain);
          
          // Custom domain found - load store data
          const { data: products } = await supabase
            .from('products')
            .select(`
              id,
              name,
              description,
              price,
              images,
              status
            `)
            .eq('store_id', customDomain.store_id)
            .eq('status', 'active');

          setStoreData({
            store: customDomain.stores,
            products: products || [],
            siteTemplate: null
          });
          setIsLoading(false);
          return;
        }

        // Check for subdomain
        const subdomain = hostname.split('.')[0];
        console.log('🔍 Checking subdomain:', subdomain);
        
        if (hostname.includes('simpshopy.com') && subdomain !== 'www' && subdomain !== 'admin') {
          // This is a subdomain, find the store
          const { data: store, error: storeError } = await supabase
            .from('stores')
            .select(`
              id,
              name,
              description,
              logo_url,
              settings,
              status,
              slug
            `)
            .eq('slug', subdomain)
            .eq('status', 'active')
            .single();

          if (storeError || !store) {
            console.log('🔍 Store not found for subdomain:', subdomain);
            setError('Boutique non trouvée');
            setIsLoading(false);
            return;
          }

          console.log('🔍 Store found for subdomain:', store);

          // Get store products
          const { data: products } = await supabase
            .from('products')
            .select(`
              id,
              name,
              description,
              price,
              images,
              status
            `)
            .eq('store_id', store.id)
            .eq('status', 'active');

          setStoreData({
            store,
            products: products || [],
            siteTemplate: null
          });
          setIsLoading(false);
          return;
        }

        console.log('🔍 No matching domain found');
        setError('Domaine non trouvé');
        setIsLoading(false);

      } catch (error) {
        console.error('❌ Domain routing error:', error);
        setError('Erreur lors du chargement de la boutique');
        setIsLoading(false);
      }
    };

    handleDomainRouting();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Chargement...</h2>
          <p className="text-muted-foreground">Vérification du domaine</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Domaine non trouvé</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => window.location.href = 'https://simpshopy.com'}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Retour à SimpShopy
          </button>
        </div>
      </div>
    );
  }

  if (storeData) {
    // Render storefront for custom domain/subdomain
    return (
      <div className="storefront-container">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">{storeData.store.name}</h1>
          <p className="text-muted-foreground mb-4">{storeData.store.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {storeData.products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.description}</p>
                <p className="text-lg font-bold mt-2">{formatPrice(product.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main domain - render normal app
  return <>{children}</>;
};

export default DomainRouter; 