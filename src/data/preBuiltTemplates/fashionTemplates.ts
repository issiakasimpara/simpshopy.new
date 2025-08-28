
import { Template } from '@/types/template';
import { fashionHomeBlocks } from './fashion/fashionHomeBlocks';
import { fashionProductBlocks } from './fashion/fashionProductBlocks';
import { fashionProductDetailBlocks } from './fashion/fashionProductDetailBlocks';
import { fashionCategoryBlocks } from './fashion/fashionCategoryBlocks';
import { fashionContactBlocks } from './fashion/fashionContactBlocks';
import { fashionCartBlocks } from './fashion/fashionCartBlocks';
import { fashionCheckoutBlocks } from './fashion/fashionCheckoutBlocks';
import { createFooterBlock } from './shared/commonFooterBlocks';

const fashionFooterBlock = createFooterBlock('fashion');

export const fashionTemplates: Template[] = [
  {
    id: 'fashion-modern',
    name: 'Fashion Moderne',
    category: 'fashion',
    description: 'Template moderne pour boutique de mode avec galerie produits et design épuré',
    thumbnail: '/placeholder.svg',
    blocks: [...fashionHomeBlocks, fashionFooterBlock],
    styles: {
      primaryColor: '#2563eb',
      secondaryColor: '#64748b',
      fontFamily: 'Inter'
    },
    pages: {
      home: [...fashionHomeBlocks, fashionFooterBlock],
      product: [...fashionProductBlocks, fashionFooterBlock],
      'product-detail': [...fashionProductDetailBlocks, fashionFooterBlock],
      category: [...fashionCategoryBlocks, fashionFooterBlock],
      contact: [...fashionContactBlocks, fashionFooterBlock],
      cart: [...fashionCartBlocks, fashionFooterBlock],
      checkout: [...fashionCheckoutBlocks, fashionFooterBlock]
    }
  },
  {
    id: 'fashion-luxury',
    name: 'Fashion Luxueux',
    category: 'fashion',
    description: 'Template élégant pour marques de luxe avec animations sophistiquées',
    thumbnail: '/placeholder.svg',
    blocks: [...fashionHomeBlocks, fashionFooterBlock],
    styles: {
      primaryColor: '#1f2937',
      secondaryColor: '#6b7280',
      fontFamily: 'Playfair Display'
    },
    pages: {
      home: [...fashionHomeBlocks, fashionFooterBlock],
      product: [...fashionProductBlocks, fashionFooterBlock],
      'product-detail': [...fashionProductDetailBlocks, fashionFooterBlock],
      category: [...fashionCategoryBlocks, fashionFooterBlock],
      contact: [...fashionContactBlocks, fashionFooterBlock],
      cart: [...fashionCartBlocks, fashionFooterBlock],
      checkout: [...fashionCheckoutBlocks, fashionFooterBlock]
    }
  },
  {
    id: 'fashion-minimalist',
    name: 'Fashion Minimaliste',
    category: 'fashion',
    description: 'Design épuré et minimaliste pour une expérience shopping raffinée',
    thumbnail: '/placeholder.svg',
    blocks: [...fashionHomeBlocks, fashionFooterBlock],
    styles: {
      primaryColor: '#059669',
      secondaryColor: '#6b7280',
      fontFamily: 'Source Sans Pro'
    },
    pages: {
      home: [...fashionHomeBlocks, fashionFooterBlock],
      product: [...fashionProductBlocks, fashionFooterBlock],
      'product-detail': [...fashionProductDetailBlocks, fashionFooterBlock],
      category: [...fashionCategoryBlocks, fashionFooterBlock],
      contact: [...fashionContactBlocks, fashionFooterBlock],
      cart: [...fashionCartBlocks, fashionFooterBlock],
      checkout: [...fashionCheckoutBlocks, fashionFooterBlock]
    }
  }
];
