
import { TemplateBlock } from '@/types/template';

export const fashionProductBlocks: TemplateBlock[] = [
  {
    id: 'hero-product-fashion',
    type: 'hero',
    content: {
      title: 'Nos Produits',
      subtitle: 'Découvrez toute notre collection mode',
      showBreadcrumb: true,
      showSearch: true
    },
    styles: {
      backgroundColor: '#f8f9fa',
      textColor: '#000000',
      padding: '60px 0',
    },
    order: 1
  },
  {
    id: 'products-listing-fashion',
    type: 'products',
    content: {
      title: 'Collection Complète',
      layout: 'grid',
      productsToShow: 12,
      showPrice: true,
      showAddToCart: true,
      showFilters: true,
      showSorting: true,
      categories: ['Robes', 'Tops', 'Pantalons', 'Accessoires']
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 2
  }
];
