
import { useStores } from '@/hooks/useStores';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Store } from 'lucide-react';

interface StoreSelectorProps {
  selectedStoreId?: string;
  onStoreSelect: (storeId: string) => void;
  onCreateStore: () => void;
}

const StoreSelector = ({ selectedStoreId, onStoreSelect, onCreateStore }: StoreSelectorProps) => {
  const { stores, isLoading } = useStores();

  if (isLoading) {
    return <div className="h-10 bg-gray-100 rounded animate-pulse" />;
  }

  if (stores.length === 0) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-500">Aucune boutique trouvée</div>
        <Button onClick={onCreateStore} size="sm">
          <Store className="h-4 w-4 mr-2" />
          Créer une boutique
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Select value={selectedStoreId} onValueChange={onStoreSelect}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Sélectionner une boutique" />
        </SelectTrigger>
        <SelectContent>
          {stores.map((store) => (
            <SelectItem key={store.id} value={store.id}>
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                {store.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={onCreateStore} variant="outline" size="sm">
        <Store className="h-4 w-4 mr-2" />
        Créer avec template
      </Button>
    </div>
  );
};

export default StoreSelector;
