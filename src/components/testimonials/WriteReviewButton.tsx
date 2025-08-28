import React from 'react';
import { Edit3, X } from 'lucide-react';

interface WriteReviewButtonProps {
  isFormOpen: boolean;
  onToggleForm: () => void;
  className?: string;
}

export const WriteReviewButton: React.FC<WriteReviewButtonProps> = ({ 
  isFormOpen, 
  onToggleForm, 
  className = '' 
}) => {
  return (
    <div className={`text-center ${className}`}>
      <div className="text-sm text-gray-600 mb-3">
        Partagez votre expérience
      </div>
      
      <button
        onClick={onToggleForm}
        className={`
          inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm
          transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg
          ${isFormOpen 
            ? 'bg-gray-600 text-white hover:bg-gray-700' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
          }
        `}
      >
        {isFormOpen ? (
          <>
            <X className="w-4 h-4" />
            Annuler
          </>
        ) : (
          <>
            <Edit3 className="w-4 h-4" />
            Écrire un avis
          </>
        )}
      </button>
      
      {!isFormOpen && (
        <div className="text-xs text-gray-500 mt-2">
          Aidez les autres clients
        </div>
      )}
    </div>
  );
};
