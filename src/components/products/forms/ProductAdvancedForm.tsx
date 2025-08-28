
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useStoreCurrency } from "@/hooks/useStoreCurrency";
import { useStores } from "@/hooks/useStores";

interface ProductAdvancedFormProps {
  formData: {
    tags: string[];
    weight: string;
    comparePrice: string;
    costPrice: string;
    trackInventory: boolean;
    allowBackorders: boolean;
    requiresShipping: boolean;
    seoTitle: string;
    seoDescription: string;
  };
  onFormDataChange: (data: any) => void;
  onNext?: () => void;
  isLoading?: boolean;
}

const ProductAdvancedForm = ({
  formData,
  onFormDataChange,
  onNext,
  isLoading = false,
}: ProductAdvancedFormProps) => {
  const { store } = useStores();
  const { formatPrice } = useStoreCurrency(store?.id);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    onFormDataChange({
      ...formData,
      [field]: value,
    });
  };

  const isFormValid = true; // Tous les champs sont optionnels

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations avancées</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prix et coûts */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Prix et coûts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="comparePrice">Prix de comparaison ({formatPrice(0)})</Label>
              <Input
                id="comparePrice"
                type="number"
                value={formData.comparePrice}
                onChange={(e) => handleInputChange("comparePrice", e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              <p className="text-xs text-muted-foreground">
                Prix barré affiché pour montrer la réduction
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="costPrice">Prix de revient ({formatPrice(0)})</Label>
              <Input
                id="costPrice"
                type="number"
                value={formData.costPrice}
                onChange={(e) => handleInputChange("costPrice", e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              <p className="text-xs text-muted-foreground">
                Prix d'achat pour calculer la marge
              </p>
            </div>
          </div>
        </div>

        {/* Expédition */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Expédition</h3>
          <div className="space-y-2">
            <Label htmlFor="weight">Poids (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={formData.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Options de gestion */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Options de gestion</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="trackInventory"
                checked={formData.trackInventory}
                onCheckedChange={(checked) => handleInputChange("trackInventory", checked)}
              />
              <Label htmlFor="trackInventory">Suivre le stock</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowBackorders"
                checked={formData.allowBackorders}
                onCheckedChange={(checked) => handleInputChange("allowBackorders", checked)}
              />
              <Label htmlFor="allowBackorders">Autoriser les commandes en rupture de stock</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requiresShipping"
                checked={formData.requiresShipping}
                onCheckedChange={(checked) => handleInputChange("requiresShipping", checked)}
              />
              <Label htmlFor="requiresShipping">Nécessite une expédition</Label>
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Optimisation SEO</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seoTitle">Titre SEO</Label>
              <Input
                id="seoTitle"
                value={formData.seoTitle}
                onChange={(e) => handleInputChange("seoTitle", e.target.value)}
                placeholder="Titre optimisé pour les moteurs de recherche"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoDescription">Description SEO</Label>
              <Textarea
                id="seoDescription"
                value={formData.seoDescription}
                onChange={(e) => handleInputChange("seoDescription", e.target.value)}
                placeholder="Description optimisée pour les moteurs de recherche"
                rows={3}
              />
            </div>
          </div>
        </div>

        {onNext && (
          <Button
            onClick={onNext}
            disabled={!isFormValid || isLoading}
            className="w-full"
          >
            {isLoading ? "Chargement..." : "Suivant"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductAdvancedForm;
