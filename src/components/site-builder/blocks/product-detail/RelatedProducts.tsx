
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, ShoppingCart } from 'lucide-react';
import AddToCartButton from '../AddToCartButton';
import { useStoreCurrency } from '@/hooks/useStoreCurrency';

interface RelatedProductsProps {
  currentProductId: string;
  products: any[];
  onProductClick?: (productId: string) => void;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  storeId?: string;
}

const RelatedProducts = ({ currentProductId, products, onProductClick, viewMode, storeId }: RelatedProductsProps) => {
  const { formatPrice } = useStoreCurrency(storeId);
  // Filtrer les produits pour exclure le produit actuel et limiter le nombre
  const relatedProducts = products
    .filter(product => product.id !== currentProductId)
    .slice(0, viewMode === 'mobile' ? 2 : 4);

  if (relatedProducts.length === 0) {
    return null;
  }

  const getGridCols = () => {
    if (viewMode === 'mobile') return 'grid-cols-2';
    if (viewMode === 'tablet') return 'grid-cols-3';
    return 'grid-cols-4';
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Vous pourriez aussi aimer</h2>
        
        <div className={`grid ${getGridCols()} gap-6`}>
          {relatedProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardHeader className="p-0" onClick={() => onProductClick?.(product.id)}>
                <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <div className="text-center">
                        <div className="text-2xl mb-1">📦</div>
                        <span className="text-xs text-gray-500">Aucune image</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Overlay avec actions rapides */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-x-2">
                      <Button size="sm" variant="secondary">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <h3 
                  className="font-medium text-sm mb-2 cursor-pointer hover:text-blue-600 transition-colors line-clamp-2" 
                  onClick={() => onProductClick?.(product.id)}
                >
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-blue-600">{formatPrice(product.price)}</span>
                  {product.compare_price && product.compare_price > product.price && (
                    <span className="text-sm text-gray-500 line-through">{formatPrice(product.compare_price)}</span>
                  )}
                </div>

                <AddToCartButton 
                  product={{
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    images: product.images || [],
                    sku: product.sku || ''
                  }}
                  storeId={storeId || product.store_id || ''}
                  className="w-full"
                  size="sm"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
