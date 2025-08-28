
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CategorySEOFormProps {
  formData: {
    slug: string;
    seo_title: string;
    seo_description: string;
  };
  errors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
}

const CategorySEOForm = ({ formData, errors, onInputChange }: CategorySEOFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium border-b pb-2">Référencement (SEO)</h3>
      
      <div className="space-y-2">
        <Label htmlFor="slug" className="text-sm font-medium">
          URL (Slug)
        </Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => onInputChange('slug', e.target.value)}
          placeholder="electronique"
          className="font-mono text-sm"
        />
        <p className="text-xs text-gray-500">
          URL finale: /categories/{formData.slug}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="seo_title" className="text-sm font-medium">
          Titre SEO
        </Label>
        <Input
          id="seo_title"
          value={formData.seo_title}
          onChange={(e) => onInputChange('seo_title', e.target.value)}
          placeholder="Titre pour les moteurs de recherche"
          className={errors.seo_title ? 'border-red-500' : ''}
        />
        {errors.seo_title && (
          <p className="text-sm text-red-500">{errors.seo_title}</p>
        )}
        <p className="text-xs text-gray-500">
          {formData.seo_title.length}/60 caractères
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="seo_description" className="text-sm font-medium">
          Description SEO
        </Label>
        <Textarea
          id="seo_description"
          value={formData.seo_description}
          onChange={(e) => onInputChange('seo_description', e.target.value)}
          placeholder="Description pour les moteurs de recherche"
          rows={2}
          className={errors.seo_description ? 'border-red-500' : ''}
        />
        {errors.seo_description && (
          <p className="text-sm text-red-500">{errors.seo_description}</p>
        )}
        <p className="text-xs text-gray-500">
          {formData.seo_description.length}/160 caractères
        </p>
      </div>
    </div>
  );
};

export default CategorySEOForm;
