
import { TemplateBlock } from '@/types/template';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TestimonialsEditorProps {
  block: TemplateBlock;
  onUpdate: (key: string, value: any) => void;
}

const TestimonialsEditor = ({ block, onUpdate }: TestimonialsEditorProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Titre du bloc</Label>
        <Input
          id="title"
          value={block.content.title || ''}
          onChange={(e) => onUpdate('title', e.target.value)}
          placeholder="Témoignages de nos clients"
        />
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Configuration des témoignages</h4>
        <p className="text-blue-600 text-sm">
          Les témoignages sont gérés depuis la page "Ma Boutique" → "Témoignages".
          Seuls les témoignages approuvés apparaîtront sur votre site.
        </p>
      </div>
    </div>
  );
};

export default TestimonialsEditor;
