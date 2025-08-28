
import { Badge } from '@/components/ui/badge';
import ProductVariantSelector from './ProductVariantSelector';
import AddToCartButton from '../AddToCartButton';
import { Button } from '@/components/ui/button';
import { Heart, Share2, ShoppingCart, Loader2 } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';
import { useCart } from '@/contexts/CartContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useStoreCurrency } from '@/hooks/useStoreCurrency';

type Product = Tables<'products'>;

interface ProductDetailInfoProps {
  product: Product;
  currentPrice: number;
  currentComparePrice?: number;
  isInStock: boolean;
  selectedAttributes: Record<string, string>;
  onAttributeSelect: (attributeType: string, valueId: string) => void;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  onVariantImageChange: (images: string[]) => void;
}

const ProductDetailInfo = ({
  product,
  currentPrice,
  currentComparePrice,
  isInStock,
  selectedAttributes,
  onAttributeSelect,
  viewMode,
  onVariantImageChange
}: ProductDetailInfoProps) => {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const { storeSlug } = useParams();
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const { formatPrice } = useStoreCurrency(product.store_id);
  console.log('ProductDetailInfo - Rendering with:', {
    productName: product.name,
    productId: product.id,
    currentPrice,
    currentComparePrice,
    isInStock,
    inventoryQuantity: product.inventory_quantity
  });

  const stockQuantity = product.inventory_quantity || 0;

  // Logique de stock améliorée
  const getStockStatus = () => {
    // Si le produit n'a pas de suivi de stock activé, toujours en stock
    if (!product.track_inventory) {
      return { status: 'in_stock', message: 'En stock', color: 'green' };
    }

    // Si suivi activé, vérifier la quantité
    if (stockQuantity === 0) {
      return { status: 'out_of_stock', message: 'Rupture de stock', color: 'red' };
    } else if (stockQuantity <= 3) {
      return { status: 'low_stock', message: `Plus que ${stockQuantity} en stock`, color: 'orange' };
    } else if (stockQuantity <= 10) {
      return { status: 'limited_stock', message: 'Stock limité', color: 'yellow' };
    } else {
      return { status: 'in_stock', message: 'En stock', color: 'green' };
    }
  };

  const stockStatus = getStockStatus();

  // Fonction pour "Acheter maintenant"
  const handleBuyNow = async () => {
    if (!isInStock) return;

    setIsBuyingNow(true);

    try {
      // Créer l'item pour le panier
      const cartItem = {
        id: `${product.id}_${Date.now()}`,
        product_id: product.id,
        name: product.name,
        price: Number(currentPrice),
        quantity: 1,
        image: product.images?.[0],
        sku: product.sku || ''
      };

      // Ajouter au panier
      await addItem(cartItem, product.store_id);

      // Rediriger vers checkout
      if (storeSlug) {
        navigate(`/store/${storeSlug}/checkout`);
      } else {
        navigate('/checkout');
      }
    } catch (error) {
      console.error('Erreur lors de l\'achat immédiat:', error);
    } finally {
      setIsBuyingNow(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Titre et évaluation */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-sm">★</span>
            ))}
            <span className="text-sm text-gray-600 ml-2">(4.8) • 127 avis</span>
          </div>
        </div>
      </div>

      {/* Prix */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl lg:text-3xl font-bold text-blue-600">{formatPrice(currentPrice)}</span>
          {currentComparePrice && currentComparePrice > currentPrice && (
            <span className="text-lg text-gray-500 line-through">{formatPrice(currentComparePrice)}</span>
          )}
          {currentComparePrice && currentComparePrice > currentPrice && (
            <Badge className="bg-red-500 text-white">
              -{Math.round(((currentComparePrice - currentPrice) / currentComparePrice) * 100)}%
            </Badge>
          )}
        </div>
      </div>

      {/* Statut de stock amélioré */}
      <div className="flex items-center gap-2 mb-6">
        <Badge
          variant={stockStatus.status === 'out_of_stock' ? 'secondary' : 'default'}
          className={
            stockStatus.color === 'green' ? 'bg-green-100 text-green-800' :
            stockStatus.color === 'red' ? 'bg-red-100 text-red-800' :
            stockStatus.color === 'orange' ? 'bg-orange-100 text-orange-800' :
            stockStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }
        >
          {stockStatus.status === 'out_of_stock' ? '✗' : '✓'} {stockStatus.message}
        </Badge>
      </div>

      {/* Sélecteur de variantes avec vraies données */}
      <ProductVariantSelector
        productId={product.id}
        selectedAttributes={selectedAttributes}
        onAttributeSelect={onAttributeSelect}
        viewMode={viewMode}
        onVariantImageChange={onVariantImageChange}
      />

      {/* Description courte */}
      {product.description && (
        <div className="border-t pt-6">
          <h3 className="font-medium mb-2">Description</h3>
          <p className="text-gray-600 leading-relaxed">
            {product.description.length > 200 
              ? `${product.description.slice(0, 200)}...` 
              : product.description
            }
          </p>
        </div>
      )}

      {/* Actions principales */}
      <div className="space-y-4 pt-6 border-t">
        <div className="flex gap-3">
          <AddToCartButton 
            product={{
              id: product.id,
              name: product.name,
              price: Number(currentPrice),
              images: product.images || [],
              sku: product.sku || ''
            }}
            storeId={product.store_id}
            className="flex-1"
            size="lg"
            disabled={!isInStock}
          />
          <Button
            variant="outline"
            size="lg"
            className="px-4"
            disabled={!isInStock}
          >
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-4"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {isInStock && (
          <Button
            className="w-full"
            size="lg"
            variant="secondary"
            onClick={handleBuyNow}
            disabled={isBuyingNow}
          >
            {isBuyingNow ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Redirection...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Acheter maintenant
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductDetailInfo;
