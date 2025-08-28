
import { TemplateBlock } from '@/types/template';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import MediaSelector from './MediaSelector';

interface GalleryEditorProps {
  block: TemplateBlock;
  onUpdate: (key: string, value: any) => void;
  onMediaSelect: (url: string, type: 'image' | 'video' | 'file', fieldKey: string) => void;
}

const GalleryEditor = ({ block, onUpdate, onMediaSelect }: GalleryEditorProps) => {
  const images = block.content.images || [];

  const handleMediaSelect = (url: string, type: 'image' | 'video' | 'file', fieldKey: string) => {
    if (type === 'image') {
      const newImages = [...images, url];
      onUpdate('images', newImages);
    }
    onMediaSelect(url, type, fieldKey);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_: string, i: number) => i !== index);
    onUpdate('images', newImages);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="galleryTitle">Titre</Label>
        <Input
          id="galleryTitle"
          value={block.content.title || ''}
          onChange={(e) => onUpdate('title', e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="displayMode">Mode d'affichage</Label>
        <Select 
          value={block.content.displayMode || 'grid'} 
          onValueChange={(value) => onUpdate('displayMode', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grid">Grille</SelectItem>
            <SelectItem value="slideshow">Diaporama</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {block.content.displayMode === 'grid' && (
        <div>
          <Label htmlFor="columns">Nombre de colonnes</Label>
          <Select 
            value={String(block.content.columns || 3)} 
            onValueChange={(value) => onUpdate('columns', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 colonne</SelectItem>
              <SelectItem value="2">2 colonnes</SelectItem>
              <SelectItem value="3">3 colonnes</SelectItem>
              <SelectItem value="4">4 colonnes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {block.content.displayMode === 'slideshow' && (
        <>
          <div>
            <Label htmlFor="maxImages">Nombre maximum d'images</Label>
            <Select 
              value={String(block.content.maxImages || 5)} 
              onValueChange={(value) => onUpdate('maxImages', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 image</SelectItem>
                <SelectItem value="2">2 images</SelectItem>
                <SelectItem value="3">3 images</SelectItem>
                <SelectItem value="4">4 images</SelectItem>
                <SelectItem value="5">5 images</SelectItem>
                <SelectItem value="6">6 images</SelectItem>
                <SelectItem value="8">8 images</SelectItem>
                <SelectItem value="10">10 images</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="autoplayDelay">Délai de défilement (secondes)</Label>
            <Input
              id="autoplayDelay"
              type="number"
              min="1"
              max="10"
              value={block.content.autoplayDelay || 3}
              onChange={(e) => onUpdate('autoplayDelay', parseInt(e.target.value) || 3)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="autoplay"
              checked={block.content.autoplay !== false}
              onCheckedChange={(checked) => onUpdate('autoplay', checked)}
            />
            <Label htmlFor="autoplay">Défilement automatique</Label>
          </div>
        </>
      )}
      
      <div className="flex items-center space-x-2">
        <Switch
          id="showTitles"
          checked={block.content.showTitles || false}
          onCheckedChange={(checked) => onUpdate('showTitles', checked)}
        />
        <Label htmlFor="showTitles">Afficher les titres</Label>
      </div>
      
      <MediaSelector
        fieldKey="images"
        label="Ajouter une image"
        currentValue=""
        acceptedTypes="image/*"
        onMediaSelect={handleMediaSelect}
      />
      
      {images.length > 0 && (
        <div className="space-y-2">
          <Label>Images de la galerie ({images.length})</Label>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {images.map((imageUrl: string, index: number) => (
              <div key={index} className="relative group">
                <img 
                  src={imageUrl} 
                  alt={`Galerie ${index + 1}`}
                  className="w-full h-16 object-cover rounded border"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryEditor;
