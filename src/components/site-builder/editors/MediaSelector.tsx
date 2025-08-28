
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import MediaManager from '../MediaManager';

interface MediaSelectorProps {
  fieldKey: string;
  label: string;
  currentValue: string;
  acceptedTypes?: string;
  onMediaSelect: (url: string, type: 'image' | 'video' | 'file', fieldKey: string) => void;
}

const MediaSelector = ({ 
  fieldKey, 
  label, 
  currentValue, 
  acceptedTypes = "image/*", 
  onMediaSelect 
}: MediaSelectorProps) => {
  const [showMediaManager, setShowMediaManager] = useState(false);

  const handleMediaSelect = (url: string, type: 'image' | 'video' | 'file') => {
    onMediaSelect(url, type, fieldKey);
    setShowMediaManager(false);
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs sm:text-sm">{label}</Label>
      <div className="space-y-2">
        {currentValue && (
          <div className="p-2 border rounded bg-gray-50">
            <p className="text-xs text-gray-600 truncate">{currentValue}</p>
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowMediaManager(true)}
          className="w-full text-xs sm:text-sm h-8 sm:h-9"
        >
          {currentValue ? 'Changer le média' : 'Sélectionner un média'}
        </Button>
        {showMediaManager && (
          <div className="mt-2">
            <MediaManager
              onSelectMedia={handleMediaSelect}
              acceptedTypes={acceptedTypes}
              title={`Sélectionner - ${label}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaSelector;
