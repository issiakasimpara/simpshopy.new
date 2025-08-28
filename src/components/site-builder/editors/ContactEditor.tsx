
import { TemplateBlock } from '@/types/template';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface ContactEditorProps {
  block: TemplateBlock;
  onUpdate: (key: string, value: any) => void;
}

const ContactEditor = ({ block, onUpdate }: ContactEditorProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="contactTitle">Titre</Label>
        <Input
          id="contactTitle"
          value={block.content.title || ''}
          onChange={(e) => onUpdate('title', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          value={block.content.address || ''}
          onChange={(e) => onUpdate('address', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          value={block.content.phone || ''}
          onChange={(e) => onUpdate('phone', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={block.content.email || ''}
          onChange={(e) => onUpdate('email', e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="showForm"
          checked={block.content.showForm || false}
          onCheckedChange={(checked) => onUpdate('showForm', checked)}
        />
        <Label htmlFor="showForm">Afficher le formulaire</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="showMap"
          checked={block.content.showMap || false}
          onCheckedChange={(checked) => onUpdate('showMap', checked)}
        />
        <Label htmlFor="showMap">Afficher la carte</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="showInfo"
          checked={block.content.showInfo || false}
          onCheckedChange={(checked) => onUpdate('showInfo', checked)}
        />
        <Label htmlFor="showInfo">Afficher les informations</Label>
      </div>
    </div>
  );
};

export default ContactEditor;
