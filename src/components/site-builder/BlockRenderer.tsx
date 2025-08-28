
import React, { memo } from 'react';
import { TemplateBlock } from '@/types/template';
import type { Tables } from '@/integrations/supabase/types';

// ⚡ IMPORT SYNCHRONE pour la boutique publique (performance maximale)
import AnnouncementBarBlock from './blocks/AnnouncementBarBlock';
import BrandingBlock from './blocks/BrandingBlock';
import HeroBlock from './blocks/HeroBlock';
import ProductsBlock from './blocks/ProductsBlock';
import ProductDetailBlock from './blocks/ProductDetailBlock';
import TextImageBlock from './blocks/TextImageBlock';
import TextVideoBlock from './blocks/TextVideoBlock';
import ContactBlock from './blocks/ContactBlock';
import GalleryBlock from './blocks/GalleryBlock';
import VideoBlock from './blocks/VideoBlock';
import FooterBlock from './blocks/FooterBlock';
import FeaturesBlock from './blocks/FeaturesBlock';
import TestimonialsBlock from './blocks/TestimonialsBlock';
import FAQBlock from './blocks/FAQBlock';
import BeforeAfterBlock from './blocks/BeforeAfterBlock';
import ComparisonBlock from './blocks/ComparisonBlock';
import CartBlock from './blocks/CartBlock';
import CheckoutBlock from './blocks/CheckoutBlock';
import GuaranteesBlock from './blocks/GuaranteesBlock';
import DefaultBlock from './blocks/DefaultBlock';

// Composant supprimé - plus de lazy loading

type Store = Tables<'stores'>;

interface BlockRendererProps {
  block: TemplateBlock;
  isEditing?: boolean;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
  onUpdate?: (block: TemplateBlock) => void;
  selectedStore?: Store | null;
  productId?: string | null;
  onProductClick?: (productId: string) => void;
  onNavigate?: (page: string) => void;
  products?: any[]; // Ajouter les produits pour éviter les requêtes doubles
}

const BlockRenderer = memo(({
  block,
  isEditing = false,
  viewMode = 'desktop',
  onUpdate,
  selectedStore,
  productId,
  onProductClick,
  onNavigate,
  products
}: BlockRendererProps) => {
  // Log seulement en développement et très rarement
  if (import.meta.env.DEV && Math.random() < 0.01) {
    console.log('BlockRenderer - Rendering block:', block.type, 'with productId:', productId);
  }

  const blockProps = {
    block,
    isEditing,
    viewMode,
    onUpdate,
    selectedStore,
    productId,
    onProductClick,
    onNavigate
  };

  const renderBlock = () => {

  switch (block.type) {
    case 'announcement':
      return <AnnouncementBarBlock {...blockProps} />;
    case 'branding':
      return <BrandingBlock {...blockProps} />;
    case 'hero':
      return <HeroBlock {...blockProps} />;
    case 'products':
      return <ProductsBlock {...blockProps} />;
    case 'product-detail':
      // Log seulement en développement et très rarement
      if (import.meta.env.DEV && Math.random() < 0.01) {
        console.log('BlockRenderer - Rendering ProductDetailBlock with productId:', productId);
      }
      return <ProductDetailBlock {...blockProps} products={products} />;
    case 'text-image':
      return <TextImageBlock {...blockProps} />;
    case 'text-video':
      return <TextVideoBlock {...blockProps} />;
    case 'contact':
      return <ContactBlock {...blockProps} />;
    case 'gallery':
      return <GalleryBlock {...blockProps} />;
    case 'video':
      return <VideoBlock {...blockProps} />;
    case 'footer':
      return <FooterBlock {...blockProps} />;
    case 'features':
      return <FeaturesBlock {...blockProps} />;
    case 'testimonials':
      return <TestimonialsBlock {...blockProps} />;
    case 'faq':
      return <FAQBlock {...blockProps} />;
    case 'before-after':
      return <BeforeAfterBlock {...blockProps} />;
    case 'comparison':
      return <ComparisonBlock {...blockProps} />;
    case 'cart':
      return <CartBlock {...blockProps} />;
    case 'checkout':
      return <CheckoutBlock {...blockProps} />;
    case 'guarantees':
      return <GuaranteesBlock {...blockProps} />;

    default:
      return <DefaultBlock {...blockProps} />;
    }
  };

  return renderBlock();
});

BlockRenderer.displayName = 'BlockRenderer';

export default BlockRenderer;
