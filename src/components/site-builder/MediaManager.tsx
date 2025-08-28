
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Image, Video, File, X } from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'file';
  size: number;
  isLocal: boolean;
}

interface MediaManagerProps {
  onSelectMedia: (url: string, type: 'image' | 'video' | 'file') => void;
  acceptedTypes?: string;
  title?: string;
}

const MediaManager = ({ 
  onSelectMedia, 
  acceptedTypes = "image/*,video/*",
  title = "Gestionnaire de médias" 
}: MediaManagerProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<MediaFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);

    try {
      const newFiles: MediaFile[] = [];
      
      for (const file of Array.from(files)) {
        // Convertir le fichier en base64 pour qu'il soit utilisable immédiatement
        const base64Url = await convertFileToBase64(file);
        const type: 'image' | 'video' | 'file' = file.type.startsWith('image/') ? 'image' : 
                     file.type.startsWith('video/') ? 'video' : 'file';
        
        const newFile: MediaFile = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          url: base64Url,
          type,
          size: file.size,
          isLocal: true
        };
        
        newFiles.push(newFile);
      }
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  const renderFilePreview = (file: MediaFile) => {
    if (file.type === 'image') {
      return (
        <img 
          src={file.url} 
          alt={file.name}
          className="w-8 h-8 object-cover rounded"
        />
      );
    } else if (file.type === 'video') {
      return (
        <video 
          src={file.url} 
          className="w-8 h-8 object-cover rounded"
          muted
        />
      );
    }
    return getFileIcon(file.type);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            type="file"
            multiple
            accept={acceptedTypes}
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Téléchargement...' : 'Télécharger des fichiers'}
          </Button>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Fichiers téléchargés ({uploadedFiles.length})</h4>
          {uploadedFiles.length === 0 ? (
            <p className="text-xs text-gray-500">Aucun fichier téléchargé</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 group"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {renderFilePreview(file)}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs truncate font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)} {file.isLocal && '• Local'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => onSelectMedia(file.url, file.type)}
                    >
                      <span className="text-xs">✓</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Images d'exemple</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
              'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
              'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
              'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'
            ].map((url, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-100 rounded cursor-pointer hover:opacity-80 relative overflow-hidden"
                onClick={() => onSelectMedia(url, 'image')}
              >
                <img 
                  src={url} 
                  alt={`Exemple ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaManager;
