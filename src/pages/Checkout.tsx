
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { Trash2, CreditCard, Loader2, Truck, Clock, DollarSign } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { detectUserCountry, SUPPORTED_COUNTRIES, type CountryCode } from '@/utils/countryDetection';
import { useShippingWithAutoSetup } from '@/hooks/useAutoShipping';
import { MonerooService, convertToMonerooAmount, formatMonerooAmount } from '@/services/monerooService';
import { useCartSessions } from '@/hooks/useCartSessions';
import { useStoreCurrency } from '@/hooks/useStoreCurrency';

const Checkout = () => {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart, storeId: cartStoreId, isLoading: cartLoading } = useCart();
  const { saveCartSession, getCartSession } = useCartSessions();
  const navigate = useNavigate();
  const location = useLocation();
  const { storeSlug } = useParams();
  const { toast } = useToast();
  
  // États pour les méthodes de livraison
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<any>(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [detectedCountry, setDetectedCountry] = useState<string>('');
  const [detectedCountryCode, setDetectedCountryCode] = useState<CountryCode>('ML');
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [currentStoreId, setCurrentStoreId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isCheckingCart, setIsCheckingCart] = useState(true);
  
  // Utiliser le storeId du panier en priorité, sinon celui récupéré par getStoreInfo
  const effectiveStoreId = cartStoreId || currentStoreId;
  const { formatPrice, currency } = useStoreCurrency(effectiveStoreId);

  // Détecter si nous sommes dans l'aperçu
  const isInPreview = window.self !== window.top;
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: ''
  });

  // Hook automatique pour les méthodes de livraison
  const { methods: shippingMethods, isLoading: isLoadingShipping } = useShippingWithAutoSetup(
    effectiveStoreId,
    detectedCountryCode
  );

  // Fonction pour détecter le pays de l'utilisateur
  const detectUserCountryForCheckout = useCallback(async () => {
    setIsLoadingLocation(true);
    try {
      const countryCode = await detectUserCountry();
      const countryName = SUPPORTED_COUNTRIES[countryCode]?.name || 'Mali';

      console.log('🌍 Pays détecté:', countryName, `(${countryCode})`);

      setDetectedCountry(countryName);
      setDetectedCountryCode(countryCode);

      // Mettre à jour automatiquement les informations client
      setCustomerInfo(prev => ({
        ...prev,
        country: countryName
      }));

      return countryCode;
    } catch (error) {
      console.error('❌ Erreur détection pays:', error);
      // Fallback vers Mali si la détection échoue
      setDetectedCountry('Mali');
      setCustomerInfo(prev => ({
        ...prev,
        country: 'Mali'
      }));
      return 'ML' as CountryCode;
    } finally {
      setIsLoadingLocation(false);
    }
  }, []);

  // Fonction pour récupérer les infos de la boutique
  const getStoreInfo = useCallback(async () => {
    if (!storeSlug) {
      console.log('❌ Pas de storeSlug fourni');
      return null;
    }

    try {
      // Log seulement en développement et rarement
      if (import.meta.env.DEV && Math.random() < 0.05) {
        console.log('🔍 Récupération infos boutique pour slug:', storeSlug);
      }
      
      // Essayer d'abord avec le slug exact
      const { data: store, error } = await supabase
        .from('stores')
        .select('*')
        .eq('slug', storeSlug)
        .single();

      if (error) {
        // Log seulement en développement et rarement
        if (import.meta.env.DEV && Math.random() < 0.05) {
          console.error('❌ Erreur récupération boutique par slug:', error);
        }
        
        // Si erreur 406, essayer avec une recherche par nom
        if (error.code === '406') {
          // Log seulement en développement et rarement
          if (import.meta.env.DEV && Math.random() < 0.05) {
            console.log('🔄 Tentative avec recherche par nom...');
          }
          const cleanSlug = storeSlug.replace(/-/g, ' ').replace(/---/g, ' ');
          
          const { data: storesByName, error: nameError } = await supabase
            .from('stores')
            .select('*')
            .ilike('name', `%${cleanSlug}%`)
            .limit(1);

          if (nameError) {
            // Log seulement en développement et rarement
            if (import.meta.env.DEV && Math.random() < 0.05) {
              console.error('❌ Erreur recherche par nom:', nameError);
            }
          } else if (storesByName && storesByName.length > 0) {
            // Log seulement en développement et rarement
            if (import.meta.env.DEV && Math.random() < 0.05) {
              console.log('✅ Boutique trouvée par nom:', storesByName[0]);
            }
            return storesByName[0];
          }
        }
        
        // Fallback: rechercher la première boutique disponible
        // Log seulement en développement et rarement
        if (import.meta.env.DEV && Math.random() < 0.05) {
          console.log('🔄 Fallback: recherche première boutique');
        }
        const { data: fallbackStore, error: fallbackError } = await supabase
          .from('stores')
          .select('*')
          .limit(1)
          .single();

        if (fallbackError) {
          console.error('❌ Erreur fallback boutique:', fallbackError);
          throw new Error('Aucune boutique disponible');
        }

        // Log seulement en développement et rarement
        if (import.meta.env.DEV && Math.random() < 0.05) {
          console.log('✅ Boutique fallback:', fallbackStore);
        }
        return fallbackStore;
      }

      // Log seulement en développement et rarement
      if (import.meta.env.DEV && Math.random() < 0.05) {
        console.log('✅ Boutique trouvée:', store);
      }
      return store;
    } catch (error) {
      console.error('❌ Erreur récupération boutique:', error);
      throw error;
    }
  }, [storeSlug]);

  // Vérifier s'il y a une session de panier valide (avec protection contre les boucles)
  const checkCartSession = useCallback(async () => {
    if (!effectiveStoreId) {
      setIsCheckingCart(false);
      return;
    }

    try {
      setIsCheckingCart(true);
      const session = await getCartSession(effectiveStoreId);
      
      if (session && session.items && session.items.length > 0) {
        // Log seulement en développement et rarement
        if (import.meta.env.DEV && Math.random() < 0.05) {
          console.log('✅ Session de panier trouvée avec', session.items.length, 'articles');
        }
      } else {
        // Log seulement en développement et rarement
        if (import.meta.env.DEV && Math.random() < 0.05) {
          console.log('❌ Aucune session de panier valide trouvée');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de la session:', error);
    } finally {
      setIsCheckingCart(false);
    }
  }, [effectiveStoreId, getCartSession]);

  // Initialisation unique au chargement de la page
  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        // 1. Détecter le pays de l'utilisateur
        await detectUserCountryForCheckout();

        // 2. Récupérer les infos de la boutique
        const storeInfo = await getStoreInfo();
        if (storeInfo) {
          setCurrentStoreId(storeInfo.id);
          // Log seulement en développement et rarement
          if (import.meta.env.DEV && Math.random() < 0.05) {
            console.log('🏪 Store configuré:', storeInfo.id);
          }
        }
        
        // Si on n'a pas de storeId dans le panier, utiliser celui récupéré
        if (!cartStoreId && storeInfo) {
          // Log seulement en développement et rarement
          if (import.meta.env.DEV && Math.random() < 0.05) {
            console.log('🔄 Utilisation du storeId récupéré car pas de storeId dans le panier');
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
      }
    };

    initializeCheckout();
  }, [detectUserCountryForCheckout, getStoreInfo, cartStoreId]);

  // Vérifier la session de panier une seule fois après l'initialisation
  useEffect(() => {
    if (effectiveStoreId && !isCheckingCart) {
      const timer = setTimeout(() => {
        checkCartSession();
      }, 1000); // Attendre 1 seconde après l'initialisation

      return () => clearTimeout(timer);
    }
  }, [effectiveStoreId, isCheckingCart, checkCartSession]);

  // Timeout de sécurité pour éviter le blocage infini
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      if (isCheckingCart) {
        console.warn('⚠️ Timeout de sécurité: Arrêt du chargement du panier');
        setIsCheckingCart(false);
      }
    }, 10000); // 10 secondes maximum

    return () => clearTimeout(safetyTimer);
  }, [isCheckingCart]);

  // Timeout de sécurité pour cartLoading
  useEffect(() => {
    const cartLoadingTimer = setTimeout(() => {
      if (cartLoading) {
        console.warn('⚠️ Timeout de sécurité: Arrêt du cartLoading');
        // On ne peut pas modifier cartLoading directement, mais on peut forcer le rendu
        // en modifiant isCheckingCart
        setIsCheckingCart(false);
      }
    }, 15000); // 15 secondes maximum

    return () => clearTimeout(cartLoadingTimer);
  }, [cartLoading]);

  // Debug: Afficher les états de chargement
  useEffect(() => {
    if (import.meta.env.DEV && (isCheckingCart || cartLoading)) {
      console.log('🔍 États de chargement:', { isCheckingCart, cartLoading, effectiveStoreId });
    }
  }, [isCheckingCart, cartLoading, effectiveStoreId]);

  // Sélectionner automatiquement la première méthode disponible
  useEffect(() => {
    if (shippingMethods.length > 0 && !selectedShippingMethod) {
      setSelectedShippingMethod(shippingMethods[0]);
      // Log seulement en développement et rarement
      if (import.meta.env.DEV && Math.random() < 0.05) {
        console.log('✅ Première méthode sélectionnée automatiquement:', shippingMethods[0].name);
      }
    }
  }, [shippingMethods, selectedShippingMethod]);

  // DEBUG: Afficher les informations de debug (seulement en développement et rarement)
  useEffect(() => {
    if (import.meta.env.DEV && Math.random() < 0.1) {
      console.log('🔍 DEBUG CHECKOUT:', {
        storeSlug,
        cartStoreId,
        currentStoreId,
        effectiveStoreId,
        currency,
        detectedCountry,
        detectedCountryCode,
        shippingMethodsCount: shippingMethods.length,
        isLoadingShipping,
        selectedMethod: selectedShippingMethod?.name
      });
    }
  }, [storeSlug, cartStoreId, currentStoreId, effectiveStoreId, currency, detectedCountry, detectedCountryCode, shippingMethods.length, isLoadingShipping, selectedShippingMethod]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCustomerInfoChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Charger les méthodes de livraison pour un pays spécifique
  const loadShippingMethods = async (storeId: string, userCountryCode: CountryCode) => {
    try {
      console.log('🔍 Test requêtes simples...');

      // 1. Test zones
      const { data: zones, error: zonesError } = await supabase
        .from('shipping_zones' as any)
        .select('*')
        .eq('store_id', storeId);

      if (zonesError) {
        console.error('❌ Erreur zones:', zonesError);
        return;
      }
      console.log('🌍 ZONES:', zones);

      // 2. Test méthodes sans JOIN
      const { data: methods, error: methodsError } = await supabase
        .from('shipping_methods' as any)
        .select('*')
        .eq('store_id', storeId)
        .eq('is_active', true);

      if (methodsError) {
        console.error('❌ Erreur méthodes:', methodsError);
        return;
      }
      console.log('📦 MÉTHODES:', methods);

      // 3. Filtrer les méthodes par pays de l'utilisateur
      console.log('🎯 Filtrage intelligent pour le pays:', userCountryCode);

      const availableMethods: any[] = [];

      if (methods && methods.length > 0) {
        for (const method of methods as any[]) {
          // Si la méthode n'a pas de zone (globale), elle est disponible partout
          if (!method.shipping_zone_id) {
            console.log(`🌍 ${method.name} - Méthode GLOBALE (disponible partout)`);
            availableMethods.push(method);
            continue;
          }

          // Sinon, vérifier si le pays de l'utilisateur est dans la zone
          const zone = (zones as any[])?.find((z: any) => z.id === method.shipping_zone_id);
          if (zone && zone.countries && zone.countries.includes(userCountryCode)) {
            console.log(`✅ ${method.name} - Disponible pour ${userCountryCode} (Zone: ${zone.name})`);
            availableMethods.push(method);
          } else {
            console.log(`❌ ${method.name} - NON disponible pour ${userCountryCode}`);
          }
        }
      }

      console.log('\n🎯 RÉSULTAT FINAL:', availableMethods.length, 'méthodes disponibles pour', userCountryCode);

      // Sélectionner automatiquement la première méthode si disponible
      if (availableMethods.length > 0) {
        setSelectedShippingMethod(availableMethods[0]);
        setShippingCost(availableMethods[0].price || 0);
      } else {
        setSelectedShippingMethod(null);
        setShippingCost(0);
      }
    } catch (error) {
      console.error('❌ Erreur chargement méthodes:', error);
    }
  };

  // Calculer le total avec livraison
  const getTotalWithShipping = () => {
    const shippingPrice = selectedShippingMethod?.price || 0;
    return getTotalPrice() + shippingPrice;
  };

  const handleCheckout = async () => {
    if (isProcessing) {
      console.log('⏳ Checkout déjà en cours, ignoré');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Validation des informations client
      if (!customerInfo.email || !customerInfo.firstName || !customerInfo.lastName || !customerInfo.address) {
        toast({
          title: "Informations manquantes",
          description: "Veuillez remplir tous les champs obligatoires.",
          variant: "destructive"
        });
        return;
      }

      console.log('🚀 Début du processus de checkout...');

      const storeInfo = await getStoreInfo();
      if (!storeInfo) {
        throw new Error('Impossible de récupérer les informations de la boutique');
      }

      // Utiliser le storeId du panier en priorité
      const finalStoreId = cartStoreId || storeInfo.id;

      // Sauvegarder les informations du client dans la session de panier
      const customerInfoForSession = {
        email: customerInfo.email,
        name: `${customerInfo.firstName} ${customerInfo.lastName}`,
        phone: customerInfo.phone,
        address: customerInfo.address,
        city: customerInfo.city,
        country: customerInfo.country,
        postal_code: customerInfo.postalCode
      };

      console.log('💾 Sauvegarde session avec infos client...');
      await saveCartSession(finalStoreId, items, customerInfoForSession);

      const tempOrderNumber = `TEMP-${Date.now()}`;
      const totalAmount = getTotalWithShipping();
      const totalAmountCentimes = convertToMonerooAmount(totalAmount);

      const paymentData = {
        amount: totalAmountCentimes,
        currency: currency || 'XOF',
        description: `Commande ${tempOrderNumber} - ${storeInfo.name}`,
        return_url: `${window.location.origin}/payment-success?temp_order=${tempOrderNumber}`,
        customer: {
          email: customerInfo.email,
          first_name: customerInfo.firstName,
          last_name: customerInfo.lastName,
          phone: customerInfo.phone,
          address: customerInfo.address,
          city: customerInfo.city,
          country: customerInfo.country,
          zip: customerInfo.postalCode
        },
        metadata: {
          temp_order_number: tempOrderNumber,
          store_id: finalStoreId,
          store_name: storeInfo.name,
          customer_info: JSON.stringify(customerInfo),
          items: JSON.stringify(items),
          shipping_method: JSON.stringify(selectedShippingMethod),
          shipping_cost: shippingCost.toString(),
          total_amount: totalAmount.toString()
        }
      };

      console.log('💳 Initialisation paiement Moneroo...');
      const paymentResult = await MonerooService.initializePayment(paymentData);
      
      if (paymentResult.success && paymentResult.data?.checkout_url) {
        // Stocker les données de commande temporairement
        sessionStorage.setItem('tempOrderData', JSON.stringify({
          tempOrderNumber,
          storeInfo,
          customerInfo,
          items,
          selectedShippingMethod,
          totalAmount
        }));
        
        console.log('✅ Paiement initialisé avec succès, redirection...');
        
        // Afficher un message de succès avant la redirection
        toast({
          title: "Paiement initialisé",
          description: "Redirection vers la page de paiement...",
          variant: "default"
        });
        
        // Rediriger vers Moneroo après un court délai
        setTimeout(() => {
          window.location.href = paymentResult.data.checkout_url;
        }, 1000);
      } else {
        throw new Error(paymentResult.message || 'Erreur lors de l\'initialisation du paiement');
      }
    } catch (error: any) {
      console.error('❌ Erreur lors du checkout:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors du traitement de votre commande.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Afficher un état de chargement pendant la vérification du panier
  // Ajouter une condition pour éviter le blocage infini
  const shouldShowLoading = (isCheckingCart || cartLoading) && items.length === 0;
  
  if (shouldShowLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardContent className="text-center py-12">
              <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-medium mb-2">Chargement de votre panier...</h3>
              <p className="text-gray-600">Vérification de vos articles en cours</p>
              {/* Ajouter un bouton de retry en cas de problème */}
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setIsCheckingCart(false);
                  setTimeout(() => checkCartSession(), 500);
                }}
              >
                Réessayer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">Votre panier est vide</h3>
              <p className="text-gray-600 mb-6">Ajoutez des produits avant de procéder au paiement</p>
              <Button onClick={() => navigate('/')}>
                Retour à la boutique
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Finaliser votre commande</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Informations client */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de livraison</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                  placeholder="+221 XX XXX XX XX"
                />
              </div>

              <div>
                <Label htmlFor="address">Adresse *</Label>
                <Input
                  id="address"
                  value={customerInfo.address}
                  onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                  required
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

              <div>
                <Label htmlFor="country">Pays de livraison</Label>
                <div className="p-3 border rounded-md bg-gray-50 flex items-center gap-2">
                  {isLoadingLocation ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-gray-600">Détection de votre localisation...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-green-600">📍</span>
                      <span className="font-medium">{detectedCountry}</span>
                      <span className="text-sm text-gray-500">(détecté automatiquement)</span>
                    </>
                  )}
                </div>
              </div>


            </CardContent>
          </Card>

          {/* Méthodes de livraison */}
          {!isLoadingLocation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Méthodes de livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {shippingMethods.length > 0 ? (
                  shippingMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedShippingMethod?.id === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        setSelectedShippingMethod(method);
                        console.log('🚚 Méthode sélectionnée:', method.name, method.price);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                            {selectedShippingMethod?.id === method.id && (
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{method.name}</h4>
                            {method.description && (
                              <p className="text-sm text-gray-700">{method.description}</p>
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
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {method.price === 0 ? (
                              <span className="text-green-600">Gratuit</span>
                            ) : (
                              <span>{formatPrice(method.price)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Truck className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="font-medium text-gray-900 mb-1">Aucune livraison disponible</h3>
                    <p className="text-sm text-gray-600">
                      Désolé, nous ne livrons pas encore dans votre pays ({detectedCountry}).
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

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
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total:</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Livraison:</span>
                    <span>
                      {selectedShippingMethod ? (
                        selectedShippingMethod.price === 0 ? (
                          <span className="text-green-600">Gratuit</span>
                        ) : (
                          formatPrice(selectedShippingMethod.price)
                        )
                      ) : (
                        <span className="text-gray-500">Non sélectionnée</span>
                      )}
                    </span>
                  </div>

                  {selectedShippingMethod && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Méthode:</span>
                      <span>{selectedShippingMethod.name}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>{formatPrice(getTotalWithShipping())}</span>
                  </div>
                </div>
                
                <Button
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={items.length === 0 || isProcessing || isLoadingLocation || (shippingMethods.length > 0 && !selectedShippingMethod)}
                >
                  {(isProcessing) ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payer maintenant
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
