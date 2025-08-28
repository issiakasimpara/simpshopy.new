
import { TemplateBlock } from '@/types/template';

interface HeroContentProps {
  block: TemplateBlock;
  isEditing: boolean;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  onContentUpdate: (field: string, value: string) => void;
}

const HeroContent = ({ block, isEditing, viewMode, onContentUpdate }: HeroContentProps) => {
  const getTitleClasses = () => {
    return `font-bold mb-4 ${viewMode === 'mobile' ? 'text-2xl' : viewMode === 'tablet' ? 'text-4xl' : 'text-4xl md:text-6xl'}`;
  };

  const getSubtitleClasses = () => {
    return `mb-8 ${viewMode === 'mobile' ? 'text-base' : 'text-xl'}`;
  };

  const getButtonClasses = () => {
    return `bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors ${viewMode === 'mobile' ? 'px-4 py-2 text-sm' : ''}`;
  };

  if (isEditing) {
    return (
      <>
        <h1 
          className={getTitleClasses()}
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onContentUpdate('title', (e.target as HTMLElement).textContent || '')}
          onInput={(e) => onContentUpdate('title', (e.target as HTMLElement).textContent || '')}
        >
          {block.content.title || 'Votre titre principal'}
        </h1>
        <p 
          className={getSubtitleClasses()}
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onContentUpdate('subtitle', (e.target as HTMLElement).textContent || '')}
          onInput={(e) => onContentUpdate('subtitle', (e.target as HTMLElement).textContent || '')}
        >
          {block.content.subtitle || 'Votre sous-titre accrocheur'}
        </p>
        <span 
          className={`${getButtonClasses()} inline-block cursor-text`}
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onContentUpdate('buttonText', (e.target as HTMLElement).textContent || '')}
          onInput={(e) => onContentUpdate('buttonText', (e.target as HTMLElement).textContent || '')}
        >
          {block.content.buttonText || 'Découvrir'}
        </span>
      </>
    );
  }

  return (
    <>
      <h1 className={getTitleClasses()}>
        {block.content.title || 'Votre titre principal'}
      </h1>
      <p className={getSubtitleClasses()}>
        {block.content.subtitle || 'Votre sous-titre accrocheur'}
      </p>
      {block.content.buttonLink ? (
        <a href={block.content.buttonLink} className={getButtonClasses()} target={block.content.buttonLink.startsWith('http') ? '_blank' : undefined} rel={block.content.buttonLink.startsWith('http') ? 'noopener noreferrer' : undefined}>
          {block.content.buttonText || 'Découvrir'}
        </a>
      ) : (
        <button className={getButtonClasses()}>
          {block.content.buttonText || 'Découvrir'}
        </button>
      )}
    </>
  );
};

export default HeroContent;
