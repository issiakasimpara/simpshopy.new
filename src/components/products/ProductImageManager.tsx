
import React, { useState } from 'react';
import ImageUploadTabs from './images/ImageUploadTabs';
import ImagePreviewGrid from './images/ImagePreviewGrid';
import EmptyImageState from './images/EmptyImageState';

interface ProductImageManagerProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

const ProductImageManager = ({ images, onImagesChange }: ProductImageManagerProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleImagesAdd = (newImages: string[]) => {
    const uniqueImages = newImages.filter(img => !images.includes(img));
    if (uniqueImages.length > 0) {
      onImagesChange([...images, ...uniqueImages]);
    }
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  const setAsMainImage = (index: number) => {
    if (index === 0) return; // Déjà l'image principale
    const newImages = [...images];
    const [mainImage] = newImages.splice(index, 1);
    newImages.unshift(mainImage);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <ImageUploadTabs
        onImagesAdd={handleImagesAdd}
        isUploading={isUploading}
        onUploadingChange={setIsUploading}
      />

      {images.length > 0 ? (
        <ImagePreviewGrid
          images={images}
          onRemoveImage={removeImage}
          onSetAsMainImage={setAsMainImage}
        />
      ) : (
        <EmptyImageState />
      )}
    </div>
  );
};

export default ProductImageManager;
