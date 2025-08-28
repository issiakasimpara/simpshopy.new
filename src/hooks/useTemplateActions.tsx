import { useCallback } from 'react';
import { Template } from '@/types/template';
import { useToast } from '@/hooks/use-toast';
import { validateStoreAccess } from '@/utils/validation';

interface UseTemplateActionsProps {
  selectedStore: any;
  templateData: Template;
  setHasUnsavedChanges: (value: boolean) => void;
  setShowPreview: (value: boolean) => void;
  saveTemplate: (store_id: string, template_id: string, template_data: any, is_published?: boolean) => Promise<string>;
}

export const useTemplateActions = ({
  selectedStore,
  templateData,
  setHasUnsavedChanges,
  setShowPreview,
  saveTemplate
}: UseTemplateActionsProps) => {
  const { toast } = useToast();

  const handleSave = useCallback(async (silent = false) => {
    console.log('🔧 handleSave called:', {
      selectedStore: selectedStore?.id,
      templateId: templateData.id,
      silent
    });

    if (!selectedStore?.id) {
      console.error('❌ No selectedStore found for save');
      toast({
        title: "Erreur de sauvegarde",
        description: "Aucune boutique trouvée. Veuillez créer une boutique d'abord ou rafraîchir la page.",
        variant: "destructive"
      });
      return;
    }

    // Valider que le store est accessible
    const isStoreValid = await validateStoreAccess(selectedStore.id);
    if (!isStoreValid) {
      console.error('❌ Store not accessible:', selectedStore.id);
      toast({
        title: "Erreur de sauvegarde",
        description: "La boutique n'est pas accessible. Veuillez vérifier votre connexion ou rafraîchir la page.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('💾 Saving template...', {
        storeId: selectedStore.id,
        templateId: templateData.id,
        isPublished: false
      });

      await saveTemplate(selectedStore.id, templateData.id, templateData, false);
      setHasUnsavedChanges(false);

      if (!silent) {
        toast({
          title: "Template sauvegardé",
          description: "Vos personnalisations ont été enregistrées avec succès.",
        });
      }

      console.log('✅ Template saved successfully');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder vos modifications.",
        variant: "destructive"
      });
    }
  }, [selectedStore?.id, templateData, saveTemplate, setHasUnsavedChanges, toast]);

  const handlePreview = useCallback(() => {
    // Ouvrir l'aperçu
    setShowPreview(true);

    toast({
      title: "Aperçu ouvert",
      description: "L'aperçu reflète vos modifications en temps réel.",
    });
  }, [setShowPreview, toast]);

  const handlePublish = useCallback(async () => {
    console.log('🚀 handlePublish called:', {
      selectedStore: selectedStore?.id,
      templateId: templateData.id
    });

    if (!selectedStore?.id) {
      console.error('❌ No selectedStore found for publish');
      toast({
        title: "Erreur de publication",
        description: "Aucune boutique trouvée. Veuillez créer une boutique d'abord ou rafraîchir la page.",
        variant: "destructive"
      });
      return;
    }

    // Valider que le store est accessible
    const isStoreValid = await validateStoreAccess(selectedStore.id);
    if (!isStoreValid) {
      console.error('❌ Store not accessible for publish:', selectedStore.id);
      toast({
        title: "Erreur de publication",
        description: "La boutique n'est pas accessible. Veuillez vérifier votre connexion ou rafraîchir la page.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('📤 Publishing template...', {
        storeId: selectedStore.id,
        templateId: templateData.id,
        isPublished: true
      });

      await saveTemplate(selectedStore.id, templateData.id, templateData, true);
      setHasUnsavedChanges(false);

      toast({
        title: "Site publié",
        description: "Votre site est maintenant en ligne avec toutes vos modifications !",
      });

      console.log('✅ Template published successfully');
    } catch (error) {
      console.error('❌ Erreur lors de la publication:', error);
      toast({
        title: "Erreur de publication",
        description: "Impossible de publier votre site.",
        variant: "destructive"
      });
    }
  }, [selectedStore?.id, templateData, saveTemplate, setHasUnsavedChanges, toast]);

  return {
    handleSave,
    handlePreview,
    handlePublish,
  };
};