import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Moon, Clock, TrendingDown } from "lucide-react";
import { TrackingState } from "@/hooks/useSmartVisitorTracking";

interface TrackingMonitorProps {
  trackingState: TrackingState;
  storeId?: string;
}

interface TrackingStats {
  totalTime: number;
  activeTime: number;
  sleepTime: number;
  transitions: number;
  lastTransition: Date | null;
}

const TrackingMonitor: React.FC<TrackingMonitorProps> = ({ trackingState, storeId }) => {
  const [stats, setStats] = useState<TrackingStats>({
    totalTime: 0,
    activeTime: 0,
    sleepTime: 0,
    transitions: 0,
    lastTransition: null
  });

  const [startTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const totalTime = now.getTime() - startTime.getTime();
      
      setStats(prevStats => {
        const timeDiff = 1000; // 1 seconde
        
        let newActiveTime = prevStats.activeTime;
        let newSleepTime = prevStats.sleepTime;
        
        if (trackingState === TrackingState.ACTIVE) {
          newActiveTime += timeDiff;
        } else if (trackingState === TrackingState.SLEEP) {
          newSleepTime += timeDiff;
        }
        
        return {
          totalTime,
          activeTime: newActiveTime,
          sleepTime: newSleepTime,
          transitions: prevStats.transitions,
          lastTransition: prevStats.lastTransition
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [trackingState, startTime]);

  useEffect(() => {
    setStats(prevStats => ({
      ...prevStats,
      transitions: prevStats.transitions + 1,
      lastTransition: new Date()
    }));
  }, [trackingState]);

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const calculateSavings = () => {
    const totalTime = stats.totalTime;
    const sleepTime = stats.sleepTime;
    
    if (totalTime === 0) return 0;
    
    // En mode veille, on économise ~80% des requêtes
    const savingsPercentage = (sleepTime / totalTime) * 0.8;
    return Math.round(savingsPercentage * 100);
  };

  const getStateIcon = () => {
    switch (trackingState) {
      case TrackingState.ACTIVE:
        return <Zap className="h-4 w-4 text-green-500" />;
      case TrackingState.SLEEP:
        return <Moon className="h-4 w-4 text-gray-500" />;
      case TrackingState.TRANSITIONING:
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStateColor = () => {
    switch (trackingState) {
      case TrackingState.ACTIVE:
        return "bg-green-100 text-green-800 border-green-200";
      case TrackingState.SLEEP:
        return "bg-gray-100 text-gray-800 border-gray-200";
      case TrackingState.TRANSITIONING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center space-x-2">
          <TrendingDown className="h-4 w-4" />
          <span>Monitoring Tracking Intelligent</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* État actuel */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">État actuel:</span>
          <Badge className={`${getStateColor()} flex items-center space-x-1`}>
            {getStateIcon()}
            <span className="capitalize">{trackingState}</span>
          </Badge>
        </div>

        {/* Statistiques de temps */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {formatDuration(stats.activeTime)}
            </div>
            <div className="text-xs text-muted-foreground">Mode actif</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-600">
              {formatDuration(stats.sleepTime)}
            </div>
            <div className="text-xs text-muted-foreground">Mode veille</div>
          </div>
        </div>

        {/* Économies */}
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-700">
            {calculateSavings()}%
          </div>
          <div className="text-xs text-green-600">
            Économies de requêtes
          </div>
        </div>

        {/* Transitions */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Transitions:</span>
          <span className="font-medium">{stats.transitions}</span>
        </div>

        {/* Dernière transition */}
        {stats.lastTransition && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Dernière transition:</span>
            <span className="font-medium">
              {stats.lastTransition.toLocaleTimeString()}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrackingMonitor;
