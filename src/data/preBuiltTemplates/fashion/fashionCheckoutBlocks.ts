
import { TemplateBlock } from '@/types/template';

export const fashionCheckoutBlocks: TemplateBlock[] = [
  {
    id: 'checkout-main-fashion',
    type: 'checkout',
    content: {
      title: 'Finaliser votre commande',
      subtitle: 'Dernière étape avant de recevoir vos articles',
      showOrderSummary: true,
      paymentMethods: ['card', 'paypal'],
      shippingOptions: [
        { name: 'Standard', price: 4.99, delay: '2-3 jours' },
        { name: 'Express', price: 9.99, delay: '24h' }
      ]
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '60px 0',
    },
    order: 1
  }
];
