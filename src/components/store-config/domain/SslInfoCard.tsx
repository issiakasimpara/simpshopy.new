
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CheckCircle } from 'lucide-react';

const SslInfoCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Sécurité SSL Automatique
        </CardTitle>
        <CardDescription>
          Protection et confiance pour vos clients
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900">Provisioning automatique</h4>
              <p className="text-sm text-green-700">
                Certificats SSL gratuits de Let's Encrypt générés automatiquement
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900">Renouvellement automatique</h4>
              <p className="text-sm text-green-700">
                Aucune action requise, vos certificats se renouvellent automatiquement
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900">Redirection HTTPS</h4>
              <p className="text-sm text-green-700">
                Tout le trafic HTTP est automatiquement redirigé vers HTTPS
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SslInfoCard;
