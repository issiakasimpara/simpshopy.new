
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertCircle, CheckCircle } from 'lucide-react';
import { useSecurity } from '@/hooks/useSecurity';
import { useStoreCurrency } from "@/hooks/useStoreCurrency";
import { useStores } from "@/hooks/useStores";
import { Button } from "@/components/ui/button";

type ProductStatus = 'draft' | 'active' | 'inactive';

interface FormData {
  name: string;
  description: string;
  price: string;
  sku: string;
  inventory_quantity: string;
  status: ProductStatus;
}

interface ValidationErrors {
  name?: string;
  price?: string;
  sku?: string;
  description?: string;
}

interface ProductBasicInfoFormProps {
  formData: FormData;
  onFormDataChange: (data: FormData) => void;
  onNext: () => void;
  isLoading?: boolean;
}

const ProductBasicInfoForm = ({ formData, onFormDataChange, onNext, isLoading = false }: ProductBasicInfoFormProps) => {
  const { validateField, sanitizeField } = useSecurity();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isValidating, setIsValidating] = useState(false);
  const { store } = useStores();
  const { formatPrice } = useStoreCurrency(store?.id);

  // Validation en temps réel
  const validateAndUpdate = (field: keyof FormData, value: any) => {
    setIsValidating(true);
    
    // Ne pas sanitiser pendant la saisie pour permettre les espaces
    const valueToValidate = typeof value === 'string' ? value : value;
    
    // Validation selon le type de champ
    let validationResult;
    switch (field) {
      case 'name':
        validationResult = validateField('productName', valueToValidate);
        break;
      case 'price':
        validationResult = validateField('price', valueToValidate);
        break;
      case 'sku':
        validationResult = validateField('sku', valueToValidate);
        break;
      case 'description':
        validationResult = validateField('description', valueToValidate);
        break;
      default:
        validationResult = { isValid: true };
    }
    
    // Mise à jour des erreurs
    setValidationErrors(prev => ({
      ...prev,
      [field]: validationResult.error
    }));
    
    // Mise à jour du formulaire avec la valeur originale (non sanitée)
    onFormDataChange({
      ...formData,
      [field]: value
    });
    
    setIsValidating(false);
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    validateAndUpdate(field, value);
  };

  const isFormValid = formData.name && parseFloat(formData.price) > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Informations de base
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du produit *</Label>
            <div className="relative">
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="Ex: T-shirt élégant"
                required
                className={validationErrors.name ? 'border-red-500' : ''}
              />
              {validationErrors.name && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </div>
              )}
              {!validationErrors.name && formData.name && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              )}
            </div>
            {validationErrors.name && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {validationErrors.name}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sku">Référence (SKU)</Label>
            <div className="relative">
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => updateFormData('sku', e.target.value)}
                placeholder="Ex: TSH-001"
                className={validationErrors.sku ? 'border-red-500' : ''}
              />
              {validationErrors.sku && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </div>
              )}
              {!validationErrors.sku && formData.sku && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              )}
            </div>
            {validationErrors.sku && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {validationErrors.sku}
              </p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <div className="relative">
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              placeholder="Décrivez votre produit en détail..."
              rows={4}
              className={validationErrors.description ? 'border-red-500' : ''}
            />
            {validationErrors.description && (
              <div className="absolute right-3 top-3">
                <AlertCircle className="h-4 w-4 text-red-500" />
              </div>
            )}
            {!validationErrors.description && formData.description && (
              <div className="absolute right-3 top-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            )}
          </div>
          {validationErrors.description && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {validationErrors.description}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Prix ({formatPrice(0, { showSymbol: true, showCode: true })}) *</Label>
            <div className="relative">
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => updateFormData('price', e.target.value)}
                placeholder="0.00"
                required
                className={validationErrors.price ? 'border-red-500' : ''}
              />
              {validationErrors.price && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </div>
              )}
              {!validationErrors.price && formData.price && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              )}
            </div>
            {validationErrors.price && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {validationErrors.price}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="inventory_quantity">Stock initial</Label>
            <Input
              id="inventory_quantity"
              type="number"
              min="0"
              value={formData.inventory_quantity}
              onChange={(e) => updateFormData('inventory_quantity', e.target.value)}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Statut</Label>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.status}
              onChange={e => updateFormData('status', e.target.value as ProductStatus)}
            >
              <option value="draft">Brouillon</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
        </div>
        <Button
          onClick={onNext}
          disabled={!isFormValid || isLoading}
          className="w-full"
        >
          {isLoading ? "Chargement..." : "Suivant"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductBasicInfoForm;
