
import { TemplateBlock } from '@/types/template';

interface HeroBackgroundProps {
  block: TemplateBlock;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  children: React.ReactNode;
}

const HeroBackground = ({ block, viewMode, children }: HeroBackgroundProps) => {
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

  const backgroundStyle = {
    backgroundColor: block.styles?.backgroundColor || '#3B82F6',
    color: block.styles?.textColor || '#FFFFFF',
    padding: block.styles?.padding,
    backgroundImage: block.content.backgroundImage ? `url(${block.content.backgroundImage})` : undefined
  };

  return (
    <div 
      className={`relative min-h-[400px] flex items-center justify-center bg-cover bg-center ${getResponsiveClasses()}`}
      style={backgroundStyle}
    >
      {block.content.backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      )}
      <div className="text-center z-10 max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  );
};

export default HeroBackground;
