
import { TemplateBlock } from '@/types/template';
import HeroBackground from './hero/HeroBackground';
import HeroContent from './hero/HeroContent';
import { useHeroHandlers } from './hero/useHeroHandlers';

interface HeroBlockProps {
  block: TemplateBlock;
  isEditing: boolean;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  onUpdate?: (block: TemplateBlock) => void;
}

const HeroBlock = ({ block, isEditing, viewMode, onUpdate }: HeroBlockProps) => {
  const { handleContentUpdate } = useHeroHandlers({ block, onUpdate });

  return (
    <HeroBackground block={block} viewMode={viewMode}>
      <HeroContent 
        block={block}
        isEditing={isEditing}
        viewMode={viewMode}
        onContentUpdate={handleContentUpdate}
      />
    </HeroBackground>
  );
};

export default HeroBlock;
