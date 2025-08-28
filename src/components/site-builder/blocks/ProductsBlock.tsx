
import React, { memo, useMemo } from 'react';
import { TemplateBlock } from '@/types/template';
import { useProducts } from '@/hooks/useProducts';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import AddToCartButton from './AddToCartButton';
import OptimizedImage from '@/components/ui/optimized-image';
import { useStoreCurrency } from '@/hooks/useStoreCurrency';
import type { Tables } from '@/integrations/supabase/types';

type Store = Tables<'stores'>;

interface ProductsBlockProps {
  block: TemplateBlock;
  isEditing?: boolean;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
  onUpdate?: (block: TemplateBlock) => void;
  selectedStore?: Store | null;
  onProductClick?: (productId: string) => void;
}

const ProductsBlock = ({ 
  block, 
  isEditing, 
  viewMode = 'desktop', 
  selectedStore,
  onProductClick
}: ProductsBlockProps) => {
  const { products, isLoading } = useProducts(selectedStore?.id, 'active');
  const { formatPrice } = useStoreCurrency(selectedStore?.id);
  
  // Log pour debug
  if (import.meta.env.DEV && Math.random() < 0.1) {
    console.log('ProductsBlock Debug:', {
      selectedStoreId: selectedStore?.id,
      productsCount: products?.length,
      firstProduct: products?.[0] ? {
        id: products[0].id,
        name: products[0].name,
        price: products[0].price,
        formattedPrice: formatPrice(products[0].price || 0)
      } : null
    });
  }
  
  // Log seulement en développement et très rarement
  if (import.meta.env.DEV && Math.random() < 0.01) {
    console.log('ProductsBlock - onProductClick available:', !!onProductClick);
    console.log('ProductsBlock - products count:', products.length);
  }

  const getGridCols = () => {
    const layout = block.content.layout || 'grid';
    if (layout === 'list') return 'grid-cols-1';

    const mobileColumns = block.content.mobileColumns || 1;

    if (viewMode === 'mobile') {
      // Mode preview mobile - utiliser le nombre de colonnes choisi
      return `grid-cols-${mobileColumns}`;
    }
    if (viewMode === 'tablet') return 'grid-cols-2 lg:grid-cols-3';

    // Mode desktop et responsive réel - inclure les colonnes mobile
    return `grid-cols-${mobileColumns} sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`;
  };

  const handleProductClick = (productId: string) => {
    console.log('Product clicked:', productId);
    if (onProductClick) {
      onProductClick(productId);
    } else {
      console.warn('onProductClick handler not available');
    }
  };

  if (isLoading) {
    return (
      <section className="py-16" style={{ backgroundColor: block.styles.backgroundColor || '#ffffff' }}>
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-12"></div>
            <div className={`grid ${getGridCols()} gap-6`}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const displayProducts = products.slice(0, block.content.productsToShow || 8);

  return (
    <section className="py-16" style={{ backgroundColor: block.styles.backgroundColor || '#ffffff' }}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" style={{ color: block.styles.textColor || '#000000' }}>
            {block.content.title || 'Nos Produits'}
          </h2>
          {block.content.subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {block.content.subtitle}
            </p>
          )}
        </div>

        {/* Products Grid */}
        {displayProducts.length > 0 ? (
          <div className={`grid ${getGridCols()} gap-6`}>
            {displayProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg overflow-hidden">
                <CardHeader className="p-0" onClick={() => handleProductClick(product.id)}>
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className="text-center">
                          <div className="text-3xl mb-2">📦</div>
                          <span className="text-sm text-gray-500">Aucune image</span>
                        </div>
                      </div>
                    )}


                    {/* Badge de réduction */}
                    {product.compare_price && product.compare_price > product.price && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                        -{Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
                      </Badge>
                    )}

                    {/* Badge de stock amélioré */}
                    {product.track_inventory && (product.inventory_quantity || 0) <= 5 && (product.inventory_quantity || 0) > 0 && (
                      <Badge variant="outline" className="absolute top-2 right-2 bg-white/90 text-orange-600 border-orange-200">
                        Plus que {product.inventory_quantity}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="p-4">
                  <h3 
                    className="font-semibold text-lg mb-2 cursor-pointer hover:text-blue-600 transition-colors line-clamp-2" 
                    onClick={() => handleProductClick(product.id)}
                  >
                    {product.name}
                  </h3>
                  
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-blue-600">{formatPrice(product.price)}</span>
                      {product.compare_price && product.compare_price > product.price && (
                        <span className="text-sm text-gray-500 line-through">{formatPrice(product.compare_price)}</span>
                      )}
                    </div>
                    
                    <Badge
                      variant={
                        !product.track_inventory ? "default" :
                        (product.inventory_quantity || 0) > 0 ? "default" : "secondary"
                      }
                      className={`text-xs ${
                        !product.track_inventory ? 'bg-green-100 text-green-800' :
                        (product.inventory_quantity || 0) > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {!product.track_inventory ? 'En stock' :
                       (product.inventory_quantity || 0) > 0 ? 'En stock' : 'Rupture'}
                    </Badge>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <AddToCartButton
                    product={{
                      id: product.id,
                      name: product.name,
                      price: Number(product.price),
                      images: product.images || [],
                      sku: product.sku || ''
                    }}
                    storeId={selectedStore?.id || ''}
                    className="w-full"
                    disabled={(product.inventory_quantity || 0) <= 0}
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-xl font-bold mb-2">Aucun produit disponible</h3>
            <p className="text-gray-600 mb-6">
              {selectedStore 
                ? "Ajoutez des produits depuis votre tableau de bord pour les voir apparaître ici." 
                : "Sélectionnez une boutique pour voir les produits."
              }
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsBlock;
