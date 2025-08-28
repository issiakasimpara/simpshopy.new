
import { TemplateBlock } from '@/types/template';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';

interface FeaturesEditorProps {
  block: TemplateBlock;
  onUpdate: (key: string, value: any) => void;
}

const FeaturesEditor = ({ block, onUpdate }: FeaturesEditorProps) => {
  const features = block.content.features || [];

  const addFeature = () => {
    const newFeatures = [...features, { title: 'Nouvelle fonctionnalité', description: 'Description', icon: '⭐' }];
    onUpdate('features', newFeatures);
  };

  const updateFeature = (index: number, field: string, value: string) => {
    const updatedFeatures = features.map((feature: any, i: number) => 
      i === index ? { ...feature, [field]: value } : feature
    );
    onUpdate('features', updatedFeatures);
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = features.filter((_: any, i: number) => i !== index);
    onUpdate('features', updatedFeatures);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <Label htmlFor="featuresTitle" className="text-xs sm:text-sm">Titre de la section</Label>
        <Input
          id="featuresTitle"
          value={block.content.title || ''}
          onChange={(e) => onUpdate('title', e.target.value)}
          className="text-xs sm:text-sm"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <Label className="text-xs sm:text-sm">Fonctionnalités</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addFeature}
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Ajouter</span>
          </Button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {features.map((feature: any, index: number) => (
            <div key={index} className="p-3 sm:p-4 border rounded-lg space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium">Fonctionnalité {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFeature(index)}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
              
              <div>
                <Label className="text-xs sm:text-sm">Icône (emoji)</Label>
                <Input
                  value={feature.icon || ''}
                  onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                  placeholder="⭐"
                  className="text-xs sm:text-sm"
                />
              </div>
              
              <div>
                <Label className="text-xs sm:text-sm">Titre</Label>
                <Input
                  value={feature.title || ''}
                  onChange={(e) => updateFeature(index, 'title', e.target.value)}
                  placeholder="Titre de la fonctionnalité"
                  className="text-xs sm:text-sm"
                />
              </div>
              
              <div>
                <Label className="text-xs sm:text-sm">Description</Label>
                <Input
                  value={feature.description || ''}
                  onChange={(e) => updateFeature(index, 'description', e.target.value)}
                  placeholder="Description de la fonctionnalité"
                  className="text-xs sm:text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesEditor;
