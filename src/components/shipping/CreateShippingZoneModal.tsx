import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Globe, Plus, X } from 'lucide-react';
import { ShippingZoneInsert, AFRICAN_FRANCOPHONE_COUNTRIES } from '@/types/shipping';

interface CreateShippingZoneModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: string;
  onZoneCreated: (zone: ShippingZoneInsert) => void;
}

const CreateShippingZoneModal = ({
  open,
  onOpenChange,
  storeId,
  onZoneCreated
}: CreateShippingZoneModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true
  });

  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const zoneData: ShippingZoneInsert = {
        store_id: storeId,
        name: formData.name,
        description: formData.description || undefined,
        countries: selectedCountries,
        is_active: formData.is_active
      };

      onZoneCreated(zoneData);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        is_active: true
      });
      setSelectedCountries([]);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCountry = (countryName: string) => {
    setSelectedCountries(prev => 
      prev.includes(countryName)
        ? prev.filter(c => c !== countryName)
        : [...prev, countryName]
    );
  };

  const selectAllCountries = () => {
    setSelectedCountries(AFRICAN_FRANCOPHONE_COUNTRIES.map(c => c.name));
  };

  const clearAllCountries = () => {
    setSelectedCountries([]);
  };

  const groupedCountries = AFRICAN_FRANCOPHONE_COUNTRIES.reduce((acc, country) => {
    if (!acc[country.region]) {
      acc[country.region] = [];
    }
    acc[country.region].push(country);
    return acc;
  }, {} as Record<string, typeof AFRICAN_FRANCOPHONE_COUNTRIES>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            Créer une zone de livraison
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la zone *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Afrique de l'Ouest"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description de la zone de livraison"
                rows={3}
              />
            </div>
          </div>

          {/* Sélection des pays */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">
                Pays de livraison ({selectedCountries.length} sélectionnés)
              </Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={selectAllCountries}
                >
                  Tout sélectionner
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearAllCountries}
                >
                  Tout désélectionner
                </Button>
              </div>
            </div>

            {/* Pays sélectionnés */}
            {selectedCountries.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-800 mb-2">Pays sélectionnés :</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCountries.map((country) => (
                    <Badge
                      key={country}
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 border-blue-300"
                    >
                      {country}
                      <button
                        type="button"
                        onClick={() => toggleCountry(country)}
                        className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Liste des pays par région */}
            <div className="space-y-4 max-h-96 overflow-y-auto border rounded-lg p-4">
              {Object.entries(groupedCountries).map(([region, countries]) => (
                <div key={region} className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    {region}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {countries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => toggleCountry(country.name)}
                        className={`
                          flex items-center gap-2 p-2 rounded-lg border text-left transition-colors
                          ${selectedCountries.includes(country.name)
                            ? 'bg-blue-100 border-blue-300 text-blue-800'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                          }
                        `}
                      >
                        <span className="text-lg">{country.flag}</span>
                        <span className="text-sm font-medium">{country.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statut actif */}
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Zone active</Label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name || selectedCountries.length === 0}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              {isSubmitting ? 'Création...' : 'Créer la zone'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateShippingZoneModal;
