
import { Card, CardContent } from '@/components/ui/card';
import { Package } from 'lucide-react';

const NoStoreSelected = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Sélectionnez une boutique</h3>
        <p className="text-muted-foreground text-center">
          Choisissez une boutique pour voir et gérer ses produits.
        </p>
      </CardContent>
    </Card>
  );
};

export default NoStoreSelected;
