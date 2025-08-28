import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Store, 
  ShoppingCart, 
  Heart, 
  Star, 
  Loader2,
  AlertCircle,
  Globe
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useStoreCurrency } from '@/hooks/useStoreCurrency';

interface StoreData {
  store: any;
  domain: any;
  isSubdomain: boolean;
  isCustomDomain: boolean;
}

interface StorefrontRendererProps {
  hostname: string;
}

const StorefrontRenderer = ({ hostname }: StorefrontRendererProps) => {
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { formatPrice } = useStoreCurrency(storeData?.store?.id);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 StorefrontRenderer - Fetching data for:', hostname);

        // For now, show a simple message since domain-router is removed
        console.log('🔍 Storefront renderer - no domain router available');
        setError('Fonctionnalité boutique temporairement indisponible');
        return;

        // Fetch products for this store
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            id,
            name,
            description,
            price,
            images,
            status,
            sku
          `)
          .eq('store_id', data.store.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (productsError) {
          console.error('❌ Error fetching products:', productsError);
        } else {
          console.log('✅ Products loaded:', productsData?.length || 0);
          setProducts(productsData || []);
        }

      } catch (err) {
        console.error('❌ Error fetching store data:', err);
        setError('Erreur lors du chargement de la boutique');
      } finally {
        setLoading(false);
      }
    };

    if (hostname) {
      fetchStoreData();
    }
  }, [hostname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold mb-2">Chargement de la boutique...</h2>
          <p className="text-muted-foreground">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-2xl font-bold mb-2">Boutique introuvable</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <p className="text-sm text-muted-foreground">
              Domaine : <code className="bg-muted px-2 py-1 rounded">{hostname}</code>
            </p>
            <Button 
              onClick={() => window.location.href = 'https://simpshopy.com'}
              className="mt-4"
            >
              Retour à SimpShopy
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!storeData) return null;

  const { store, domain, isSubdomain, isCustomDomain } = storeData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {store.logo_url ? (
                <img 
                  src={store.logo_url} 
                  alt={store.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                  <Store className="h-6 w-6 text-primary-foreground" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">{store.name}</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {isSubdomain ? `${store.slug}.simpshopy.com` : domain.domain_name}
                  <Badge variant="secondary" className="text-xs ml-2">
                    {isSubdomain ? 'Sous-domaine' : 'Domaine personnalisé'}
                  </Badge>
                </p>
              </div>
            </div>
            <Button>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Panier
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Bienvenue chez {store.name}
          </h2>
          {store.description && (
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              {store.description}
            </p>
          )}
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>{products.length} produits</span>
            <span>•</span>
            <span>Livraison rapide</span>
            <span>•</span>
            <span>Paiement sécurisé</span>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-8 text-center">Nos produits</h3>
          
          {products.length === 0 ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6 text-center">
                <Store className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h4 className="text-lg font-semibold mb-2">Catalogue en préparation</h4>
                <p className="text-muted-foreground">
                  Les produits arrivent bientôt dans cette boutique !
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Store className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 line-clamp-2">{product.name}</h4>
                    {product.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-lg">
                        {formatPrice(product.price)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">4.8</span>
                      </div>
                    </div>
                    <Button className="w-full mt-3">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Ajouter au panier
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Store className="h-6 w-6" />
            <span className="font-semibold">{store.name}</span>
          </div>
          <p className="text-muted-foreground mb-4">
            Boutique en ligne propulsée par SimpShopy
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>© 2024 {store.name}</span>
            <span>•</span>
            <span>Conditions d'utilisation</span>
            <span>•</span>
            <span>Politique de confidentialité</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StorefrontRenderer;