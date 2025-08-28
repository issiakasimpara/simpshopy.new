
import CheckoutBlock from '@/components/site-builder/blocks/CheckoutBlock';
import { TemplateBlock } from '@/types/template';

const CheckoutPage = () => {
  const checkoutBlock: TemplateBlock = {
    id: 'checkout-page-main',
    type: 'checkout',
    content: {
      title: 'Finaliser votre commande',
      subtitle: 'Dernière étape avant de recevoir vos articles'
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
      <CheckoutBlock block={checkoutBlock} isEditing={false} />
    </div>
  );
};

export default CheckoutPage;
