
import { CheckCircle, Circle } from 'lucide-react';

interface ProductCreationStatusIndicatorsProps {
  formData: {
    name: string;
    price: string;
    images: string[];
    variants?: any[];
    tags: string[];
    comparePrice: string;
    seoTitle: string;
  };
}

const ProductCreationStatusIndicators = ({ formData }: ProductCreationStatusIndicatorsProps) => {
  const isBasicComplete = formData.name && formData.price;
  const hasImages = formData.images.length > 0;
  const hasVariants = formData.variants && formData.variants.length > 0;
  const hasAdvanced = formData.tags.length > 0 || formData.comparePrice || formData.seoTitle;

  return (
    <div className="flex gap-4 text-sm">
      <div className="flex items-center gap-1">
        {isBasicComplete ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <Circle className="h-4 w-4 text-gray-400" />
        )}
        <span className={isBasicComplete ? "text-green-600" : "text-gray-500"}>
          Infos de base
        </span>
      </div>
      <div className="flex items-center gap-1">
        {hasImages ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <Circle className="h-4 w-4 text-gray-400" />
        )}
        <span className={hasImages ? "text-green-600" : "text-gray-500"}>
          Images ({formData.images.length})
        </span>
      </div>
      <div className="flex items-center gap-1">
        {hasVariants ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <Circle className="h-4 w-4 text-gray-400" />
        )}
        <span className={hasVariants ? "text-green-600" : "text-gray-500"}>
          Variantes ({formData.variants?.length || 0})
        </span>
      </div>
      <div className="flex items-center gap-1">
        {hasAdvanced ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <Circle className="h-4 w-4 text-gray-400" />
        )}
        <span className={hasAdvanced ? "text-green-600" : "text-gray-500"}>
          Options avancées
        </span>
      </div>
    </div>
  );
};

export default ProductCreationStatusIndicators;
