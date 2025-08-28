
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Info } from 'lucide-react';

interface CustomDomainFormProps {
  customDomain: string;
  setCustomDomain: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isUpdating: boolean;
}

const CustomDomainForm = ({ customDomain, setCustomDomain, onSubmit, isUpdating }: CustomDomainFormProps) => {
  return (
    <div className="space-y-6">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>SSL Automatique inclus :</strong> Une fois votre domaine connecté et vérifié, 
          nous provisionnerons automatiquement un certificat SSL gratuit de Let's Encrypt 
          pour sécuriser votre site.
        </AlertDescription>
      </Alert>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Vous devez d'abord acheter un nom de domaine chez un registraire (ex: OVH, Gandi, Namecheap) 
          avant de pouvoir le connecter à votre boutique.
        </AlertDescription>
      </Alert>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="custom-domain">Nom de domaine</Label>
          <Input
            id="custom-domain"
            type="text"
            placeholder="exemple: ma-boutique.com"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            className="font-mono"
          />
          <p className="text-xs text-gray-500">
            Entrez votre nom de domaine sans le protocole (https://)
          </p>
        </div>

        <Button type="submit" disabled={!customDomain.trim() || isUpdating}>
          {isUpdating ? 'Sauvegarde...' : 'Sauvegarder le domaine'}
        </Button>
      </form>
    </div>
  );
};

export default CustomDomainForm;
