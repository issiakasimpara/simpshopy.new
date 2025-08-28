
import { useState, useRef, useEffect } from 'react';
import { TemplateBlock } from '@/types/template';

interface BeforeAfterBlockProps {
  block: TemplateBlock;
  isEditing?: boolean;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
  onUpdate?: (block: TemplateBlock) => void;
}

const BeforeAfterBlock = ({ block, isEditing = false, viewMode = 'desktop' }: BeforeAfterBlockProps) => {
  const { title, subtitle, beforeImage, afterImage, beforeLabel, afterLabel, showLabels } = block.content;
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateSliderPosition(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateSliderPosition(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updateSliderPosition(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && e.touches[0]) {
      updateSliderPosition(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const updateSliderPosition = (clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

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

        <div className="max-w-2xl mx-auto">
          {beforeImage && afterImage ? (
            <div
              ref={containerRef}
              className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-lg shadow-lg cursor-col-resize select-none"
              onMouseDown={(e) => e.stopPropagation()} // Empêcher le drag du bloc parent
              draggable={false} // Désactiver le drag HTML5
            >
              {/* Image Avant (arrière-plan) */}
              <div className="absolute inset-0">
                <img
                  src={beforeImage}
                  alt={beforeLabel || "Avant"}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                {showLabels && beforeLabel && (
                  <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm font-medium">
                    {beforeLabel}
                  </div>
                )}
              </div>

              {/* Image Après (avant-plan avec clip) */}
              <div
                className="absolute inset-0"
                style={{
                  clipPath: `polygon(${sliderPosition}% 0%, 100% 0%, 100% 100%, ${sliderPosition}% 100%)`
                }}
              >
                <img
                  src={afterImage}
                  alt={afterLabel || "Après"}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                {showLabels && afterLabel && (
                  <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm font-medium">
                    {afterLabel}
                  </div>
                )}
              </div>

              {/* Curseur de séparation */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-col-resize z-10"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                onMouseDown={(e) => {
                  e.stopPropagation(); // Empêcher le drag du bloc parent
                  handleMouseDown(e);
                }}
                onTouchStart={(e) => {
                  e.stopPropagation(); // Empêcher le drag du bloc parent
                  handleTouchStart(e);
                }}
                draggable={false} // Désactiver le drag HTML5
              >
                {/* Poignée du curseur */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-gray-200 flex items-center justify-center">
                  <div className="flex space-x-0.5">
                    <div className="w-0.5 h-4 bg-gray-400"></div>
                    <div className="w-0.5 h-4 bg-gray-400"></div>
                    <div className="w-0.5 h-4 bg-gray-400"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            isEditing && (
              <div className="w-full h-96 md:h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p className="text-lg font-medium mb-2">Bloc Avant-Après</p>
                  <p className="text-sm">Ajoutez une image "avant" et une image "après" pour commencer</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterBlock;
