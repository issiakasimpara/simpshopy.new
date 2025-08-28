
import { TemplateBlock } from '@/types/template';

interface GuaranteesBlockProps {
  block: TemplateBlock;
  isEditing?: boolean;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
  onUpdate?: (block: TemplateBlock) => void;
}

const GuaranteesBlock = ({ 
  block, 
  isEditing = false, 
  viewMode = 'desktop',
  onUpdate 
}: GuaranteesBlockProps) => {
  const { guarantees = [] } = block.content;

  const getContainerClasses = () => {
    const base = 'py-8';
    if (viewMode === 'mobile') return `${base} px-4`;
    if (viewMode === 'tablet') return `${base} px-6`;
    return `${base} px-8`;
  };

  const getGridClasses = () => {
    if (viewMode === 'mobile') return 'space-y-4';
    return 'grid grid-cols-1 md:grid-cols-3 gap-6';
  };

  if (!guarantees.length) {
    return (
      <div className={getContainerClasses()}>
        <div className="container mx-auto">
          <div className="text-center py-8">
            <p className="text-gray-500">Aucune garantie configurée</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={getContainerClasses()}
      style={{
        backgroundColor: block.styles.backgroundColor || '#ffffff',
        color: block.styles.textColor || '#374151',
      }}
    >
      <div className="container mx-auto">
        {block.content.title && (
          <h2 className="text-2xl font-bold text-center mb-8">
            {block.content.title}
          </h2>
        )}
        
        <div className={getGridClasses()}>
          {guarantees.map((guarantee: any, index: number) => (
            <div 
              key={index}
              className="flex items-center gap-3 p-4 rounded-lg bg-gray-50"
            >
              <div className="text-2xl">
                {guarantee.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {guarantee.title}
                </h3>
                {guarantee.description && (
                  <p className="text-sm text-gray-600">
                    {guarantee.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuaranteesBlock;
