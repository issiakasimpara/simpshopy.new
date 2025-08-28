
import { TemplateBlock } from '@/types/template';
import AutoplayCarousel from './AutoplayCarousel';

interface GalleryBlockProps {
  block: TemplateBlock;
  isEditing: boolean;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  onUpdate?: (block: TemplateBlock) => void;
}

const GalleryBlock = ({ block, isEditing, viewMode, onUpdate }: GalleryBlockProps) => {
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

  const gridCols = viewMode === 'mobile' ? 'grid-cols-1' : 
                   viewMode === 'tablet' ? 'grid-cols-2' : 
                   `grid-cols-${block.content.columns || 3}`;
  
  // Utiliser les images personnalisées si disponibles, sinon utiliser les images par défaut
  const customImages = block.content.images || [];
  const defaultImages = [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'
  ];
  
  const allImages = customImages.length > 0 ? customImages : defaultImages;
  const displayMode = block.content.displayMode || 'grid';
  const maxImages = block.content.maxImages || 5;
  const images = displayMode === 'slideshow' ? allImages.slice(0, maxImages) : allImages;

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
            {block.content.title || 'Notre galerie'}
          </h2>
        ) : (
          <h2 className={`font-bold text-center mb-12 ${viewMode === 'mobile' ? 'text-xl' : 'text-3xl'}`}>
            {block.content.title || 'Notre galerie'}
          </h2>
        )}
        
        {images.length > 0 ? (
          displayMode === 'slideshow' ? (
            <AutoplayCarousel
              images={images}
              autoplay={block.content.autoplay !== false}
              autoplayDelay={block.content.autoplayDelay || 3}
              showTitles={block.content.showTitles || false}
              className="w-full max-w-4xl mx-auto"
            />
          ) : (
            <div className={`grid ${gridCols} gap-6`}>
              {images.slice(0, 12).map((imageUrl: string, index: number) => (
                <div key={index} className="group cursor-pointer overflow-hidden rounded-lg shadow-md">
                  <img 
                    src={imageUrl} 
                    alt={`Galerie image ${index + 1}`}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {block.content.showTitles && (
                    <div className="p-4 bg-white">
                      <p className="text-sm font-medium">Image {index + 1}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🖼️</div>
            <p className="text-gray-600">Aucune image dans la galerie</p>
            <p className="text-sm text-gray-500 mt-2">Utilisez l'éditeur pour ajouter des images</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryBlock;
