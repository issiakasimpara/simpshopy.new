
import { TemplateBlock } from '@/types/template';
import { Check, X } from 'lucide-react';

interface ComparisonBlockProps {
  block: TemplateBlock;
  isEditing?: boolean;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
}

const ComparisonBlock = ({ block, isEditing = false, viewMode = 'desktop' }: ComparisonBlockProps) => {
  const { title, subtitle, ourColumn, theirColumn, features } = block.content;

  const getResponsiveClasses = () => {
    switch (viewMode) {
      case 'mobile':
        return 'px-4 py-8';
      case 'tablet':
        return 'px-6 py-12';
      default:
        return 'px-8 py-16';
    }
  };

  return (
    <section 
      className={`${getResponsiveClasses()}`}
      style={{
        backgroundColor: block.styles.backgroundColor,
        color: block.styles.textColor,
        padding: block.styles.padding
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-gray-50 border-b">
            <div className="p-4"></div>
            <div className="p-4 text-center font-semibold text-blue-600">
              {ourColumn || 'Nous'}
            </div>
            <div className="p-4 text-center font-semibold text-gray-700">
              {theirColumn || 'Autres'}
            </div>
          </div>

          {/* Table Rows */}
          {features?.map((feature: any, index: number) => (
            <div key={index} className="grid grid-cols-3 border-b last:border-b-0 hover:bg-gray-50">
              <div className="p-4 font-medium">
                {feature.name}
              </div>
              <div className="p-4 text-center">
                {feature.us ? (
                  <Check className="h-6 w-6 text-green-500 mx-auto" />
                ) : (
                  <X className="h-6 w-6 text-red-500 mx-auto" />
                )}
              </div>
              <div className="p-4 text-center">
                {feature.them ? (
                  <Check className="h-6 w-6 text-green-500 mx-auto" />
                ) : (
                  <X className="h-6 w-6 text-red-500 mx-auto" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        {block.content.buttonText && (
          <div className="text-center mt-8">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              {block.content.buttonText}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ComparisonBlock;
