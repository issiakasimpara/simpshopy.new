
import { TemplateBlock } from '@/types/template';

interface ContactBlockProps {
  block: TemplateBlock;
  isEditing: boolean;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  onUpdate?: (block: TemplateBlock) => void;
}

const ContactBlock = ({ block, isEditing, viewMode, onUpdate }: ContactBlockProps) => {
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
        backgroundColor: block.styles?.backgroundColor || '#F8F9FA',
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
            {block.content.title || 'Contactez-nous'}
          </h2>
        ) : (
          <h2 className={`font-bold text-center mb-12 ${viewMode === 'mobile' ? 'text-xl' : 'text-3xl'}`}>
            {block.content.title || 'Contactez-nous'}
          </h2>
        )}
        <div className={`grid gap-12 ${viewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
          {block.content.showForm && (
            <div>
              <h3 className="text-xl font-semibold mb-6">Formulaire de contact</h3>
              <form className="space-y-4">
                <input type="text" placeholder="Nom" className="w-full p-3 border rounded-lg" />
                <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg" />
                <textarea placeholder="Message" rows={5} className="w-full p-3 border rounded-lg"></textarea>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Envoyer
                </button>
              </form>
            </div>
          )}
          {block.content.showInfo && (
            <div>
              <h3 className="text-xl font-semibold mb-6">Informations de contact</h3>
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <p>
                      <strong>Adresse:</strong>
                      <span 
                        className="ml-2 cursor-text"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleContentUpdate('address', (e.target as HTMLElement).textContent || '')}
                        onInput={(e) => handleContentUpdate('address', (e.target as HTMLElement).textContent || '')}
                      >
                        {block.content.address || '123 Rue Example, 75001 Paris'}
                      </span>
                    </p>
                    <p>
                      <strong>Téléphone:</strong>
                      <span 
                        className="ml-2 cursor-text"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleContentUpdate('phone', (e.target as HTMLElement).textContent || '')}
                        onInput={(e) => handleContentUpdate('phone', (e.target as HTMLElement).textContent || '')}
                      >
                        {block.content.phone || '+33 1 23 45 67 89'}
                      </span>
                    </p>
                    <p>
                      <strong>Email:</strong>
                      <span 
                        className="ml-2 cursor-text"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleContentUpdate('email', (e.target as HTMLElement).textContent || '')}
                        onInput={(e) => handleContentUpdate('email', (e.target as HTMLElement).textContent || '')}
                      >
                        {block.content.email || 'contact@example.com'}
                      </span>
                    </p>
                  </>
                ) : (
                  <>
                    <p><strong>Adresse:</strong> {block.content.address || '123 Rue Example, 75001 Paris'}</p>
                    <p><strong>Téléphone:</strong> {block.content.phone || '+33 1 23 45 67 89'}</p>
                    <p><strong>Email:</strong> {block.content.email || 'contact@example.com'}</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactBlock;
