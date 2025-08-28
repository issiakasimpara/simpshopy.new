
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Image as ImageIcon, Package, Settings, Save } from 'lucide-react';
import ProductImageManager from '../ProductImageManager';
import { useStoreCurrency } from "@/hooks/useStoreCurrency";
import { useStores } from "@/hooks/useStores";
import { Package as PackageIcon, Tag, DollarSign, Hash, AlertTriangle } from "lucide-react";

interface Variant {
  id?: string;
  name: string;
  sku: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  stock_quantity: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  is_active: boolean;
}

interface VariantEditorProps {
  variant: Variant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (variant: Variant) => void;
  productName: string;
}

const VariantEditor = ({ variant, open, onOpenChange, onSave, productName }: VariantEditorProps) => {
  const { store } = useStores();
  const { formatPrice } = useStoreCurrency(store?.id);
  
  const [formData, setFormData] = useState<Variant>({
    name: "",
    sku: "",
    price: 0,
    compare_price: 0,
    cost_price: 0,
    stock_quantity: 0,
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    is_active: true,
  });

  useEffect(() => {
    if (variant) {
      setFormData({
        ...variant,
        compare_price: variant.compare_price || 0,
        cost_price: variant.cost_price || 0,
        weight: variant.weight || 0,
        dimensions: {
          length: variant.dimensions?.length || 0,
          width: variant.dimensions?.width || 0,
          height: variant.dimensions?.height || 0,
        },
      });
    } else {
      setFormData({
        name: "",
        sku: "",
        price: 0,
        compare_price: 0,
        cost_price: 0,
        stock_quantity: 0,
        weight: 0,
        dimensions: {
          length: 0,
          width: 0,
          height: 0,
        },
        is_active: true,
      });
    }
  }, [variant]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDimensionChange = (dimension: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: value,
      },
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  const isFormValid = formData.name && formData.price > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackageIcon className="h-5 w-5" />
            {variant ? "Modifier la variante" : "Ajouter une variante"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations de base */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Tag className="h-4 w-4" />
                Informations de base
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de la variante *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder={`Ex: ${productName} - Rouge, Taille L`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">Référence (SKU)</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  placeholder="Ex: TSH-RED-L"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange("is_active", e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="is_active">Variante active</Label>
              </div>
            </CardContent>
          </Card>

          {/* Prix et stock */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-4 w-4" />
                Prix et stock
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Prix de vente ({formatPrice(0, { showSymbol: true, showCode: true })}) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compare_price">Prix comparé ({formatPrice(0, { showSymbol: true, showCode: true })})</Label>
                  <Input
                    id="compare_price"
                    type="number"
                    value={formData.compare_price}
                    onChange={(e) => handleInputChange("compare_price", parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost_price">Prix de revient ({formatPrice(0, { showSymbol: true, showCode: true })})</Label>
                  <Input
                    id="cost_price"
                    type="number"
                    value={formData.cost_price}
                    onChange={(e) => handleInputChange("cost_price", parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Quantité en stock</Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => handleInputChange("stock_quantity", parseInt(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                />
              </div>
            </CardContent>
          </Card>

          {/* Dimensions et poids */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Hash className="h-4 w-4" />
                Dimensions et poids
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Poids (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="length">Longueur (cm)</Label>
                  <Input
                    id="length"
                    type="number"
                    value={formData.dimensions?.length}
                    onChange={(e) => handleDimensionChange("length", parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="width">Largeur (cm)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={formData.dimensions?.width}
                    onChange={(e) => handleDimensionChange("width", parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Hauteur (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.dimensions?.height}
                    onChange={(e) => handleDimensionChange("height", parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avertissement */}
          {formData.compare_price > 0 && formData.compare_price <= formData.price && (
            <div className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-orange-800 dark:text-orange-200">
                <p className="font-medium">Prix comparé invalide</p>
                <p>Le prix comparé doit être supérieur au prix de vente pour afficher une réduction.</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={!isFormValid}>
              {variant ? "Mettre à jour" : "Ajouter"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VariantEditor;
