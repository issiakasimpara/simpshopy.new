import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Settings, Image, Sliders } from 'lucide-react';
import ProductImageManager from './ProductImageManager';
import ProductAdvancedForm from './forms/ProductAdvancedForm';
import ProductBasicInfoForm from './forms/ProductBasicInfoForm';
import SimpleVariantSection from './variants/SimpleVariantSection';

type ProductStatus = 'draft' | 'active' | 'inactive';

interface FormData {
  name: string;
  description: string;
  price: string;
  sku: string;
  inventory_quantity: string;
  status: ProductStatus;
  images: string[];
  // Champs avancés
  tags: string[];
  weight: string;
  comparePrice: string;
  costPrice: string;
  trackInventory: boolean;
  allowBackorders: boolean;
  requiresShipping: boolean;
  seoTitle: string;
  seoDescription: string;
  // Variantes
  variants?: any[];
}

interface ProductFormProps {
  formData: FormData;
  onFormDataChange: (data: FormData) => void;
  productId?: string;
  isEditing?: boolean;
}

const ProductForm = ({ formData, onFormDataChange, productId, isEditing = false }: ProductFormProps) => {
  const updateFormData = (field: keyof FormData, value: any) => {
    console.log('ProductForm - Updating field:', field, 'with value:', value);
    const newFormData = {
      ...formData,
      [field]: value
    };
    console.log('ProductForm - New form data:', newFormData);
    onFormDataChange(newFormData);
  };

  const handleAdvancedDataChange = (advancedData: any) => {
    console.log('ProductForm - Advanced data change:', advancedData);
    const newFormData = {
      ...formData,
      ...advancedData
    };
    console.log('ProductForm - Updated form data with advanced:', newFormData);
    onFormDataChange(newFormData);
  };

  const handleBasicInfoChange = (basicData: any) => {
    console.log('ProductForm - Basic info change:', basicData);
    const newFormData = {
      ...formData,
      ...basicData
    };
    console.log('ProductForm - Updated form data with basic:', newFormData);
    onFormDataChange(newFormData);
  };

  const handleVariantsChange = (variants: any[]) => {
    console.log('ProductForm - Variants change:', variants);
    const newFormData = {
      ...formData,
      variants
    };
    console.log('ProductForm - Updated form data with variants:', newFormData);
    onFormDataChange(newFormData);
  };

  const handleImagesChange = (images: string[]) => {
    console.log('ProductForm - Images change:', images);
    const newFormData = {
      ...formData,
      images
    };
    console.log('ProductForm - Updated form data with images:', newFormData);
    onFormDataChange(newFormData);
  };

  console.log('ProductForm - Current form data:', formData);
  console.log('ProductForm - Current variants:', formData.variants);

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic" className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Essentiel
        </TabsTrigger>
        <TabsTrigger value="images" className="flex items-center gap-2">
          <Image className="h-4 w-4" />
          Images
        </TabsTrigger>
        <TabsTrigger value="variants" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Variantes
        </TabsTrigger>
        <TabsTrigger value="advanced" className="flex items-center gap-2">
          <Sliders className="h-4 w-4" />
          Avancé
        </TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4">
        <ProductBasicInfoForm
          formData={{
            name: formData.name,
            description: formData.description,
            price: formData.price,
            sku: formData.sku,
            inventory_quantity: formData.inventory_quantity,
            status: formData.status
          }}
          onFormDataChange={handleBasicInfoChange}
        />
      </TabsContent>

      <TabsContent value="images">
        <ProductImageManager
          images={formData.images}
          onImagesChange={handleImagesChange}
        />
      </TabsContent>

      <TabsContent value="variants">
        <SimpleVariantSection
          onVariantsChange={handleVariantsChange}
          productName={formData.name}
          initialVariants={formData.variants}
          productId={productId}
        />
      </TabsContent>

      <TabsContent value="advanced">
        <ProductAdvancedForm
          formData={{
            tags: formData.tags || [],
            weight: formData.weight || '',
            comparePrice: formData.comparePrice || '',
            costPrice: formData.costPrice || '',
            trackInventory: formData.trackInventory || false,
            allowBackorders: formData.allowBackorders || false,
            requiresShipping: formData.requiresShipping || true,
            seoTitle: formData.seoTitle || '',
            seoDescription: formData.seoDescription || ''
          }}
          onFormDataChange={handleAdvancedDataChange}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProductForm;
