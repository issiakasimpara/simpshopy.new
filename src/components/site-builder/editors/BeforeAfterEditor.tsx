
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { TemplateBlock } from '@/types/template';
import MediaSelector from './MediaSelector';

interface BeforeAfterEditorProps {
  block: TemplateBlock;
  onUpdate: (key: string, value: any) => void;
  onMediaSelect: (url: string, type: 'image' | 'video' | 'file', fieldKey: string) => void;
}

const BeforeAfterEditor = ({ block, onUpdate, onMediaSelect }: BeforeAfterEditorProps) => {
  const { title, subtitle, beforeImage, afterImage, beforeLabel, afterLabel, showLabels } = block.content;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            value={title || ''}
            onChange={(e) => onUpdate('title', e.target.value)}
            placeholder="Titre de la section"
          />
        </div>

        <div>
          <Label htmlFor="subtitle">Sous-titre</Label>
          <Textarea
            id="subtitle"
            value={subtitle || ''}
            onChange={(e) => onUpdate('subtitle', e.target.value)}
            placeholder="Description de la transformation"
            rows={2}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-sm">Images de comparaison</h4>
        
        <MediaSelector
          fieldKey="beforeImage"
          label="Image Avant"
          currentValue={beforeImage || ''}
          acceptedTypes="image/*"
          onMediaSelect={onMediaSelect}
        />

        <MediaSelector
          fieldKey="afterImage"
          label="Image Après"
          currentValue={afterImage || ''}
          acceptedTypes="image/*"
          onMediaSelect={onMediaSelect}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="showLabels"
            checked={showLabels || false}
            onCheckedChange={(checked) => onUpdate('showLabels', checked)}
          />
          <Label htmlFor="showLabels">Afficher les étiquettes</Label>
        </div>

        {showLabels && (
          <div className="space-y-3 pl-6">
            <div>
              <Label htmlFor="beforeLabel">Étiquette "Avant"</Label>
              <Input
                id="beforeLabel"
                value={beforeLabel || ''}
                onChange={(e) => onUpdate('beforeLabel', e.target.value)}
                placeholder="Avant"
              />
            </div>

            <div>
              <Label htmlFor="afterLabel">Étiquette "Après"</Label>
              <Input
                id="afterLabel"
                value={afterLabel || ''}
                onChange={(e) => onUpdate('afterLabel', e.target.value)}
                placeholder="Après"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeforeAfterEditor;
