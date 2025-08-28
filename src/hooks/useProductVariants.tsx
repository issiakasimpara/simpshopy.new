
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type ProductVariant = Tables<'product_variants'>;

// Ajouter supabase au window pour pouvoir y accéder dans les composants
declare global {
  interface Window {
    supabase: typeof supabase;
  }
}

// Assigner supabase au window
if (typeof window !== 'undefined') {
  window.supabase = supabase;
}

export const useProductVariants = (productId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: variants, isLoading } = useQuery({
    queryKey: ['product-variants', productId],
    queryFn: async () => {
      if (!productId) return [];
      
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

      if (error) throw error;
      return data;
    },
    enabled: !!productId,
  });

  const createVariant = useMutation({
    mutationFn: async (variant: TablesInsert<'product_variants'>) => {
      const { data, error } = await supabase
        .from('product_variants')
        .insert(variant)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-variants'] });
      toast({
        title: "Variante créée !",
        description: "La variante a été ajoutée avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer la variante. " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateVariant = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProductVariant> & { id: string }) => {
      const { data, error } = await supabase
        .from('product_variants')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-variants'] });
      toast({
        title: "Variante mise à jour !",
        description: "Les modifications ont été sauvegardées.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la variante. " + error.message,
        variant: "destructive",
      });
    },
  });

  const deleteVariant = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-variants'] });
      toast({
        title: "Variante supprimée !",
        description: "La variante a été supprimée avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la variante. " + error.message,
        variant: "destructive",
      });
    },
  });

  const linkAttributeToVariant = useMutation({
    mutationFn: async ({ variantId, attributeValueId }: { variantId: string; attributeValueId: string }) => {
      const { data, error } = await supabase
        .from('variant_attribute_values')
        .insert({ variant_id: variantId, attribute_value_id: attributeValueId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-variants'] });
    },
  });

  return {
    variants: variants || [],
    isLoading,
    createVariant: createVariant.mutateAsync,
    updateVariant: updateVariant.mutateAsync,
    deleteVariant: deleteVariant.mutate,
    linkAttributeToVariant: linkAttributeToVariant.mutateAsync,
    isCreating: createVariant.isPending,
    isUpdating: updateVariant.isPending,
    isDeleting: deleteVariant.isPending,
  };
};
