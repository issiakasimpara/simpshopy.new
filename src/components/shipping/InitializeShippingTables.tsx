import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, CheckCircle, AlertCircle, Loader2, TestTube, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { testShippingTables, createSampleShippingData } from '@/utils/testShippingTables';
import { createShippingTablesDirectly, verifyShippingTables } from '@/utils/createTablesDirectly';
import { setupShippingDatabase, createSampleShippingData as createSampleData } from '@/utils/setupShippingDatabase';
import { fullSupabaseAutomation, checkSupabaseConnection, createCompleteTestData } from '@/utils/connectSupabase';
import { useStores } from '@/hooks/useStores';

const InitializeShippingTables = () => {
  const { stores } = useStores();
  const [isCreating, setIsCreating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isCreatingData, setIsCreatingData] = useState(false);
  const [isRunningFullAutomation, setIsRunningFullAutomation] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const createTablesManually = async () => {
    setIsCreating(true);
    setStatus('idle');
    setMessage('');

    try {
      const result = await setupShippingDatabase();

      if (result.success) {
        setStatus('success');
        setMessage(result.message + '\n\nÉtapes suivantes:\n' + result.nextSteps?.join('\n') || '');
      } else {
        setStatus('error');
        setMessage(result.message + '\n\nÉtapes manuelles:\n' + result.manualSteps?.join('\n') || '');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la création des tables:', error);
      setStatus('error');
      setMessage(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsCreating(false);
    }
  };

  const testTablesExist = async () => {
    setIsTesting(true);
    setStatus('idle');
    setMessage('');

    try {
      const result = await verifyShippingTables();

      if (result.success) {
        setStatus('success');
        setMessage(result.message + (result.data ? ` (Zones: ${result.data.zonesCount}, Méthodes: ${result.data.methodsCount})` : ''));
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Impossible de vérifier l\'existence des tables.');
    } finally {
      setIsTesting(false);
    }
  };

  const createTestData = async () => {
    if (!stores || stores.length === 0) {
      setStatus('error');
      setMessage('Aucune boutique trouvée. Créez d\'abord une boutique.');
      return;
    }

    setIsCreatingData(true);
    setStatus('idle');
    setMessage('');

    try {
      const firstStore = stores[0];
      const result = await createCompleteTestData(firstStore.id);

      if (result.success) {
        setStatus('success');
        setMessage(result.message);
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Erreur lors de la création des données de test.');
    } finally {
      setIsCreatingData(false);
    }
  };

  const runFullAutomation = async () => {
    setIsRunningFullAutomation(true);
    setStatus('idle');
    setMessage('');

    try {
      const result = await fullSupabaseAutomation();

      if (result.summary.connected && result.summary.setupSuccess) {
        setStatus('success');
        setMessage(`🎉 Automatisation réussie !

Connexion: ${result.summary.connected ? '✅ Connecté' : '❌ Déconnecté'}
Tables trouvées: ${result.summary.tablesFound}
Erreurs: ${result.summary.errorsCount}

${result.connection?.user ? `Utilisateur: ${result.connection.user.email}` : 'Non authentifié'}

Prochaines étapes:
1. Créez des données de test
2. Configurez vos livraisons
3. Testez l'interface`);
      } else {
        setStatus('error');
        setMessage(`⚠️ Automatisation partielle

Connexion: ${result.summary.connected ? '✅' : '❌'}
Setup: ${result.summary.setupSuccess ? '✅' : '❌'}
Erreurs: ${result.summary.errorsCount}

${result.connection?.errors?.join('\n') || 'Erreurs non spécifiées'}`);
      }
    } catch (error) {
      setStatus('error');
      setMessage(`Erreur lors de l'automatisation: ${error}`);
    } finally {
      setIsRunningFullAutomation(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-600" />
          Initialisation des tables de livraisons
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Bouton d'automatisation complète */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">🚀 Automatisation complète</h4>
            <p className="text-sm text-blue-700 mb-3">
              Configure automatiquement toute votre base de données Supabase en un clic !
            </p>
            <Button
              onClick={runFullAutomation}
              disabled={isCreating || isTesting || isCreatingData || isRunningFullAutomation}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isRunningFullAutomation ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Automatisation en cours...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Tout automatiser
                </>
              )}
            </Button>
          </div>

          {/* Boutons individuels */}
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={testTablesExist}
              variant="outline"
              disabled={isCreating || isTesting || isCreatingData || isRunningFullAutomation}
            >
              {isTesting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Test en cours...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
                  Tester les tables
                </>
              )}
            </Button>

            <Button
              onClick={createTablesManually}
              disabled={isCreating || isTesting || isCreatingData || isRunningFullAutomation}
              variant="outline"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Création en cours...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Créer les tables
                </>
              )}
            </Button>

            <Button
              onClick={createTestData}
              variant="outline"
              disabled={isCreating || isTesting || isCreatingData || isRunningFullAutomation || !stores?.length}
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              {isCreatingData ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Création données...
                </>
              ) : (
                <>
                  <Package className="h-4 w-4 mr-2" />
                  Créer données test
                </>
              )}
            </Button>
          </div>
        </div>

        {status !== 'idle' && (
          <Alert className={status === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            {status === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className="whitespace-pre-line">
              {message}
            </AlertDescription>
          </Alert>
        )}

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">Instructions alternatives :</h4>
          <p className="text-sm text-blue-700">
            Si la création automatique ne fonctionne pas, vous pouvez créer les tables manuellement 
            dans Supabase → Table Editor en suivant les instructions qui s'afficheront ci-dessus.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InitializeShippingTables;
