
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TemplateBlock } from '@/types/template';
import { Trash2, Edit, GripVertical } from 'lucide-react';
import BlockRenderer from './BlockRenderer';

interface CanvasEditorProps {
  blocks: TemplateBlock[];
  selectedBlock: TemplateBlock | null;
  onBlockSelect: (block: TemplateBlock) => void;
  onBlockUpdate: (block: TemplateBlock) => void;
  onBlockDelete: (blockId: string) => void;
  onBlockReorder: (draggedBlockId: string, targetBlockId: string) => void;
  viewMode: 'desktop' | 'tablet' | 'mobile';
}

const CanvasEditor = ({
  blocks,
  selectedBlock,
  onBlockSelect,
  onBlockUpdate,
  onBlockDelete,
  onBlockReorder,
  viewMode
}: CanvasEditorProps) => {
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dragOverBlockId, setDragOverBlockId] = useState<string | null>(null);

  const sortedBlocks = blocks.sort((a, b) => a.order - b.order);

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedBlockId(blockId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, blockId: string) => {
    e.preventDefault();
    setDragOverBlockId(blockId);
  };

  const handleDragEnd = () => {
    setDraggedBlockId(null);
    setDragOverBlockId(null);
  };

  const handleDrop = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault();
    if (draggedBlockId && draggedBlockId !== targetBlockId) {
      onBlockReorder(draggedBlockId, targetBlockId);
    }
    setDraggedBlockId(null);
    setDragOverBlockId(null);
  };

  if (blocks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <Edit className="h-16 w-16 mx-auto mb-4" />
          </div>
          <h3 className="text-lg font-medium mb-2">Votre page est vide</h3>
          <p className="text-gray-600">
            Commencez en ajoutant des blocs depuis la bibliothèque
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {sortedBlocks.map((block) => (
        <div
          key={block.id}
          className={`relative group ${
            selectedBlock?.id === block.id ? 'ring-2 ring-blue-500' : ''
          } ${
            dragOverBlockId === block.id ? 'border-t-4 border-blue-500' : ''
          }`}
          draggable
          onDragStart={(e) => handleDragStart(e, block.id)}
          onDragOver={(e) => handleDragOver(e, block.id)}
          onDragEnd={handleDragEnd}
          onDrop={(e) => handleDrop(e, block.id)}
          onClick={() => onBlockSelect(block)}
        >
          {/* Block Controls */}
          <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-1 bg-white shadow-lg rounded-md p-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onBlockSelect(block);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onBlockDelete(block.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Block Content */}
          <BlockRenderer 
            block={block} 
            isEditing={true}
            viewMode={viewMode}
            onUpdate={onBlockUpdate}
          />
        </div>
      ))}
    </div>
  );
};

export default CanvasEditor;
