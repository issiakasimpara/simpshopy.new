
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { ShoppingBag, X, Plus, Minus } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useStores } from '@/hooks/useStores';
import { useStoreCurrency } from '@/hooks/useStoreCurrency';

const CartWidget = () => {
  const {
    items,
    getTotalItems,
    getTotalPrice,
    isOpen,
    toggleCart,
    updateQuantity,
    removeItem
  } = useCart();
  const navigate = useNavigate();
  const { storeSlug } = useParams();
  const location = useLocation();
  const { stores } = useStores();
  const { formatPrice } = useStoreCurrency(stores[0]?.id);

  const getStoreBasedUrl = (path: string) => {
    // Si nous sommes dans une boutique spécifique
    if (storeSlug) {
      return `/store/${storeSlug}${path}`;
    }

    // Si nous sommes sur une page de boutique mais sans slug dans l'URL
    if (location.pathname.includes('/store/')) {
      const pathParts = location.pathname.split('/');
      const slugIndex = pathParts.indexOf('store') + 1;
      if (slugIndex < pathParts.length) {
        const currentSlug = pathParts[slugIndex];
        return `/store/${currentSlug}${path}`;
      }
    }

    // Sinon, utiliser la première boutique disponible
    if (stores.length > 0) {
      const firstStore = stores[0];
      return `/store/${firstStore.slug || firstStore.id}${path}`;
    }

    // Fallback vers l'URL simple
    return path;
  };

  const handleViewCart = () => {
    toggleCart();
    navigate(getStoreBasedUrl('/cart'));
  };

  const handleCheckout = () => {
    toggleCart();
    navigate(getStoreBasedUrl('/checkout'));
  };

  return (
    <>
      {/* Bouton du panier */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-40"
        onClick={toggleCart}
      >
        <ShoppingBag className="h-6 w-6" />
        {getTotalItems() > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
            {getTotalItems()}
          </span>
        )}
      </Button>

      {/* Panel du panier */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={toggleCart}
          />
          
          {/* Panel */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <Card className="h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">
                  Mon Panier ({getTotalItems()})
                </h3>
                <Button variant="ghost" size="icon" onClick={toggleCart}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <CardContent className="flex flex-col h-full p-0">
                {items.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center">
                      <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500">Votre panier est vide</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Liste des articles */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex space-x-3 p-3 border rounded-lg">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{item.name}</h4>
                            <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.variant_id)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.variant_id)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-red-500"
                                onClick={() => removeItem(item.product_id, item.variant_id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer avec total et actions */}
                    <div className="p-4 border-t space-y-4">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>{formatPrice(getTotalPrice())}</span>
                      </div>
                      <div className="space-y-2">
                        <Button onClick={handleViewCart} variant="outline" className="w-full">
                          Voir le panier
                        </Button>
                        <Button onClick={handleCheckout} className="w-full">
                          Commander
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default CartWidget;
