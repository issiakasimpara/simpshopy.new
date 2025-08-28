import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Globe, 
  Plus, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Star,
  ExternalLink,
  Copy,
  AlertCircle
} from 'lucide-react';
import { useStoreDomains, type StoreDomain } from '@/hooks/useDomains';
import { useToast } from '@/hooks/use-toast';

interface DomainManagerProps {
  storeId: string;
  storeSlug: string;
}

const DomainManager: React.FC<DomainManagerProps> = ({ storeId, storeSlug }) => {
  const [newDomain, setNewDomain] = useState('');
  const [isAddingDomain, setIsAddingDomain] = useState(false);
  const { toast } = useToast();

  const {
    domains,
    isLoading,
    addCustomDomain,
    deleteDomain,
    setPrimaryDomain,
    verifyDomain,
    isAddingDomain: isAdding,
    isDeletingDomain,
    isVerifyingDomain
  } = useStoreDomains(storeId);

  const defaultSubdomain = `${storeSlug}.simpshopy.com`;

  const handleAddDomain = async () => {
    if (!newDomain.trim()) {
      toast({
        title: "Domaine requis",
        description: "Veuillez saisir un nom de domaine.",
        variant: "destructive"
      });
      return;
    }

    setIsAddingDomain(true);
    try {
      await addCustomDomain({ storeId, domainName: newDomain });
      setNewDomain('');
    } finally {
      setIsAddingDomain(false);
    }
  };

  const handleCopyDomain = (domain: string) => {
    navigator.clipboard.writeText(`https://${domain}`);
    toast({
      title: "Lien copié !",
      description: "Le lien de votre boutique a été copié dans le presse-papiers.",
    });
  };

  const getStatusIcon = (domain: StoreDomain) => {
    if (domain.domain_type === 'subdomain') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }

    switch (domain.verification_status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (domain: StoreDomain) => {
    if (domain.domain_type === 'subdomain') {
      return 'Actif';
    }

    switch (domain.verification_status) {
      case 'verified':
        return 'Vérifié';
      case 'pending':
        return 'En attente';
      case 'failed':
        return 'Échec';
      default:
        return 'Inconnu';
    }
  };

  const getStatusColor = (domain: StoreDomain) => {
    if (domain.domain_type === 'subdomain') {
      return 'bg-green-100 text-green-800';
    }

    switch (domain.verification_status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Domaines de votre boutique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Domaines de votre boutique
        </CardTitle>
        <p className="text-sm text-gray-600">
          Gérez les domaines de votre boutique. Commencez avec un sous-domaine gratuit, puis ajoutez votre domaine personnalisé.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Domaine par défaut (sous-domaine) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {getStatusIcon({ domain_type: 'subdomain', verification_status: 'verified' } as StoreDomain)}
                <Badge className={getStatusColor({ domain_type: 'subdomain', verification_status: 'verified' } as StoreDomain)}>
                  {getStatusText({ domain_type: 'subdomain', verification_status: 'verified' } as StoreDomain)}
                </Badge>
              </div>
              <div>
                <div className="font-medium">{defaultSubdomain}</div>
                <div className="text-sm text-gray-600">Domaine par défaut (gratuit)</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyDomain(defaultSubdomain)}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copier
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://${defaultSubdomain}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Voir
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Domaines personnalisés */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Domaines personnalisés</h3>
            <Badge variant="outline" className="text-xs">
              {domains.filter(d => d.domain_type === 'custom').length} domaine(s)
            </Badge>
          </div>

          {/* Liste des domaines personnalisés */}
          {domains
            .filter(domain => domain.domain_type === 'custom')
            .map(domain => (
              <div key={domain.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(domain)}
                    <Badge className={getStatusColor(domain)}>
                      {getStatusText(domain)}
                    </Badge>
                    {domain.is_primary && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        <Star className="h-3 w-3 mr-1" />
                        Principal
                      </Badge>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{domain.domain_name}</div>
                    <div className="text-sm text-gray-600">
                      {domain.verification_status === 'pending' && 'Vérification en cours...'}
                      {domain.verification_status === 'failed' && 'Configuration DNS requise'}
                      {domain.verification_status === 'verified' && 'Domaine actif'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {domain.verification_status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => verifyDomain(domain.id)}
                      disabled={isVerifyingDomain}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Vérifier
                    </Button>
                  )}
                  {domain.verification_status === 'verified' && !domain.is_primary && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPrimaryDomain({ storeId, domainId: domain.id })}
                    >
                      <Star className="h-4 w-4 mr-1" />
                      Principal
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://${domain.domain_name}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteDomain(domain.id)}
                    disabled={isDeletingDomain}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}

          {/* Formulaire d'ajout */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <Label htmlFor="new-domain" className="text-sm font-medium">
              Ajouter un domaine personnalisé
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="new-domain"
                placeholder="mon-domaine.com"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddDomain()}
              />
              <Button
                onClick={handleAddDomain}
                disabled={isAdding || !newDomain.trim()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Entrez votre nom de domaine sans http:// ou www
            </p>
          </div>
        </div>

        {/* Instructions pour les domaines personnalisés */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Configuration DNS requise</h4>
          <p className="text-sm text-blue-800 mb-3">
            Pour que votre domaine personnalisé fonctionne, vous devez configurer les enregistrements DNS :
          </p>
          <div className="text-xs text-blue-700 space-y-1">
            <div><strong>CNAME :</strong> www → simpshopy.com</div>
            <div><strong>OU A Record :</strong> @ → [IP de SimpShopy]</div>
            <div><strong>OU A Record :</strong> www → [IP de SimpShopy]</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DomainManager; 