
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type ProductAttribute = Tables<'product_attributes'>;
type AttributeValue = Tables<'attribute_values'>;

export const useProductAttributes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: attributes, isLoading } = useQuery({
    queryKey: ['product-attributes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_attributes')
        .select(`
          *,
          attribute_values (*)
        `)
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  const createAttribute = useMutation({
    mutationFn: async (attribute: TablesInsert<'product_attributes'>) => {
      const { data, error } = await supabase
        .from('product_attributes')
        .insert(attribute)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-attributes'] });
      toast({
        title: "Attribut créé !",
        description: "L'attribut a été ajouté avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'attribut. " + error.message,
        variant: "destructive",
      });
    },
  });

  const createAttributeValue = useMutation({
    mutationFn: async (value: TablesInsert<'attribute_values'>) => {
      const { data, error } = await supabase
        .from('attribute_values')
        .insert(value)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-attributes'] });
      toast({
        title: "Valeur ajoutée !",
        description: "La valeur d'attribut a été ajoutée avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la valeur. " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    attributes: attributes || [],
    isLoading,
    createAttribute: createAttribute.mutateAsync,
    createAttributeValue: createAttributeValue.mutateAsync,
    isCreatingAttribute: createAttribute.isPending,
    isCreatingValue: createAttributeValue.isPending,
  };
};
