
import { TemplateBlock } from '@/types/template';

interface UseHeroHandlersProps {
  block: TemplateBlock;
  onUpdate?: (block: TemplateBlock) => void;
}

export const useHeroHandlers = ({ block, onUpdate }: UseHeroHandlersProps) => {
  const handleContentUpdate = (field: string, value: string) => {
    if (onUpdate) {
      onUpdate({
        ...block,
        content: { ...block.content, [field]: value }
      });
    }
  };

  return { handleContentUpdate };
};
