import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, ExternalLink, Copy, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { generateSimpshopyUrl, generateStorePath } from '@/utils/domainUtils';

interface StoreUrlDisplayProps {
  storeName: string;
  isTemporary?: boolean;
}

const StoreUrlDisplay = ({ storeName, isTemporary = true }: StoreUrlDisplayProps) => {
  const { toast } = useToast();
  const storeUrl = generateSimpshopyUrl(storeName);
  const storePath = generateStorePath(storeName);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: "L'URL a été copiée dans le presse-papiers.",
    });
  };

  const openStore = () => {
    window.open(storeUrl, '_blank');
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-600" />
          URL de votre boutique
          {isTemporary && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              Temporaire
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {isTemporary 
            ? "URL temporaire en attendant votre domaine personnalisé"
            : "URL permanente de votre boutique"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isTemporary && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <Info className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Système temporaire :</strong> Cette URL utilise un système de paths. 
              Quand vous achèterez votre domaine, elle deviendra <code className="bg-yellow-100 px-1 rounded">{storeName.toLowerCase().replace(/\s+/g, '-')}.simpshopy.com</code>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="font-medium text-gray-900 break-all">{storeUrl}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-600">Boutique active</p>
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                  ✓ En ligne
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => copyToClipboard(storeUrl)}
              className="hover:bg-blue-100"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copier
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={openStore}
              className="hover:bg-blue-100"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visiter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-1">Path de la boutique</h4>
            <code className="text-blue-600 bg-white px-2 py-1 rounded border">{storePath}</code>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-1">Format futur</h4>
            <code className="text-purple-600 bg-white px-2 py-1 rounded border">
              {storeName.toLowerCase().replace(/\s+/g, '-')}.simpshopy.com
            </code>
          </div>
        </div>

        {isTemporary && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">🚀 Prochaines étapes</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Partagez cette URL temporaire avec vos clients</li>
              <li>• Achetez le domaine <strong>simpshopy.com</strong> pour les sous-domaines</li>
              <li>• Configurez votre domaine personnalisé dans les paramètres</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StoreUrlDisplay;
