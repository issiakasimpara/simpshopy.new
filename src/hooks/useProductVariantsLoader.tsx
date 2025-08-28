
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface VariantCombination {
  id: string;
  color: string;
  size: string;
  price: string;
  stock: string;
  sku: string;
  image?: string;
}

export const useProductVariantsLoader = (productId?: string) => {
  const { data: variants, isLoading } = useQuery({
    queryKey: ['product-variants-with-attributes', productId],
    queryFn: async () => {
      if (!productId) return [];

      console.log('ProductVariantsLoader - Loading variants for product:', productId);

      const { data, error } = await supabase
        .from('product_variants')
        .select(`
          *,
          variant_attribute_values (
            attribute_values (
              *,
              product_attributes (*)
            )
          )
        `)
        .eq('product_id', productId)
        .order('created_at');

      if (error) {
        console.error('ProductVariantsLoader - Error loading variants:', error);
        throw error;
      }

      console.log('ProductVariantsLoader - Raw variants data:', data);

      // Transformer les données en format utilisable par SimpleVariantSection
      const transformedVariants: VariantCombination[] = data.map(variant => {
        // Extraire les attributs couleur et taille
        let color = '';
        let size = '';

        variant.variant_attribute_values?.forEach(vav => {
          const attrValue = vav.attribute_values;
          const attrName = attrValue?.product_attributes?.name;
          
          if (attrName === 'Couleur') {
            color = attrValue?.value || '';
          } else if (attrName === 'Taille') {
            size = attrValue?.value || '';
          }
        });

        return {
          id: `${color}-${size}`,
          color,
          size,
          price: variant.price?.toString() || '',
          stock: variant.inventory_quantity?.toString() || '0',
          sku: variant.sku || '',
          image: variant.images?.[0] || undefined
        };
      });

      console.log('ProductVariantsLoader - Transformed variants:', transformedVariants);
      return transformedVariants;
    },
    enabled: !!productId,
  });

  return {
    variants: variants || [],
    isLoading
  };
};
