
import { TemplateBlock } from '@/types/template';
import { useRef } from 'react';

interface TextImageBlockProps {
  block: TemplateBlock;
  isEditing: boolean;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  onUpdate?: (block: TemplateBlock) => void;
}

const TextImageBlock = ({ block, isEditing, viewMode, onUpdate }: TextImageBlockProps) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLSpanElement>(null);

  const getResponsiveClasses = () => {
    switch (viewMode) {
      case 'mobile':
        return 'text-sm px-2';
      case 'tablet':
        return 'text-base px-4';
      default:
        return 'text-base px-6';
    }
  };

  const saveCursorPosition = (element: HTMLElement) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      return preCaretRange.toString().length;
    }
    return 0;
  };

  const restoreCursorPosition = (element: HTMLElement, position: number) => {
    const selection = window.getSelection();
    if (selection && element.firstChild) {
      const range = document.createRange();
      const textNode = element.firstChild;
      const maxPosition = textNode.textContent?.length || 0;
      const safePosition = Math.min(position, maxPosition);
      
      range.setStart(textNode, safePosition);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const handleContentUpdate = (field: string, value: string, elementRef: React.RefObject<HTMLElement>) => {
    if (onUpdate && elementRef.current) {
      const cursorPosition = saveCursorPosition(elementRef.current);
      
      onUpdate({
        ...block,
        content: { ...block.content, [field]: value }
      });

      // Restaurer la position du curseur après le re-render
      setTimeout(() => {
        if (elementRef.current) {
          restoreCursorPosition(elementRef.current, cursorPosition);
        }
      }, 0);
    }
  };

  const isImageLeft = block.content.layout === 'image-left';
  const flexDirection = viewMode === 'mobile' ? 'flex-col' : (isImageLeft ? 'flex-row' : 'flex-row-reverse');
  
  return (
    <div 
      className={`py-16 ${getResponsiveClasses()}`}
      style={{ 
        backgroundColor: block.styles?.backgroundColor || '#FFFFFF',
        color: block.styles?.textColor || '#000000',
        padding: block.styles?.padding
      }}
    >
      <div className="container mx-auto">
        <div className={`flex items-center gap-12 ${flexDirection}`}>
          <div className="flex-1">
            {isEditing ? (
              <>
                <h2 
                  ref={titleRef}
                  className={`font-bold mb-6 ${viewMode === 'mobile' ? 'text-xl' : 'text-3xl'}`}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => handleContentUpdate('title', (e.target as HTMLElement).textContent || '', titleRef)}
                >
                  {block.content.title || 'Votre titre'}
                </h2>
                <p 
                  ref={textRef}
                  className={`mb-6 leading-relaxed ${viewMode === 'mobile' ? 'text-sm' : 'text-lg'}`}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => handleContentUpdate('text', (e.target as HTMLElement).textContent || '', textRef)}
                >
                  {block.content.text || 'Votre texte descriptif ici...'}
                </p>
                <span 
                  ref={buttonRef}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block cursor-text"
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => handleContentUpdate('buttonText', (e.target as HTMLElement).textContent || '', buttonRef)}
                >
                  {block.content.buttonText || 'En savoir plus'}
                </span>
              </>
            ) : (
              <>
                <h2 className={`font-bold mb-6 ${viewMode === 'mobile' ? 'text-xl' : 'text-3xl'}`}>
                  {block.content.title || 'Votre titre'}
                </h2>
                <p className={`mb-6 leading-relaxed ${viewMode === 'mobile' ? 'text-sm' : 'text-lg'}`}>
                  {block.content.text || 'Votre texte descriptif ici...'}
                </p>
                {block.content.buttonLink ? (
                  <a href={block.content.buttonLink} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors" target={block.content.buttonLink.startsWith('http') ? '_blank' : undefined} rel={block.content.buttonLink.startsWith('http') ? 'noopener noreferrer' : undefined}>
                    {block.content.buttonText || 'En savoir plus'}
                  </a>
                ) : (
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    {block.content.buttonText || 'En savoir plus'}
                  </button>
                )}
              </>
            )}
          </div>
          <div className="flex-1">
            <img 
              src={block.content.imageUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8'} 
              alt={block.content.title || 'Image'}
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextImageBlock;
