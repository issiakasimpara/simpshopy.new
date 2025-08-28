
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NameserverInstructionsProps {
  domain: any;
}

const NameserverInstructions = ({ domain }: NameserverInstructionsProps) => {
  const { toast } = useToast();

  const nameservers = [
    'alba.ns.cloudflare.com',
    'rene.ns.cloudflare.com'
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: `${text} copié dans le presse-papiers.`,
    });
  };

  const registrars = [
    {
      name: 'OVH',
      flag: '🇫🇷',
      url: 'https://www.ovh.com/manager/',
      steps: [
        'Connectez-vous à votre espace client OVH',
        'Allez dans "Web Cloud" → "Noms de domaine"',
        'Cliquez sur votre domaine',
        'Onglet "Serveurs DNS"',
        'Cliquez sur "Modifier les serveurs DNS"',
        'Sélectionnez "Utiliser des serveurs DNS externes"',
        'Supprimez les anciens serveurs et ajoutez les serveurs Cloudflare'
      ]
    },
    {
      name: 'Gandi',
      flag: '🇫🇷',
      url: 'https://www.gandi.net/',
      steps: [
        'Connectez-vous à votre compte Gandi',
        'Allez dans "Domaines" → votre domaine',
        'Section "Serveurs de noms"',
        'Cliquez sur "Modifier"',
        'Sélectionnez "Serveurs de noms externes"',
        'Remplacez par les serveurs Cloudflare'
      ]
    },
    {
      name: 'Namecheap',
      flag: '🌍',
      url: 'https://ap.www.namecheap.com/',
      steps: [
        'Login to your Namecheap account',
        'Go to "Domain List" → "Manage" next to your domain',
        'Find "Nameservers" section',
        'Select "Custom DNS"',
        'Replace with Cloudflare nameservers'
      ]
    },
    {
      name: 'GoDaddy',
      flag: '🌍',
      url: 'https://account.godaddy.com/',
      steps: [
        'Login to your GoDaddy account',
        'Go to "My Products" → "All Products and Services"',
        'Find your domain and click "DNS"',
        'Scroll to "Nameservers" section',
        'Click "Change" and select "Custom"',
        'Add Cloudflare nameservers'
      ]
    },
    {
      name: 'Cloudflare',
      flag: '🌍',
      url: 'https://dash.cloudflare.com/',
      steps: [
        'Si votre domaine est déjà chez Cloudflare',
        'Allez dans votre tableau de bord Cloudflare',
        'Sélectionnez votre domaine',
        'Vérifiez que le statut est "Active"',
        'Si pas actif, suivez les instructions Cloudflare'
      ]
    }
  ];

  return (
    <Card className="border-l-4 border-l-orange-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          Configuration requise chez votre registraire
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-orange-50 border-orange-200">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Action requise :</strong> Vous devez configurer les serveurs de noms 
            chez votre <strong>registraire</strong> (là où vous avez acheté le domaine), 
            pas dans Cloudflare.
          </AlertDescription>
        </Alert>

        {/* Serveurs de noms à configurer */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-lg mb-4 text-blue-900">
            Serveurs de noms à configurer :
          </h3>
          <div className="space-y-3">
            {nameservers.map((ns, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                <div className="font-mono text-sm font-medium">{ns}</div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(ns)}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copier
                </Button>
              </div>
            ))}
          </div>
          <p className="text-sm text-blue-700 mt-3">
            <strong>Important :</strong> Remplacez TOUS les serveurs de noms existants par ces deux serveurs Cloudflare.
          </p>
        </div>

        {/* Instructions par registraire */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Instructions par registraire :</h3>
          
          {registrars.map((registrar) => (
            <div key={registrar.name} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{registrar.flag}</span>
                  <h4 className="font-medium text-lg">{registrar.name}</h4>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href={registrar.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Ouvrir
                  </a>
                </Button>
              </div>
              
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                {registrar.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        {/* Note sur la propagation */}
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            <strong>Après configuration :</strong> La propagation DNS prend généralement 
            5 minutes à 24 heures. Cloudflare détectera automatiquement le changement 
            et activera votre domaine.
          </AlertDescription>
        </Alert>

        {/* Aide supplémentaire */}
        <div className="text-center pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-2">
            Votre registraire n'est pas dans la liste ?
          </p>
          <p className="text-xs text-muted-foreground">
            Cherchez "Serveurs de noms", "Nameservers", ou "DNS" dans votre interface 
            et remplacez par les serveurs Cloudflare ci-dessus.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NameserverInstructions;
