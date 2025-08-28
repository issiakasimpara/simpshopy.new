// ========================================
// DIALOGUE DE CRÉATION DE MARCHÉ
// ========================================

import { useState, useEffect } from 'react';
import { useMarkets } from '@/hooks/useMarkets';
import { SUPPORTED_COUNTRIES } from '@/types/markets';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Globe, Loader2 } from 'lucide-react';

// Pays francophones d'Afrique supportés
const FRANCOPHONE_AFRICAN_COUNTRIES = [
  { code: 'BJ', name: 'Bénin', flag: '🇧🇯' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮' },
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲' },
  { code: 'CF', name: 'Centrafrique', flag: '🇨🇫' },
  { code: 'KM', name: 'Comores', flag: '🇰🇲' },
  { code: 'CG', name: 'Congo', flag: '🇨🇬' },
  { code: 'CD', name: 'Congo (RDC)', flag: '🇨🇩' },
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮' },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦' },
  { code: 'GN', name: 'Guinée', flag: '🇬🇳' },
  { code: 'GQ', name: 'Guinée équatoriale', flag: '🇬🇶' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱' },
  { code: 'MA', name: 'Maroc', flag: '🇲🇦' },
  { code: 'MU', name: 'Maurice', flag: '🇲🇺' },
  { code: 'MR', name: 'Mauritanie', flag: '🇲🇷' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨' },
  { code: 'TD', name: 'Tchad', flag: '🇹🇩' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬' },
  { code: 'TN', name: 'Tunisie', flag: '🇹🇳' }
];

interface CreateMarketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: string;
  editingMarket?: any; // Marché à éditer (optionnel)
  onSuccess?: () => void;
}

const CreateMarketDialog = ({ open, onOpenChange, storeId, editingMarket, onSuccess }: CreateMarketDialogProps) => {
  const { createMarket, updateMarket, isCreatingMarket, isUpdatingMarket } = useMarkets(storeId);
  const [formData, setFormData] = useState({
    name: editingMarket?.name || '',
    countries: editingMarket?.countries || [] as string[],
    is_active: editingMarket?.is_active ?? true
  });

  // Réinitialiser le formulaire quand editingMarket change
  useEffect(() => {
    setFormData({
      name: editingMarket?.name || '',
      countries: editingMarket?.countries || [] as string[],
      is_active: editingMarket?.is_active ?? true
    });
  }, [editingMarket]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    if (formData.countries.length === 0) {
      return;
    }

    try {
      if (editingMarket) {
        // Mode édition
        await updateMarket({
          id: editingMarket.id,
          updates: {
            name: formData.name.trim(),
            countries: formData.countries,
            is_active: formData.is_active
          }
        });
      } else {
        // Mode création
        await createMarket({
          store_id: storeId,
          name: formData.name.trim(),
          countries: formData.countries,
          is_active: formData.is_active
        });
      }

      // Reset form
      if (!editingMarket) {
        setFormData({
          name: '',
          countries: [],
          is_active: true
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error('Erreur lors de la création du marché:', error);
    }
  };

  const handleCountryChange = (countryCode: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      countries: checked
        ? [...prev.countries, countryCode]
        : prev.countries.filter(c => c !== countryCode)
    }));
  };

  const handleClose = () => {
    if (!editingMarket) {
      setFormData({
        name: '',
        countries: [],
        is_active: true
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
            {editingMarket ? 'Modifier le marché' : 'Créer un nouveau marché'}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            {editingMarket
              ? 'Modifiez les détails de ce marché et les pays couverts.'
              : 'Définissez une zone de vente pour vos produits en sélectionnant les pays où vous souhaitez vendre.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du marché *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Afrique de l'Ouest, Maghreb..."
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Pays couverts *</Label>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded-md p-3">
              {FRANCOPHONE_AFRICAN_COUNTRIES.map((country) => (
                <div key={country.code} className="flex items-center space-x-2">
                  <Checkbox
                    id={country.code}
                    checked={formData.countries.includes(country.code)}
                    onCheckedChange={(checked) => handleCountryChange(country.code, checked as boolean)}
                  />
                  <Label htmlFor={country.code} className="text-sm font-normal cursor-pointer">
                    {country.flag} {country.name}
                  </Label>
                </div>
              ))}
            </div>
            {formData.countries.length > 0 && (
              <p className="text-sm text-gray-600">
                {formData.countries.length} pays sélectionné{formData.countries.length > 1 ? 's' : ''}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked as boolean }))}
            />
            <Label htmlFor="is_active" className="text-sm font-normal cursor-pointer">
              Marché actif (les clients peuvent commander)
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={(isCreatingMarket || isUpdatingMarket) || !formData.name.trim() || formData.countries.length === 0}
            >
              {(isCreatingMarket || isUpdatingMarket) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingMarket ? 'Modifier le marché' : 'Créer le marché'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMarketDialog;
