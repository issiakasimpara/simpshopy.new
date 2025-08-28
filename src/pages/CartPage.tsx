
import CartBlock from '@/components/site-builder/blocks/CartBlock';
import { TemplateBlock } from '@/types/template';

const CartPage = () => {
  const cartBlock: TemplateBlock = {
    id: 'cart-page-main',
    type: 'cart',
    content: {
      title: 'Mon Panier',
      subtitle: 'Vérifiez vos articles avant de passer commande'
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '60px 0'
    },
    order: 1
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CartBlock block={cartBlock} isEditing={false} />
    </div>
  );
};

export default CartPage;
