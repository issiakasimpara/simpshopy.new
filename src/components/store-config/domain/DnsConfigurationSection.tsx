
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Copy, RefreshCw, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DnsConfigurationSectionProps {
  isDnsConfigured: boolean;
  isVerifying: boolean;
  onVerifyDomain: () => void;
}

const DnsConfigurationSection = ({ isDnsConfigured, isVerifying, onVerifyDomain }: DnsConfigurationSectionProps) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié",
      description: "L'information a été copiée dans le presse-papiers.",
    });
  };

  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Configuration DNS</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onVerifyDomain}
          disabled={isDnsConfigured || isVerifying}
        >
          {isVerifying ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Vérification...
            </>
          ) : isDnsConfigured ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              Vérifié
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 mr-2" />
              Vérifier
            </>
          )}
        </Button>
      </div>

      <Alert className={isDnsConfigured ? 'border-green-200 bg-green-50' : ''}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Pour connecter votre domaine, ajoutez ces enregistrements DNS chez votre registraire:
        </AlertDescription>
      </Alert>

      <div className="space-y-3">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Enregistrement CNAME (www)</Label>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => copyToClipboard('commerce-flow-proxy.vercel.app')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1 font-mono text-sm">
            <div><span className="text-gray-600">Type:</span> CNAME</div>
            <div><span className="text-gray-600">Nom:</span> www</div>
            <div><span className="text-gray-600">Valeur:</span> commerce-flow-proxy.vercel.app</div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Enregistrement A (racine)</Label>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => copyToClipboard('76.76.19.123')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1 font-mono text-sm">
            <div><span className="text-gray-600">Type:</span> A</div>
            <div><span className="text-gray-600">Nom:</span> @</div>
            <div><span className="text-gray-600">Valeur:</span> 76.76.19.123</div>
          </div>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          La propagation DNS peut prendre de 1 à 48 heures. Une fois configuré, 
          votre domaine pointera automatiquement vers votre boutique avec SSL activé.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DnsConfigurationSection;
