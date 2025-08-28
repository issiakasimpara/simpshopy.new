
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ProductCreationProgressProps {
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

const ProductCreationProgress = ({ formData }: ProductCreationProgressProps) => {
  const getCompletionPercentage = () => {
    const basicFields = [formData.name, formData.price].filter(Boolean).length;
    const hasImages = formData.images.length > 0;
    const hasDescription = formData.description.length > 0;
    const hasVariants = formData.variants && formData.variants.length > 0;
    const hasAdvancedFields = formData.tags.length > 0 || formData.comparePrice || formData.seoTitle;
    
    let total = 0;
    total += (basicFields / 2) * 40; // 40% pour les champs obligatoires
    total += hasImages ? 20 : 0; // 20% pour les images
    total += hasDescription ? 15 : 0; // 15% pour la description
    total += hasVariants ? 15 : 0; // 15% pour les variantes
    total += hasAdvancedFields ? 10 : 0; // 10% pour les champs avancés
    
    return Math.round(total);
  };

  const completionPercentage = getCompletionPercentage();

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Progression</span>
        <Badge variant={completionPercentage === 100 ? "default" : "secondary"}>
          {completionPercentage}% complété
        </Badge>
      </div>
      <Progress value={completionPercentage} className="w-full" />
    </div>
  );
};

export default ProductCreationProgress;
