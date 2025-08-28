import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  RefreshCw,
  Download
} from 'lucide-react';
import { useTestSuite } from '@/utils/testSuite';

interface TestRunnerProps {
  className?: string;
}

const TestRunner: React.FC<TestRunnerProps> = ({ className }) => {
  const { runAllTests, getResults, clearResults } = useTestSuite();
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  const runTests = async () => {
    setIsRunning(true);
    setProgress(0);
    
    // Simulation de progression
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      const testResults = await runAllTests();
      setResults(testResults);
      setProgress(100);
    } catch (error) {
      console.error('Erreur lors des tests:', error);
    } finally {
      clearInterval(progressInterval);
      setIsRunning(false);
    }
  };

  const clearTestResults = () => {
    clearResults();
    setResults(null);
    setProgress(0);
  };

  const downloadResults = () => {
    if (!results) return;
    
    const report = results.summary;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-results-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (passed: number, total: number) => {
    const ratio = passed / total;
    if (ratio === 1) return 'text-green-600';
    if (ratio >= 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (passed: number, total: number) => {
    const ratio = passed / total;
    if (ratio === 1) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (ratio >= 0.8) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      {/* En-tête avec actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Play className="h-5 w-5 sm:h-6 sm:w-6" />
            Tests Automatisés
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Validation de la sécurité, performance et robustesse
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={runTests}
            disabled={isRunning}
            className="flex items-center gap-2 text-xs sm:text-sm"
          >
            {isRunning ? (
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
            ) : (
              <Play className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
            {isRunning ? 'En cours...' : 'Lancer les tests'}
          </Button>
          {results && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={downloadResults}
              className="text-xs sm:text-sm"
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Résultats
            </Button>
          )}
        </div>
      </div>

      {/* Barre de progression */}
      {isRunning && (
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression des tests</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résultats des tests */}
      {results && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm sm:text-base">Tests de Sécurité</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm">Authentification</span>
                  {getStatusIcon(results.security.auth.passed, results.security.auth.total)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm">Autorisation</span>
                  {getStatusIcon(results.security.authorization.passed, results.security.authorization.total)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm">Validation</span>
                  {getStatusIcon(results.security.validation.passed, results.security.validation.total)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm sm:text-base">Tests de Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm">Temps de réponse</span>
                  {getStatusIcon(results.performance.responseTime.passed, results.performance.responseTime.total)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm">Mémoire</span>
                  {getStatusIcon(results.performance.memory.passed, results.performance.memory.total)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm">CPU</span>
                  {getStatusIcon(results.performance.cpu.passed, results.performance.cpu.total)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm sm:text-base">Tests d'Intégration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm">API</span>
                  {getStatusIcon(results.integration.api.passed, results.integration.api.total)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm">Base de données</span>
                  {getStatusIcon(results.integration.database.passed, results.integration.database.total)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm">Services externes</span>
                  {getStatusIcon(results.integration.external.passed, results.integration.external.total)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* État initial */}
      {!results && !isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun test exécuté</h3>
              <p className="text-muted-foreground mb-4">
                Cliquez sur "Lancer les Tests" pour commencer la validation automatique
              </p>
              <Button onClick={runTests}>
                <Play className="h-4 w-4 mr-2" />
                Lancer les Tests
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestRunner; 