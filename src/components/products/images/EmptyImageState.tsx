
import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

const EmptyImageState = () => {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <p className="text-gray-600 mb-2">Aucune image ajoutée</p>
      <p className="text-sm text-gray-500">
        Ajoutez des images pour améliorer la présentation de votre produit
      </p>
    </div>
  );
};

export default EmptyImageState;
