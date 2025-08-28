
import { TemplateBlock } from '@/types/template';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2 } from 'lucide-react';

interface ComparisonEditorProps {
  block: TemplateBlock;
  onUpdate: (key: string, value: any) => void;
}

const ComparisonEditor = ({ block, onUpdate }: ComparisonEditorProps) => {
  const addFeature = () => {
    const newFeatures = [
      ...(block.content.features || []),
      { name: 'Nouvelle fonctionnalité', us: true, them: false }
    ];
    onUpdate('features', newFeatures);
  };

  const updateFeature = (index: number, field: string, value: any) => {
    const newFeatures = [...(block.content.features || [])];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    onUpdate('features', newFeatures);
  };

  const removeFeature = (index: number) => {
    const newFeatures = block.content.features.filter((_: any, i: number) => i !== index);
    onUpdate('features', newFeatures);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            value={block.content.title || ''}
            onChange={(e) => onUpdate('title', e.target.value)}
            placeholder="Pourquoi nous choisir ?"
          />
        </div>

        <div>
          <Label htmlFor="subtitle">Sous-titre</Label>
          <Textarea
            id="subtitle"
            value={block.content.subtitle || ''}
            onChange={(e) => onUpdate('subtitle', e.target.value)}
            placeholder="Découvrez nos avantages par rapport à la concurrence"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ourColumn">Notre colonne</Label>
            <Input
              id="ourColumn"
              value={block.content.ourColumn || ''}
              onChange={(e) => onUpdate('ourColumn', e.target.value)}
              placeholder="Nous"
            />
          </div>
          <div>
            <Label htmlFor="theirColumn">Leur colonne</Label>
            <Input
              id="theirColumn"
              value={block.content.theirColumn || ''}
              onChange={(e) => onUpdate('theirColumn', e.target.value)}
              placeholder="Autres"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="buttonText">Texte du bouton (optionnel)</Label>
          <Input
            id="buttonText"
            value={block.content.buttonText || ''}
            onChange={(e) => onUpdate('buttonText', e.target.value)}
            placeholder="Commencer maintenant"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Fonctionnalités à comparer</Label>
          <Button onClick={addFeature} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>

        {block.content.features?.map((feature: any, index: number) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <Label>Fonctionnalité {index + 1}</Label>
              <Button
                onClick={() => removeFeature(index)}
                size="sm"
                variant="destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <Input
              value={feature.name || ''}
              onChange={(e) => updateFeature(index, 'name', e.target.value)}
              placeholder="Nom de la fonctionnalité"
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={feature.us}
                  onCheckedChange={(checked) => updateFeature(index, 'us', checked)}
                />
                <Label>Nous l'avons</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={feature.them}
                  onCheckedChange={(checked) => updateFeature(index, 'them', checked)}
                />
                <Label>Ils l'ont</Label>
              </div>
            </div>
          </div>
        ))}

        {(!block.content.features || block.content.features.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            <p>Aucune fonctionnalité ajoutée</p>
            <Button onClick={addFeature} className="mt-2">
              Ajouter la première fonctionnalité
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonEditor;
