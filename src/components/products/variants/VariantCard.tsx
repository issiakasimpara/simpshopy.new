
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Image as ImageIcon, Package } from 'lucide-react';
import { useStoreCurrency } from '@/hooks/useStoreCurrency';

interface VariantCardProps {
  variant: any;
  onEdit: (variant: any) => void;
  onDelete: (variantId: string) => void;
}

const VariantCard = ({ variant, onEdit, onDelete }: VariantCardProps) => {
  const { formatPrice } = useStoreCurrency();
  const productName = variant.product?.name || 'Produit';
  const getVariantDisplayName = () => {
    const attributeNames = variant.variant_attribute_values
      ?.map((vav: any) => vav.attribute_values?.value)
      .filter(Boolean)
      .join(' / ') || 'Variante sans attributs';
    
    return attributeNames;
  };

  const getMainImage = () => {
    if (variant.images && variant.images.length > 0) {
      return variant.images[0];
    }
    return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop';
  };

  const hasCustomImages = variant.images && variant.images.length > 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <div className="aspect-square w-full bg-gray-100">
          <img
            src={getMainImage()}
            alt={`Image du produit ${getVariantDisplayName()} - ${productName || 'Produit'}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop';
            }}
          />
        </div>
        
        {/* Badge pour les images personnalisées */}
        {hasCustomImages && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-blue-600 text-white text-xs">
              <ImageIcon className="h-3 w-3 mr-1" />
              {variant.images.length}
            </Badge>
          </div>
        )}

        {/* Badge de stock */}
        <div className="absolute top-2 right-2">
          <Badge variant={variant.inventory_quantity > 0 ? "default" : "destructive"}>
            {variant.inventory_quantity || 0}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Nom et attributs */}
        <div>
          <h4 className="font-medium text-sm">{getVariantDisplayName()}</h4>
          <div className="flex flex-wrap gap-1 mt-2">
            {variant.variant_attribute_values?.map((vav: any, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {vav.attribute_values?.hex_color && (
                  <div 
                    className="w-2 h-2 rounded-full border mr-1"
                    style={{ backgroundColor: vav.attribute_values.hex_color }}
                  />
                )}
                {vav.attribute_values?.value}
              </Badge>
            ))}
          </div>
        </div>

        {/* Prix */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-green-600">
              {variant.price ? formatPrice(variant.price) : 'Prix non défini'}
            </span>
            {variant.compare_price && variant.compare_price > variant.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(variant.compare_price)}
              </span>
            )}
          </div>
          {variant.sku && (
            <p className="text-xs text-gray-500">SKU: {variant.sku}</p>
          )}
        </div>

        {/* Informations supplémentaires */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Package className="h-3 w-3" />
            Stock: {variant.inventory_quantity || 0}
          </span>
          {variant.weight && (
            <span>{variant.weight}kg</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(variant)}
            className="flex-1"
          >
            <Edit className="h-3 w-3 mr-1" />
            Modifier
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(variant.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VariantCard;
