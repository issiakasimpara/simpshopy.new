import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { DsersService } from '@/services/dsersService';
import { useToast } from '@/hooks/use-toast';

interface DsersInstallButtonProps {
  storeId: string;
  onInstallSuccess?: () => void;
}

export default function DsersInstallButton({ storeId, onInstallSuccess }: DsersInstallButtonProps) {
  const [isInstalling, setIsInstalling] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();

  const handleTestConnection = async () => {
    if (!apiKey || !apiSecret) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await DsersService.testConnection(apiKey, apiSecret);
      
      if (result.success) {
        setTestResult({ success: true, message: "Connexion DSERS réussie !" });
        toast({
          title: "Succès",
          description: "Connexion DSERS testée avec succès",
        });
      } else {
        setTestResult({ success: false, message: result.error || "Erreur de connexion" });
        toast({
          title: "Erreur",
          description: result.error || "Erreur de connexion DSERS",
          variant: "destructive"
        });
      }
    } catch (error) {
      setTestResult({ success: false, message: "Erreur lors du test de connexion" });
      toast({
        title: "Erreur",
        description: "Erreur lors du test de connexion",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleInstall = async () => {
    if (!apiKey || !apiSecret) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    setIsInstalling(true);

    try {
      const result = await DsersService.createIntegration(storeId, apiKey, apiSecret);
      
      if (result.success) {
        toast({
          title: "Succès",
          description: "Intégration DSERS installée avec succès !",
        });
        setShowForm(false);
        setApiKey('');
        setApiSecret('');
        setTestResult(null);
        onInstallSuccess?.();
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Erreur lors de l'installation",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'installation de DSERS",
        variant: "destructive"
      });
    } finally {
      setIsInstalling(false);
    }
  };

  const openDsersWebsite = () => {
    window.open('https://dsers.com', '_blank');
  };

  if (!showForm) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <img src="/dsers-logo.svg" alt="DSERS" className="h-8 w-8" />
            <div>
              <CardTitle>DSERS Dropshipping</CardTitle>
              <CardDescription>Importez des produits AliExpress automatiquement</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              DSERS vous permet d'importer facilement des produits AliExpress dans votre boutique 
              avec synchronisation automatique des prix et stocks.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Import automatique depuis AliExpress</li>
              <li>• Synchronisation des prix et stocks</li>
              <li>• Gestion des commandes automatisée</li>
              <li>• Plan gratuit jusqu'à 3000 produits</li>
            </ul>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={() => setShowForm(true)}
              className="flex-1"
            >
              Installer DSERS
            </Button>
            <Button 
              variant="outline" 
              onClick={openDsersWebsite}
              className="flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Site Web</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <img src="/dsers-logo.svg" alt="DSERS" className="h-8 w-8" />
          <div>
            <CardTitle>Configuration DSERS</CardTitle>
            <CardDescription>Entrez vos clés API DSERS</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">Clé API DSERS</Label>
          <Input
            id="api-key"
            type="password"
            placeholder="Entrez votre clé API DSERS"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="api-secret">Secret API DSERS</Label>
          <Input
            id="api-secret"
            type="password"
            placeholder="Entrez votre secret API DSERS"
            value={apiSecret}
            onChange={(e) => setApiSecret(e.target.value)}
          />
        </div>

        {testResult && (
          <Alert variant={testResult.success ? "default" : "destructive"}>
            <div className="flex items-center space-x-2">
              {testResult.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{testResult.message}</AlertDescription>
            </div>
          </Alert>
        )}

        <div className="flex space-x-2">
          <Button 
            onClick={handleTestConnection}
            disabled={isTesting || !apiKey || !apiSecret}
            variant="outline"
            className="flex-1"
          >
            {isTesting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Test...
              </>
            ) : (
              "Tester Connexion"
            )}
          </Button>
          
          <Button 
            onClick={handleInstall}
            disabled={isInstalling || !apiKey || !apiSecret || (testResult && !testResult.success)}
            className="flex-1"
          >
            {isInstalling ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Installation...
              </>
            ) : (
              "Installer"
            )}
          </Button>
        </div>

        <Button 
          variant="ghost" 
          onClick={() => setShowForm(false)}
          className="w-full"
        >
          Annuler
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>💡 <strong>Comment obtenir vos clés API :</strong></p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Créez un compte sur <a href="https://dsers.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">dsers.com</a></li>
            <li>Allez dans Paramètres → API</li>
            <li>Générez vos clés API</li>
            <li>Copiez la clé API et le secret</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
