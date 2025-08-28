import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStoreCurrency } from '@/hooks/useStoreCurrency';
import { useStores } from '@/hooks/useStores';
import { 
  Truck, 
  Edit, 
  Trash2, 
  Plus, 
  DollarSign, 
  Clock, 
  MapPin,
  Eye,
  EyeOff
} from 'lucide-react';
import { ShippingMethod, ShippingZone } from '@/types/shipping';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';

interface ShippingMethodsListProps {
  methods: ShippingMethod[];
  zones: ShippingZone[];
  isLoading: boolean;
  onEdit: (method: ShippingMethod) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const ShippingMethodsList = ({
  methods,
  zones,
  isLoading,
  onEdit,
  onDelete,
  onAdd
}: ShippingMethodsListProps) => {
  const { store } = useStores();
  const { formatPrice } = useStoreCurrency(store?.id);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredMethods = methods.filter(method => {
    if (filter === 'active') return method.is_active;
    if (filter === 'inactive') return !method.is_active;
    return true;
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (methods.length === 0) {
    return (
      <EmptyState
        icon={Truck}
        title="Aucune méthode de livraison"
        description="Créez votre première méthode de livraison pour commencer à vendre."
        action={
          <Button onClick={onAdd} className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Plus className="h-4 w-4 mr-2" />
            Créer une méthode
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Toutes ({methods.length})
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('active')}
          >
            Actives ({methods.filter(m => m.is_active).length})
          </Button>
          <Button
            variant={filter === 'inactive' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('inactive')}
          >
            Inactives ({methods.filter(m => !m.is_active).length})
          </Button>
        </div>

        <Button onClick={onAdd} className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle méthode
        </Button>
      </div>

      {/* Liste des méthodes */}
      <div className="grid gap-4">
        {filteredMethods.map((method) => (
          <Card key={method.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Icône et nom */}
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{method.icon}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{method.name}</h3>
                        {method.is_active ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <Eye className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                      </div>
                      {method.description && (
                        <p className="text-muted-foreground text-sm mt-1">
                          {method.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Informations et actions */}
                <div className="flex items-center gap-6">
                  {/* Prix */}
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-lg font-semibold">
                      <DollarSign className="h-4 w-4" />
                      {method.price === 0 ? 'Gratuit' : formatPrice(method.price)}
                    </div>
                    {method.free_shipping_threshold && (
                      <p className="text-xs text-muted-foreground">
                        Gratuit à partir de {formatPrice(method.free_shipping_threshold)}
                      </p>
                    )}
                  </div>

                  {/* Délai */}
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3" />
                      {method.estimated_days}
                    </div>
                  </div>

                  {/* Zone */}
                  {method.shipping_zone && (
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {method.shipping_zone.name}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {method.shipping_zone.countries.length} pays
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(method)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(method.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMethods.length === 0 && methods.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Aucune méthode ne correspond au filtre sélectionné.
          </p>
        </div>
      )}
    </div>
  );
};

export default ShippingMethodsList;
