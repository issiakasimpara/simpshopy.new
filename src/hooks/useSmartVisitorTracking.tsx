import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ActiveVisitor {
  id: string;
  store_id: string;
  session_id: string;
  user_agent: string;
  ip_address: string;
  last_activity: string;
  created_at: string;
}

export interface ActiveVisitorsStats {
  totalVisitors: number;
  uniqueVisitors: number;
  averageSessionDuration: number;
  mostActivePage: string;
}

export enum TrackingState {
  SLEEP = 'sleep',           // Pas de visiteurs, pas de tracking
  ACTIVE = 'active',         // Visiteurs présents, tracking actif
  TRANSITIONING = 'transitioning' // Changement d'état
}

// Configuration des seuils et intervalles
const CONFIG = {
  ACTIVATION_THRESHOLD: 1,     // Activer dès 1 visiteur
  DEACTIVATION_DELAY: 30000,   // 30s après dernier visiteur
  CHECK_INTERVAL: 60000,       // Vérifier toutes les minutes (mode veille)
  ACTIVE_INTERVALS: {
    fetchActiveVisitors: 15000,    // 15s en mode actif
    cleanupExpiredSessions: 30000, // 30s en mode actif
    heartbeat: 15000               // 15s en mode actif
  },
  SLEEP_INTERVALS: {
    fetchActiveVisitors: 0,        // Pas de polling en veille
    cleanupExpiredSessions: 0,     // Pas de nettoyage en veille
    heartbeat: 0                   // Pas de heartbeat en veille
  }
};

