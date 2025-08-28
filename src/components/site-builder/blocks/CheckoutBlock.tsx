
import React, { useState, useEffect } from 'react';
import { TemplateBlock } from '@/types/template';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { Trash2, CreditCard, Truck, Clock, MapPin, Loader2 } from 'lucide-react';
import { detectUserCountry, SUPPORTED_COUNTRIES, type CountryCode } from '@/utils/countryDetection';
import { useShippingWithAutoSetup } from '@/hooks/useAutoShipping';
import { useStoreCurrency } from '@/hooks/useStoreCurrency';
import type { Tables } from '@/integrations/supabase/types';

interface CheckoutBlockProps {
  block: TemplateBlock;
  isEditing?: boolean;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
  onUpdate?: (block: TemplateBlock) => void;
  selectedStore?: Tables<'stores'> | null;
}

interface ShippingMethod {
  id: string;
  name: string;
  description?: string;
  price: number;
  estimated_days: string;
  is_active: boolean;
  store_id: string;
  shipping_zone_id?: string;
}

const CheckoutBlock = ({ block, isEditing, selectedStore }: CheckoutBlockProps) => {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart();
  const { formatPrice } = useStoreCurrency(selectedStore?.id);
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');

  // États pour les méthodes de livraison
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod | null>(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [detectedCountry, setDetectedCountry] = useState<string>('');
  const [detectedCountryCode, setDetectedCountryCode] = useState<CountryCode>('ML');

  // Hook automatique pour les méthodes de livraison COMPLÈTES
  const { methods: shippingMethods, isLoading: isLoadingShipping } = useShippingWithAutoSetup(
    selectedStore?.id,
    detectedCountryCode
  );

  // Fonction pour convertir le code pays en nom pour l'affichage
  const getCountryName = (countryCode: CountryCode): string => {
    return SUPPORTED_COUNTRIES[countryCode]?.name || 'Mali';
  };

  // Sélectionner automatiquement la première méthode quand elles sont chargées
  useEffect(() => {
    if (shippingMethods.length > 0 && !selectedShippingMethod) {
      setSelectedShippingMethod(shippingMethods[0]);
      setShippingCost(shippingMethods[0].price || 0);
      console.log('✅ Méthode sélectionnée automatiquement:', shippingMethods[0].name);
    }
  }, [shippingMethods, selectedShippingMethod]);

  // Initialiser la détection de pays
  useEffect(() => {
    const initializeCountry = async () => {
      const countryCode = await detectUserCountry();
      const countryName = getCountryName(countryCode);
      setDetectedCountry(countryName);
      setDetectedCountryCode(countryCode);
      console.log('🌍 Pays détecté:', countryName, `(${countryCode})`);
    };

    initializeCountry();
  }, []);

  const handleCustomerInfoChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getTotalWithShipping = () => {
    return getTotalPrice() + shippingCost;
  };

  const handleCheckout = () => {
    console.log('Processus de commande:', {
      items,
      customerInfo,
      paymentMethod,
      shippingMethod: selectedShippingMethod,
      total: getTotalWithShipping()
    });
    // Ici on intégrerait avec les moyens de paiement configurés
  };

  if (isEditing) {
    return (
      <div className="border-2 border-dashed border-blue-300 p-8 text-center">
        <CreditCard className="h-12 w-12 mx-auto mb-4 text-blue-500" />
        <h3 className="text-lg font-semibold mb-2">Bloc Commande</h3>
        <p className="text-gray-600">Page de finalisation de commande avec informations client et paiement</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Finaliser votre commande</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Informations client */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de livraison</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={customerInfo.firstName}
                    onChange={(e) => handleCustomerInfoChange('firstName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={customerInfo.lastName}
                    onChange={(e) => handleCustomerInfoChange('lastName', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={customerInfo.address}
                  onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={customerInfo.city}
                    onChange={(e) => handleCustomerInfoChange('city', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input
                    id="postalCode"
                    value={customerInfo.postalCode}
                    onChange={(e) => handleCustomerInfoChange('postalCode', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Récapitulatif de commande */}
          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif de commande</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      )}
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-gray-600">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.variant_id)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.variant_id)}
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.product_id, item.variant_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Section Méthodes de livraison */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Méthodes de livraison
                  </h3>

                  {isLoadingShipping ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      <span className="text-gray-600">Chargement...</span>
                    </div>
                  ) : shippingMethods.length > 0 ? (
                    <div className="space-y-2">
                      {shippingMethods.map((method) => (
                        <div
                          key={method.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedShippingMethod?.id === method.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => {
                            setSelectedShippingMethod(method);
                            setShippingCost(method.price || 0);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">{method.name}</div>
                              {method.description && (
                                <div className="text-sm text-gray-700">{method.description}</div>
                              )}
                              <div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {method.conditions?.display_text ||
                                   (method.estimated_min_days === 0 && method.estimated_max_days === 0
                                     ? 'Instantané'
                                     : method.estimated_days || `${method.estimated_min_days || 1}-${method.estimated_max_days || 3} jours`)
                                  }
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">
                                {method.price === 0 ? (
                                  <span className="text-green-600">Gratuit</span>
                                ) : (
                                  <span>{formatPrice(method.price)}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <Truck className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        Aucune livraison disponible pour {detectedCountry}
                      </p>
                    </div>
                  )}
                </div>

                {/* Récapitulatif des coûts */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total:</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison:</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Gratuit</span>
                      ) : (
                        formatPrice(shippingCost)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-2">
                    <span>Total:</span>
                    <span>{formatPrice(getTotalWithShipping())}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={items.length === 0}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payer maintenant
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutBlock;
