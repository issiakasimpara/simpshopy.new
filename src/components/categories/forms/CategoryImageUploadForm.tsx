
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

const CategoryImageUploadForm = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium border-b pb-2">Image</h3>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Image de la catégorie</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            Cliquez pour télécharger ou glissez-déposez une image
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PNG, JPG jusqu'à 5MB (recommandé: 400x400px)
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryImageUploadForm;
