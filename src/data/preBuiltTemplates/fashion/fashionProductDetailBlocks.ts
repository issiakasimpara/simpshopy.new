
import { TemplateBlock } from '@/types/template';

export const fashionProductDetailBlocks: TemplateBlock[] = [
  {
    id: 'product-detail-main-fashion',
    type: 'product-detail',
    content: {
      title: 'Détail du produit',
      showImageGallery: true,
      showProductInfo: true,
      showVariantSelector: true,
      showBreadcrumb: true
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '0',
    },
    order: 1
  }
];
