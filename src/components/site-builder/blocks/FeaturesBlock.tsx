
import { TemplateBlock } from '@/types/template';

interface FeaturesBlockProps {
  block: TemplateBlock;
  isEditing: boolean;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  onUpdate?: (block: TemplateBlock) => void;
}

const FeaturesBlock = ({ block, isEditing, viewMode, onUpdate }: FeaturesBlockProps) => {
  const getResponsiveClasses = () => {
    switch (viewMode) {
      case 'mobile':
        return 'text-sm px-4';
      case 'tablet':
        return 'text-base px-6';
      default:
        return 'text-base px-8';
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

  const gridCols = viewMode === 'mobile' ? 'grid-cols-1' : viewMode === 'tablet' ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-3';

  const defaultFeatures = [
    { title: 'Qualité Premium', description: 'Des produits de haute qualité sélectionnés avec soin', icon: '⭐' },
    { title: 'Livraison Rapide', description: 'Livraison express en 24-48h partout en France', icon: '🚚' },
    { title: 'Support Client', description: 'Une équipe dédiée disponible 7j/7 pour vous accompagner', icon: '💬' }
  ];

  const features = block.content.features || defaultFeatures;

  return (
    <div 
      className={`py-20 ${getResponsiveClasses()}`}
      style={{ 
        backgroundColor: block.styles?.backgroundColor || '#FAFBFC',
        color: block.styles?.textColor || '#1F2937',
        padding: block.styles?.padding
      }}
    >
      <div className="container mx-auto max-w-6xl">
        {isEditing ? (
          <h2 
            className={`font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${viewMode === 'mobile' ? 'text-2xl' : 'text-4xl'}`}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleContentUpdate('title', (e.target as HTMLElement).textContent || '')}
            onInput={(e) => handleContentUpdate('title', (e.target as HTMLElement).textContent || '')}
          >
            {block.content.title || 'Nos avantages'}
          </h2>
        ) : (
          <h2 className={`font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${viewMode === 'mobile' ? 'text-2xl' : 'text-4xl'}`}>
            {block.content.title || 'Nos avantages'}
          </h2>
        )}
        
        <div className={`grid ${gridCols} gap-8`}>
          {features.map((feature: any, index: number) => (
            <div 
              key={index} 
              className="group relative text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:border-blue-200"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-6 group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                
                <h3 className="font-bold text-xl mb-4 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
              
              {/* Subtle border effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesBlock;
