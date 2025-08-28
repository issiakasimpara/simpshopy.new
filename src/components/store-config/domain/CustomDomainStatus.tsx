
import React from 'react';
import { Shield } from 'lucide-react';
import SslStatusBadge from './SslStatusBadge';

interface CustomDomainStatusProps {
  customDomain: string;
  isDnsConfigured: boolean;
  sslStatus: 'pending' | 'active' | 'error' | 'provisioning';
}

const CustomDomainStatus = ({ customDomain, isDnsConfigured, sslStatus }: CustomDomainStatusProps) => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isDnsConfigured ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <div>
            <p className="font-medium text-gray-900">
              {customDomain}
            </p>
            <p className="text-sm text-gray-600">
              {isDnsConfigured ? 'Connecté et actif' : 'En attente de configuration DNS'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SslStatusBadge sslStatus={sslStatus} />
        </div>
      </div>
      
      {isDnsConfigured && (
        <div className="mt-4 p-3 bg-white rounded border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="font-medium text-sm">Sécurité SSL</span>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            {sslStatus === 'active' && (
              <>
                <p>✅ Certificat SSL actif et valide</p>
                <p>✅ Connexions sécurisées (HTTPS)</p>
                <p>✅ Renouvellement automatique</p>
              </>
            )}
            {sslStatus === 'provisioning' && (
              <>
                <p>🔄 Provisioning du certificat SSL en cours...</p>
                <p>⏱️ Délai habituel: 2-5 minutes</p>
              </>
            )}
            {sslStatus === 'pending' && (
              <p>⏳ SSL sera activé après vérification du domaine</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDomainStatus;
