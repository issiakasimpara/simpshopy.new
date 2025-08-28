
import { TemplateBlock } from '@/types/template';

export const fashionCategoryBlocks: TemplateBlock[] = [
  {
    id: 'hero-category-fashion',
    type: 'hero',
    content: {
      title: 'Catégories',
      subtitle: 'Explorez nos différentes collections',
      showBreadcrumb: true
    },
    styles: {
      backgroundColor: '#f8f9fa',
      textColor: '#000000',
      padding: '60px 0',
    },
    order: 1
  },
  {
    id: 'gallery-categories-fashion',
    type: 'gallery',
    content: {
      title: 'Nos Collections',
      layout: 'grid',
      showOverlay: true,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
          title: 'Robes',
          link: '/category/robes'
        },
        {
          url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1',
          title: 'Tops',
          link: '/category/tops'
        },
        {
          url: 'https://images.unsplash.com/photo-1506629905496-f43d8e5d8b6d',
          title: 'Pantalons',
          link: '/category/pantalons'
        }
      ]
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 2
  }
];
