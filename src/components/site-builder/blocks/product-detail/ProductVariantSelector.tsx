
import { useEffect } from 'react';
import { useProductVariantsLoader } from '@/hooks/useProductVariantsLoader';
import { useProductAttributes } from '@/hooks/useProductAttributes';
import { useVariantOptions } from '@/hooks/useVariantOptions';
import ColorSelector from './ColorSelector';
import SizeSelector from './SizeSelector';
import StockStatus from './StockStatus';

interface ProductVariantSelectorProps {
  productId: string;
  selectedAttributes: Record<string, string>;
  onAttributeSelect: (attributeType: string, valueId: string) => void;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  onVariantImageChange: (images: string[]) => void;
}

const ProductVariantSelector = ({ 
  productId,
  selectedAttributes, 
  onAttributeSelect,
  viewMode,
  onVariantImageChange
}: ProductVariantSelectorProps) => {
  const { variants, isLoading: variantsLoading } = useProductVariantsLoader(productId);
  const { attributes, isLoading: attributesLoading } = useProductAttributes();
  const { colors, sizes } = useVariantOptions(variants);

  console.log('ProductVariantSelector - Loading data for product:', productId);
  console.log('ProductVariantSelector - Variants loaded:', variants);
  console.log('ProductVariantSelector - Attributes loaded:', attributes);

  // Effect to change image when selection changes
  useEffect(() => {
    const selectedVariant = variants.find(v => 
      v.color === selectedAttributes.color && 
      v.size === selectedAttributes.size
    );

    if (selectedVariant && selectedVariant.image) {
      console.log('ProductVariantSelector - Changing image to variant image:', selectedVariant.image);
      onVariantImageChange([selectedVariant.image]);
    } else if (selectedAttributes.color) {
      const colorVariant = variants.find(v => v.color === selectedAttributes.color);
      if (colorVariant && colorVariant.image) {
        console.log('ProductVariantSelector - Changing image to color variant image:', colorVariant.image);
        onVariantImageChange([colorVariant.image]);
      }
    }
  }, [selectedAttributes, variants, onVariantImageChange]);

  if (variantsLoading || attributesLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-10 h-10 bg-gray-200 rounded-full"></div>
            ))}
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-12 h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  console.log('ProductVariantSelector - Available colors:', colors);
  console.log('ProductVariantSelector - Available sizes:', sizes);

  // Calculate available stock for selected combination
  const selectedVariant = variants.find(v => 
    v.color === selectedAttributes.color && 
    v.size === selectedAttributes.size
  );
  
  const stockQuantity = selectedVariant ? parseInt(selectedVariant.stock) : 0;
  const isInStock = stockQuantity > 0;

  const handleAttributeSelect = (attributeType: string, valueId: string) => {
    console.log('ProductVariantSelector - Attribute selected:', { attributeType, valueId });
    onAttributeSelect(attributeType, valueId);
  };

  return (
    <div className="space-y-6">
      <ColorSelector
        colors={colors}
        selectedColor={selectedAttributes.color}
        onColorSelect={(colorId) => handleAttributeSelect('color', colorId)}
      />

      <SizeSelector
        sizes={sizes}
        selectedSize={selectedAttributes.size}
        onSizeSelect={(sizeId) => handleAttributeSelect('size', sizeId)}
        viewMode={viewMode}
      />

      {/* Stock status supprimé pour éviter la duplication - géré dans ProductDetailInfo */}

      {colors.length === 0 && sizes.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          <p className="text-sm">Aucune variante configurée pour ce produit</p>
        </div>
      )}
    </div>
  );
};

export default ProductVariantSelector;