export const useSmartVisitorTracking = (storeId?: string) => {
  const [activeVisitors, setActiveVisitors] = useState<ActiveVisitor[]>([]);
  const [stats, setStats] = useState<ActiveVisitorsStats>({
    totalVisitors: 0,
    uniqueVisitors: 0,
    averageSessionDuration: 0,
    mostActivePage: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [trackingState, setTrackingState] = useState<TrackingState>(TrackingState.SLEEP);
  const { toast } = useToast();

  // Références pour les intervals
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fetchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cleanupIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const deactivationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<any>(null);

  // Générer un ID de session stable basé sur l'IP et User Agent
  const generateSessionId = useCallback((userAgent: string, ipAddress: string) => {
    const sessionKey = `${ipAddress}_${userAgent}`;
    return `session_${btoa(sessionKey).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16)}`;
  }, []);

  // Créer ou mettre à jour une session active
  const trackVisitor = useCallback(async (sessionId: string, userAgent: string, ipAddress?: string) => {
    if (!storeId) return;

    try {
      const now = new Date().toISOString();
      
      // Vérifier si la session existe déjà
      const { data: existingSession } = await supabase
        .from('active_sessions')
        .select('*')
        .eq('store_id', storeId)
        .eq('session_id', sessionId)
        .single();

      if (existingSession) {
        // Mettre à jour l'activité
        await supabase
          .from('active_sessions')
          .update({ 
            last_activity: now,
            user_agent: userAgent
          })
          .eq('id', existingSession.id);
      } else {
        // Créer une nouvelle session
        await supabase
          .from('active_sessions')
          .insert({
            store_id: storeId,
            session_id: sessionId,
            user_agent: userAgent,
            ip_address: ipAddress || 'unknown',
            last_activity: now
          });
      }
    } catch (error) {
      console.error('Erreur tracking visiteur:', error);
    }
  }, [storeId]);

  // Récupérer les visiteurs actifs
  const fetchActiveVisitors = useCallback(async () => {
    if (!storeId) return;

    try {
      setIsLoading(true);
      
      // Récupérer les sessions actives (activité dans les 2 dernières minutes)
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('active_sessions')
        .select('*')
        .eq('store_id', storeId)
        .gte('last_activity', twoMinutesAgo)
        .order('last_activity', { ascending: false });

      if (error) {
        console.error('Erreur récupération visiteurs actifs:', error);
        return;
      }

      setActiveVisitors(data || []);
      
      // Calculer les statistiques
      const uniqueSessions = new Set(data?.map(v => v.session_id) || []).size;
      const uniqueVisitors = new Set(data?.map(v => v.ip_address) || []).size;
      
      setStats({
        totalVisitors: uniqueSessions,
        uniqueVisitors,
        averageSessionDuration: 0,
        mostActivePage: ''
      });

      // Gérer la transition d'état basée sur le nombre de visiteurs
      const visitorCount = uniqueSessions;
      
      if (visitorCount >= CONFIG.ACTIVATION_THRESHOLD && trackingState === TrackingState.SLEEP) {
        console.log('🟢 Activation du tracking - visiteurs détectés:', visitorCount);
        activateTracking();
      } else if (visitorCount === 0 && trackingState === TrackingState.ACTIVE) {
        console.log('🟡 Préparation désactivation - plus de visiteurs');
        scheduleDeactivation();
      }

    } catch (error) {
      console.error('Erreur calcul stats visiteurs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [storeId, trackingState]);

  // Nettoyer les sessions expirées
  const cleanupExpiredSessions = useCallback(async () => {
    if (!storeId) return;

    try {
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
      
      await supabase
        .from('active_sessions')
        .delete()
        .eq('store_id', storeId)
        .lt('last_activity', twoMinutesAgo);
    } catch (error) {
      console.error('Erreur nettoyage sessions expirées:', error);
    }
  }, [storeId]);

  // Activer le mode de tracking actif
  const activateTracking = useCallback(() => {
    console.log('🚀 Activation du mode tracking actif');
    setTrackingState(TrackingState.TRANSITIONING);

    // Nettoyer les intervals de veille
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }

    // Annuler la désactivation programmée
    if (deactivationTimeoutRef.current) {
      clearTimeout(deactivationTimeoutRef.current);
      deactivationTimeoutRef.current = null;
    }

    // Démarrer les intervals actifs
    fetchIntervalRef.current = setInterval(fetchActiveVisitors, CONFIG.ACTIVE_INTERVALS.fetchActiveVisitors);
    cleanupIntervalRef.current = setInterval(cleanupExpiredSessions, CONFIG.ACTIVE_INTERVALS.cleanupExpiredSessions);

    // Établir la connexion Supabase Realtime
    if (channelRef.current) {
      channelRef.current.unsubscribe();
    }

    channelRef.current = supabase
      .channel(`active_visitors_${storeId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'active_sessions',
          filter: `store_id=eq.${storeId}`
        },
        (payload) => {
          console.log('🔄 Changement visiteur actif (mode actif):', payload);
          fetchActiveVisitors();
        }
      )
      .subscribe();

    setTrackingState(TrackingState.ACTIVE);
    console.log('✅ Mode tracking actif activé');
  }, [storeId, fetchActiveVisitors, cleanupExpiredSessions]);

  // Programmer la désactivation
  const scheduleDeactivation = useCallback(() => {
    console.log('⏰ Programmation désactivation dans', CONFIG.DEACTIVATION_DELAY, 'ms');
    
    if (deactivationTimeoutRef.current) {
      clearTimeout(deactivationTimeoutRef.current);
    }

    deactivationTimeoutRef.current = setTimeout(() => {
      deactivateTracking();
    }, CONFIG.DEACTIVATION_DELAY);
  }, []);

  // Désactiver le mode de tracking actif
  const deactivateTracking = useCallback(() => {
    console.log('😴 Désactivation du mode tracking actif');
    setTrackingState(TrackingState.TRANSITIONING);

    // Nettoyer les intervals actifs
    if (fetchIntervalRef.current) {
      clearInterval(fetchIntervalRef.current);
      fetchIntervalRef.current = null;
    }
    if (cleanupIntervalRef.current) {
      clearInterval(cleanupIntervalRef.current);
      cleanupIntervalRef.current = null;
    }

    // Fermer la connexion Supabase Realtime
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }

    // Démarrer l'interval de vérification en veille
    checkIntervalRef.current = setInterval(fetchActiveVisitors, CONFIG.CHECK_INTERVAL);

    setTrackingState(TrackingState.SLEEP);
    console.log('✅ Mode veille activé');
  }, [fetchActiveVisitors]);

  // Initialisation et gestion du cycle de vie
  useEffect(() => {
    if (!storeId) return;

    console.log('🎯 Initialisation du tracking intelligent pour store:', storeId);

    // Récupération initiale pour déterminer l'état
    fetchActiveVisitors();

    // Démarrer en mode veille (vérification périodique)
    checkIntervalRef.current = setInterval(fetchActiveVisitors, CONFIG.CHECK_INTERVAL);

    // Cleanup lors du démontage
    return () => {
      console.log('🧹 Cleanup du tracking intelligent');
      
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      if (fetchIntervalRef.current) {
        clearInterval(fetchIntervalRef.current);
      }
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
      }
      if (deactivationTimeoutRef.current) {
        clearTimeout(deactivationTimeoutRef.current);
      }
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [storeId, fetchActiveVisitors]);

  return {
    activeVisitors,
    stats,
    isLoading,
    trackingState,
    trackVisitor,
    generateSessionId,
    fetchActiveVisitors,
    cleanupExpiredSessions,
    activateTracking,
    deactivateTracking
  };
};
