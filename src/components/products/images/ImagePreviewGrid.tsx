
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Star } from 'lucide-react';

interface ImagePreviewGridProps {
  images: string[];
  onRemoveImage: (index: number) => void;
  onSetAsMainImage: (index: number) => void;
}

const ImagePreviewGrid = ({ images, onRemoveImage, onSetAsMainImage }: ImagePreviewGridProps) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Images ajoutées ({images.length})</Label>
        <Badge variant="outline">
          {images.length === 1 ? '1 image' : `${images.length} images`}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <Card key={index} className="relative group overflow-hidden">
            <CardContent className="p-2">
              <div className="aspect-square relative">
                <img
                  src={image}
                  alt={`Image ${index + 1} du produit - ${images.length} image${images.length > 1 ? 's' : ''} disponible${images.length > 1 ? 's' : ''}`}
                  className="w-full h-full object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop';
                  }}
                />
                
                {/* Badge image principale */}
                {index === 0 && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-blue-600 text-white text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Principale
                    </Badge>
                  </div>
                )}
                
                {/* Boutons d'action */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  {index !== 0 && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => onSetAsMainImage(index)}
                      className="h-6 w-6 p-0"
                      title="Définir comme image principale"
                    >
                      <Star className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemoveImage(index)}
                    className="h-6 w-6 p-0"
                    title="Supprimer l'image"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                {/* Numéro d'ordre */}
                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary" className="text-xs">
                    {index + 1}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-xs text-muted-foreground space-y-1">
        <p>💡 La première image sera utilisée comme image principale du produit.</p>
        <p>⭐ Cliquez sur l'étoile pour définir une autre image comme principale.</p>
      </div>
    </div>
  );
};

export default ImagePreviewGrid;
