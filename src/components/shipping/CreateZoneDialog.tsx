import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AFRICAN_COUNTRIES = [
  'Burkina Faso', 'Mali', 'Niger', 'Sénégal', 'Côte d\'Ivoire',
  'Guinea', 'Benin', 'Togo', 'Cameroun', 'Tchad',
  'République centrafricaine', 'Gabon', 'République du Congo',
  'République démocratique du Congo', 'Madagascar', 'Comores'
];

interface CreateZoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: string;
  onZoneCreated: () => void;
  editingZone?: any;
}

const CreateZoneDialog = ({ open, onOpenChange, storeId, onZoneCreated, editingZone }: CreateZoneDialogProps) => {
  const [name, setName] = useState(editingZone?.name || '');
  const [selectedCountries, setSelectedCountries] = useState<string[]>(editingZone?.countries || []);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || selectedCountries.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      if (editingZone) {
        // Mode édition
        const { error } = await supabase
          .from('shipping_zones')
          .update({
            name: name.trim(),
            countries: selectedCountries
          })
          .eq('id', editingZone.id);

        if (error) throw error;
      } else {
        // Mode création
        const { error } = await supabase
          .from('shipping_zones')
          .insert({
            name: name.trim(),
            countries: selectedCountries,
            store_id: storeId
          });

        if (error) throw error;
      }

      toast({
        title: "Succès",
        description: editingZone ? "Zone modifiée avec succès" : "Zone de livraison créée avec succès"
      });

      if (!editingZone) {
        setName('');
        setSelectedCountries([]);
      }
      onZoneCreated();
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: editingZone ? "Impossible de modifier la zone" : "Impossible de créer la zone",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCountry = (country: string) => {
    setSelectedCountries(prev => 
      prev.includes(country) 
        ? prev.filter(c => c !== country)
        : [...prev, country]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingZone ? 'Modifier la zone de livraison' : 'Créer une zone de livraison'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Nom de la zone</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Afrique de l'Ouest"
              required
            />
          </div>

          <div>
            <Label>Pays inclus dans cette zone</Label>
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto border rounded-lg p-4">
              {AFRICAN_COUNTRIES.map((country) => (
                <div key={country} className="flex items-center space-x-2">
                  <Checkbox
                    id={country}
                    checked={selectedCountries.includes(country)}
                    onCheckedChange={() => toggleCountry(country)}
                  />
                  <Label htmlFor={country} className="text-sm cursor-pointer">
                    {country}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {selectedCountries.length} pays sélectionné(s)
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Création...' : 'Créer la zone'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateZoneDialog;
