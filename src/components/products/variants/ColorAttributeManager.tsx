
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Palette } from 'lucide-react';
import { useProductAttributes } from '@/hooks/useProductAttributes';
import { useToast } from '@/hooks/use-toast';

interface ColorValue {
  id: string;
  value: string;
  hex_color: string;
}

interface ColorAttributeManagerProps {
  onColorAttributeCreated?: () => void;
}

const predefinedColors = [
  { name: 'Noir', hex: '#000000' },
  { name: 'Blanc', hex: '#FFFFFF' },
  { name: 'Rouge', hex: '#EF4444' },
  { name: 'Bleu', hex: '#3B82F6' },
  { name: 'Vert', hex: '#10B981' },
  { name: 'Jaune', hex: '#F59E0B' },
  { name: 'Violet', hex: '#8B5CF6' },
  { name: 'Rose', hex: '#EC4899' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Gris', hex: '#6B7280' },
  { name: 'Marine', hex: '#1E40AF' },
  { name: 'Beige', hex: '#D2B48C' },
];

const ColorAttributeManager = ({ onColorAttributeCreated }: ColorAttributeManagerProps) => {
  const { toast } = useToast();
  const { createAttribute, createAttributeValue } = useProductAttributes();
  const [selectedColors, setSelectedColors] = useState<ColorValue[]>([]);
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#000000');
  const [isCreating, setIsCreating] = useState(false);

  const addPredefinedColor = (color: { name: string; hex: string }) => {
    if (selectedColors.some(c => c.hex_color === color.hex)) return;
    
    const newColor: ColorValue = {
      id: Date.now().toString(),
      value: color.name,
      hex_color: color.hex
    };
    
    setSelectedColors([...selectedColors, newColor]);
  };

  const addCustomColor = () => {
    if (!customColorName.trim()) return;
    
    const newColor: ColorValue = {
      id: Date.now().toString(),
      value: customColorName.trim(),
      hex_color: customColorHex
    };
    
    setSelectedColors([...selectedColors, newColor]);
    setCustomColorName('');
    setCustomColorHex('#000000');
  };

  const removeColor = (id: string) => {
    setSelectedColors(selectedColors.filter(c => c.id !== id));
  };

  const createColorAttribute = async () => {
    if (selectedColors.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins une couleur",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      // Créer l'attribut couleur
      const attribute = await createAttribute({
        name: 'Couleur',
        type: 'color'
      });

      // Créer les valeurs de couleur
      for (const color of selectedColors) {
        await createAttributeValue({
          attribute_id: attribute.id,
          value: color.value,
          hex_color: color.hex_color
        });
      }

      toast({
        title: "Couleurs créées !",
        description: `${selectedColors.length} couleurs ont été ajoutées avec succès.`,
      });

      setSelectedColors([]);
      onColorAttributeCreated?.();
    } catch (error) {
      console.error('Error creating color attribute:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Gestionnaire de Couleurs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Couleurs prédéfinies */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Couleurs prédéfinies</Label>
          <div className="grid grid-cols-4 gap-2">
            {predefinedColors.map((color) => (
              <Button
                key={color.hex}
                variant="outline"
                size="sm"
                onClick={() => addPredefinedColor(color)}
                disabled={selectedColors.some(c => c.hex_color === color.hex)}
                className="flex items-center gap-2 h-10"
              >
                <div 
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-xs">{color.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Couleur personnalisée */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Couleur personnalisée</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Nom de la couleur"
              value={customColorName}
              onChange={(e) => setCustomColorName(e.target.value)}
              className="flex-1"
            />
            <input
              type="color"
              value={customColorHex}
              onChange={(e) => setCustomColorHex(e.target.value)}
              className="w-12 h-10 rounded border border-input cursor-pointer"
            />
            <Button 
              onClick={addCustomColor}
              disabled={!customColorName.trim()}
              size="sm"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Couleurs sélectionnées */}
        {selectedColors.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Couleurs sélectionnées ({selectedColors.length})</Label>
            <div className="flex flex-wrap gap-2">
              {selectedColors.map((color) => (
                <div
                  key={color.id}
                  className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg"
                >
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.hex_color }}
                  />
                  <span className="text-sm">{color.value}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeColor(color.id)}
                    className="h-4 w-4 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bouton de création */}
        <Button 
          onClick={createColorAttribute}
          disabled={selectedColors.length === 0 || isCreating}
          className="w-full"
        >
          {isCreating ? 'Création...' : `Créer les couleurs (${selectedColors.length})`}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ColorAttributeManager;
