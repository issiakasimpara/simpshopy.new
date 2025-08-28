import React from 'react';
import { Loader2 } from 'lucide-react';

interface StorefrontPreloadingIndicatorProps {
  isPreloading: boolean;
  isVisible: boolean;
}

const StorefrontPreloadingIndicator: React.FC<StorefrontPreloadingIndicatorProps> = ({
  isPreloading,
  isVisible
}) => {
  if (!isVisible || !isPreloading) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3 flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        <span className="text-sm text-gray-600 font-medium">
          Optimisation en cours...
        </span>
      </div>
    </div>
  );
};

export default StorefrontPreloadingIndicator;
