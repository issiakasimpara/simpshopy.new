import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Edit, 
  Trash2, 
  Plus, 
  MapPin,
  Eye,
  EyeOff,
  Users
} from 'lucide-react';
import { ShippingZone } from '@/types/shipping';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';

interface ShippingZonesListProps {
  zones: ShippingZone[];
  isLoading: boolean;
  onEdit: (zone: ShippingZone) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const ShippingZonesList = ({
  zones,
  isLoading,
  onEdit,
  onDelete,
  onAdd
}: ShippingZonesListProps) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredZones = zones.filter(zone => {
    if (filter === 'active') return zone.is_active;
    if (filter === 'inactive') return !zone.is_active;
    return true;
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (zones.length === 0) {
    return (
      <EmptyState
        icon={Globe}
        title="Aucune zone de livraison"
        description="Créez votre première zone de livraison pour organiser vos méthodes par région."
        action={
          <Button onClick={onAdd} className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Plus className="h-4 w-4 mr-2" />
            Créer une zone
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
            Toutes ({zones.length})
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('active')}
          >
            Actives ({zones.filter(z => z.is_active).length})
          </Button>
          <Button
            variant={filter === 'inactive' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('inactive')}
          >
            Inactives ({zones.filter(z => !z.is_active).length})
          </Button>
        </div>

        <Button onClick={onAdd} className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle zone
        </Button>
      </div>

      {/* Liste des zones */}
      <div className="grid gap-4">
        {filteredZones.map((zone) => (
          <Card key={zone.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Icône et nom */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Globe className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{zone.name}</h3>
                        {zone.is_active ? (
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
                      {zone.description && (
                        <p className="text-muted-foreground text-sm mt-1">
                          {zone.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Informations et actions */}
                <div className="flex items-center gap-6">
                  {/* Nombre de pays */}
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-lg font-semibold">
                      <MapPin className="h-4 w-4" />
                      {zone.countries.length} pays
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {zone.countries.length > 0 ? zone.countries.slice(0, 2).join(', ') : 'Aucun pays'}
                      {zone.countries.length > 2 && ` +${zone.countries.length - 2}`}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(zone)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(zone.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Liste des pays (expandable) */}
              {zone.countries.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex flex-wrap gap-2">
                    {zone.countries.slice(0, 8).map((country) => (
                      <Badge key={country} variant="outline" className="text-xs">
                        {country}
                      </Badge>
                    ))}
                    {zone.countries.length > 8 && (
                      <Badge variant="outline" className="text-xs">
                        +{zone.countries.length - 8} autres
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredZones.length === 0 && zones.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Aucune zone ne correspond au filtre sélectionné.
          </p>
        </div>
      )}
    </div>
  );
};

export default ShippingZonesList;
