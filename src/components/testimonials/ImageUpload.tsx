// 📸 COMPOSANT D'UPLOAD D'IMAGES POUR TÉMOIGNAGES
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  maxSizeInMB?: number;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 3,
  maxSizeInMB = 5,
  className = ""
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    // Vérifier le nombre maximum d'images
    if (images.length + files.length > maxImages) {
      toast({
        title: "Trop d'images",
        description: `Vous ne pouvez ajouter que ${maxImages} images maximum.`,
        variant: "destructive",
      });
      return;
    }

    // Vérifier les types de fichiers
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Format non supporté",
        description: "Seuls les formats JPG, PNG et WebP sont acceptés.",
        variant: "destructive",
      });
      return;
    }

    // Vérifier la taille des fichiers
    const oversizedFiles = files.filter(file => file.size > maxSizeInMB * 1024 * 1024);
    
    if (oversizedFiles.length > 0) {
      toast({
        title: "Fichier trop volumineux",
        description: `Les images doivent faire moins de ${maxSizeInMB}MB.`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = files.map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `testimonial-${Date.now()}-${index}.${fileExt}`;
        const filePath = `testimonials/${fileName}`;

        // Simuler le progrès d'upload
        const progressKey = `${file.name}-${index}`;
        setUploadProgress(prev => ({ ...prev, [progressKey]: 0 }));

        const { data, error } = await supabase.storage
          .from('testimonials')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Erreur upload:', error);

          // Message d'erreur spécifique selon le type d'erreur
          if (error.message.includes('Bucket not found')) {
            throw new Error('Le système de stockage d\'images n\'est pas configuré. Contactez l\'administrateur.');
          } else if (error.message.includes('File size')) {
            throw new Error('Le fichier est trop volumineux.');
          } else {
            throw new Error('Erreur lors de l\'upload: ' + error.message);
          }
        }

        // Obtenir l'URL publique
        const { data: { publicUrl } } = supabase.storage
          .from('testimonials')
          .getPublicUrl(filePath);

        setUploadProgress(prev => ({ ...prev, [progressKey]: 100 }));
        
        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedUrls];
      onImagesChange(newImages);

      toast({
        title: "Images ajoutées !",
        description: `${files.length} image(s) ajoutée(s) avec succès.`,
      });

    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      const errorMessage = error instanceof Error ? error.message : "Impossible d'uploader les images. Veuillez réessayer.";

      toast({
        title: "Erreur d'upload",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress({});
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onImagesChange(newImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <Label className="text-sm font-medium text-gray-700 mb-2 block">
        Images (optionnel) - {images.length}/{maxImages}
      </Label>
      
      {/* Zone d'upload */}
      <div className="space-y-3">
        {/* Bouton d'ajout */}
        {images.length < maxImages && (
          <Card 
            className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
            onClick={openFileDialog}
          >
            <div className="p-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-gray-100 rounded-full">
                  <Upload className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Cliquez pour ajouter des images
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG ou WebP • Max {maxSizeInMB}MB • {maxImages - images.length} restante(s)
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Input file caché */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        {/* Aperçu des images */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <Card className="overflow-hidden">
                  <div className="aspect-square relative">
                    <img
                      src={imageUrl}
                      alt={`Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback en cas d'erreur de chargement
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiAxNkM5Ljc5IDEzLjc5IDkuNzkgMTAuMjEgMTIgOEMxNC4yMSAxMC4yMSAxNC4yMSAxMy43OSAxMiAxNloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                      }}
                    />
                    
                    {/* Bouton de suppression */}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>

                    {/* Indicateur de chargement */}
                    {isUploading && Object.keys(uploadProgress).length > 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-white text-xs">Upload...</div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}

        {/* Message d'aide */}
        {images.length === 0 && (
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span>
              Ajoutez des images pour illustrer votre expérience (optionnel)
            </span>
          </div>
        )}

        {/* Indicateur de chargement global */}
        {isUploading && (
          <div className="text-center py-2">
            <div className="inline-flex items-center gap-2 text-sm text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Upload en cours...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
