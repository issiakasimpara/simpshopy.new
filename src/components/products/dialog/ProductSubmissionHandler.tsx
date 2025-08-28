import { useQueryClient } from '@tanstack/react-query';
import { useProducts } from '@/hooks/useProducts';
import { useVariantAttributeManager } from '@/hooks/useVariantAttributeManager';

type ProductStatus = 'draft' | 'active' | 'inactive';

interface FormData {
  name: string;
  description: string;
  price: string;
  sku: string;
  inventory_quantity: string;
  status: ProductStatus;
  images: string[];
  tags: string[];
  weight: string;
  comparePrice: string;
  costPrice: string;
  trackInventory: boolean;
  allowBackorders: boolean;
  requiresShipping: boolean;
  seoTitle: string;
  seoDescription: string;
  variants?: any[];
}

interface ProductSubmissionHandlerProps {
  storeId: string;
  formData: FormData;
  onSuccess: () => void;
}

export const useProductSubmission = ({ storeId, formData, onSuccess }: ProductSubmissionHandlerProps) => {
  const queryClient = useQueryClient();
  const { createProduct, isCreating } = useProducts(storeId);
  const { createVariantsWithAttributes } = useVariantAttributeManager();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('ProductSubmission - Manual submit triggered');
    console.log('ProductSubmission - Current form data:', formData);
    
    if (!formData.name || !formData.price) {
      console.log('ProductSubmission - Missing required fields:', {
        name: formData.name,
        price: formData.price
      });
      return;
    }

    // Validation des prix
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      console.log('ProductSubmission - Invalid price:', formData.price);
      return;
    }

    try {
      const productData: any = {
        store_id: storeId,
        name: formData.name.trim(), // Sanitiser le nom lors de la soumission
        price: price,
        status: formData.status,
        inventory_quantity: parseInt(formData.inventory_quantity) || 0,
      };

      console.log('ProductSubmission - Base product data:', productData);

      // Ajout conditionnel des champs
      if (formData.description?.trim()) {
        productData.description = formData.description.trim();
      }
      if (formData.sku?.trim()) {
        productData.sku = formData.sku.trim();
      }
      if (formData.images.length > 0) {
        productData.images = formData.images;
      }
      if (formData.tags.length > 0) {
        productData.tags = formData.tags;
      }
      if (formData.weight && !isNaN(parseFloat(formData.weight))) {
        productData.weight = parseFloat(formData.weight);
      }
      if (formData.comparePrice && !isNaN(parseFloat(formData.comparePrice))) {
        productData.compare_price = parseFloat(formData.comparePrice);
      }
      if (formData.costPrice && !isNaN(parseFloat(formData.costPrice))) {
        productData.cost_price = parseFloat(formData.costPrice);
      }

      // Ajouter le champ track_inventory
      productData.track_inventory = formData.trackInventory;

      console.log('ProductSubmission - Final product data:', productData);

      // 1. Créer le produit principal
      const createdProduct = await createProduct.mutateAsync(productData);

      // 2. Créer les variantes si elles existent
      if (formData.variants && formData.variants.length > 0) {
        console.log('ProductSubmission - Creating variants:', formData.variants);
        
        // Filtrer les variantes qui ont au moins un prix ou du stock
        const validVariants = formData.variants.filter(variant => 
          variant.price || variant.stock || variant.sku
        );

        if (validVariants.length > 0) {
          try {
            await createVariantsWithAttributes(createdProduct.id, validVariants);
            console.log('ProductSubmission - Variants created successfully');
          } catch (variantError) {
            console.error('ProductSubmission - Error creating variants:', variantError);
            // Le produit est créé mais les variantes ont échoué
            // On continue quand même pour ne pas bloquer l'utilisateur
          }
        }
      }

      console.log('ProductSubmission - Product and variants created successfully');
      
      // 3. Forcer l'invalidation des queries et fermer le Dialog
      queryClient.invalidateQueries(['products', storeId]);
      queryClient.refetchQueries(['products', storeId]);
      
      // 4. Fermer le Dialog après un petit délai pour éviter les conflits DOM
      setTimeout(() => {
        onSuccess();
      }, 100);
      
    } catch (error) {
      console.error('ProductSubmission - Error creating product:', error);
    }
  };

  return {
    handleSubmit,
    isCreating
  };
};
