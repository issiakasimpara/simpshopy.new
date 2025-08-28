
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Palette, Ruler } from 'lucide-react';
import type { CheckedState } from '@radix-ui/react-checkbox';

interface AttributeSelectorProps {
  colorAttribute?: any;
  sizeAttribute?: any;
  selectedAttributes: Record<string, string[]>;
  generateMode: boolean;
  onAttributeChange: (attributeId: string, valueId: string, checked: CheckedState) => void;
}

const AttributeSelector = ({ 
  colorAttribute, 
  sizeAttribute, 
  selectedAttributes, 
  generateMode, 
  onAttributeChange 
}: AttributeSelectorProps) => {
  return (
    <div className="space-y-6">
      {colorAttribute && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-base font-medium">
              <Palette className="h-4 w-4" />
              Couleurs disponibles
            </Label>
            {generateMode && (
              <Badge variant="outline" className="text-xs">
                Sélection multiple
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {colorAttribute.attribute_values?.map((value: any) => (
              <div 
                key={value.id} 
                className="group relative border rounded-lg p-3 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`color-${value.id}`}
                    checked={(selectedAttributes[colorAttribute.id] || []).includes(value.id)}
                    onCheckedChange={(checked) => onAttributeChange(colorAttribute.id, value.id, checked)}
                    className="flex-shrink-0"
                  />
                  <Label 
                    htmlFor={`color-${value.id}`} 
                    className="flex items-center gap-2 cursor-pointer flex-1"
                  >
                    <div 
                      className="w-5 h-5 rounded-full border-2 border-gray-300 shadow-sm"
                      style={{ backgroundColor: value.hex_color }}
                    />
                    <span className="text-sm font-medium">{value.value}</span>
                  </Label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sizeAttribute && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-base font-medium">
              <Ruler className="h-4 w-4" />
              Tailles disponibles
            </Label>
            {generateMode && (
              <Badge variant="outline" className="text-xs">
                Sélection multiple
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {sizeAttribute.attribute_values
              ?.sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
              .map((value: any) => (
                <div 
                  key={value.id} 
                  className="group relative border rounded-lg p-3 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`size-${value.id}`}
                      checked={(selectedAttributes[sizeAttribute.id] || []).includes(value.id)}
                      onCheckedChange={(checked) => onAttributeChange(sizeAttribute.id, value.id, checked)}
                      className="flex-shrink-0"
                    />
                    <Label 
                      htmlFor={`size-${value.id}`}
                      className="cursor-pointer flex-1 text-center"
                    >
                      <Badge variant="outline" className="w-full justify-center">
                        {value.value}
                      </Badge>
                    </Label>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {!colorAttribute && !sizeAttribute && (
        <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-center gap-2">
              <Palette className="h-6 w-6 opacity-50" />
              <Ruler className="h-6 w-6 opacity-50" />
            </div>
            <p className="font-medium">Aucun attribut configuré</p>
            <p className="text-sm">
              Configurez d'abord vos couleurs et tailles dans l'onglet "Attributs" ci-dessus
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttributeSelector;
