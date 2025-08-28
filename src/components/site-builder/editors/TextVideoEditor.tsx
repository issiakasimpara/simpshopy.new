
import { TemplateBlock } from '@/types/template';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import MediaSelector from './MediaSelector';
import LinkAutocomplete from './LinkAutocomplete';

interface TextVideoEditorProps {
  block: TemplateBlock;
  onUpdate: (key: string, value: any) => void;
  onMediaSelect: (url: string, type: 'image' | 'video' | 'file', fieldKey: string) => void;
}

const TextVideoEditor = ({ block, onUpdate, onMediaSelect }: TextVideoEditorProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="textVideoTitle">Titre</Label>
        <Input
          id="textVideoTitle"
          value={block.content.title || ''}
          onChange={(e) => onUpdate('title', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="text">Texte</Label>
        <Textarea
          id="text"
          value={block.content.text || ''}
          onChange={(e) => onUpdate('text', e.target.value)}
          rows={4}
        />
      </div>
      <MediaSelector
        fieldKey="videoUrl"
        label="Vidéo"
        currentValue={block.content.videoUrl || ''}
        acceptedTypes="video/*"
        onMediaSelect={onMediaSelect}
      />
      <div>
        <Label htmlFor="textVideoButtonText">Texte du bouton</Label>
        <Input
          id="textVideoButtonText"
          value={block.content.buttonText || ''}
          onChange={(e) => onUpdate('buttonText', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="textVideoButtonLink">Lien du bouton</Label>
        <LinkAutocomplete
          value={block.content.buttonLink || ''}
          onChange={(val) => onUpdate('buttonLink', val)}
        />
      </div>
      <div>
        <Label>Position de la vidéo</Label>
        <Select 
          value={block.content.layout || 'video-right'} 
          onValueChange={(value) => onUpdate('layout', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="video-left">Vidéo à gauche</SelectItem>
            <SelectItem value="video-right">Vidéo à droite</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="autoplay"
          checked={block.content.autoplay || false}
          onCheckedChange={(checked) => onUpdate('autoplay', checked)}
        />
        <Label htmlFor="autoplay">Lecture automatique</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="controls"
          checked={block.content.controls !== false}
          onCheckedChange={(checked) => onUpdate('controls', checked)}
        />
        <Label htmlFor="controls">Afficher les contrôles</Label>
      </div>
    </div>
  );
};

export default TextVideoEditor;
