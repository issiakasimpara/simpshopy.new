
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    images?: string[];
    sku?: string;
  };
  storeId: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  disabled?: boolean;
}

const AddToCartButton = ({ 
  product, 
  storeId,
  className = '',
  variant = 'default',
  size = 'default',
  disabled = false
}: AddToCartButtonProps) => {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    console.log('AddToCartButton: handleAddToCart called', { disabled, storeId, product });
    
    if (disabled) {
      console.log('AddToCartButton: Bouton désactivé');
      return;
    }
    
    if (!storeId) {
      console.error('AddToCartButton: storeId manquant!');
      alert('Erreur: Aucune boutique sélectionnée. Veuillez d\'abord sélectionner une boutique.');
      return;
    }
    
    try {
      const cartItem = {
        id: `${product.id}_${Date.now()}`,
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images?.[0],
        sku: product.sku
      };
      
      await addItem(cartItem, storeId);
      console.log('AddToCartButton: Item successfully added to cart');
      setIsAdded(true);
      
      // Réinitialiser l'état après 2 secondes
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    } catch (error) {
      console.error('AddToCartButton: Error adding item to cart:', error);
      alert('Erreur lors de l\'ajout au panier. Veuillez réessayer.');
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      variant={variant}
      size={size}
      className={`${className} ${isAdded ? 'bg-green-500 hover:bg-green-600' : ''}`}
      disabled={disabled || isAdded}
    >
      {isAdded ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Ajouté !
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Ajouter au panier
        </>
      )}
    </Button>
  );
};

export default AddToCartButton;
