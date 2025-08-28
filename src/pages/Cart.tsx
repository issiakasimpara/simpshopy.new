
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStores } from '@/hooks/useStores';
import { useStoreCurrency } from '@/hooks/useStoreCurrency';
import { useEffect } from 'react';

const Cart = () => {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart, setStoreId, storeId } = useCart();
  const navigate = useNavigate();
  const { stores } = useStores();
  const { storeSlug } = useParams();
  const { formatPrice } = useStoreCurrency(storeId);

  // Initialiser le panier avec le premier store disponible
  useEffect(() => {
    if (stores.length > 0 && !storeId) {
      console.log('Cart: Initializing with storeId:', stores[0].id);
      setStoreId(stores[0].id);
    }
  }, [stores, storeId, setStoreId]);

  const handleCheckout = () => {
    // Si nous sommes dans une boutique spécifique, naviguer vers son checkout
    if (storeSlug) {
      navigate(`/store/${storeSlug}/checkout`);
    } else {
      // Sinon, utiliser la première boutique disponible
      if (stores.length > 0) {
        const firstStore = stores[0];
        navigate(`/store/${firstStore.slug || firstStore.id}/checkout`);
      } else {
        navigate('/checkout'); // Fallback
      }
    }
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Mon Panier</h1>

        {items.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-medium mb-2">Votre panier est vide</h3>
              <p className="text-gray-600 mb-6">Ajoutez des produits pour commencer vos achats</p>
              <Button onClick={handleContinueShopping}>
                Continuer mes achats
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Liste des articles */}
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        {item.sku && (
                          <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                        )}
                        <p className="text-lg font-bold">{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.variant_id)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.variant_id)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.product_id, item.variant_id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Résumé et actions */}
            <Card>
              <CardHeader>
                <CardTitle>Résumé de la commande</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-lg">
                    <span>Sous-total</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Livraison</span>
                    <span>Calculée à l'étape suivante</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span>{formatPrice(getTotalPrice())}</span>
                    </div>
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <Button variant="outline" onClick={clearCart} className="flex-1">
                      Vider le panier
                    </Button>
                    <Button onClick={handleCheckout} className="flex-1">
                      Passer la commande
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
