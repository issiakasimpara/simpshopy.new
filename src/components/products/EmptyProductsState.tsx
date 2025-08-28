
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Plus } from 'lucide-react';

interface EmptyProductsStateProps {
  onAddProduct: () => void;
}

const EmptyProductsState = ({ onAddProduct }: EmptyProductsStateProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Aucun produit</h3>
        <p className="text-muted-foreground text-center mb-4">
          Commencez par ajouter votre premier produit à votre boutique.
        </p>
        <Button onClick={onAddProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un produit
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyProductsState;
