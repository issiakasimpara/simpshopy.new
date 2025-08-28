import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Package, Sliders } from 'lucide-react';
import { useProductAttributes } from '@/hooks/useProductAttributes';
import { useProductVariants } from '@/hooks/useProductVariants';
import { useToast } from '@/hooks/use-toast';
import AttributeManagementPanel from './variants/AttributeManagementPanel';
import VariantEditor from './variants/VariantEditor';
import VariantsList from './variants/VariantsList';
import VariantCreationForm from './variants/VariantCreationForm';
import type { CheckedState } from '@radix-ui/react-checkbox';

interface ProductVariantsManagerProps {
  productId?: string;
  productName?: string;
  allowCreation?: boolean;
  onVariantsChange?: (variants: any[]) => void;
}

const ProductVariantsManager = ({ 
  productId, 
  productName, 
  allowCreation = false, 
  onVariantsChange 
}: ProductVariantsManagerProps) => {
  const { toast } = useToast();
  const { attributes, isLoading: attributesLoading } = useProductAttributes();
  const { variants, createVariant, updateVariant, deleteVariant, linkAttributeToVariant } = useProductVariants(productId);
  
  const [newVariant, setNewVariant] = useState({
    price: '',
    inventory_quantity: '',
    selectedAttributes: {} as Record<string, string[]>
  });

  const [editingVariant, setEditingVariant] = useState<any>(null);
  const [showVariantEditor, setShowVariantEditor] = useState(false);
  const [generateMode, setGenerateMode] = useState(false);
  const [activeTab, setActiveTab] = useState('attributes');

  const colorAttribute = attributes.find(attr => attr.type === 'color');
  const sizeAttribute = attributes.find(attr => attr.type === 'size');

  const generateAutomaticSKU = async (variantAttributes: string[]) => {
    if (!productName) return '';
    
    try {
      const { data, error } = await window.supabase
        .rpc('generate_variant_sku', {
          product_name: productName,
          variant_attributes: variantAttributes
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error generating SKU:', error);
      const baseProduct = productName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 6).toUpperCase();
      const attributePart = variantAttributes.join('').replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase();
      const randomPart = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
      return `${baseProduct}-${attributePart}-${randomPart}`;
    }
  };

  const handleCreateVariant = async () => {
    if (!newVariant.price || !productId) return;

    try {
      const selectedAttributeNames: string[] = [];
      for (const [attributeId, valueIds] of Object.entries(newVariant.selectedAttributes)) {
        for (const valueId of valueIds) {
          const attribute = attributes.find(attr => attr.id === attributeId);
          const value = attribute?.attribute_values?.find((val: any) => val.id === valueId);
          if (value) {
            selectedAttributeNames.push(value.value);
          }
        }
      }

      const generatedSKU = await generateAutomaticSKU(selectedAttributeNames);

      const variant = await createVariant({
        product_id: productId,
        sku: generatedSKU,
        price: parseFloat(newVariant.price),
        inventory_quantity: parseInt(newVariant.inventory_quantity) || 0,
      });

      for (const [attributeId, valueIds] of Object.entries(newVariant.selectedAttributes)) {
        for (const valueId of valueIds) {
          if (valueId) {
            await linkAttributeToVariant({
              variantId: variant.id,
              attributeValueId: valueId
            });
          }
        }
      }

      setNewVariant({
        price: '',
        inventory_quantity: '',
        selectedAttributes: {}
      });

      onVariantsChange?.(variants);
      
      toast({
        title: "Variante créée !",
        description: `SKU généré automatiquement : ${generatedSKU}`,
      });
    } catch (error) {
      console.error('Error creating variant:', error);
    }
  };

  const generateAllCombinations = async () => {
    if (!newVariant.price || !productId) return;

    const colors = newVariant.selectedAttributes[colorAttribute?.id || ''] || [];
    const sizes = newVariant.selectedAttributes[sizeAttribute?.id || ''] || [];

    if (colors.length === 0 && sizes.length === 0) return;

    try {
      const combinations = [];
      
      if (colors.length > 0 && sizes.length > 0) {
        for (const colorId of colors) {
          for (const sizeId of sizes) {
            combinations.push([colorId, sizeId]);
          }
        }
      } else if (colors.length > 0) {
        combinations.push(...colors.map(colorId => [colorId]));
      } else if (sizes.length > 0) {
        combinations.push(...sizes.map(sizeId => [sizeId]));
      }

      for (let i = 0; i < combinations.length; i++) {
        const combination = combinations[i];
        
        const attributeNames: string[] = [];
        for (const valueId of combination) {
          const attribute = attributes.find(attr => 
            attr.attribute_values?.some((val: any) => val.id === valueId)
          );
          const value = attribute?.attribute_values?.find((val: any) => val.id === valueId);
          if (value) {
            attributeNames.push(value.value);
          }
        }

        const generatedSKU = await generateAutomaticSKU(attributeNames);
        
        const variant = await createVariant({
          product_id: productId,
          sku: generatedSKU,
          price: parseFloat(newVariant.price),
          inventory_quantity: parseInt(newVariant.inventory_quantity) || 0,
        });

        for (const valueId of combination) {
          await linkAttributeToVariant({
            variantId: variant.id,
            attributeValueId: valueId
          });
        }
      }

      setNewVariant({
        price: '',
        inventory_quantity: '',
        selectedAttributes: {}
      });

      onVariantsChange?.(variants);
      
      toast({
        title: "Variantes générées !",
        description: `${combinations.length} variantes créées avec SKU automatiques`,
      });
    } catch (error) {
      console.error('Error generating variants:', error);
    }
  };

  const handleAttributeChange = (attributeId: string, valueId: string, checked: CheckedState) => {
    const isChecked = checked === true;
    setNewVariant(prev => {
      const currentValues = prev.selectedAttributes[attributeId] || [];
      let newValues;
      
      if (isChecked) {
        newValues = [...currentValues, valueId];
      } else {
        newValues = currentValues.filter(id => id !== valueId);
      }
      
      return {
        ...prev,
        selectedAttributes: {
          ...prev.selectedAttributes,
          [attributeId]: newValues
        }
      };
    });
  };

  const handleEditVariant = (variant: any) => {
    setEditingVariant(variant);
    setShowVariantEditor(true);
  };

  const handleSaveVariant = async (variantData: any) => {
    try {
      await updateVariant(variantData);
      onVariantsChange?.(variants);
      toast({
        title: "Variante mise à jour !",
        description: "Les modifications ont été sauvegardées.",
      });
    } catch (error) {
      console.error('Error updating variant:', error);
    }
  };

  const handleDeleteVariant = (variantId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette variante ?')) {
      deleteVariant(variantId);
      onVariantsChange?.(variants);
    }
  };

  if (!productId) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 mb-2">Gestion des variantes</p>
          <p className="text-sm text-gray-400">
            Sauvegardez d'abord le produit pour gérer ses variantes
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="attributes" className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            Gestion des Attributs
          </TabsTrigger>
          <TabsTrigger value="variants" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Variantes du Produit
            {variants.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {variants.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attributes" className="space-y-4">
          <AttributeManagementPanel onAttributesUpdated={() => {}} />
        </TabsContent>

        <TabsContent value="variants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Variantes du produit
                {variants.length > 0 && (
                  <Badge variant="secondary">
                    {variants.length} variante{variants.length > 1 ? 's' : ''}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <VariantsList
                variants={variants}
                onEdit={handleEditVariant}
                onDelete={handleDeleteVariant}
              />

              {(colorAttribute || sizeAttribute) && (
                <VariantCreationForm
                  newVariant={newVariant}
                  onNewVariantChange={setNewVariant}
                  generateMode={generateMode}
                  onGenerateModeChange={(checked: CheckedState) => setGenerateMode(checked === true)}
                  colorAttribute={colorAttribute}
                  sizeAttribute={sizeAttribute}
                  onAttributeChange={handleAttributeChange}
                  onCreateVariant={handleCreateVariant}
                  onGenerateAllCombinations={generateAllCombinations}
                  productId={productId}
                />
              )}

              {!colorAttribute && !sizeAttribute && (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium">Aucun attribut configuré</p>
                  <p className="text-sm mb-4">
                    Configurez d'abord vos couleurs et tailles dans l'onglet "Gestion des Attributs"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <VariantEditor
        variant={editingVariant}
        open={showVariantEditor}
        onOpenChange={setShowVariantEditor}
        onSave={handleSaveVariant}
        productName={productName}
      />
    </>
  );
};

export default ProductVariantsManager;
