
import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  viewMode: 'desktop' | 'tablet' | 'mobile';
}

const ProductImageGallery = ({ images, productName, viewMode }: ProductImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showZoom, setShowZoom] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="space-y-4">
        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📸</div>
            <span className="text-gray-500">Aucune image</span>
          </div>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const getGridCols = () => {
    if (viewMode === 'mobile') return 'grid-cols-3';
    return 'grid-cols-4';
  };

  return (
    <div className="space-y-4">
      {/* Image principale */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
        <img 
          src={images[currentImageIndex]} 
          alt={`${productName} ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Contrôles de navigation */}
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Bouton zoom */}
        <Button
          variant="outline"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
          onClick={() => setShowZoom(true)}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        {/* Indicateur de position */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Miniatures */}
      {images.length > 1 && (
        <div className={`grid ${getGridCols()} gap-2`}>
          {images.slice(0, viewMode === 'mobile' ? 6 : 8).map((image, index) => (
            <div 
              key={index} 
              className={`aspect-square bg-gray-100 rounded cursor-pointer overflow-hidden border-2 transition-all ${
                index === currentImageIndex ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
              }`}
              onClick={() => setCurrentImageIndex(index)}
            >
              <img 
                src={image} 
                alt={`${productName} ${index + 1}`}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
