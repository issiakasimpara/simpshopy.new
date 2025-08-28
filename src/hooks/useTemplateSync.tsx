import { useEffect } from 'react';
import { Template } from '@/types/template';

interface UseTemplateSyncProps {
  selectedStore: any;
  initialTemplate: Template;
  setTemplateData: (template: Template) => void;
  hasUnsavedChanges: boolean;
  handleSave: (silent?: boolean) => Promise<void>;
  loadTemplate: (storeId: string, templateId: string) => Promise<Template | null>;
}

export const useTemplateSync = ({
  selectedStore,
  initialTemplate,
  setTemplateData,
  hasUnsavedChanges,
  handleSave,
  loadTemplate
}: UseTemplateSyncProps) => {
  // Charger le template personnalisé depuis la base de données au démarrage
  useEffect(() => {
    const loadCustomizedTemplate = async () => {
      if (selectedStore?.id && initialTemplate.id) {
        try {
          const savedTemplate = await loadTemplate(selectedStore.id, initialTemplate.id);
          if (savedTemplate) {
            setTemplateData(savedTemplate);
          } else {
            setTemplateData(initialTemplate);
          }
        } catch (error) {
          console.error('Erreur lors du chargement du template:', error);
          setTemplateData(initialTemplate);
        }
      }
    };

    loadCustomizedTemplate();
  }, [selectedStore?.id, initialTemplate.id, loadTemplate, setTemplateData, initialTemplate]);

  // Synchroniser le template initial avec l'état seulement si aucune personnalisation n'existe
  useEffect(() => {
    if (!selectedStore?.id) {
      setTemplateData(initialTemplate);
    }
  }, [initialTemplate, selectedStore?.id, setTemplateData]);

  // Sauvegarde automatique toutes les 30 secondes
  useEffect(() => {
    if (hasUnsavedChanges && selectedStore?.id) {
      const autoSave = setInterval(() => {
        handleSave(true); // true pour sauvegarde silencieuse
      }, 30000);

      return () => clearInterval(autoSave);
    }
  }, [hasUnsavedChanges, selectedStore?.id, handleSave]);
};