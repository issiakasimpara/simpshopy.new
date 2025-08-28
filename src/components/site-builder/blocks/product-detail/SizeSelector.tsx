
import { Button } from '@/components/ui/button';

interface SizeOption {
  name: string;
  id: string;
}

interface SizeSelectorProps {
  sizes: SizeOption[];
  selectedSize?: string;
  onSizeSelect: (sizeId: string) => void;
  viewMode: 'desktop' | 'tablet' | 'mobile';
}

const SizeSelector = ({ sizes, selectedSize, onSizeSelect, viewMode }: SizeSelectorProps) => {
  if (sizes.length === 0) return null;

  const getButtonSize = () => {
    return viewMode === 'mobile' ? 'sm' : 'default';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium">Taille</h4>
        <Button variant="link" size="sm" className="text-xs">
          Guide des tailles
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <Button
            key={size.id}
            variant={selectedSize === size.id ? "default" : "outline"}
            size={getButtonSize()}
            className={`min-w-[3rem] ${
              selectedSize === size.id 
                ? 'bg-gray-900 text-white hover:bg-gray-800' 
                : 'hover:border-gray-400'
            }`}
            onClick={() => onSizeSelect(size.id)}
          >
            {size.name}
          </Button>
        ))}
      </div>
      {selectedSize && (
        <p className="text-sm text-gray-600 mt-2">
          Taille sélectionnée: {sizes.find(s => s.id === selectedSize)?.name}
        </p>
      )}
    </div>
  );
};

export default SizeSelector;
