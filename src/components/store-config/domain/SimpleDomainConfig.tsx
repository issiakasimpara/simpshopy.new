
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Globe, Copy, ExternalLink, Info, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateSimpshopySubdomain } from '@/utils/domainUtils';

interface SimpleDomainConfigProps {
  selectedStore: any;
}

const SimpleDomainConfig = ({ selectedStore }: SimpleDomainConfigProps) => {
  const [customDomain, setCustomDomain] = useState('');
  const [savedDomains, setSavedDomains] = useState<string[]>([]);
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: `${label} copié dans le presse-papiers.`,
    });
  };

  const handleSaveDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDomain.trim()) return;

    const domain = customDomain.trim().toLowerCase();
    if (!savedDomains.includes(domain)) {
      setSavedDomains([...savedDomains, domain]);
      toast({
        title: "Domaine ajouté !",
        description: `${domain} a été ajouté à votre liste.`,
      });
    }
    setCustomDomain('');
  };

  const removeDomain = (domain: string) => {
    setSavedDomains(savedDomains.filter(d => d !== domain));
    toast({
      title: "Domaine supprimé",
      description: `${domain} a été retiré de votre liste.`,
    });
  };

  // URL de votre app Simpshopy
  const appUrl = generateSimpshopySubdomain(selectedStore?.name || 'Ma Boutique');

  return (
    <div className="space-y-6">
      {/* Ajouter un domaine */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            Connecter votre domaine personnalisé
          </CardTitle>
          <CardDescription>
            Configuration manuelle simple - Ajoutez les enregistrements DNS chez votre registraire
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSaveDomain} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="domain">Votre nom de domaine</Label>
              <Input
                id="domain"
                type="text"
                placeholder="exemple.com"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Entrez votre nom de domaine sans "www" (ex: ma-boutique.com)
              </p>
            </div>

            <Button type="submit" disabled={!customDomain.trim()}>
              Ajouter le domaine
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Liste des domaines et instructions DNS */}
      {savedDomains.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Configuration DNS requise</CardTitle>
            <CardDescription>
              Ajoutez ces enregistrements dans la zone DNS de votre registraire
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {savedDomains.map((domain) => (
              <div key={domain} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="font-medium">{domain}</p>
                      <p className="text-sm text-muted-foreground">En configuration</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                      <Info className="h-3 w-3 mr-1" />
                      Configuration requise
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeDomain(domain)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Étape à suivre :</strong> Connectez-vous à votre registraire (OVH, Gandi, Namecheap, etc.) 
                    et ajoutez ces enregistrements dans la zone DNS de votre domaine :
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  {/* Enregistrement pour le domaine racine */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Domaine racine ({domain})</Label>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(appUrl, 'Valeur CNAME')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-1 font-mono text-sm">
                      <div><span className="text-muted-foreground">Type:</span> CNAME</div>
                      <div><span className="text-muted-foreground">Nom:</span> @</div>
                      <div><span className="text-muted-foreground">Valeur:</span> {appUrl}</div>
                      <div><span className="text-muted-foreground">TTL:</span> 3600</div>
                    </div>
                  </div>

                  {/* Enregistrement pour www */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Sous-domaine www</Label>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(domain, 'Valeur CNAME')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-1 font-mono text-sm">
                      <div><span className="text-muted-foreground">Type:</span> CNAME</div>
                      <div><span className="text-muted-foreground">Nom:</span> www</div>
                      <div><span className="text-muted-foreground">Valeur:</span> {domain}</div>
                      <div><span className="text-muted-foreground">TTL:</span> 3600</div>
                    </div>
                  </div>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>Après configuration :</strong> La propagation DNS prend généralement 1-24h. 
                    Une fois propagé, {domain} et www.{domain} redirigeront vers votre boutique avec SSL automatique.
                  </AlertDescription>
                </Alert>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Guide étape par étape */}
      <Card>
        <CardHeader>
          <CardTitle>Guide de configuration</CardTitle>
          <CardDescription>
            Comment configurer votre domaine chez les registraires populaires
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">🇫🇷 OVH</h4>
              <ol className="text-sm space-y-1 text-muted-foreground">
                <li>1. Connectez-vous à votre espace client OVH</li>
                <li>2. Allez dans "Domaines" → Votre domaine → "Zone DNS"</li>
                <li>3. Cliquez "Ajouter une entrée" → Choisissez "CNAME"</li>
                <li>4. Ajoutez les enregistrements ci-dessus</li>
              </ol>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">🇫🇷 Gandi</h4>
              <ol className="text-sm space-y-1 text-muted-foreground">
                <li>1. Connectez-vous à votre compte Gandi</li>
                <li>2. Allez dans "Domaines" → Votre domaine → "Enregistrements DNS"</li>
                <li>3. Cliquez "Ajouter un enregistrement"</li>
                <li>4. Sélectionnez "CNAME" et ajoutez les valeurs</li>
              </ol>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">🌍 Cloudflare</h4>
              <ol className="text-sm space-y-1 text-muted-foreground">
                <li>1. Connectez-vous à Cloudflare</li>
                <li>2. Sélectionnez votre domaine → "DNS"</li>
                <li>3. Cliquez "Add record" → Type: "CNAME"</li>
                <li>4. Activez le proxy (nuage orange) pour de meilleures performances</li>
              </ol>
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Astuce :</strong> Chaque registraire a une interface différente, mais le principe reste le même : 
              ajouter des enregistrements CNAME avec les valeurs indiquées ci-dessus.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleDomainConfig;
