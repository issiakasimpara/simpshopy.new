
import { useState } from 'react';
import { TemplateBlock } from '@/types/template';
import { useProducts } from '@/hooks/useProducts';
import { useProductVariants } from '@/hooks/useProductVariants';
import { useProductVariantSelection } from '@/hooks/useProductVariantSelection';
import ProductImageGallery from './product-detail/ProductImageGallery';
import ProductDetailLoadingState from './product-detail/ProductDetailLoadingState';
import ProductDetailEmptyState from './product-detail/ProductDetailEmptyState';
import ProductDetailInfo from './product-detail/ProductDetailInfo';
import type { Tables } from '@/integrations/supabase/types';

type Store = Tables<'stores'>;

interface ProductDetailBlockProps {
  block: TemplateBlock;
  isEditing?: boolean;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
  onUpdate?: (block: TemplateBlock) => void;
  selectedStore?: Store | null;
  productId?: string | null;
  onProductClick?: (productId: string) => void;
  products?: any[]; // Produits passés directement pour éviter les requêtes doubles
}

const ProductDetailBlock = ({
  block,
  isEditing,
  viewMode = 'desktop',
  selectedStore,
  productId,
  onProductClick,
  products: passedProducts
}: ProductDetailBlockProps) => {
  // TOUS LES HOOKS EN PREMIER - ORDRE FIXE ET STABLE
  // Utiliser les produits passés en props ou charger via hook si pas disponibles
  const { products: hookProducts, isLoading } = useProducts(passedProducts ? undefined : selectedStore?.id, 'active');
  const products = passedProducts || hookProducts || [];
  const [currentImages, setCurrentImages] = useState<string[]>([]);

  // Calculer le productId stable AVANT d'appeler useProductVariants
  const firstProductId = products && products.length > 0 ? products[0].id : '';
  const stableProductId = productId || firstProductId;

  // TOUJOURS appeler useProductVariants avec une valeur stable
  const { variants } = useProductVariants(stableProductId);

  // TOUJOURS appeler useProductVariantSelection AVANT tout early return
  const {
    selectedVariant,
    selectedAttributes,
    selectAttribute,
    getCurrentPrice,
    getCurrentComparePrice,
    getCurrentStock,
    isInStock
  } = useProductVariantSelection({
    product: products.find(p => p.id === (productId || firstProductId)) || null,
    variants: variants || []
  });

  try {
  
  console.log('ProductDetailBlock - Debug info:');
  console.log('- Received productId:', productId);
  console.log('- Products available:', products?.length || 0);
  console.log('- Store ID:', selectedStore?.id);
  console.log('- Is editing mode:', isEditing);
  console.log('- Using passed products:', !!passedProducts);

  // Si on utilise les produits passés, pas de loading
  if (!passedProducts && isLoading) {
    console.log('ProductDetailBlock - Loading products...');
    return <ProductDetailLoadingState />;
  }

  // Si un productId spécifique est fourni, le trouver
  let selectedProduct = null;
  if (productId) {
    selectedProduct = products.find(p => p.id === productId);
    console.log('ProductDetailBlock - Looking for specific product:', productId);
    console.log('ProductDetailBlock - Found specific product:', !!selectedProduct);

    // Si le produit spécifique n'est pas trouvé et qu'on a fini de charger
    if (!selectedProduct && !isLoading && products.length > 0) {
      console.log('ProductDetailBlock - Specific product not found after loading complete');
      return (
        <div className="bg-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Erreur de chargement du produit</h2>
            <p className="text-gray-600 mb-8">Une erreur est survenue lors du chargement des détails du produit.</p>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retour
            </button>
          </div>
        </div>
      );
    }
  }

  // Si aucun produit spécifique trouvé ou pas d'ID fourni, prendre le premier
  if (!selectedProduct && products.length > 0) {
    selectedProduct = products[0];
    console.log('ProductDetailBlock - Using first available product as fallback:', selectedProduct?.id);
  }

  console.log('ProductDetailBlock - Final selected product:', {
    id: selectedProduct?.id,
    name: selectedProduct?.name,
    price: selectedProduct?.price,
    images: selectedProduct?.images?.length || 0
  });

  // Les variantes sont déjà chargées en haut du composant

  if (!selectedProduct) {
    console.log('ProductDetailBlock - No product found');
    return <ProductDetailEmptyState productId={productId} />;
  }

  // Gérer le changement d'image basé sur la variante
  const handleVariantImageChange = (images: string[]) => {
    console.log('ProductDetailBlock - Variant image changed:', images);
    setCurrentImages(images);
  };

  // Déterminer quelles images afficher (variante ou produit par défaut)
  const imagesToDisplay = currentImages.length > 0 ? currentImages : (selectedProduct.images || []);

  const getGridLayout = () => {
    if (viewMode === 'mobile') return 'grid-cols-1';
    return 'grid-cols-1 lg:grid-cols-2';
  };

  const currentPrice = getCurrentPrice();
  const currentComparePrice = getCurrentComparePrice();

  console.log('ProductDetailBlock - Rendering product detail for:', {
    productName: selectedProduct.name,
    currentPrice,
    currentComparePrice,
    inStock: isInStock(),
    imagesCount: imagesToDisplay.length,
    currentImages: imagesToDisplay
  });

  return (
    <div className="bg-white">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className={`grid ${getGridLayout()} gap-12`}>
            {/* Galerie d'images */}
            <ProductImageGallery
              images={imagesToDisplay}
              productName={selectedProduct.name}
              viewMode={viewMode}
            />

            {/* Informations du produit */}
            <ProductDetailInfo
              product={selectedProduct}
              currentPrice={currentPrice}
              currentComparePrice={currentComparePrice}
              isInStock={isInStock()}
              selectedAttributes={selectedAttributes}
              onAttributeSelect={selectAttribute}
              viewMode={viewMode}
              onVariantImageChange={handleVariantImageChange}
            />
          </div>
        </div>
      </section>
    </div>
  );
  } catch (error) {
    console.error('ProductDetailBlock - Erreur critique:', error);
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Erreur de chargement du produit
        </h3>
        <p className="text-gray-600">
          Une erreur est survenue lors du chargement des détails du produit.
        </p>
      </div>
    );
  }
};

export default ProductDetailBlock;
