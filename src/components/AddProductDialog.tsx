
import { useState, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ProductForm from './products/ProductForm';
import ProductDialogHeader from './products/dialog/ProductDialogHeader';
import { useProductSubmission } from './products/dialog/ProductSubmissionHandler';

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

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: string;
  onProductCreated?: () => void;
}

// État initial du formulaire
const initialFormData: FormData = {
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
};

const AddProductDialog = ({ open, onOpenChange, storeId, onProductCreated }: AddProductDialogProps) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Reset du formulaire quand le dialog se ferme
  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (!newOpen) {
      // Reset du formulaire quand on ferme
      setFormData(initialFormData);
    }
    onOpenChange(newOpen);
  }, [onOpenChange]);

  const handleSuccess = useCallback(() => {
    console.log('AddProductDialog - Product created successfully');
    // Appeler le callback parent si fourni
    if (onProductCreated) {
      onProductCreated();
    } else {
      // Fallback : fermer le dialog
      handleOpenChange(false);
    }
  }, [onProductCreated, handleOpenChange]);

  const { handleSubmit, isCreating } = useProductSubmission({
    storeId,
    formData,
    onSuccess: handleSuccess
  });

  const handleFormDataChange = useCallback((data: FormData) => {
    setFormData(data);
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto" 
        aria-describedby="add-product-desc"
      >
        <div id="add-product-desc" className="sr-only">
          Formulaire pour créer un nouveau produit. Remplissez les informations requises.
        </div>
        
        <ProductDialogHeader 
          title="Ajouter un nouveau produit"
          formData={formData}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <ProductForm 
            formData={formData} 
            onFormDataChange={handleFormDataChange}
            isEditing={false}
          />

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isCreating || !formData.name || !formData.price}
            >
              {isCreating ? 'Création...' : 'Créer le produit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
