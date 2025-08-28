import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStoreCurrency } from "@/hooks/useStoreCurrency";
import { useStores } from "@/hooks/useStores";
import { Truck, DollarSign, Package } from "lucide-react";

interface CreateMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId?: string;
  onMethodCreated: (method: any) => void;
  editingMethod?: any;
}

const CreateMethodDialog = ({ open, onOpenChange, storeId, onMethodCreated, editingMethod }: CreateMethodDialogProps) => {
  const { store } = useStores();
  const { formatPrice } = useStoreCurrency(store?.id);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    estimated_days: "",
    is_active: true,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onMethodCreated(formData);
    onOpenChange(false);
    // Reset form
    setFormData({
      name: "",
      description: "",
      price: 0,
      estimated_days: "",
      is_active: true,
    });
  };

  const isFormValid = formData.name && formData.price >= 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            {editingMethod ? "Modifier la méthode" : "Créer une méthode de livraison"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations de base */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-4 w-4" />
                Informations de base
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="method-name">Nom de la méthode *</Label>
                <Input
                  id="method-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Ex: Livraison standard"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="method-description">Description</Label>
                <Textarea
                  id="method-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Description de la méthode de livraison"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="method-active"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange("is_active", e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="method-active">Méthode active</Label>
              </div>
            </CardContent>
          </Card>

          {/* Prix et délais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-4 w-4" />
                Prix et délais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="method-price">Prix ({formatPrice(0, { showSymbol: true, showCode: true })}) *</Label>
                  <Input
                    id="method-price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="method-days">Délai estimé</Label>
                  <Input
                    id="method-days"
                    value={formData.estimated_days}
                    onChange={(e) => handleInputChange("estimated_days", e.target.value)}
                    placeholder="Ex: 3-5 jours"
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
              {editingMethod ? "Mettre à jour" : "Créer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMethodDialog;
