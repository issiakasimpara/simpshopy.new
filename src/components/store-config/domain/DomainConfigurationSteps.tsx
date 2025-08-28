
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertTriangle, Info, ExternalLink, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NameserverInstructions from './NameserverInstructions';

interface DomainConfigurationStepsProps {
  domain: any;
  onRetry?: () => void;
}

const DomainConfigurationSteps = ({ domain, onRetry }: DomainConfigurationStepsProps) => {
  const { toast } = useToast();

  const getStepStatus = (step: string) => {
    if (!domain) return 'pending';
    
    switch (step) {
      case 'zone':
        return domain.cloudflare_zone_id ? 'completed' : 'pending';
      case 'nameservers':
        return domain.status === 'active' ? 'completed' : 
               domain.status === 'verifying' ? 'in-progress' : 'pending';
      case 'ssl':
        return domain.ssl_status === 'active' ? 'completed' : 
               domain.ssl_status === 'provisioning' ? 'in-progress' : 'pending';
      default:
        return 'pending';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">✓ Terminé</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">⏳ En cours</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">❌ Erreur</Badge>;
      default:
        return <Badge variant="outline">⏸ En attente</Badge>;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: `${text} copié dans le presse-papiers.`,
    });
  };

  const nameservers = [
    'alba.ns.cloudflare.com',
    'rene.ns.cloudflare.com'
  ];

  const steps = [
    {
      id: 'zone',
      title: 'Création de la zone Cloudflare',
      description: 'Configuration automatique de la zone DNS',
      status: getStepStatus('zone')
    },
    {
      id: 'nameservers',
      title: 'Configuration des serveurs de noms',
      description: 'Vous devez pointer vos serveurs de noms vers Cloudflare',
      status: getStepStatus('nameservers'),
      action: true
    },
    {
      id: 'ssl',
      title: 'Activation du certificat SSL',
      description: 'Génération automatique du certificat HTTPS',
      status: getStepStatus('ssl')
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            Étapes de configuration pour {domain?.domain_name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(step.status)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium">{step.title}</h3>
                  {getStatusBadge(step.status)}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
              </div>
            </div>
          ))}

          {/* Serveurs de noms à configurer - toujours visible pour clarté */}
          <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg">
            <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Serveurs de noms à configurer chez votre registraire :
            </h4>
            <div className="space-y-2">
              {nameservers.map((ns, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-3 rounded border border-orange-200">
                  <div className="font-mono text-sm font-medium text-orange-800">{ns}</div>
                  <button 
                    onClick={() => copyToClipboard(ns)}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
                  >
                    <Copy className="h-3 w-3" />
                    Copier
                  </button>
                </div>
              ))}
            </div>
            <p className="text-sm text-orange-700 mt-3 font-medium">
              ⚠️ Remplacez TOUS vos serveurs de noms actuels par ces deux serveurs Cloudflare
            </p>
          </div>

          {/* Message d'erreur si présent */}
          {domain?.error_message && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Erreur :</strong> {domain.error_message}
              </AlertDescription>
            </Alert>
          )}

          {/* Message de succès */}
          {domain?.status === 'active' && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                <strong>🎉 Configuration terminée !</strong> Votre domaine {domain.domain_name} est 
                maintenant actif avec SSL. Il peut y avoir un délai de propagation de 5-10 minutes.
              </AlertDescription>
            </Alert>
          )}

          {/* Debug info pour diagnostiquer */}
          <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
            <strong>Debug info :</strong><br/>
            Statut: {domain?.status} | SSL: {domain?.ssl_status} | Zone ID: {domain?.cloudflare_zone_id ? '✓' : '✗'}
            <br/>
            Dernière vérification: {domain?.last_verified_at ? new Date(domain.last_verified_at).toLocaleString('fr-FR') : 'Jamais'}
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <a 
              href="https://dash.cloudflare.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="h-4 w-4" />
              Ouvrir Cloudflare Dashboard
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Instructions détaillées pour les serveurs de noms */}
      {domain && getStepStatus('nameservers') !== 'completed' && (
        <NameserverInstructions domain={domain} />
      )}
    </div>
  );
};

export default DomainConfigurationSteps;
