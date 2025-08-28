
import { TemplateBlock } from '@/types/template';

interface VideoBlockProps {
  block: TemplateBlock;
  isEditing: boolean;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  onUpdate?: (block: TemplateBlock) => void;
}

const VideoBlock = ({ block, isEditing, viewMode, onUpdate }: VideoBlockProps) => {
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

  const handleContentUpdate = (field: string, value: string) => {
    if (onUpdate) {
      onUpdate({
        ...block,
        content: { ...block.content, [field]: value }
      });
    }
  };

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
        {isEditing ? (
          <h2 
            className={`font-bold text-center mb-12 ${viewMode === 'mobile' ? 'text-xl' : 'text-3xl'}`}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleContentUpdate('title', (e.target as HTMLElement).textContent || '')}
            onInput={(e) => handleContentUpdate('title', (e.target as HTMLElement).textContent || '')}
          >
            {block.content.title || 'Notre vidéo'}
          </h2>
        ) : (
          <h2 className={`font-bold text-center mb-12 ${viewMode === 'mobile' ? 'text-xl' : 'text-3xl'}`}>
            {block.content.title || 'Notre vidéo'}
          </h2>
        )}
        <div className="max-w-4xl mx-auto">
          {block.content.videoUrl ? (
            <div className="aspect-video">
              <video 
                className="w-full h-full rounded-lg"
                controls={block.content.controls !== false}
                autoPlay={block.content.autoplay === true}
                muted={block.content.autoplay === true}
                src={block.content.videoUrl}
              >
                Votre navigateur ne supporte pas la lecture vidéo.
              </video>
            </div>
          ) : (
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">🎥</div>
                <p className="text-gray-600">Aucune vidéo sélectionnée</p>
                <p className="text-sm text-gray-500 mt-2">Utilisez l'éditeur pour ajouter une vidéo</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoBlock;
