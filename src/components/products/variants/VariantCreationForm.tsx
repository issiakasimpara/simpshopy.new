
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStoreCurrency } from "@/hooks/useStoreCurrency";
import { useStores } from "@/hooks/useStores";
import { Package, Tag, DollarSign } from "lucide-react";

interface VariantCreationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (variant: any) => void;
  productName: string;
  attributes: any[];
}

const VariantCreationForm = ({
  open,
  onOpenChange,
  onSave,
  productName,
  attributes,
}: VariantCreationFormProps) => {
  const { store } = useStores();
  const { formatPrice } = useStoreCurrency(store?.id);
  
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: 0,
    stock_quantity: 0,
    is_active: true,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
    // Reset form
    setFormData({
      name: "",
      sku: "",
      price: 0,
      stock_quantity: 0,
      is_active: true,
    });
  };

  const isFormValid = formData.name && formData.price > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Créer une nouvelle variante
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
                <Label htmlFor="variant-name">Nom de la variante *</Label>
                <Input
                  id="variant-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder={`Ex: ${productName} - Rouge, Taille L`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="variant-sku">Référence (SKU)</Label>
                <Input
                  id="variant-sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  placeholder="Ex: TSH-RED-L"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="variant-active"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange("is_active", e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="variant-active">Variante active</Label>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="variant-price">Prix ({formatPrice(0, { showSymbol: true, showCode: true })}) *</Label>
                  <Input
                    id="variant-price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="variant-stock">Quantité en stock</Label>
                  <Input
                    id="variant-stock"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => handleInputChange("stock_quantity", parseInt(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={!isFormValid}>
              Créer la variante
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VariantCreationForm;
