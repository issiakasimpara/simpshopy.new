
import { Template, TemplateBlock } from '@/types/template';
import EditorHeader from './EditorHeader';
import EditorSidebar from './EditorSidebar';
import EditorCanvas from './EditorCanvas';
import EditorPropertiesPanel from './EditorPropertiesPanel';
import SitePreview from './SitePreview';
import SiteSettings from './SiteSettings';
import CartWidget from './blocks/CartWidget';
import type { Tables } from '@/integrations/supabase/types';

type Store = Tables<'stores'>;

interface TemplateEditorLayoutProps {
  // Template data
  templateData: Template;
  currentPage: string;
  selectedBlock: TemplateBlock | null;
  pageBlocks: TemplateBlock[];
  
  // UI state
  viewMode: 'desktop' | 'tablet' | 'mobile';
  showStylePanel: boolean;
  showPreview: boolean;
  showSettings: boolean;
  hasUnsavedChanges: boolean;
  isSaving?: boolean;
  
  // Store
  selectedStore: Store | null;
  
  // Handlers
  onBack: () => void;
  onViewModeChange: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  onSave: () => void;
  onPreview: () => void;
  onPublish: () => void;
  onPageChange: (page: string) => void;
  onBlockAdd: (block: TemplateBlock) => void;
  onBlockSelect: (block: TemplateBlock) => void;
  onBlockUpdate: (block: TemplateBlock) => void;
  onBlockDelete: (blockId: string) => void;
  onBlockReorder: (draggedBlockId: string, targetBlockId: string) => void;
  onTemplateUpdate: (template: Template) => void;
  onToggleSettings: () => void;
  onToggleStylePanel: () => void;
  onClosePreview: () => void;
  onClosePropertiesPanel: () => void;
  
  // History handlers
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

const TemplateEditorLayout = ({
  templateData,
  currentPage,
  selectedBlock,
  pageBlocks,
  viewMode,
  showStylePanel,
  showPreview,
  showSettings,
  hasUnsavedChanges,
  isSaving = false,
  selectedStore,
  onBack,
  onViewModeChange,
  onSave,
  onPreview,
  onPublish,
  onPageChange,
  onBlockAdd,
  onBlockSelect,
  onBlockUpdate,
  onBlockDelete,
  onBlockReorder,
  onTemplateUpdate,
  onToggleSettings,
  onToggleStylePanel,
  onClosePreview,
  onClosePropertiesPanel,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}: TemplateEditorLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <EditorHeader
        templateName={templateData.name}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        onBack={onBack}
        onSave={onSave}
        onPreview={onPreview}
        onPublish={onPublish}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        onUndo={onUndo}
        onRedo={onRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        hasStore={!!selectedStore}
      />

      <EditorSidebar
        template={templateData}
        currentPage={currentPage}
        onPageChange={onPageChange}
        onBlockAdd={onBlockAdd}
        showSettings={showSettings}
        onToggleSettings={onToggleSettings}
      />

      {showSettings ? (
        <div className="flex-1 mt-20 overflow-y-auto p-6">
          <SiteSettings
            template={templateData}
            onUpdate={onTemplateUpdate}
          />
        </div>
      ) : (
        <EditorCanvas
          blocks={pageBlocks}
          selectedBlock={selectedBlock}
          viewMode={viewMode}
          onBlockSelect={onBlockSelect}
          onBlockUpdate={onBlockUpdate}
          onBlockDelete={onBlockDelete}
          onBlockReorder={onBlockReorder}
          selectedStore={selectedStore}
        />
      )}

      {selectedBlock && !showSettings && (
        <EditorPropertiesPanel
          selectedBlock={selectedBlock}
          showStylePanel={showStylePanel}
          onToggleStylePanel={onToggleStylePanel}
          onBlockUpdate={onBlockUpdate}
          onClose={onClosePropertiesPanel}
          selectedStore={selectedStore}
        />
      )}

      <SitePreview
        template={templateData}
        currentPage={currentPage}
        blocks={pageBlocks}
        open={showPreview}
        onClose={onClosePreview}
      />

      {/* Widget de panier flottant disponible partout */}
      <CartWidget />
    </div>
  );
};

export default TemplateEditorLayout;
