
import { useProductAttributes } from './useProductAttributes';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface VariantCombination {
  id: string;
  color: string;
  size: string;
  price: string;
  stock: string;
  sku: string;
  image?: string;
}

export const useVariantAttributeManager = () => {
  const { attributes } = useProductAttributes();
  const { toast } = useToast();

  const findOrCreateAttributeValue = async (attributeName: string, value: string, hexColor?: string) => {
    console.log('VariantAttributeManager - Finding/creating attribute value:', { attributeName, value, hexColor });
    
    // Trouver l'attribut par nom
    const attribute = attributes.find(attr => attr.name === attributeName);
    if (!attribute) {
      console.error('VariantAttributeManager - Attribute not found:', attributeName);
      throw new Error(`Attribut ${attributeName} non trouvé`);
    }

    // Vérifier si la valeur existe déjà
    const existingValue = attribute.attribute_values?.find(val => val.value === value);
    if (existingValue) {
      console.log('VariantAttributeManager - Using existing attribute value:', existingValue.id);
      return existingValue.id;
    }

    // Créer la nouvelle valeur d'attribut
    console.log('VariantAttributeManager - Creating new attribute value');
    const { data, error } = await supabase
      .from('attribute_values')
      .insert({
        attribute_id: attribute.id,
        value: value,
        hex_color: hexColor || null,
        sort_order: (attribute.attribute_values?.length || 0) + 1
      })
      .select()
      .single();

    if (error) {
      console.error('VariantAttributeManager - Error creating attribute value:', error);
      throw error;
    }
    
    console.log('VariantAttributeManager - Created new attribute value:', data.id);
    return data.id;
  };

  const createVariantsWithAttributes = async (productId: string, variants: VariantCombination[]) => {
    console.log('VariantAttributeManager - Creating variants for product:', productId);
    console.log('VariantAttributeManager - Variants to create:', variants);

    try {
      const createdVariants = [];

      for (const variant of variants) {
        console.log('VariantAttributeManager - Processing variant:', variant);
        
        try {
          // 1. Créer la variante de produit avec toutes les données
          const variantData = {
            product_id: productId,
            price: variant.price ? parseFloat(variant.price) : null,
            inventory_quantity: variant.stock ? parseInt(variant.stock) : 0,
            sku: variant.sku || null,
            images: variant.image ? [variant.image] : null,
            is_default: false
          };

          console.log('VariantAttributeManager - Creating variant with data:', variantData);

          const { data: productVariant, error: variantError } = await supabase
            .from('product_variants')
            .insert(variantData)
            .select()
            .single();

          if (variantError) {
            console.error('VariantAttributeManager - Error creating variant:', variantError);
            throw variantError;
          }

          console.log('VariantAttributeManager - Created product variant:', productVariant);

          // 2. Créer ou récupérer les valeurs d'attributs
          const colorValueId = await findOrCreateAttributeValue('Couleur', variant.color);
          const sizeValueId = await findOrCreateAttributeValue('Taille', variant.size);

          console.log('VariantAttributeManager - Attribute value IDs:', { colorValueId, sizeValueId });

          // 3. Lier les attributs à la variante
          const attributeLinks = [
            { variant_id: productVariant.id, attribute_value_id: colorValueId },
            { variant_id: productVariant.id, attribute_value_id: sizeValueId }
          ];

          console.log('VariantAttributeManager - Creating attribute links:', attributeLinks);

          const { error: linkError } = await supabase
            .from('variant_attribute_values')
            .insert(attributeLinks);

          if (linkError) {
            console.error('VariantAttributeManager - Error linking attributes:', linkError);
            // Supprimer la variante créée en cas d'erreur de liaison
            await supabase.from('product_variants').delete().eq('id', productVariant.id);
            throw linkError;
          }

          console.log('VariantAttributeManager - Successfully linked attributes to variant');
          createdVariants.push(productVariant);

        } catch (error) {
          console.error('VariantAttributeManager - Error creating variant:', error);
          toast({
            title: "Erreur",
            description: `Impossible de créer la variante ${variant.color}/${variant.size}: ${error.message}`,
            variant: "destructive",
          });
          // Continue avec les autres variantes au lieu de s'arrêter
          continue;
        }
      }

      console.log('VariantAttributeManager - Successfully created variants:', createdVariants);
      return createdVariants;
    } catch (error) {
      console.error('VariantAttributeManager - General error in createVariantsWithAttributes:', error);
      throw error;
    }
  };

  const deleteVariant = async (variantId: string) => {
    console.log('VariantAttributeManager - Deleting variant:', variantId);

    try {
      // Supprimer d'abord les liaisons d'attributs
      const { error: linkError } = await supabase
        .from('variant_attribute_values')
        .delete()
        .eq('variant_id', variantId);

      if (linkError) {
        console.error('VariantAttributeManager - Error deleting variant attribute links:', linkError);
        throw linkError;
      }

      // Supprimer la variante
      const { error: variantError } = await supabase
        .from('product_variants')
        .delete()
        .eq('id', variantId);

      if (variantError) {
        console.error('VariantAttributeManager - Error deleting variant:', variantError);
        throw variantError;
      }

      console.log('VariantAttributeManager - Variant deleted successfully');
      toast({
        title: "Variante supprimée",
        description: "La variante a été supprimée avec succès.",
      });
    } catch (error) {
      console.error('VariantAttributeManager - Error in deleteVariant:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la variante",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    createVariantsWithAttributes,
    findOrCreateAttributeValue,
    deleteVariant
  };
};
