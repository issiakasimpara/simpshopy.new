
import { TemplateBlock, Template } from '@/types/template';
import { useToast } from '@/hooks/use-toast';

interface UseTemplateOperationsProps {
  templateData: Template;
  currentPage: string;
  selectedBlock: TemplateBlock | null;
  onTemplateUpdate: (template: Template) => void;
  setSelectedBlock: (block: TemplateBlock | null) => void;
}

export const useTemplateOperations = ({
  templateData,
  currentPage,
  selectedBlock,
  onTemplateUpdate,
  setSelectedBlock,
}: UseTemplateOperationsProps) => {
  const { toast } = useToast();

  const pageBlocks = templateData.pages[currentPage] || [];

  const handlePageChange = (page: string) => {
    // Si la page n'existe pas encore, la créer
    if (!templateData.pages[page]) {
      const updatedTemplate = {
        ...templateData,
        pages: {
          ...templateData.pages,
          [page]: []
        }
      };
      onTemplateUpdate(updatedTemplate);
    }
    
    setSelectedBlock(null);
  };

  const handleBlockSelect = (block: TemplateBlock) => {
    setSelectedBlock(block);
  };

  const updatePageBlocks = (newBlocks: TemplateBlock[]) => {
    const updatedTemplate = {
      ...templateData,
      pages: {
        ...templateData.pages,
        [currentPage]: newBlocks
      }
    };
    console.log('updatePageBlocks - Template mis à jour:', updatedTemplate);
    onTemplateUpdate(updatedTemplate);
  };

  const handleBlockUpdate = (updatedBlock: TemplateBlock) => {
    console.log('handleBlockUpdate - Bloc mis à jour:', updatedBlock);
    const updatedBlocks = pageBlocks.map(block => 
      block.id === updatedBlock.id ? updatedBlock : block
    );
    updatePageBlocks(updatedBlocks);
    setSelectedBlock(updatedBlock);
  };

  const handleBlockAdd = (newBlock: TemplateBlock) => {
    console.log('handleBlockAdd - Nouveau bloc:', newBlock);
    const blockWithOrder = {
      ...newBlock,
      id: `${newBlock.type}-${Date.now()}`,
      order: pageBlocks.length + 1
    };
    updatePageBlocks([...pageBlocks, blockWithOrder]);
    toast({
      title: "Bloc ajouté",
      description: "Le bloc a été ajouté à votre page.",
    });
  };

  const handleBlockDelete = (blockId: string) => {
    console.log('handleBlockDelete - Suppression du bloc:', blockId);
    const updatedBlocks = pageBlocks.filter(block => block.id !== blockId);
    // Réorganiser l'ordre
    updatedBlocks.forEach((block, index) => {
      block.order = index + 1;
    });
    updatePageBlocks(updatedBlocks);
    
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
    }
    
    toast({
      title: "Bloc supprimé",
      description: "Le bloc a été retiré de votre page.",
    });
  };

  const handleBlockReorder = (draggedBlockId: string, targetBlockId: string) => {
    console.log('handleBlockReorder - Réorganisation:', draggedBlockId, '->', targetBlockId);
    const draggedBlock = pageBlocks.find(b => b.id === draggedBlockId);
    const targetBlock = pageBlocks.find(b => b.id === targetBlockId);
    
    if (!draggedBlock || !targetBlock) return;

    const newBlocks = [...pageBlocks];
    const draggedIndex = newBlocks.findIndex(b => b.id === draggedBlockId);
    const targetIndex = newBlocks.findIndex(b => b.id === targetBlockId);

    newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(targetIndex, 0, draggedBlock);

    // Mettre à jour l'ordre
    newBlocks.forEach((block, index) => {
      block.order = index + 1;
    });

    updatePageBlocks(newBlocks);
  };

  return {
    pageBlocks,
    handlePageChange,
    handleBlockSelect,
    handleBlockUpdate,
    handleBlockAdd,
    handleBlockDelete,
    handleBlockReorder,
  };
};
