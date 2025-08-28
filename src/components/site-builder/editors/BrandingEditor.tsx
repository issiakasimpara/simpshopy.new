import React, { useState } from 'react';
import { TemplateBlock } from '@/types/template';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X, Image, Globe, Building2, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface BrandingEditorProps {
  block: TemplateBlock;
  onUpdate: (key: string, value: any) => void;
}

const BrandingEditor = ({ block, onUpdate }: BrandingEditorProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File, type: 'logo' | 'favicon') => {
    if (!file) return;

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Format non supporté",
        description: "Veuillez utiliser un fichier JPG, PNG, GIF ou WebP.",
        variant: "destructive"
      });
      return;
    }

    // Vérifier la taille (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale autorisée est de 5MB.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Convertir en base64 pour stockage temporaire
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log(`📁 Upload ${type}:`, result.substring(0, 50) + '...');

        onUpdate(type, result);

        toast({
          title: "Image uploadée",
          description: `${type === 'logo' ? 'Logo' : 'Favicon'} mis à jour avec succès.`,
        });

        setIsUploading(false);
      };

      reader.onerror = () => {
        console.error('Erreur lecture fichier');
        toast({
          title: "Erreur de lecture",
          description: "Impossible de lire le fichier. Réessayez.",
          variant: "destructive"
        });
        setIsUploading(false);
      };

      reader.readAsDataURL(file);

      // Pour le favicon, afficher un conseil après upload
      if (type === 'favicon') {
        setTimeout(() => {
          toast({
            title: "Conseil favicon",
            description: "Pour de meilleurs résultats, utilisez une image carrée (32x32 ou 64x64 pixels).",
            variant: "default"
          });
        }, 1000);
      }

    } catch (error) {
      console.error('Erreur upload:', error);
      toast({
        title: "Erreur d'upload",
        description: "Impossible d'uploader l'image. Réessayez.",
        variant: "destructive"
      });
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (type: 'logo' | 'favicon') => {
    onUpdate(type, '');
    toast({
      title: "Image supprimée",
      description: `${type === 'logo' ? 'Logo' : 'Favicon'} supprimé.`,
    });
  };

  return (
    <div className="space-y-6 p-4">
      <div className="text-center mb-6">
        <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
        <h3 className="text-lg font-semibold">Configuration de la marque</h3>
        <p className="text-sm text-gray-600">
          Personnalisez l'identité visuelle de votre boutique
        </p>
      </div>

      {/* Logo principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Image className="h-4 w-4" />
            Logo principal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {block.content.logo ? (
            <div className="text-center">
              <div className="inline-block p-4 bg-gray-50 rounded-lg border">
                <img 
                  src={block.content.logo} 
                  alt="Logo actuel" 
                  className="max-h-20 max-w-full object-contain"
                />
              </div>
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveImage('logo')}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Image className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-3">Aucun logo configuré</p>
            </div>
          )}
          
          <div>
            <Label htmlFor="logo-upload">Choisir un logo</Label>
            <Input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'logo');
              }}
              disabled={isUploading}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Formats acceptés: JPG, PNG, GIF, WebP (max 5MB)
            </p>
          </div>

          {/* Position du logo */}
          {block.content.logo && (
            <div>
              <Label htmlFor="logoPosition">Position du logo</Label>
              <Select
                value={block.content.logoPosition || 'left'}
                onValueChange={(value) => onUpdate('logoPosition', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">
                    <div className="flex items-center gap-2">
                      <AlignLeft className="h-4 w-4" />
                      À gauche
                    </div>
                  </SelectItem>
                  <SelectItem value="center">
                    <div className="flex items-center gap-2">
                      <AlignCenter className="h-4 w-4" />
                      Au centre
                    </div>
                  </SelectItem>
                  <SelectItem value="right">
                    <div className="flex items-center gap-2">
                      <AlignRight className="h-4 w-4" />
                      À droite
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Position du logo dans la navigation
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Favicon */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="h-4 w-4" />
            Favicon
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {block.content.favicon ? (
            <div className="text-center">
              <div className="inline-block p-2 bg-gray-50 rounded border">
                <img 
                  src={block.content.favicon} 
                  alt="Favicon actuel" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveImage('favicon')}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
              <Globe className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Aucun favicon configuré</p>
            </div>
          )}
          
          <div>
            <Label htmlFor="favicon-upload">Choisir un favicon</Label>
            <Input
              id="favicon-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'favicon');
              }}
              disabled={isUploading}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommandé: image carrée 32x32 ou 64x64 pixels
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Informations de la marque */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informations de la marque</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="brandName">Nom de la marque</Label>
            <Input
              id="brandName"
              value={block.content.brandName || ''}
              onChange={(e) => onUpdate('brandName', e.target.value)}
              placeholder="Ma Super Boutique"
            />
          </div>
          
          <div>
            <Label htmlFor="tagline">Slogan / Tagline</Label>
            <Input
              id="tagline"
              value={block.content.tagline || ''}
              onChange={(e) => onUpdate('tagline', e.target.value)}
              placeholder="Votre slogan accrocheur"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description courte</Label>
            <Textarea
              id="description"
              value={block.content.description || ''}
              onChange={(e) => onUpdate('description', e.target.value)}
              placeholder="Description de votre boutique en quelques mots..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {isUploading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-blue-600">
            <Upload className="h-4 w-4 animate-spin" />
            Upload en cours...
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandingEditor;
