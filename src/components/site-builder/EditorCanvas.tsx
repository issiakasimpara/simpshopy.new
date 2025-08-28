
import { useState, useEffect, useRef } from 'react';
import { TemplateBlock } from '@/types/template';
import { Button } from '@/components/ui/button';
import { Trash2, GripVertical } from 'lucide-react';
import BlockRenderer from './BlockRenderer';
import type { Tables } from '@/integrations/supabase/types';

type Store = Tables<'stores'>;

interface EditorCanvasProps {
  blocks: TemplateBlock[];
  selectedBlock: TemplateBlock | null;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  selectedStore?: Store | null;
  onBlockSelect: (block: TemplateBlock) => void;
  onBlockUpdate: (block: TemplateBlock) => void;
  onBlockDelete: (blockId: string) => void;
  onBlockReorder: (draggedBlockId: string, targetBlockId: string) => void;
}

const EditorCanvas = ({
  blocks,
  selectedBlock,
  viewMode,
  selectedStore,
  onBlockSelect,
  onBlockUpdate,
  onBlockDelete,
  onBlockReorder
}: EditorCanvasProps) => {
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
  const [dragOverBlock, setDragOverBlock] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState<'top' | 'bottom' | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getCanvasWidth = () => {
    switch (viewMode) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      default:
        return 'w-full';
    }
  };

  // Auto-scroll pendant le drag - VERSION CORRIGÉE
  useEffect(() => {
    let scrollInterval: NodeJS.Timeout | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (!draggedBlock || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const scrollThreshold = 80;

      // Nettoyer l'ancien interval avant d'en créer un nouveau
      if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
      }

      // Scroll vers le haut
      if (e.clientY < rect.top + scrollThreshold && canvas.scrollTop > 0) {
        scrollInterval = setInterval(() => {
          if (canvas.scrollTop > 0) {
            canvas.scrollTop = Math.max(0, canvas.scrollTop - 8);
          }
        }, 20);
      }
      // Scroll vers le bas
      else if (e.clientY > rect.bottom - scrollThreshold) {
        const maxScroll = canvas.scrollHeight - canvas.clientHeight;
        if (canvas.scrollTop < maxScroll) {
          scrollInterval = setInterval(() => {
            if (canvas.scrollTop < maxScroll) {
              canvas.scrollTop = Math.min(maxScroll, canvas.scrollTop + 8);
            }
          }, 20);
        }
      }
    };

    if (draggedBlock) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (scrollInterval) {
        clearInterval(scrollInterval);
      }
    };
  }, [draggedBlock]);

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', blockId);
    setDraggedBlock(blockId);
  };

  const handleDragOver = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault();
    e.stopPropagation();

    // Calculer la position relative dans le bloc
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;
    const position = y < height / 2 ? 'top' : 'bottom';

    // Éviter les updates inutiles avec debounce
    if (dragOverBlock === targetBlockId && dragPosition === position) {
      return;
    }

    // Nettoyer le timeout précédent
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }

    // Debounce les updates pour éviter les vibrations
    dragTimeoutRef.current = setTimeout(() => {
      setDragOverBlock(targetBlockId);
      setDragPosition(position);
    }, 10);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();

    // Ne nettoyer que si on quitte vraiment le bloc (pas ses enfants)
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverBlock(null);
      setDragPosition(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedBlock(null);
    setDragOverBlock(null);
    setDragPosition(null);
  };

  const handleDrop = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const draggedBlockId = e.dataTransfer.getData('text/plain');

    if (draggedBlockId && draggedBlockId !== targetBlockId) {
      onBlockReorder(draggedBlockId, targetBlockId);
    }

    // Nettoyer tous les états
    setDraggedBlock(null);
    setDragOverBlock(null);
    setDragPosition(null);
  };

  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <div ref={canvasRef} className="flex-1 bg-gray-100 overflow-y-auto mt-20">
      <div className={`bg-white min-h-full ${getCanvasWidth()}`}>
        {sortedBlocks.length === 0 ? (
          <div className="flex items-center justify-center h-96 text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-4">📄</div>
              <p>Ajoutez des blocs pour commencer à construire votre page</p>
            </div>
          </div>
        ) : (
          sortedBlocks.map((block) => {
            const isDragging = draggedBlock === block.id;
            const isDragOver = dragOverBlock === block.id;

            return (
              <div
                key={block.id}
                className={`relative group transition-all duration-200 ${
                  selectedBlock?.id === block.id ? 'ring-2 ring-blue-500' : ''
                } ${
                  isDragging ? 'opacity-50 scale-95 shadow-2xl z-50' : ''
                } ${
                  isDragOver && dragPosition === 'top' ? 'border-t-4 border-blue-500' : ''
                } ${
                  isDragOver && dragPosition === 'bottom' ? 'border-b-4 border-blue-500' : ''
                }`}
                draggable={!isDragging} // Désactiver le drag pendant qu'on drag déjà
                onDragStart={(e) => handleDragStart(e, block.id)}
                onDragOver={(e) => handleDragOver(e, block.id)}
                onDragLeave={handleDragLeave}
                onDragEnd={handleDragEnd}
                onDrop={(e) => handleDrop(e, block.id)}
                onClick={() => !isDragging && onBlockSelect(block)}
              >
              {/* Zones de drop visuelles */}
              {isDragOver && dragPosition === 'top' && (
                <div className="absolute -top-2 left-0 right-0 h-4 bg-blue-500/20 border-2 border-dashed border-blue-500 rounded flex items-center justify-center z-20">
                  <span className="text-xs text-blue-600 font-medium bg-white px-2 rounded">
                    Déposer ici
                  </span>
                </div>
              )}

              {isDragOver && dragPosition === 'bottom' && (
                <div className="absolute -bottom-2 left-0 right-0 h-4 bg-blue-500/20 border-2 border-dashed border-blue-500 rounded flex items-center justify-center z-20">
                  <span className="text-xs text-blue-600 font-medium bg-white px-2 rounded">
                    Déposer ici
                  </span>
                </div>
              )}

              {/* Overlay d'édition */}
              <div className={`absolute inset-0 z-10 transition-opacity ${
                isDragging ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100'
              } bg-blue-500/10 ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}>
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 cursor-grab active:cursor-grabbing"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    <GripVertical className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBlockDelete(block.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {block.type}
                  </span>
                </div>
              </div>

              {/* Rendu du bloc */}
              <div className={`transition-all duration-200 ${
                isDragging ? 'max-h-32 overflow-hidden' : ''
              }`}>
                <BlockRenderer
                  block={block}
                  isEditing={true}
                  viewMode={viewMode}
                  onUpdate={onBlockUpdate}
                  selectedStore={selectedStore}
                />

                {/* Overlay de compactage pendant le drag */}
                {isDragging && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90 flex items-end justify-center pb-2">
                    <span className="text-xs text-gray-600 bg-white/80 px-2 py-1 rounded">
                      {block.type} - En cours de déplacement...
                    </span>
                  </div>
                )}
              </div>
            </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EditorCanvas;
