
import { blockTemplates } from '@/data/blockTemplates';
import BlockLibraryItem from './BlockLibraryItem';
import { TemplateBlock } from '@/types/template';

interface BlockLibraryProps {
  onBlockAdd: (block: TemplateBlock) => void;
}

const BlockLibrary = ({ onBlockAdd }: BlockLibraryProps) => {
  // Types de blocs supportés (synchronisé avec TemplateBlock)
  const supportedBlockTypes = [
    'announcement', 'branding', 'hero', 'products', 'product-detail', 'text-image', 'text-video', 'video',
    'testimonials', 'newsletter', 'contact', 'gallery', 'features',
    'team', 'faq', 'before-after', 'footer', 'cart', 'checkout', 'comparison', 'guarantees',

  ];

  const handleAddBlock = (blockTemplate: any) => {
    const newBlock: TemplateBlock = {
      id: `${blockTemplate.type}-${Date.now()}`,
      type: blockTemplate.type,
      content: blockTemplate.content,
      styles: blockTemplate.styles,
      order: 0
    };
    onBlockAdd(newBlock);
  };

  // Filtrer les blocs pour ne montrer que ceux supportés
  const filteredBlockTemplates = blockTemplates.filter(blockTemplate =>
    supportedBlockTypes.includes(blockTemplate.type)
  );

  return (
    <div className="space-y-3 sm:space-y-4">
      <h3 className="font-semibold text-xs sm:text-sm">Bibliothèque de blocs</h3>
      <div className="grid gap-2 sm:gap-3">
        {filteredBlockTemplates.map((blockTemplate) => (
          <BlockLibraryItem
            key={blockTemplate.type}
            blockType={blockTemplate}
            onAddBlock={handleAddBlock}
          />
        ))}
      </div>
    </div>
  );
};

export default BlockLibrary;
