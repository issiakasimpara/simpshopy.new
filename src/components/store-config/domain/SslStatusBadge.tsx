
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, AlertCircle } from 'lucide-react';

interface SslStatusBadgeProps {
  sslStatus: 'pending' | 'active' | 'error' | 'provisioning';
}

const SslStatusBadge = ({ sslStatus }: SslStatusBadgeProps) => {
  switch (sslStatus) {
    case 'active':
      return (
        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
          <Shield className="h-3 w-3 mr-1" />
          SSL Actif
        </Badge>
      );
    case 'provisioning':
      return (
        <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
          <Clock className="h-3 w-3 mr-1" />
          SSL en cours
        </Badge>
      );
    case 'error':
      return (
        <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
          <AlertCircle className="h-3 w-3 mr-1" />
          SSL Erreur
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-gray-600 border-gray-200 bg-gray-50">
          <Clock className="h-3 w-3 mr-1" />
          SSL Inactif
        </Badge>
      );
  }
};

export default SslStatusBadge;
