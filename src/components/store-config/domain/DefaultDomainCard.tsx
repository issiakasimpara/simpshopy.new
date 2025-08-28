
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, ExternalLink, Copy, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DefaultDomainCardProps {
  defaultDomain: string;
}

const DefaultDomainCard = ({ defaultDomain }: DefaultDomainCardProps) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié",
      description: "L'information a été copiée dans le presse-papiers.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-600" />
          Domaine par défaut
        </CardTitle>
        <CardDescription>
          Votre boutique est accessible via ce domaine Simpshopy avec SSL automatique
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium text-gray-900">{defaultDomain}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-600">Domaine gratuit - Actif</p>
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                  <Shield className="h-3 w-3 mr-1" />
                  SSL Automatique
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => copyToClipboard(`https://${defaultDomain}`)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copier
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={`https://${defaultDomain}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visiter
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DefaultDomainCard;
