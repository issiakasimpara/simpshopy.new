import { useEffect, useRef } from 'react';
import { useSmartVisitorTracking, TrackingState } from '@/hooks/useSmartVisitorTracking';

interface VisitorTrackerProps {
  storeId: string;
  storeSlug?: string;
}

const VisitorTracker: React.FC<VisitorTrackerProps> = ({ storeId, storeSlug }) => {
  const { trackVisitor, generateSessionId, trackingState } = useSmartVisitorTracking(storeId);
  const sessionIdRef = useRef<string>('');
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Récupérer les informations du navigateur
    const userAgent = navigator.userAgent;
    const ipAddress = 'unknown'; // En production, récupérer via API

    // Générer un ID de session stable pour ce visiteur
    sessionIdRef.current = generateSessionId(userAgent, ipAddress);

    console.log('👤 VisitorTracker initialisé:', {
      storeId,
      storeSlug,
      sessionId: sessionIdRef.current,
      trackingState
    });

    // Tracker le visiteur initial
    const trackInitialVisit = async () => {
      await trackVisitor(sessionIdRef.current, userAgent, ipAddress);
      console.log('✅ Visiteur initial tracké');
    };

    trackInitialVisit();

    // Heartbeat intelligent - seulement en mode actif
    const startHeartbeat = () => {
      if (trackingState === TrackingState.ACTIVE) {
        heartbeatIntervalRef.current = setInterval(async () => {
          await trackVisitor(sessionIdRef.current, userAgent, ipAddress);
        }, 15 * 1000);
        console.log('💓 Heartbeat démarré (mode actif)');
      }
    };

    const stopHeartbeat = () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
        console.log('💓 Heartbeat arrêté');
      }
    };

    // Gérer le heartbeat selon l'état du tracking
    if (trackingState === TrackingState.ACTIVE) {
      startHeartbeat();
    } else {
      stopHeartbeat();
    }

    // Tracker les interactions utilisateur (seulement en mode actif)
    const handleUserActivity = async () => {
      if (trackingState === TrackingState.ACTIVE) {
        await trackVisitor(sessionIdRef.current, userAgent, ipAddress);
      }
    };

    // Écouter les événements d'activité utilisateur
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Tracker le changement de page
    const handlePageChange = async () => {
      if (trackingState === TrackingState.ACTIVE) {
        await trackVisitor(sessionIdRef.current, userAgent, ipAddress);
      }
    };

    // Écouter les changements de route (si applicable)
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handlePageChange);
    }

    // Cleanup lors du démontage
    return () => {
      stopHeartbeat();

      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });

      if (typeof window !== 'undefined') {
        window.removeEventListener('popstate', handlePageChange);
      }

      console.log('🧹 VisitorTracker cleanup terminé');
    };
  }, [storeId, trackVisitor, generateSessionId, trackingState]);

  // Composant invisible - ne rend rien
  return null;
};

export default VisitorTracker;
