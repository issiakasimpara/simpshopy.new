
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface CategorySettingsFormProps {
  formData: {
    is_active: boolean;
    sort_order: number;
  };
  onInputChange: (field: string, value: boolean | number) => void;
}

const CategorySettingsForm = ({ formData, onInputChange }: CategorySettingsFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium border-b pb-2">Paramètres</h3>
      
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label className="text-sm font-medium">Catégorie active</Label>
          <p className="text-xs text-gray-500">
            Les catégories inactives ne sont pas visibles sur le site
          </p>
        </div>
        <Switch
          checked={formData.is_active}
          onCheckedChange={(checked) => onInputChange('is_active', checked)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sort_order" className="text-sm font-medium">
          Ordre d'affichage
        </Label>
        <Input
          id="sort_order"
          type="number"
          value={formData.sort_order}
          onChange={(e) => onInputChange('sort_order', parseInt(e.target.value) || 0)}
          placeholder="0"
          min="0"
        />
        <p className="text-xs text-gray-500">
          Plus le nombre est petit, plus la catégorie apparaîtra en premier
        </p>
      </div>
    </div>
  );
};

export default CategorySettingsForm;
