
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category } from '@/hooks/useCategories';

interface CategoryBasicInfoFormProps {
  formData: {
    name: string;
    description: string;
    parent_id: string;
  };
  errors: Record<string, string>;
  categories: Category[];
  category?: Category | null;
  onInputChange: (field: string, value: string) => void;
}

const CategoryBasicInfoForm = ({ 
  formData, 
  errors, 
  categories, 
  category, 
  onInputChange 
}: CategoryBasicInfoFormProps) => {
  const availableParentCategories = categories.filter(cat => 
    cat.id !== category?.id && !cat.parent_id
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium border-b pb-2">Informations générales</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Nom de la catégorie *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder="Ex: Électronique"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="parent_id" className="text-sm font-medium">
            Catégorie parente
          </Label>
          <Select 
            value={formData.parent_id} 
            onValueChange={(value) => onInputChange('parent_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie parente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucune (catégorie principale)</SelectItem>
              {availableParentCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="Description de la catégorie..."
          rows={3}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
        <p className="text-xs text-gray-500">
          {formData.description.length}/500 caractères
        </p>
      </div>
    </div>
  );
};

export default CategoryBasicInfoForm;
