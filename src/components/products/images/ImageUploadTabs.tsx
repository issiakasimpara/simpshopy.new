
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Link } from 'lucide-react';

interface ImageUploadTabsProps {
  onImagesAdd: (images: string[]) => void;
  isUploading: boolean;
  onUploadingChange: (isUploading: boolean) => void;
}

const ImageUploadTabs = ({ onImagesAdd, isUploading, onUploadingChange }: ImageUploadTabsProps) => {
  const [urlInput, setUrlInput] = useState('');

  const addImageFromUrl = () => {
    if (urlInput.trim()) {
      onImagesAdd([urlInput.trim()]);
      setUrlInput('');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    onUploadingChange(true);

    try {
      const filePromises = Array.from(files).map((file) => {
        return new Promise<string>((resolve, reject) => {
          if (!file.type.startsWith('image/')) {
            reject(new Error('Le fichier doit être une image'));
            return;
          }

          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              resolve(e.target.result as string);
            } else {
              reject(new Error('Erreur lors de la lecture du fichier'));
            }
          };
          reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
          reader.readAsDataURL(file);
        });
      });

      const newImageUrls = await Promise.all(filePromises);
      onImagesAdd(newImageUrls);

      // Reset l'input
      event.target.value = '';
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
    } finally {
      onUploadingChange(false);
    }
  };

  return (
    <Tabs defaultValue="url" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="url" className="flex items-center gap-2">
          <Link className="h-4 w-4" />
          URL d'image
        </TabsTrigger>
        <TabsTrigger value="upload" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload fichiers
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="url" className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://exemple.com/image.jpg"
            onKeyPress={(e) => e.key === 'Enter' && addImageFromUrl()}
          />
          <Button 
            type="button" 
            onClick={addImageFromUrl}
            disabled={!urlInput.trim()}
          >
            Ajouter
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Collez l'URL d'une image accessible en ligne
        </p>
      </TabsContent>
      
      <TabsContent value="upload" className="space-y-4">
        <div>
          <Label htmlFor="fileUpload" className="cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-1">
                {isUploading ? 'Upload en cours...' : 'Cliquez pour sélectionner des images'}
              </p>
              <p className="text-xs text-gray-500">
                Formats: JPG, PNG, GIF - Max 5MB par image
              </p>
            </div>
          </Label>
          <Input
            id="fileUpload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ImageUploadTabs;
