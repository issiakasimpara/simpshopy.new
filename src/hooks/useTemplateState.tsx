import { Template } from '@/types/template';
import { useStores } from '@/hooks/useStores';
import { useSiteTemplates } from '@/hooks/useSiteTemplates';
import { useTemplateHistory } from '@/hooks/useTemplateHistory';
import { useTemplateStateCore } from '@/hooks/useTemplateStateCore';
import { useTemplateActions } from '@/hooks/useTemplateActions';
import { useTemplateSync } from '@/hooks/useTemplateSync';
import { useTemplateHistoryHandlers } from '@/hooks/useTemplateHistoryHandlers';

interface UseTemplateStateProps {
  initialTemplate: Template;
}

export const useTemplateState = ({ initialTemplate }: UseTemplateStateProps) => {
  const { stores } = useStores();
  const selectedStore = stores.length > 0 ? stores[0] : null;
  const { saveTemplate, loadTemplate } = useSiteTemplates(selectedStore?.id);

  // Debug logs
  console.log('🏪 useTemplateState:', {
    storesCount: stores.length,
    selectedStore: selectedStore?.id,
    selectedStoreName: selectedStore?.name
  });
  
  const {
    currentPage,
    selectedBlock,
    viewMode,
    showStylePanel,
    showPreview,
    showSettings,
    templateData,
    hasUnsavedChanges,
    setCurrentPage,
    setSelectedBlock,
    setViewMode,
    setShowStylePanel,
    setShowPreview,
    setShowSettings,
    setTemplateData,
    setHasUnsavedChanges,
  } = useTemplateStateCore(initialTemplate);

  const { handleSave, handlePreview, handlePublish } = useTemplateActions({
    selectedStore,
    templateData,
    setHasUnsavedChanges,
    setShowPreview,
    saveTemplate
  });

  const {
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useTemplateHistory({
    initialTemplate,
    onTemplateChange: (template: Template) => {
      setTemplateData(template);
      setHasUnsavedChanges(true);
    }
  });

  const {
    handleTemplateUpdate,
    handleUndo,
    handleRedo,
  } = useTemplateHistoryHandlers({
    templateData,
    setTemplateData,
    setHasUnsavedChanges,
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  });

  useTemplateSync({
    selectedStore,
    initialTemplate,
    setTemplateData,
    hasUnsavedChanges,
    handleSave,
    loadTemplate
  });

  return {
    // State
    currentPage,
    selectedBlock,
    viewMode,
    showStylePanel,
    showPreview,
    showSettings,
    templateData,
    hasUnsavedChanges,
    
    // Setters
    setCurrentPage,
    setSelectedBlock,
    setViewMode,
    setShowStylePanel,
    setShowPreview,
    setShowSettings,
    setTemplateData,
    setHasUnsavedChanges,
    
    // Handlers
    handleSave,
    handlePreview,
    handlePublish,
    handleTemplateUpdate,
    
    // History
    undo: handleUndo,
    redo: handleRedo,
    canUndo,
    canRedo,
  };
};