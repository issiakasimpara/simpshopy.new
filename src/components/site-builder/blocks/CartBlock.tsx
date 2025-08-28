
import { TemplateBlock } from '@/types/template';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStoreCurrency } from '@/hooks/useStoreCurrency';

interface CartBlockProps {
  block: TemplateBlock;
  isEditing?: boolean;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
  onUpdate?: (block: TemplateBlock) => void;
  onNavigate?: (page: string) => void; // Pour la navigation dans l'aperçu
}

const CartBlock = ({ block, isEditing = false, onNavigate }: CartBlockProps) => {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { formatPrice } = useStoreCurrency();

  console.log('CartBlock - Items in cart:', items);
  console.log('CartBlock - Total items:', items.length);

  const handleCheckout = () => {
    if (onNavigate) {
      // Mode aperçu - navigation interne
      onNavigate('checkout');
    } else {
      // Mode normal - navigation React Router
      navigate('/checkout');
    }
  };

  const handleContinueShopping = () => {
    if (onNavigate) {
      // Mode aperçu - retour à la page d'accueil
      onNavigate('home');
    } else {
      // Mode normal - navigation React Router
      navigate('/');
    }
  };

  if (isEditing) {
    return (
      <div className="p-6 border-2 border-dashed border-gray-300 text-center">
        <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-gray-500">Bloc Panier - Prévisualisation en mode édition</p>
      </div>
    );
  }

  return (
    <div 
      className="py-12 px-4"
      style={{
        backgroundColor: block.styles.backgroundColor || '#ffffff',
        color: block.styles.textColor || '#000000',
        padding: block.styles.padding || '60px 0'
      }}
    >
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {block.content.title || 'Mon Panier'}
        </h2>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium mb-2">Votre panier est vide</h3>
            <p className="text-gray-600 mb-6">Ajoutez des produits pour commencer vos achats</p>
            <Button onClick={handleContinueShopping}>
              Continuer mes achats
            </Button>
          </div>
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

export default CartBlock;
