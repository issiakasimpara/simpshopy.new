
import { TemplateBlock } from '@/types/template';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import MediaSelector from './MediaSelector';

interface VideoEditorProps {
  block: TemplateBlock;
  onUpdate: (key: string, value: any) => void;
  onMediaSelect: (url: string, type: 'image' | 'video' | 'file', fieldKey: string) => void;
}

const VideoEditor = ({ block, onUpdate, onMediaSelect }: VideoEditorProps) => {
  const handleMediaSelect = (url: string, type: 'image' | 'video' | 'file', fieldKey: string) => {
    if (fieldKey === 'videoUrl') {
      onUpdate('videoUrl', url);
    }
    onMediaSelect(url, type, fieldKey);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="videoTitle">Titre</Label>
        <Input
          id="videoTitle"
          value={block.content.title || ''}
          onChange={(e) => onUpdate('title', e.target.value)}
        />
      </div>
      
      <MediaSelector
        fieldKey="videoUrl"
        label="Vidéo"
        currentValue={block.content.videoUrl || ''}
        acceptedTypes="video/*"
        onMediaSelect={handleMediaSelect}
      />
      
      {block.content.videoUrl && (
        <div className="p-2 border rounded bg-gray-50">
          <p className="text-xs text-gray-600 mb-2">Aperçu de la vidéo:</p>
          <video 
            className="w-full h-24 object-cover rounded"
            controls
            src={block.content.videoUrl}
          >
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
        </div>
      )}
      
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

export default VideoEditor;
