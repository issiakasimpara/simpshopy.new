import { useEffect, useRef, useCallback, useState } from 'react';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';

// Cache global pour éviter les subscriptions multiples
const channelCache = new Map<string, RealtimeChannel>();
const subscriptionCount = new Map<string, number>();
const lastCallTime = new Map<string, number>();

interface UseOptimizedRealtimeOptions {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  debounceMs?: number;
  enabled?: boolean;
  maxCallsPerMinute?: number; // Nouvelle option pour limiter la fréquence
}

export function useOptimizedRealtime<T = any>(
  options: UseOptimizedRealtimeOptions,
  callback?: (payload: RealtimePostgresChangesPayload<T>) => void
) {
  const { table, event = '*', filter, debounceMs = 5000, enabled = true, maxCallsPerMinute = 12 } = options;
  const [data, setData] = useState<T[]>([]);
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastPayloadRef = useRef<string>('');

  // Mise à jour du callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Fonction debounced optimisée avec limitation de fréquence
  const debouncedCallback = useCallback((payload: RealtimePostgresChangesPayload<T>) => {
    const channelKey = `${table}:${event}:${filter || 'all'}`;
    const now = Date.now();
    
    // Vérifier la limitation de fréquence
    const lastCall = lastCallTime.get(channelKey) || 0;
    const timeSinceLastCall = now - lastCall;
    const minInterval = 60000 / maxCallsPerMinute; // Intervalle minimum entre les appels
    
    if (timeSinceLastCall < minInterval) {
      console.log(`🚫 Appel realtime ignoré - trop fréquent pour ${channelKey}`);
      return;
    }
    
    // Créer une clé unique pour ce payload
    const payloadKey = JSON.stringify({
      eventType: payload.eventType,
      table: payload.table,
      schema: payload.schema,
      commit_timestamp: payload.commit_timestamp
    });

    // Éviter les doublons de payload
    if (lastPayloadRef.current === payloadKey) {
      console.log(`🚫 Payload dupliqué ignoré pour ${channelKey}`);
      return;
    }
    lastPayloadRef.current = payloadKey;
    lastCallTime.set(channelKey, now);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (callbackRef.current) {
        callbackRef.current(payload);
      }
      
      // Mise à jour optimisée de l'état
      setData(prev => {
        const newData = [...prev];
        const { new: newRecord, old: oldRecord } = payload;
        
        switch (payload.eventType) {
          case 'INSERT':
            if (newRecord) newData.push(newRecord);
            break;
          case 'UPDATE':
            if (newRecord && oldRecord) {
              const index = newData.findIndex(item => 
                (item as any).id === (newRecord as any).id
              );
              if (index !== -1) newData[index] = newRecord;
            }
            break;
          case 'DELETE':
            if (oldRecord) {
              const index = newData.findIndex(item => 
                (item as any).id === (oldRecord as any).id
              );
              if (index !== -1) newData.splice(index, 1);
            }
            break;
        }
        return newData;
      });
    }, debounceMs);
  }, [debounceMs]);

  useEffect(() => {
    if (!enabled) return;

    const channelKey = `${table}:${event}:${filter || 'all'}`;
    
    // Vérifier si le channel existe déjà
    let channel = channelCache.get(channelKey);
    
    if (!channel) {
      // Créer un nouveau channel seulement si nécessaire
      channel = supabase
        .channel(channelKey)
        .on(
          'postgres_changes',
          {
            event,
            schema: 'public',
            table,
            filter
          },
          debouncedCallback
        )
        .subscribe((status) => {
          console.log(`Realtime ${channelKey}:`, status);
        });

      channelCache.set(channelKey, channel);
      subscriptionCount.set(channelKey, 1);
    } else {
      // Incrémenter le compteur pour ce channel
      const count = subscriptionCount.get(channelKey) || 0;
      subscriptionCount.set(channelKey, count + 1);
    }

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const count = subscriptionCount.get(channelKey) || 0;
      if (count <= 1) {
        // Dernier subscriber, nettoyer le channel
        channel?.unsubscribe();
        channelCache.delete(channelKey);
        subscriptionCount.delete(channelKey);
      } else {
        // Décrémenter le compteur
        subscriptionCount.set(channelKey, count - 1);
      }
    };
  }, [table, event, filter, enabled, debouncedCallback]);

  // Fonction pour nettoyer manuellement le cache
  const clearCache = useCallback(() => {
    channelCache.forEach(channel => channel.unsubscribe());
    channelCache.clear();
    subscriptionCount.clear();
  }, []);

  return { data, clearCache };
}

// Hook pour nettoyer tous les channels au démontage de l'app
export function useGlobalRealtimeCleanup() {
  useEffect(() => {
    return () => {
      channelCache.forEach(channel => channel.unsubscribe());
      channelCache.clear();
      subscriptionCount.clear();
    };
  }, []);
}
