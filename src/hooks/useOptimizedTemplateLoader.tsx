
import { useState, useEffect, useCallback } from 'react';
import { Template } from '@/types/template';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useStores } from '@/hooks/useStores';
import { useSiteTemplates } from '@/hooks/useSiteTemplates';
import { preBuiltTemplates } from '@/data/preBuiltTemplates';

interface LoadingState {
  currentStep: string;
  progress: number;
  isLoading: boolean;
  error: string | null;
}

const CACHE_KEY_PREFIX = 'template_cache_';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useOptimizedTemplateLoader = (templateId: string) => {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { stores, isLoading: storesLoading, refetchStores } = useStores();
  const selectedStore = stores.length > 0 ? stores[0] : null;
  const { loadTemplate, saveTemplate } = useSiteTemplates(selectedStore?.id);

  const [template, setTemplate] = useState<Template | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    currentStep: 'auth',
    progress: 0,
    isLoading: true,
    error: null
  });

  // Cache utilities
  const getCachedTemplate = useCallback((id: string): Template | null => {
    try {
      const cached = localStorage.getItem(`${CACHE_KEY_PREFIX}${id}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
        localStorage.removeItem(`${CACHE_KEY_PREFIX}${id}`);
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }
    return null;
  }, []);

  const setCachedTemplate = useCallback((id: string, data: Template) => {
    try {
      localStorage.setItem(`${CACHE_KEY_PREFIX}${id}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Cache write error:', error);
    }
  }, []);

  const updateProgress = useCallback((step: string, progress: number) => {
    setLoadingState(prev => ({ ...prev, currentStep: step, progress }));
  }, []);

  const loadTemplateData = useCallback(async () => {
    if (!templateId || !selectedStore) return;

    try {
      updateProgress('template', 60);

      // Check cache first
      const cachedTemplate = getCachedTemplate(templateId);
      if (cachedTemplate) {
        console.log('Template loaded from cache:', cachedTemplate);
        setTemplate(cachedTemplate);
        updateProgress('ready', 100);
        setLoadingState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Load from database
      const savedTemplate = await loadTemplate(selectedStore.id, templateId);
      
      if (savedTemplate) {
        console.log('Template loaded from database:', savedTemplate);
        setTemplate(savedTemplate);
        setCachedTemplate(templateId, savedTemplate);
      } else {
        // Load pre-built template
        updateProgress('template', 70);
        const foundTemplate = preBuiltTemplates.find(t => t.id === templateId);
        
        if (foundTemplate) {
          console.log('Pre-built template loaded:', foundTemplate);
          setTemplate(foundTemplate);
          setCachedTemplate(templateId, foundTemplate);
          
          // Save to database in background
          updateProgress('template', 80);
          try {
            await saveTemplate(selectedStore.id, foundTemplate.id, foundTemplate);
            console.log('Template saved to database');
          } catch (saveError) {
            console.warn('Background save failed:', saveError);
          }
        } else {
          throw new Error('Template not found');
        }
      }

      updateProgress('ready', 100);
      setLoadingState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error('Template loading error:', error);
      setLoadingState(prev => ({
        ...prev,
        error: 'Erreur lors du chargement du template',
        isLoading: false
      }));
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger le template.",
        variant: "destructive"
      });
    }
  }, [templateId, selectedStore, loadTemplate, saveTemplate, getCachedTemplate, setCachedTemplate, updateProgress, toast]);

  useEffect(() => {
    const initializeLoader = async () => {
      // Step 1: Authentication
      if (authLoading) {
        updateProgress('auth', 20);
        return;
      }

      if (!user) {
        setLoadingState(prev => ({
          ...prev,
          error: 'Authentification requise',
          isLoading: false
        }));
        return;
      }

      // Step 2: Stores
      updateProgress('stores', 40);
      if (storesLoading) return;

      if (!selectedStore) {
        // Essayer de recharger les stores une fois
        console.log('⚠️ Aucune boutique trouvée, tentative de rechargement...');
        updateProgress('stores', 50);

        try {
          await refetchStores();
          // Attendre un peu et vérifier à nouveau
          setTimeout(() => {
            if (stores.length === 0) {
              setLoadingState(prev => ({
                ...prev,
                error: 'Aucune boutique disponible. Veuillez d\'abord créer une boutique.',
                isLoading: false
              }));
            }
          }, 1000);
        } catch (error) {
          console.error('Erreur lors du rechargement des stores:', error);
          setLoadingState(prev => ({
            ...prev,
            error: 'Erreur lors du chargement des boutiques',
            isLoading: false
          }));
        }
        return;
      }

      // Step 3: Template
      await loadTemplateData();
    };

    initializeLoader();
  }, [authLoading, user, storesLoading, selectedStore, loadTemplateData, updateProgress]);

  const clearCache = useCallback(() => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  return {
    template,
    loadingState,
    selectedStore,
    clearCache,
    isReady: !loadingState.isLoading && !loadingState.error && template !== null
  };
};
