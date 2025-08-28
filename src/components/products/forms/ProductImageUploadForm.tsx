
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImagePlus, X, Upload, Link } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductImageUploadFormProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

const ProductImageUploadForm = ({ images, onImagesChange }: ProductImageUploadFormProps) => {
  const [urlInput, setUrlInput] = useState('');

  const addImageFromUrl = () => {
    if (urlInput.trim() && !images.includes(urlInput.trim())) {
      onImagesChange([...images, urlInput.trim()]);
      setUrlInput('');
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // En production, ici on uploadrait les fichiers vers un service de stockage
      // Pour la démo, on simule avec des URLs d'exemple
      const newImages = Array.from(files).map((file, index) => 
        `https://images.unsplash.com/photo-${1500000000000 + index}?w=400&h=400&fit=crop`
      );
      onImagesChange([...images, ...newImages]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImagePlus className="h-5 w-5" />
          Images du produit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">URL d'image</TabsTrigger>
            <TabsTrigger value="upload">Upload de fichier</TabsTrigger>
          </TabsList>
          
          <TabsContent value="url" className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="imageUrl">URL de l'image</Label>
                <Input
                  id="imageUrl"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://exemple.com/image.jpg"
                  onKeyPress={(e) => e.key === 'Enter' && addImageFromUrl()}
                />
              </div>
              <Button 
                type="button" 
                onClick={addImageFromUrl}
                disabled={!urlInput.trim()}
                className="mt-6"
              >
                <Link className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div>
              <Label htmlFor="fileUpload">Sélectionner des fichiers</Label>
              <Input
                id="fileUpload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Formats acceptés: JPG, PNG, GIF. Taille max: 5MB par image.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Aperçu des images */}
        {images.length > 0 && (
          <div>
            <Label>Aperçu des images ({images.length})</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                    <img 
                      src={image} 
                      alt={`Produit ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop';
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  {index === 0 && (
                    <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      Principal
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              💡 La première image sera utilisée comme image principale du produit.
            </p>
          </div>
        )}

        {images.length === 0 && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <ImagePlus className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">Aucune image ajoutée</p>
            <p className="text-sm text-gray-500">
              Ajoutez des images pour améliorer la présentation de votre produit
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductImageUploadForm;
