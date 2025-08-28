// ========================================
// DIALOGUE DE CRÉATION DE MÉTHODE DE LIVRAISON
// ========================================

import { useState, useEffect } from 'react';
import { useMarkets } from '@/hooks/useMarkets';
import { Market } from '@/types/markets';
import { useStoreCurrency } from '@/hooks/useStoreCurrency';
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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Truck, Loader2, Clock, Zap } from 'lucide-react';

interface CreateShippingMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: string;
  markets: Market[];
  editingMethod?: any; // Méthode à éditer (optionnel)
  onSuccess?: () => void;
}

const CreateShippingMethodDialog = ({
  open,
  onOpenChange,
  storeId,
  markets,
  editingMethod,
  onSuccess
}: CreateShippingMethodDialogProps) => {
  const { createShippingMethod, updateShippingMethod, isCreatingMethod, isUpdatingMethod } = useMarkets(storeId);
  const { formatPrice } = useStoreCurrency(storeId);
  const [formData, setFormData] = useState({
    name: editingMethod?.name || '',
    description: editingMethod?.description || '',
    market_id: editingMethod?.market_id || '',
    price: editingMethod?.price?.toString() || '',
    delivery_type: 'days', // 'instant', 'minutes', 'hours', 'days'
    min_value: editingMethod?.estimated_min_days?.toString() || '1',
    max_value: editingMethod?.estimated_max_days?.toString() || '3',
    is_active: editingMethod?.is_active ?? true
  });

  // Réinitialiser le formulaire quand editingMethod change
  useEffect(() => {
    if (editingMethod) {
      // Vérifier si on a des conditions sauvegardées avec les détails du délai
      let deliveryType = 'days';
      let minValue = '1';
      let maxValue = '3';

      if (editingMethod.conditions?.delivery_type) {
        // Utiliser les données sauvegardées dans conditions
        deliveryType = editingMethod.conditions.delivery_type;
        minValue = editingMethod.conditions.min_value?.toString() || '1';
        maxValue = editingMethod.conditions.max_value?.toString() || '3';
      } else {
        // Fallback: déterminer le type basé sur les valeurs en jours
        minValue = editingMethod.estimated_min_days?.toString() || '1';
        maxValue = editingMethod.estimated_max_days?.toString() || '3';

        if (editingMethod.estimated_min_days === 0 && editingMethod.estimated_max_days === 0) {
          deliveryType = 'instant';
          minValue = '0';
          maxValue = '0';
        }
      }

      setFormData({
        name: editingMethod.name || '',
        description: editingMethod.description || '',
        market_id: editingMethod.market_id || '',
        price: editingMethod.price?.toString() || '',
        delivery_type: deliveryType,
        min_value: minValue,
        max_value: maxValue,
        is_active: editingMethod.is_active ?? true
      });
    }
  }, [editingMethod]);

  // Fonction pour convertir les délais en jours (entiers seulement)
  const convertToDays = (value: number, type: string): number => {
    switch (type) {
      case 'instant':
        return 0;
      case 'minutes':
        // Pour les minutes, on utilise 0 jours (même jour)
        return 0;
      case 'hours':
        // Pour les heures, on arrondit au jour le plus proche
        // Moins de 24h = 0 jour (même jour), 24h+ = 1 jour
        return value >= 24 ? Math.ceil(value / 24) : 0;
      case 'days':
      default:
        return Math.round(value);
    }
  };

  // Fonction pour formater l'affichage des délais
  const formatDeliveryTime = (minValue: string, maxValue: string, type: string): string => {
    if (type === 'instant') return 'Instantané';

    const min = parseInt(minValue);
    const max = parseInt(maxValue);
    const unit = type === 'minutes' ? 'min' : type === 'hours' ? 'h' : 'jour(s)';

    if (min === max) {
      return `${min} ${unit}`;
    }
    return `${min}-${max} ${unit}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.market_id || !formData.price) {
      return;
    }

    const price = parseFloat(formData.price);

    if (isNaN(price) || price < 0) {
      return;
    }

    // Convertir les délais en jours pour la base de données
    let minDays: number, maxDays: number;

    if (formData.delivery_type === 'instant') {
      minDays = 0;
      maxDays = 0;
    } else {
      const minValue = parseFloat(formData.min_value) || 1;
      const maxValue = parseFloat(formData.max_value) || minValue;

      if (maxValue < minValue) {
        return; // Validation: max doit être >= min
      }

      minDays = convertToDays(minValue, formData.delivery_type);
      maxDays = convertToDays(maxValue, formData.delivery_type);
    }

    // Créer les conditions avec les détails du délai
    const deliveryConditions = {
      delivery_type: formData.delivery_type,
      min_value: parseFloat(formData.min_value),
      max_value: parseFloat(formData.max_value),
      display_text: formatDeliveryTime(formData.min_value, formData.max_value, formData.delivery_type)
    };

    try {
      if (editingMethod) {
        // Mode édition
        await updateShippingMethod({
          id: editingMethod.id,
          updates: {
            market_id: formData.market_id,
            name: formData.name.trim(),
            description: formData.description.trim() || null,
            price: price,
            estimated_min_days: minDays,
            estimated_max_days: maxDays,
            conditions: deliveryConditions,
            is_active: formData.is_active
          }
        });
      } else {
        // Mode création
        await createShippingMethod({
          store_id: storeId,
          market_id: formData.market_id,
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          price: price,
          estimated_min_days: minDays,
          estimated_max_days: maxDays,
          conditions: deliveryConditions,
          is_active: formData.is_active
        });
      }

      // Reset form
      if (!editingMethod) {
        setFormData({
          name: '',
          description: '',
          market_id: '',
          price: '',
          delivery_type: 'days',
          min_value: '1',
          max_value: '3',
          is_active: true
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error('Erreur lors de la création de la méthode de livraison:', error);
    }
  };

  const handleClose = () => {
    if (!editingMethod) {
      setFormData({
        name: '',
        description: '',
        market_id: '',
        price: '',
        delivery_type: 'days',
        min_value: '1',
        max_value: '3',
        is_active: true
      });
    }
    onOpenChange(false);
  };

  const activeMarkets = markets.filter(market => market.is_active);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            {editingMethod ? 'Modifier la méthode de livraison' : 'Créer une méthode de livraison'}
          </DialogTitle>
          <DialogDescription>
            {editingMethod
              ? 'Modifiez les détails de cette méthode de livraison.'
              : 'Ajoutez une nouvelle option de livraison pour un de vos marchés.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <form id="shipping-method-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="market">Marché *</Label>
            <Select value={formData.market_id} onValueChange={(value) => setFormData(prev => ({ ...prev, market_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un marché" />
              </SelectTrigger>
              <SelectContent>
                {activeMarkets.map((market) => (
                  <SelectItem key={market.id} value={market.id}>
                    {market.name} ({market.countries.length} pays)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nom de la méthode *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Livraison standard, Express..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description de cette méthode de livraison..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Prix ({formatPrice(0, { showSymbol: true, showCode: true })}) *</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              placeholder="0"
              required
            />
          </div>

          {/* Délai de livraison flexible */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Type de délai de livraison
              </Label>
              <Select
                value={formData.delivery_type}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  delivery_type: value,
                  min_value: value === 'instant' ? '0' : '1',
                  max_value: value === 'instant' ? '0' : (value === 'days' ? '3' : value === 'hours' ? '2' : '30')
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instant">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      Instantané (0 minute)
                    </div>
                  </SelectItem>
                  <SelectItem value="minutes">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      Minutes
                    </div>
                  </SelectItem>
                  <SelectItem value="hours">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-500" />
                      Heures
                    </div>
                  </SelectItem>
                  <SelectItem value="days">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      Jours
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.delivery_type !== 'instant' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_value">
                    Délai min ({formData.delivery_type === 'minutes' ? 'min' : formData.delivery_type === 'hours' ? 'h' : 'jours'})
                  </Label>
                  <Input
                    id="min_value"
                    type="number"
                    min={formData.delivery_type === 'minutes' ? '5' : '1'}
                    step={formData.delivery_type === 'minutes' ? '5' : '1'}
                    value={formData.min_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, min_value: e.target.value }))}
                    placeholder={formData.delivery_type === 'minutes' ? '5' : '1'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_value">
                    Délai max ({formData.delivery_type === 'minutes' ? 'min' : formData.delivery_type === 'hours' ? 'h' : 'jours'})
                  </Label>
                  <Input
                    id="max_value"
                    type="number"
                    min={formData.delivery_type === 'minutes' ? '5' : '1'}
                    step={formData.delivery_type === 'minutes' ? '5' : '1'}
                    value={formData.max_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_value: e.target.value }))}
                    placeholder={formData.delivery_type === 'minutes' ? '30' : formData.delivery_type === 'hours' ? '2' : '3'}
                  />
                </div>
              </div>
            )}

            {formData.delivery_type === 'instant' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">Livraison instantanée</span>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  Cette option est idéale pour les produits numériques ou les services immédiats.
                </p>
              </div>
            )}

            {/* Aperçu du délai */}
            {formData.min_value && formData.max_value && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-blue-800">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Aperçu du délai</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Les clients verront : <strong>{formatDeliveryTime(formData.min_value, formData.max_value, formData.delivery_type)}</strong>
                </p>
              </div>
            )}
          </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked as boolean }))}
              />
              <Label htmlFor="is_active" className="text-sm font-normal cursor-pointer">
                Méthode active (disponible pour les clients)
              </Label>
            </div>
          </form>
        </div>

        <DialogFooter className="flex-shrink-0 mt-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          <Button
            type="submit"
            form="shipping-method-form"
            disabled={(isCreatingMethod || isUpdatingMethod) || !formData.name.trim() || !formData.market_id || !formData.price}
          >
            {(isCreatingMethod || isUpdatingMethod) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {editingMethod ? 'Modifier la méthode' : 'Créer la méthode'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateShippingMethodDialog;
