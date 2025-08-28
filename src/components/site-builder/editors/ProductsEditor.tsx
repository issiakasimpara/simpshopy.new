
import { TemplateBlock } from '@/types/template';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProducts } from '@/hooks/useProducts';
import { Package } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Store = Tables<'stores'>;

interface ProductsEditorProps {
  block: TemplateBlock;
  selectedStore?: Store | null;
  onUpdate: (key: string, value: any) => void;
}

const ProductsEditor = ({ block, selectedStore, onUpdate }: ProductsEditorProps) => {
  const { products, isLoading } = useProducts(selectedStore?.id, 'active');

  return (
    <div className="space-y-4">
      {/* Informations sur les produits disponibles */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <Package className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">
            Produits de votre boutique
          </span>
        </div>
        {isLoading ? (
          <p className="text-sm text-blue-700">Chargement...</p>
        ) : (
          <p className="text-sm text-blue-700">
            {products.length} produit{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}
            {selectedStore ? ` dans "${selectedStore.name}"` : ''}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="productsTitle">Titre de la section</Label>
        <Input
          id="productsTitle"
          value={block.content.title || ''}
          onChange={(e) => onUpdate('title', e.target.value)}
          placeholder="Nos Produits"
        />
      </div>
      
      <div>
        <Label htmlFor="productsToShow">Nombre de produits à afficher</Label>
        <Input
          id="productsToShow"
          type="number"
          min="1"
          max={Math.max(20, products.length)}
          value={block.content.productsToShow || 8}
          onChange={(e) => onUpdate('productsToShow', parseInt(e.target.value))}
        />
        {products.length > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            Maximum disponible: {products.length} produits
          </p>
        )}
      </div>
      
      <div>
        <Label>Mise en page</Label>
        <Select
          value={block.content.layout || 'grid'}
          onValueChange={(value) => onUpdate('layout', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grid">Grille</SelectItem>
            <SelectItem value="carousel">Carrousel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Option colonnes mobile - seulement pour la grille */}
      {(block.content.layout || 'grid') === 'grid' && (
        <div>
          <Label>Colonnes sur mobile</Label>
          <Select
            value={String(block.content.mobileColumns || 1)}
            onValueChange={(value) => onUpdate('mobileColumns', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 colonne (large)</SelectItem>
              <SelectItem value="2">2 colonnes</SelectItem>
              <SelectItem value="3">3 colonnes</SelectItem>
              <SelectItem value="4">4 colonnes</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            Nombre de produits par ligne sur mobile
          </p>
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <Switch
          id="showPrice"
          checked={block.content.showPrice !== false}
          onCheckedChange={(checked) => onUpdate('showPrice', checked)}
        />
        <Label htmlFor="showPrice">Afficher les prix</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="showAddToCart"
          checked={block.content.showAddToCart !== false}
          onCheckedChange={(checked) => onUpdate('showAddToCart', checked)}
        />
        <Label htmlFor="showAddToCart">Afficher bouton d'achat</Label>
      </div>

      {products.length === 0 && !isLoading && (
        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800">
            💡 Aucun produit trouvé. Ajoutez des produits depuis la section "Produits" de votre tableau de bord pour les voir apparaître dans votre template.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductsEditor;
