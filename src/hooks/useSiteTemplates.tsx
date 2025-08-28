
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { siteTemplateService, type SiteTemplate } from '@/services/siteTemplateService';
import { useSiteTemplateOperations } from '@/hooks/useSiteTemplateOperations';
import { templateCacheUtils } from '@/utils/templateCache';

export const useSiteTemplates = (storeId?: string) => {
  const [siteTemplates, setSiteTemplates] = useState<SiteTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const {
    saveTemplate: saveTemplateOperation,
    loadTemplate: loadTemplateOperation,
    publishTemplate: publishTemplateOperation
  } = useSiteTemplateOperations();

  // Charger les templates avec optimisation
  const loadSiteTemplates = useCallback(async (store_id: string) => {
    if (!store_id) return;
    
    setIsLoading(true);
    try {
      const data = await siteTemplateService.loadSiteTemplates(store_id);
      setSiteTemplates(data);
      
      // Mettre à jour le cache
      data.forEach(template => {
        templateCacheUtils.set(store_id, template.template_id, template.template_data);
      });
      
    } catch (error) {
      console.error('Erreur lors du chargement des templates:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les templates sauvegardés.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Wrapper pour la sauvegarde avec état de chargement
  const saveTemplate = useCallback(async (
    store_id: string,
    template_id: string,
    template_data: any,
    is_published = false
  ): Promise<string | null> => {
    setIsSaving(true);
    try {
      const result = await saveTemplateOperation(store_id, template_id, template_data, is_published);
      
      // Recharger en arrière-plan
      setTimeout(() => loadSiteTemplates(store_id), 100);
      
      return result;
    } finally {
      setIsSaving(false);
    }
  }, [saveTemplateOperation, loadSiteTemplates]);

  const loadTemplate = useCallback(async (store_id: string, template_id: string) => {
    return await loadTemplateOperation(store_id, template_id);
  }, [loadTemplateOperation]);

  const publishTemplate = useCallback(async (store_id: string, template_id: string, template_data: any) => {
    setIsSaving(true);
    try {
      const result = await publishTemplateOperation(store_id, template_id, template_data);
      
      // Recharger en arrière-plan
      setTimeout(() => loadSiteTemplates(store_id), 100);
      
      return result;
    } finally {
      setIsSaving(false);
    }
  }, [publishTemplateOperation, loadSiteTemplates]);

  useEffect(() => {
    if (storeId) {
      loadSiteTemplates(storeId);
    }
  }, [storeId, loadSiteTemplates]);

  return {
    siteTemplates,
    isLoading,
    isSaving,
    saveTemplate,
    loadTemplate,
    publishTemplate,
    loadSiteTemplates
  };
};
