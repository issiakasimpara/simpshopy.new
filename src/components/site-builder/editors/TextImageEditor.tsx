
import { TemplateBlock } from '@/types/template';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MediaSelector from './MediaSelector';
import LinkAutocomplete from './LinkAutocomplete';

interface TextImageEditorProps {
  block: TemplateBlock;
  onUpdate: (key: string, value: any) => void;
  onMediaSelect: (url: string, type: 'image' | 'video' | 'file', fieldKey: string) => void;
}

const TextImageEditor = ({ block, onUpdate, onMediaSelect }: TextImageEditorProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="textImageTitle">Titre</Label>
        <Input
          id="textImageTitle"
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
        fieldKey="imageUrl"
        label="Image"
        currentValue={block.content.imageUrl || ''}
        acceptedTypes="image/*"
        onMediaSelect={onMediaSelect}
      />
      <div>
        <Label htmlFor="textImageButtonText">Texte du bouton</Label>
        <Input
          id="textImageButtonText"
          value={block.content.buttonText || ''}
          onChange={(e) => onUpdate('buttonText', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="textImageButtonLink">Lien du bouton</Label>
        <LinkAutocomplete
          value={block.content.buttonLink || ''}
          onChange={(val) => onUpdate('buttonLink', val)}
        />
      </div>
      <div>
        <Label>Position de l'image</Label>
        <Select 
          value={block.content.layout || 'image-right'} 
          onValueChange={(value) => onUpdate('layout', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="image-left">Image à gauche</SelectItem>
            <SelectItem value="image-right">Image à droite</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TextImageEditor;
