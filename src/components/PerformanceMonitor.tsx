// ⚡ MONITEUR DE PERFORMANCE EN TEMPS RÉEL
import { useState, useEffect, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { performanceManager } from '@/utils/performanceManager';
import { Activity, Zap, Brain, Clock, X } from 'lucide-react';

interface PerformanceMonitorProps {
  isVisible: boolean;
  onClose: () => void;
}

const PerformanceMonitor = memo<PerformanceMonitorProps>(({ isVisible, onClose }) => {
  const [metrics, setMetrics] = useState(performanceManager.getMetrics());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setMetrics(performanceManager.getMetrics());
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const getStatusColor = (value: number, threshold: number, reverse = false) => {
    const isGood = reverse ? value < threshold : value > threshold;
    return isGood ? 'bg-green-500' : value > threshold * 0.7 ? 'bg-yellow-500' : 'bg-red-500';
  };

  const formatMemory = (bytes: number) => {
    return `${Math.round(bytes / 1024 / 1024)}MB`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="shadow-lg border-2 border-primary/20 bg-background/95 backdrop-blur">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Performance Monitor
            </CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 w-6 p-0"
              >
                {isExpanded ? '−' : '+'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {/* Métriques principales */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-blue-500" />
              <span>Requêtes/min:</span>
              <Badge variant={metrics.queryCount > 20 ? 'destructive' : 'secondary'} className="text-xs">
                {metrics.queryCount}
              </Badge>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-orange-500" />
              <span>Temps moy:</span>
              <Badge variant={metrics.averageQueryTime > 1000 ? 'destructive' : 'secondary'} className="text-xs">
                {Math.round(metrics.averageQueryTime)}ms
              </Badge>
            </div>
            
            <div className="flex items-center gap-1">
              <Brain className="h-3 w-3 text-purple-500" />
              <span>Mémoire:</span>
              <Badge variant={metrics.memoryUsage > 50 * 1024 * 1024 ? 'destructive' : 'secondary'} className="text-xs">
                {formatMemory(metrics.memoryUsage)}
              </Badge>
            </div>
            
            <div className="flex items-center gap-1">
              <Activity className="h-3 w-3 text-green-500" />
              <span>Renders:</span>
              <Badge variant="secondary" className="text-xs">
                {metrics.renderCount}
              </Badge>
            </div>
          </div>

          {/* Indicateur de santé global */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  metrics.queryCount < 15 && metrics.averageQueryTime < 800 
                    ? 'bg-green-500' 
                    : metrics.queryCount < 25 && metrics.averageQueryTime < 1500
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ 
                  width: `${Math.min(100, Math.max(20, 100 - (metrics.queryCount * 2 + metrics.averageQueryTime / 20)))}%` 
                }}
              />
            </div>
            <span className="text-xs font-medium">
              {metrics.queryCount < 15 && metrics.averageQueryTime < 800 ? '✅' : 
               metrics.queryCount < 25 && metrics.averageQueryTime < 1500 ? '⚠️' : '🚨'}
            </span>
          </div>

          {/* Détails étendus */}
          {isExpanded && (
            <div className="space-y-2 pt-2 border-t">
              <div className="text-xs">
                <div className="font-medium mb-1">Requêtes Lentes:</div>
                {metrics.slowQueries.length > 0 ? (
                  <div className="space-y-1 max-h-20 overflow-y-auto">
                    {metrics.slowQueries.slice(-3).map((query, index) => (
                      <div key={index} className="text-xs text-muted-foreground">
                        {query.key.split(':')[0]}: {query.duration}ms
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-green-600">Aucune requête lente</div>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log('📊 RAPPORT DÉTAILLÉ:', performanceManager.getReport());
                }}
                className="w-full text-xs h-6"
              >
                Rapport Détaillé (Console)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

PerformanceMonitor.displayName = 'PerformanceMonitor';

export default PerformanceMonitor;
