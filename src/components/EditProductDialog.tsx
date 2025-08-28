
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import { useVariantAttributeManager } from '@/hooks/useVariantAttributeManager';
import ProductForm from './products/ProductForm';
import type { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type ProductStatus = 'draft' | 'active' | 'inactive';

interface FormData {
  name: string;
  description: string;
  price: string;
  sku: string;
  inventory_quantity: string;
  status: ProductStatus;
  images: string[];
  // Champs avancés
  tags: string[];
  weight: string;
  comparePrice: string;
  costPrice: string;
  trackInventory: boolean;
  allowBackorders: boolean;
  requiresShipping: boolean;
  seoTitle: string;
  seoDescription: string;
  // Variantes
  variants?: any[];
}

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Tables<'products'> | null;
  storeId: string;
}

const EditProductDialog = ({ open, onOpenChange, product, storeId }: EditProductDialogProps) => {
  const { updateProduct, isUpdating } = useProducts(storeId);
  const { createVariantsWithAttributes } = useVariantAttributeManager();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    sku: '',
    inventory_quantity: '',
    status: 'draft',
    images: [],
    tags: [],
    weight: '',
    comparePrice: '',
    costPrice: '',
    trackInventory: false,
    allowBackorders: false,
    requiresShipping: true,
    seoTitle: '',
    seoDescription: '',
    variants: []
  });

  // Populate form when product changes
  useEffect(() => {
    if (product) {
      console.log('EditProductDialog - Populating form with product:', product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        sku: product.sku || '',
        inventory_quantity: product.inventory_quantity?.toString() || '',
        status: (product.status as ProductStatus) || 'draft',
        images: product.images || [],
        tags: product.tags || [],
        weight: product.weight?.toString() || '',
        comparePrice: product.compare_price?.toString() || '',
        costPrice: product.cost_price?.toString() || '',
        trackInventory: false,
        allowBackorders: false,
        requiresShipping: true,
        seoTitle: '',
        seoDescription: '',
        variants: []
      });
    }
  }, [product]);

  // Fonction pour mettre à jour les données du formulaire
  const handleFormDataChange = (data: FormData) => {
    console.log('EditProductDialog - Form data change:', data);
    setFormData(data);
  };

  // Fonction de sauvegarde
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('EditProductDialog - Manual submit triggered');
    
    if (!product || !formData.name || !formData.price) {
      console.log('EditProductDialog - Missing product or required fields');
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('EditProductDialog - Updating product with data:', formData);
      console.log('EditProductDialog - Variants to save:', formData.variants);

      // 1. Mettre à jour le produit principal en utilisant mutateAsync
      const updatedProduct = await updateProduct.mutateAsync({
        id: product.id,
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        sku: formData.sku || null,
        inventory_quantity: parseInt(formData.inventory_quantity) || 0,
        status: formData.status,
        images: formData.images
      });

      console.log('EditProductDialog - Product updated successfully:', updatedProduct);

      // 2. Sauvegarder les nouvelles variantes
      if (formData.variants && formData.variants.length > 0) {
        console.log('EditProductDialog - Creating variants:', formData.variants);
        
        // Filtrer les variantes valides
        const validVariants = formData.variants.filter(variant => {
          const hasValidData = variant.color && variant.size && 
            (variant.price || variant.stock || variant.sku);
          console.log('EditProductDialog - Variant validation:', variant, 'Valid:', hasValidData);
          return hasValidData;
        });

        console.log('EditProductDialog - Valid variants to create:', validVariants);

        if (validVariants.length > 0) {
          try {
            const createdVariants = await createVariantsWithAttributes(product.id, validVariants);
            console.log('EditProductDialog - Successfully created variants:', createdVariants);
            
            toast({
              title: "Succès",
              description: `Produit mis à jour avec ${createdVariants.length} nouvelle(s) variante(s)`,
            });
          } catch (variantError) {
            console.error('EditProductDialog - Error creating variants:', variantError);
            toast({
              title: "Attention",
              description: "Produit mis à jour mais erreur lors de la création des variantes",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Succès",
            description: "Produit mis à jour avec succès",
          });
        }
      } else {
        toast({
          title: "Succès",
          description: "Produit mis à jour avec succès",
        });
      }
      
      console.log('EditProductDialog - Product updated successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('EditProductDialog - Error updating product:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le produit",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le produit</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <ProductForm 
            formData={formData} 
            onFormDataChange={handleFormDataChange}
            productId={product?.id}
            isEditing={true}
          />

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isUpdating || !formData.name || !formData.price}
            >
              {isUpdating ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
