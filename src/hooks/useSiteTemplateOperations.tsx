
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Template } from '@/types/template';
import { siteTemplateService } from '@/services/siteTemplateService';
import { templateCacheUtils } from '@/utils/templateCache';

export const useSiteTemplateOperations = () => {
  const { toast } = useToast();

  const saveTemplate = useCallback(async (
    storeId: string,
    templateId: string,
    templateData: Template,
    isPublished = false
  ): Promise<string | null> => {
    if (!storeId || !templateId) {
      console.error('Store ID ou Template ID manquant');
      return null;
    }

    // Mettre en cache immédiatement
    templateCacheUtils.set(storeId, templateId, templateData);

    try {
      const resultId = await siteTemplateService.saveTemplate(
        storeId,
        templateId,
        templateData,
        isPublished
      );
      
      return resultId;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      templateCacheUtils.delete(storeId, templateId);
      throw error;
    }
  }, []);

  const loadTemplate = useCallback(async (storeId: string, templateId: string): Promise<Template | null> => {
    if (!storeId || !templateId) return null;

    // Vérifier le cache d'abord
    const cached = templateCacheUtils.get(storeId, templateId);
    if (cached) {
      console.log('Template chargé depuis le cache:', templateId);
      return cached;
    }

    try {
      const templateData = await siteTemplateService.loadTemplate(storeId, templateId);
      
      if (templateData) {
        // Mettre en cache
        templateCacheUtils.set(storeId, templateId, templateData);
        console.log('Template chargé depuis la base de données:', templateId);
      } else {
        console.log('Aucune personnalisation trouvée pour:', templateId);
      }

      return templateData;
    } catch (error) {
      console.error('Erreur lors du chargement du template:', error);
      return null;
    }
  }, []);

  const publishTemplate = useCallback(async (storeId: string, templateId: string, templateData: Template) => {
    return await saveTemplate(storeId, templateId, templateData, true);
  }, [saveTemplate]);

  return {
    saveTemplate,
    loadTemplate,
    publishTemplate
  };
};
