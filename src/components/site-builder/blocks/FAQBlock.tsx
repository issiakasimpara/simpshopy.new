
import { TemplateBlock } from '@/types/template';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FAQBlockProps {
  block: TemplateBlock;
  isEditing?: boolean;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
  onUpdate?: (block: TemplateBlock) => void;
}

const FAQBlock = ({ block, isEditing = false, viewMode = 'desktop' }: FAQBlockProps) => {
  const { title, subtitle, faqs } = block.content;

  const getResponsiveClasses = () => {
    switch (viewMode) {
      case 'mobile':
        return 'px-4 text-sm';
      case 'tablet':
        return 'px-6 text-base';
      default:
        return 'px-8 text-base';
    }
  };

  const getContainerClasses = () => {
    switch (viewMode) {
      case 'mobile':
        return 'max-w-full';
      case 'tablet':
        return 'max-w-3xl';
      default:
        return 'max-w-4xl';
    }
  };

  return (
    <section
      className={`py-16 ${getResponsiveClasses()}`}
      style={{
        backgroundColor: block.styles.backgroundColor,
        color: block.styles.textColor,
        padding: block.styles.padding
      }}
    >
      <div className={`container mx-auto ${getContainerClasses()}`}>
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
            )}
          </div>
        )}

        {faqs && faqs.length > 0 && (
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq: any, index: number) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white bg-opacity-10 rounded-lg border border-gray-200 px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-lg">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        {(!faqs || faqs.length === 0) && isEditing && (
          <div className="text-center py-12 bg-gray-100 rounded-lg">
            <p className="text-gray-500">Aucune question FAQ configurée. Utilisez le panneau de propriétés pour ajouter des questions.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQBlock;
