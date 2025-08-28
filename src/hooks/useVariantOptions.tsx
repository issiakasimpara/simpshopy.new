
import { useMemo } from 'react';
import { getColorHex } from '@/utils/colorUtils';

interface VariantCombination {
  id: string;
  color: string;
  size: string;
  price: string;
  stock: string;
  sku: string;
  image?: string;
}

interface ColorOption {
  name: string;
  hex: string;
  id: string;
}

interface SizeOption {
  name: string;
  id: string;
}

export const useVariantOptions = (variants: VariantCombination[]) => {
  const { colors, sizes } = useMemo(() => {
    const availableColors = new Map<string, ColorOption>();
    const availableSizes = new Map<string, SizeOption>();

    variants.forEach(variant => {
      if (variant.color) {
        availableColors.set(variant.color, {
          name: variant.color,
          hex: getColorHex(variant.color),
          id: variant.color
        });
      }
      
      if (variant.size) {
        availableSizes.set(variant.size, {
          name: variant.size,
          id: variant.size
        });
      }
    });

    return {
      colors: Array.from(availableColors.values()),
      sizes: Array.from(availableSizes.values())
    };
  }, [variants]);

  return { colors, sizes };
};
