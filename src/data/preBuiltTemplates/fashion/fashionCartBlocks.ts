
import { TemplateBlock } from '@/types/template';

export const fashionCartBlocks: TemplateBlock[] = [
  {
    id: 'cart-main-fashion',
    type: 'cart',
    content: {
      title: 'Mon Panier',
      subtitle: 'Vérifiez vos articles avant de passer commande',
      showRecommendations: true,
      continueShoppingLink: '/products'
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '60px 0',
    },
    order: 1
  }
];
