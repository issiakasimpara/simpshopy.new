
import { useState, useEffect } from 'react';
import type { Tables } from '@/integrations/supabase/types';

type ProductVariant = Tables<'product_variants'>;
type Product = Tables<'products'>;

interface UseProductVariantSelectionProps {
  product: Product;
  variants: ProductVariant[];
}

export const useProductVariantSelection = ({ product, variants }: UseProductVariantSelectionProps) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  useEffect(() => {
    // Sélectionner la variante par défaut ou la première disponible
    const defaultVariant = variants.find(v => v.is_default) || variants[0];
    if (defaultVariant && !selectedVariant) {
      setSelectedVariant(defaultVariant);
    }
  }, [variants, selectedVariant]);

  const selectAttribute = (attributeType: string, valueId: string) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attributeType]: valueId
    }));

    // Trouver la variante correspondante aux attributs sélectionnés
    // Pour l'instant, on utilise la première variante disponible
    // Cette logique sera améliorée avec les vraies données de variantes
    const matchingVariant = variants.find(variant => variant.inventory_quantity && variant.inventory_quantity > 0);
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  };

  const getCurrentPrice = () => {
    return selectedVariant?.price || product.price;
  };

  const getCurrentComparePrice = () => {
    return selectedVariant?.compare_price || product.compare_price;
  };

  const getCurrentStock = () => {
    return selectedVariant?.inventory_quantity || product.inventory_quantity || 0;
  };

  const getCurrentSku = () => {
    return selectedVariant?.sku || product.sku;
  };

  const isInStock = () => {
    // Si le suivi de stock n'est pas activé, toujours en stock
    if (!product.track_inventory) {
      return true;
    }
    // Si le suivi est activé, vérifier la quantité
    return getCurrentStock() > 0;
  };

  return {
    selectedVariant,
    selectedAttributes,
    selectAttribute,
    getCurrentPrice,
    getCurrentComparePrice,
    getCurrentStock,
    getCurrentSku,
    isInStock,
  };
};
