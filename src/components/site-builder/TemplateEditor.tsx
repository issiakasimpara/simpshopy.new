
import { useEffect } from 'react';
import { Template } from '@/types/template';
import { useStores } from '@/hooks/useStores';
import { useTemplateState } from '@/hooks/useTemplateState';
import { useTemplateOperations } from '@/hooks/useTemplateOperations';
import { useSiteTemplates } from '@/hooks/useSiteTemplates';
import TemplateEditorLayout from './TemplateEditorLayout';

interface TemplateEditorProps {
  template: Template;
  onBack: () => void;
}

const TemplateEditor = ({ template, onBack }: TemplateEditorProps) => {
  const { stores, isLoading: storesLoading, refetchStores } = useStores();
  const selectedStore = stores.length > 0 ? stores[0] : null;
  const { isSaving } = useSiteTemplates(selectedStore?.id);

  // Debug logs pour identifier le problème
  console.log('🏪 TemplateEditor Debug:', {
    storesCount: stores.length,
    selectedStore: selectedStore?.id,
    selectedStoreName: selectedStore?.name,
    storesLoading
  });

  // Si pas de store et pas en cours de chargement, essayer de rafraîchir
  useEffect(() => {
    if (!selectedStore && !storesLoading) {
      console.log('🔄 Aucun store trouvé, tentative de rafraîchissement...');

      // Essayer plusieurs fois avec un délai
      const attemptRefresh = async () => {
        for (let i = 0; i < 3; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log(`🔄 Tentative ${i + 1}/3 de rafraîchissement...`);
          await refetchStores();

          // Vérifier si on a maintenant un store
          if (stores.length > 0) {
            console.log('✅ Store trouvé après rafraîchissement');
            break;
          }
        }
      };

      attemptRefresh();
    }
  }, [selectedStore, storesLoading, refetchStores, stores.length]);

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
    handleSave,
    handlePreview,
    handlePublish,
    handleTemplateUpdate,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useTemplateState({ initialTemplate: template });

  const {
    pageBlocks,
    handlePageChange,
    handleBlockSelect,
    handleBlockUpdate,
    handleBlockAdd,
    handleBlockDelete,
    handleBlockReorder,
  } = useTemplateOperations({
    templateData,
    currentPage,
    selectedBlock,
    onTemplateUpdate: handleTemplateUpdate,
    setSelectedBlock,
  });

  const wrappedPageChange = (page: string) => {
    setCurrentPage(page);
    handlePageChange(page);
  };

  const handleClosePropertiesPanel = () => {
    setSelectedBlock(null);
  };

  return (
    <TemplateEditorLayout
      templateData={templateData}
      currentPage={currentPage}
      selectedBlock={selectedBlock}
      pageBlocks={pageBlocks}
      viewMode={viewMode}
      showStylePanel={showStylePanel}
      showPreview={showPreview}
      showSettings={showSettings}
      hasUnsavedChanges={hasUnsavedChanges}
      isSaving={isSaving}
      selectedStore={selectedStore}
      onBack={onBack}
      onViewModeChange={setViewMode}
      onSave={() => handleSave()}
      onPreview={handlePreview}
      onPublish={handlePublish}
      onPageChange={wrappedPageChange}
      onBlockAdd={handleBlockAdd}
      onBlockSelect={handleBlockSelect}
      onBlockUpdate={handleBlockUpdate}
      onBlockDelete={handleBlockDelete}
      onBlockReorder={handleBlockReorder}
      onTemplateUpdate={handleTemplateUpdate}
      onToggleSettings={() => setShowSettings(!showSettings)}
      onToggleStylePanel={() => setShowStylePanel(!showStylePanel)}
      onClosePreview={() => setShowPreview(false)}
      onClosePropertiesPanel={handleClosePropertiesPanel}
      // Nouvelles props pour l'historique
      onUndo={undo}
      onRedo={redo}
      canUndo={canUndo}
      canRedo={canRedo}
    />
  );
};

export default TemplateEditor;
