
import { Check } from 'lucide-react';

interface ColorOption {
  name: string;
  hex: string;
  id: string;
}

interface ColorSelectorProps {
  colors: ColorOption[];
  selectedColor?: string;
  onColorSelect: (colorId: string) => void;
}

const ColorSelector = ({ colors, selectedColor, onColorSelect }: ColorSelectorProps) => {
  if (colors.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-medium mb-3">Couleur</h4>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.id}
            className={`relative w-10 h-10 rounded-full border-2 transition-all ${
              selectedColor === color.id
                ? 'border-gray-900 shadow-lg'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            style={{ backgroundColor: color.hex }}
            onClick={() => onColorSelect(color.id)}
            title={color.name}
          >
            {selectedColor === color.id && (
              <Check 
                className={`h-4 w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                  color.hex === '#FFFFFF' ? 'text-gray-900' : 'text-white'
                }`} 
              />
            )}
          </button>
        ))}
      </div>
      {selectedColor && (
        <p className="text-sm text-gray-600 mt-2">
          Couleur sélectionnée: {colors.find(c => c.id === selectedColor)?.name}
        </p>
      )}
    </div>
  );
};

export default ColorSelector;
