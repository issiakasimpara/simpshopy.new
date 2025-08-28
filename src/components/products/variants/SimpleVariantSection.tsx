import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Image as ImageIcon } from 'lucide-react';
import { useProductVariantsLoader } from '@/hooks/useProductVariantsLoader';
import { useStoreCurrency } from '@/hooks/useStoreCurrency';
import { useStores } from '@/hooks/useStores';

interface VariantCombination {
  id: string;
  color: string;
  size: string;
  price: string;
  stock: string;
  sku: string;
  image?: string;
}

interface SimpleVariantSectionProps {
  onVariantsChange: (variants: VariantCombination[]) => void;
  productName?: string;
  initialVariants?: VariantCombination[];
  productId?: string;
}

const SimpleVariantSection = ({ onVariantsChange, productName = '', initialVariants = [], productId }: SimpleVariantSectionProps & { productId?: string }) => {
  // Charger les variantes depuis la base de données si on édite un produit
  const { variants: dbVariants, isLoading } = useProductVariantsLoader(productId);
  const { store } = useStores();
  const { formatPrice } = useStoreCurrency(store?.id);
  
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');
  const [variants, setVariants] = useState<VariantCombination[]>(initialVariants);
  const [colorImages, setColorImages] = useState<Record<string, string>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Suggestions communes
  const colorSuggestions = ['Rouge', 'Bleu', 'Vert', 'Noir', 'Blanc', 'Gris', 'Rose', 'Jaune', 'Orange', 'Violet'];
  const sizeSuggestions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

  // Initialiser depuis la base de données ou les props
  useEffect(() => {
    console.log('SimpleVariantSection - Initializing with:', {
      productId,
      dbVariants: dbVariants.length,
      initialVariants: initialVariants.length,
      isInitialized
    });
    
    const variantsToUse = productId && dbVariants.length > 0 ? dbVariants : initialVariants;
    
    if (variantsToUse && variantsToUse.length > 0 && !isInitialized) {
      const existingColors = [...new Set(variantsToUse.map(v => v.color))];
      const existingSizes = [...new Set(variantsToUse.map(v => v.size))];
      const existingColorImages: Record<string, string> = {};
      
      variantsToUse.forEach(variant => {
        if (variant.image) {
          existingColorImages[variant.color] = variant.image;
        }
      });

      console.log('SimpleVariantSection - Setting data from:', productId ? 'database' : 'props', {
        colors: existingColors,
        sizes: existingSizes,
        colorImages: existingColorImages
      });

      setColors(existingColors);
      setSizes(existingSizes);
      setVariants(variantsToUse);
      setColorImages(existingColorImages);
      setIsInitialized(true);
    }
  }, [dbVariants, initialVariants, isInitialized, productId]);

  const generateSKU = (productName: string, color: string, size: string) => {
    const product = productName.substring(0, 3).toUpperCase();
    const colorCode = color.substring(0, 2).toUpperCase();
    const sizeCode = size.toUpperCase();
    const random = Math.floor(Math.random() * 999).toString().padStart(3, '0');
    return `${product}-${colorCode}${sizeCode}-${random}`;
  };

  // Générer automatiquement les combinaisons
  useEffect(() => {
    if (colors.length > 0 && sizes.length > 0) {
      console.log('SimpleVariantSection - Generating variants for:', { colors, sizes });
      
      const newVariants: VariantCombination[] = [];
      
      colors.forEach(color => {
        sizes.forEach(size => {
          const id = `${color}-${size}`;
          const existingVariant = variants.find(v => v.id === id);
          
          newVariants.push({
            id,
            color,
            size,
            price: existingVariant?.price || '',
            stock: existingVariant?.stock || '0',
            sku: existingVariant?.sku || generateSKU(productName, color, size),
            image: colorImages[color]
          });
        });
      });
      
      console.log('SimpleVariantSection - Generated variants:', newVariants);
      setVariants(newVariants);
      onVariantsChange(newVariants);
    } else if (colors.length === 0 && sizes.length === 0) {
      console.log('SimpleVariantSection - Clearing variants');
      setVariants([]);
      onVariantsChange([]);
    }
  }, [colors, sizes, colorImages, productName]);

  const addColor = () => {
    if (newColor.trim() && !colors.includes(newColor.trim())) {
      console.log('SimpleVariantSection - Adding color:', newColor.trim());
      setColors([...colors, newColor.trim()]);
      setNewColor('');
    }
  };

  const addSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      console.log('SimpleVariantSection - Adding size:', newSize.trim());
      setSizes([...sizes, newSize.trim()]);
      setNewSize('');
    }
  };

  const removeColor = (colorToRemove: string) => {
    console.log('SimpleVariantSection - Removing color:', colorToRemove);
    setColors(colors.filter(c => c !== colorToRemove));
    const newColorImages = { ...colorImages };
    delete newColorImages[colorToRemove];
    setColorImages(newColorImages);
  };

  const removeSize = (sizeToRemove: string) => {
    console.log('SimpleVariantSection - Removing size:', sizeToRemove);
    setSizes(sizes.filter(s => s !== sizeToRemove));
  };

  const updateVariant = (variantId: string, field: string, value: string) => {
    console.log('SimpleVariantSection - Updating variant:', variantId, field, value);
    const updatedVariants = variants.map(variant => 
      variant.id === variantId 
        ? { ...variant, [field]: value }
        : variant
    );
    setVariants(updatedVariants);
    onVariantsChange(updatedVariants);
  };

  const handleImageUpload = (color: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        console.log('SimpleVariantSection - Image uploaded for color:', color);
        setColorImages(prev => ({ ...prev, [color]: imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  console.log('SimpleVariantSection - Current state:', {
    colors,
    sizes,
    variants: variants.length,
    isInitialized
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p>Chargement des variantes...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Configuration des options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Couleurs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Couleurs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ajouter une couleur..."
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addColor)}
                list="color-suggestions"
              />
              <datalist id="color-suggestions">
                {colorSuggestions.map(color => (
                  <option key={color} value={color} />
                ))}
              </datalist>
              <Button type="button" onClick={addColor} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <Badge key={color} variant="secondary" className="flex items-center gap-1">
                  <span>{color}</span>
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => removeColor(color)}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tailles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tailles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ajouter une taille..."
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addSize)}
                list="size-suggestions"
              />
              <datalist id="size-suggestions">
                {sizeSuggestions.map(size => (
                  <option key={size} value={size} />
                ))}
              </datalist>
              <Button type="button" onClick={addSize} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => (
                <Badge key={size} variant="secondary" className="flex items-center gap-1">
                  <span>{size}</span>
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => removeSize(size)}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Images par couleur */}
      {colors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Images par couleur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {colors.map(color => (
                <div key={color} className="space-y-2">
                  <Label className="text-sm font-medium">{color}</Label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(color, e)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      {colorImages[color] ? (
                        <img 
                          src={colorImages[color]} 
                          alt={color}
                          className="w-full h-20 object-cover rounded"
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <ImageIcon className="h-8 w-8 text-gray-400 mb-1" />
                          <span className="text-xs text-gray-500">Ajouter image</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tableau des variantes */}
      {variants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Variantes générées ({variants.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Variante</th>
                    <th className="text-left p-2">Prix ({formatPrice(0, { showSymbol: true, showCode: true })})</th>
                    <th className="text-left p-2">Stock</th>
                    <th className="text-left p-2">SKU</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map(variant => (
                    <tr key={variant.id} className="border-b">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          {variant.image && (
                            <img 
                              src={variant.image} 
                              alt={variant.color}
                              className="w-8 h-8 object-cover rounded"
                            />
                          )}
                          <span className="font-medium">
                            {variant.color} / {variant.size}
                          </span>
                        </div>
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={variant.price}
                          onChange={(e) => updateVariant(variant.id, 'price', e.target.value)}
                          className="w-24"
                          onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          placeholder="0"
                          value={variant.stock}
                          onChange={(e) => updateVariant(variant.id, 'stock', e.target.value)}
                          className="w-20"
                          onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          placeholder="SKU"
                          value={variant.sku}
                          onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)}
                          className="w-32"
                          onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {colors.length === 0 && sizes.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="space-y-2">
              <p className="text-gray-500">Ce produit n'a pas de variantes</p>
              <p className="text-sm text-gray-400">
                Ajoutez des couleurs et des tailles pour créer des variantes automatiquement
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SimpleVariantSection;
