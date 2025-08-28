
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Info, ExternalLink, HelpCircle } from 'lucide-react';

const DomainSetupGuide = () => {
  const registrars = [
    {
      name: 'OVH',
      flag: '🇫🇷',
      steps: [
        'Connectez-vous à votre espace client OVH',
        'Allez dans "Domaines" → votre domaine',
        'Cliquez sur "Serveurs DNS"',
        'Sélectionnez "Utiliser des serveurs DNS externes"',
        'Entrez les serveurs DNS Cloudflare'
      ],
      url: 'https://www.ovh.com'
    },
    {
      name: 'Gandi',
      flag: '🇫🇷', 
      steps: [
        'Connectez-vous à votre compte Gandi',
        'Allez dans "Domaines" → votre domaine',
        'Cliquez sur "Serveurs de noms"',
        'Changez pour "Serveurs de noms externes"',
        'Ajoutez les serveurs DNS Cloudflare'
      ],
      url: 'https://www.gandi.net'
    },
    {
      name: 'Namecheap',
      flag: '🌍',
      steps: [
        'Login to Namecheap account',
        'Go to Domain List → Manage',
        'Find "Nameservers" section',
        'Select "Custom DNS"',
        'Add Cloudflare nameservers'
      ],
      url: 'https://www.namecheap.com'
    },
    {
      name: 'GoDaddy',
      flag: '🌍',
      steps: [
        'Login to GoDaddy account',
        'Go to My Products → Domains',
        'Click DNS next to your domain',
        'Change nameservers to Cloudflare',
        'Save changes'
      ],
      url: 'https://www.godaddy.com'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-purple-600" />
          Guide de configuration par registraire
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Temps de propagation :</strong> Après avoir changé les serveurs de noms, 
            la propagation peut prendre de 5 minutes à 48 heures selon votre registraire.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4">
          {registrars.map((registrar) => (
            <div key={registrar.name} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{registrar.flag}</span>
                  <h3 className="font-medium">{registrar.name}</h3>
                </div>
                <a 
                  href={registrar.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="h-3 w-3" />
                  Ouvrir
                </a>
              </div>
              
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                {registrar.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            <strong>Astuce :</strong> Une fois les serveurs de noms changés, vous pouvez cliquer 
            sur "Vérifier" dans la configuration du domaine pour forcer une nouvelle vérification.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default DomainSetupGuide;
