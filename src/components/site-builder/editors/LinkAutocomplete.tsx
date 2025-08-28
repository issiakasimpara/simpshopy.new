import React, { useMemo, useState } from 'react';
import { Command, CommandGroup, CommandItem, CommandList, CommandInput, CommandEmpty } from '@/components/ui/command';
import { useStores } from '@/hooks/useStores';
import { useProducts } from '@/hooks/useProducts';

interface LinkAutocompleteProps {
  value: string;
  onChange: (val: string) => void;
  pages?: { label: string; value: string }[];
}

const LinkAutocomplete: React.FC<LinkAutocompleteProps> = ({ value, onChange, pages }) => {
  const { stores } = useStores();
  const storeId = stores && stores[0]?.id;
  const { products = [] } = useProducts(storeId, 'active');

  // Suggestions de pages : soit via prop, soit fallback
  const pageSuggestions = useMemo(() => {
    if (pages && pages.length > 0) return pages;
    return [
      { label: 'Accueil', value: '/' },
      { label: 'Produits', value: '/products' },
      { label: 'Contact', value: '/contact' },
      { label: 'Panier', value: '/cart' },
      { label: 'Checkout', value: '/checkout' },
    ];
  }, [pages]);

  const productLinks = useMemo(() =>
    Array.isArray(products)
      ? products.map((p: any) => ({
          label: p.name,
          value: `/product/${p.id}`
        }))
      : [],
    [products]
  );

  const [input, setInput] = useState(value);

  const handleSelect = (val: string) => {
    setInput(val);
    onChange(val);
  };

  return (
    <Command className="text-xs sm:text-sm">
      <CommandInput
        placeholder="/page-ou-url"
        value={input}
        onValueChange={(val) => {
          setInput(val);
          onChange(val);
        }}
        className="text-xs sm:text-sm"
      />
      <CommandList>
        <CommandGroup heading="Pages" className="text-xs sm:text-sm">
          {pageSuggestions.map((page) => (
            <CommandItem key={page.value} value={page.value} onSelect={() => handleSelect(page.value)} className="text-xs sm:text-sm">
              {page.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Produits" className="text-xs sm:text-sm">
          {productLinks.map((prod) => (
            <CommandItem key={prod.value} value={prod.value} onSelect={() => handleSelect(prod.value)} className="text-xs sm:text-sm">
              {prod.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandEmpty className="text-xs sm:text-sm">Aucun résultat</CommandEmpty>
      </CommandList>
    </Command>
  );
};

export default LinkAutocomplete; 