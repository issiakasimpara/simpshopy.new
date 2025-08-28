
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Ruler, GripVertical } from 'lucide-react';
import { useProductAttributes } from '@/hooks/useProductAttributes';
import { useToast } from '@/hooks/use-toast';

interface SizeValue {
  id: string;
  value: string;
  sort_order: number;
}

interface SizeAttributeManagerProps {
  onSizeAttributeCreated?: () => void;
}

const predefinedSizeSets = {
  clothing: {
    name: 'Vêtements',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
  },
  shoes: {
    name: 'Chaussures (EU)',
    sizes: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']
  },
  numeric: {
    name: 'Numérique',
    sizes: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  },
  letters: {
    name: 'Lettres',
    sizes: ['A', 'B', 'C', 'D', 'E', 'F']
  }
};

const SizeAttributeManager = ({ onSizeAttributeCreated }: SizeAttributeManagerProps) => {
  const { toast } = useToast();
  const { createAttribute, createAttributeValue } = useProductAttributes();
  const [selectedSizes, setSelectedSizes] = useState<SizeValue[]>([]);
  const [customSize, setCustomSize] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const addPredefinedSizes = (sizeSet: { name: string; sizes: string[] }) => {
    const newSizes: SizeValue[] = sizeSet.sizes.map((size, index) => ({
      id: `${Date.now()}-${index}`,
      value: size,
      sort_order: index
    }));
    
    setSelectedSizes(newSizes);
  };

  const addCustomSize = () => {
    if (!customSize.trim() || selectedSizes.some(s => s.value === customSize.trim())) return;
    
    const newSize: SizeValue = {
      id: Date.now().toString(),
      value: customSize.trim().toUpperCase(),
      sort_order: selectedSizes.length
    };
    
    setSelectedSizes([...selectedSizes, newSize]);
    setCustomSize('');
  };

  const removeSize = (id: string) => {
    setSelectedSizes(selectedSizes.filter(s => s.id !== id));
  };

  const moveSizeUp = (index: number) => {
    if (index === 0) return;
    const newSizes = [...selectedSizes];
    [newSizes[index], newSizes[index - 1]] = [newSizes[index - 1], newSizes[index]];
    // Mettre à jour les sort_order
    newSizes.forEach((size, idx) => {
      size.sort_order = idx;
    });
    setSelectedSizes(newSizes);
  };

  const moveSizeDown = (index: number) => {
    if (index === selectedSizes.length - 1) return;
    const newSizes = [...selectedSizes];
    [newSizes[index], newSizes[index + 1]] = [newSizes[index + 1], newSizes[index]];
    // Mettre à jour les sort_order
    newSizes.forEach((size, idx) => {
      size.sort_order = idx;
    });
    setSelectedSizes(newSizes);
  };

  const createSizeAttribute = async () => {
    if (selectedSizes.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter au moins une taille",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      // Créer l'attribut taille
      const attribute = await createAttribute({
        name: 'Taille',
        type: 'size'
      });

      // Créer les valeurs de taille
      for (const size of selectedSizes) {
        await createAttributeValue({
          attribute_id: attribute.id,
          value: size.value,
          sort_order: size.sort_order
        });
      }

      toast({
        title: "Tailles créées !",
        description: `${selectedSizes.length} tailles ont été ajoutées avec succès.`,
      });

      setSelectedSizes([]);
      onSizeAttributeCreated?.();
    } catch (error) {
      console.error('Error creating size attribute:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ruler className="h-5 w-5" />
          Gestionnaire de Tailles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sets de tailles prédéfinis */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Sets de tailles prédéfinis</Label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(predefinedSizeSets).map(([key, sizeSet]) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                onClick={() => addPredefinedSizes(sizeSet)}
                className="h-auto p-3 flex flex-col items-start gap-1"
              >
                <div className="font-medium">{sizeSet.name}</div>
                <div className="text-xs text-muted-foreground">
                  {sizeSet.sizes.slice(0, 4).join(', ')}
                  {sizeSet.sizes.length > 4 && '...'}
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Taille personnalisée */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Ajouter une taille personnalisée</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Taille (ex: XS, 42, M/L)"
              value={customSize}
              onChange={(e) => setCustomSize(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomSize()}
              className="flex-1"
            />
            <Button 
              onClick={addCustomSize}
              disabled={!customSize.trim()}
              size="sm"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tailles sélectionnées */}
        {selectedSizes.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Tailles configurées ({selectedSizes.length})
              <span className="text-xs font-normal text-muted-foreground ml-2">
                - Réorganisez l'ordre si nécessaire
              </span>
            </Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {selectedSizes.map((size, index) => (
                <div
                  key={size.id}
                  className="flex items-center gap-2 bg-muted p-2 rounded-lg"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                  <Badge variant="outline" className="flex-1 justify-center">
                    {size.value}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveSizeUp(index)}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveSizeDown(index)}
                      disabled={index === selectedSizes.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      ↓
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSize(size.id)}
                      className="h-6 w-6 p-0 text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bouton de création */}
        <Button 
          onClick={createSizeAttribute}
          disabled={selectedSizes.length === 0 || isCreating}
          className="w-full"
        >
          {isCreating ? 'Création...' : `Créer les tailles (${selectedSizes.length})`}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SizeAttributeManager;
