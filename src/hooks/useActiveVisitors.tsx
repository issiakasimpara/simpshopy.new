import { useState, useEffect, useCallback } from 'react';
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

export const useActiveVisitors = (storeId?: string) => {
  const [activeVisitors, setActiveVisitors] = useState<ActiveVisitor[]>([]);
  const [stats, setStats] = useState<ActiveVisitorsStats>({
    totalVisitors: 0,
    uniqueVisitors: 0,
    averageSessionDuration: 0,
    mostActivePage: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Générer un ID de session stable basé sur l'IP et User Agent
  const generateSessionId = useCallback((userAgent: string, ipAddress: string) => {
    // Créer un hash stable basé sur l'IP et User Agent
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
      
      // Récupérer les sessions actives (activité dans les 2 dernières minutes - plus strict)
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
      
      // Calculer les statistiques CORRIGÉES
      // Utiliser session_id pour compter les sessions uniques (pas ip_address)
      const uniqueSessions = new Set(data?.map(v => v.session_id) || []).size;
      const uniqueVisitors = new Set(data?.map(v => v.ip_address) || []).size;
      
      setStats({
        totalVisitors: uniqueSessions, // Nombre de sessions actives
        uniqueVisitors, // Nombre de visiteurs uniques (par IP)
        averageSessionDuration: 0, // À implémenter si nécessaire
        mostActivePage: '' // À implémenter si nécessaire
      });

    } catch (error) {
      console.error('Erreur calcul stats visiteurs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [storeId]);

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

  // Écouter les changements en temps réel
  useEffect(() => {
    if (!storeId) return;

    // Récupérer les données initiales
    fetchActiveVisitors();

    // S'abonner aux changements en temps réel
    const channel = supabase
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
          console.log('🔄 Changement visiteur actif:', payload);
          fetchActiveVisitors();
        }
      )
      .subscribe();

    // Nettoyer les sessions expirées toutes les 30 secondes (plus fréquent)
    const cleanupInterval = setInterval(cleanupExpiredSessions, 30 * 1000);

    // Mettre à jour les données toutes les 15 secondes (plus fréquent)
    const updateInterval = setInterval(fetchActiveVisitors, 15 * 1000);

    return () => {
      channel.unsubscribe();
      clearInterval(cleanupInterval);
      clearInterval(updateInterval);
    };
  }, [storeId, fetchActiveVisitors, cleanupExpiredSessions]);

  return {
    activeVisitors,
    stats,
    isLoading,
    trackVisitor,
    generateSessionId,
    fetchActiveVisitors,
    cleanupExpiredSessions
  };
};
