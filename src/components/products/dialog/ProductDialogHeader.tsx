
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProductCreationProgress from './ProductCreationProgress';
import ProductCreationStatusIndicators from './ProductCreationStatusIndicators';

interface ProductDialogHeaderProps {
  title: string;
  formData: {
    name: string;
    price: string;
    images: string[];
    description: string;
    variants?: any[];
    tags: string[];
    comparePrice: string;
    seoTitle: string;
  };
}

const ProductDialogHeader = ({ title, formData }: ProductDialogHeaderProps) => {
  return (
    <DialogHeader className="space-y-4">
      <DialogTitle className="text-2xl">{title}</DialogTitle>
      
      {/* Barre de progression */}
      <ProductCreationProgress formData={formData} />

      {/* Indicateurs de statut */}
      <ProductCreationStatusIndicators formData={formData} />
    </DialogHeader>
  );
};

export default ProductDialogHeader;
