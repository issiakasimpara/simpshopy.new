
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Category } from '@/hooks/useCategories';
import CategoryBasicInfoForm from './forms/CategoryBasicInfoForm';
import CategoryImageUploadForm from './forms/CategoryImageUploadForm';
import CategorySEOForm from './forms/CategorySEOForm';
import CategorySettingsForm from './forms/CategorySettingsForm';

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (category: Omit<Category, 'id' | 'created_at'>) => void;
  category?: Category | null;
  storeId: string;
  isLoading?: boolean;
  categories?: Category[];
}

const CategoryDialog = ({ 
  open, 
  onClose, 
  onSave, 
  category, 
  storeId, 
  isLoading,
  categories = []
}: CategoryDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent_id: 'none',
    image_url: '',
    is_active: true,
    sort_order: 0,
    seo_title: '',
    seo_description: '',
    slug: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        parent_id: category.parent_id || 'none',
        image_url: '',
        is_active: true,
        sort_order: 0,
        seo_title: category.name,
        seo_description: category.description || '',
        slug: category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      });
    } else {
      setFormData({
        name: '',
        description: '',
        parent_id: 'none',
        image_url: '',
        is_active: true,
        sort_order: 0,
        seo_title: '',
        seo_description: '',
        slug: '',
      });
    }
    setErrors({});
  }, [category, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de la catégorie est requis';
    }
    
    if (formData.name.length > 100) {
      newErrors.name = 'Le nom ne peut pas dépasser 100 caractères';
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'La description ne peut pas dépasser 500 caractères';
    }

    if (formData.seo_title && formData.seo_title.length > 60) {
      newErrors.seo_title = 'Le titre SEO ne peut pas dépasser 60 caractères';
    }

    if (formData.seo_description && formData.seo_description.length > 160) {
      newErrors.seo_description = 'La description SEO ne peut pas dépasser 160 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from name
    if (field === 'name' && typeof value === 'string') {
      const slug = value.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
      setFormData(prev => ({ 
        ...prev, 
        [field]: value,
        slug: slug,
        seo_title: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSave = () => {
    if (!validateForm()) return;

    onSave({
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      store_id: storeId,
      parent_id: formData.parent_id === 'none' ? undefined : formData.parent_id,
    });

    if (!category) {
      setFormData({
        name: '',
        description: '',
        parent_id: 'none',
        image_url: '',
        is_active: true,
        sort_order: 0,
        seo_title: '',
        seo_description: '',
        slug: '',
      });
    }
  };

  const handleClose = () => {
    onClose();
    setErrors({});
    if (!category) {
      setFormData({
        name: '',
        description: '',
        parent_id: 'none',
        image_url: '',
        is_active: true,
        sort_order: 0,
        seo_title: '',
        seo_description: '',
        slug: '',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            {category ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6 py-4">
          <CategoryBasicInfoForm
            formData={{
              name: formData.name,
              description: formData.description,
              parent_id: formData.parent_id,
            }}
            errors={errors}
            categories={categories}
            category={category}
            onInputChange={handleInputChange}
          />

          <CategoryImageUploadForm />

          <CategorySEOForm
            formData={{
              slug: formData.slug,
              seo_title: formData.seo_title,
              seo_description: formData.seo_description,
            }}
            errors={errors}
            onInputChange={handleInputChange}
          />

          <CategorySettingsForm
            formData={{
              is_active: formData.is_active,
              sort_order: formData.sort_order,
            }}
            onInputChange={handleInputChange}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={isLoading} className="text-sm">
            Annuler
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!formData.name.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-sm"
          >
            {isLoading ? 'Enregistrement...' : (category ? 'Modifier' : 'Ajouter')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
