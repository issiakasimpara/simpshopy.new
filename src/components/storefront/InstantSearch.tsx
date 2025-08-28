import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, X, Loader2, ShoppingBag, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import OptimizedImage from '@/components/ui/optimized-image';
import { useOptimizedProducts } from '@/hooks/useOptimizedQuery';
import { useStoreCurrency } from '@/hooks/useStoreCurrency';
import { cn } from '@/lib/utils';

interface InstantSearchProps {
  storeId?: string;
  onProductSelect?: (productId: string) => void;
  className?: string;
}

interface SearchResult {
  id: string;
  name: string;
  description?: string;
  price: number;
  images?: string[];
  category?: string;
}

const InstantSearch = ({ storeId, onProductSelect, className }: InstantSearchProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const { data: products = [], isLoading } = useOptimizedProducts(storeId);
  const { formatPrice } = useStoreCurrency(storeId);

  // Recherche intelligente avec scoring
  const searchResults = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];

    const searchTerm = query.toLowerCase().trim();
    
    return products
      .map((product) => {
        let score = 0;
        const name = product.name?.toLowerCase() || '';
        const description = product.description?.toLowerCase() || '';
        const category = product.categories?.name?.toLowerCase() || '';

        // Scoring sophistiqué
        if (name.includes(searchTerm)) score += 10;
        if (name.startsWith(searchTerm)) score += 5;
        if (description.includes(searchTerm)) score += 3;
        if (category.includes(searchTerm)) score += 2;

        // Bonus pour correspondance exacte
        if (name === searchTerm) score += 20;

        return { ...product, score };
      })
      .filter(product => product.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8); // Limiter à 8 résultats
  }, [products, query]);

  // Gestion du clavier
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && searchResults[selectedIndex]) {
          handleProductSelect(searchResults[selectedIndex].id);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  }, [isOpen, searchResults, selectedIndex]);

  const handleProductSelect = useCallback((productId: string) => {
    onProductSelect?.(productId);
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(-1);
  }, [onProductSelect]);



  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      {/* Champ de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Rechercher des produits..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10 bg-white/90 backdrop-blur-sm border-gray-200 focus:border-blue-500 transition-all duration-200"
        />
        
        {/* Bouton clear */}
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Résultats de recherche */}
      {isOpen && query.length >= 2 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-xl border-0 bg-white/95 backdrop-blur-md animate-scale-in">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Recherche...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {searchResults.map((product, index) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductSelect(product.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-b-0",
                      selectedIndex === index 
                        ? "bg-blue-50 border-blue-200" 
                        : "hover:bg-gray-50"
                    )}
                  >
                    {/* Image du produit */}
                    <div className="flex-shrink-0">
                      <OptimizedImage
                        src={product.images?.[0] || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    </div>

                    {/* Informations du produit */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-semibold text-blue-600">
                          {formatPrice(product.price)}
                        </span>
                        {product.categories?.name && (
                          <Badge variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {product.categories.name}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Icône d'action */}
                    <div className="flex-shrink-0">
                      <ShoppingBag className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Aucun produit trouvé pour "{query}"</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Overlay pour fermer */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default InstantSearch;
