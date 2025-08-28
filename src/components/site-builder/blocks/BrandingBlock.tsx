import React from 'react';
import { TemplateBlock } from '@/types/template';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Image, Globe } from 'lucide-react';

interface BrandingBlockProps {
  block: TemplateBlock;
  isEditing?: boolean;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
  onUpdate?: (block: TemplateBlock) => void;
}

const BrandingBlock = ({ 
  block, 
  isEditing, 
  viewMode = 'desktop',
  onUpdate 
}: BrandingBlockProps) => {
  
  const getResponsiveClasses = () => {
    switch (viewMode) {
      case 'mobile':
        return 'px-4 py-8';
      case 'tablet':
        return 'px-6 py-12';
      default:
        return 'px-8 py-16';
    }
  };

  // En mode édition, afficher un aperçu des éléments de branding
  if (isEditing) {
    return (
      <section 
        className={`${getResponsiveClasses()}`}
        style={{ backgroundColor: block.styles?.backgroundColor || '#f8fafc' }}
      >
        <div className="container mx-auto">
          <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Building2 className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-xl text-blue-800">
                  Configuration de la marque
                </CardTitle>
              </div>
              <p className="text-sm text-blue-600">
                Gérez le logo, favicon et autres éléments de votre marque
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Aperçu du logo */}
              <div className="text-center">
                <h3 className="font-semibold mb-3 flex items-center justify-center gap-2">
                  <Image className="h-4 w-4" />
                  Logo principal
                </h3>
                {block.content.logo ? (
                  <div className="inline-block p-4 bg-white rounded-lg shadow-sm border">
                    <img 
                      src={block.content.logo} 
                      alt="Logo" 
                      className="max-h-16 max-w-48 object-contain"
                    />
                  </div>
                ) : (
                  <div className="inline-block p-8 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                    <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Aucun logo configuré</p>
                  </div>
                )}
              </div>

              {/* Aperçu du favicon */}
              <div className="text-center">
                <h3 className="font-semibold mb-3 flex items-center justify-center gap-2">
                  <Globe className="h-4 w-4" />
                  Favicon
                </h3>
                {block.content.favicon ? (
                  <div className="inline-block p-2 bg-white rounded border">
                    <img 
                      src={block.content.favicon} 
                      alt="Favicon" 
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                ) : (
                  <div className="inline-block p-4 bg-gray-100 rounded border-2 border-dashed border-gray-300">
                    <Globe className="h-6 w-6 text-gray-400 mx-auto" />
                    <p className="text-xs text-gray-500 mt-1">Aucun favicon</p>
                  </div>
                )}
              </div>

              {/* Informations de la marque */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-3 rounded border">
                  <strong>Nom de la marque:</strong>
                  <p className="text-gray-600 mt-1">
                    {block.content.brandName || 'Non défini'}
                  </p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <strong>Slogan:</strong>
                  <p className="text-gray-600 mt-1">
                    {block.content.tagline || 'Non défini'}
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Badge variant="outline" className="text-blue-600 border-blue-300">
                  Configurez ces éléments dans le panneau de droite
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  // En mode public, ce bloc n'affiche rien (les éléments sont utilisés ailleurs)
  // Le logo apparaîtra dans la navigation, le favicon dans l'onglet, etc.
  return null;
};

export default BrandingBlock;
