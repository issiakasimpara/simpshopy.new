
import { Template } from '@/types/template';
import { createFooterBlock } from './shared/commonFooterBlocks';

const electronicsFooterBlock = createFooterBlock('electronics');

// Blocs spécialisés pour l'électronique
const electronicsHomeBlocks = [
  {
    id: 'hero-electronics-1',
    type: 'hero',
    content: {
      title: 'Technologie de Pointe',
      subtitle: 'Découvrez les dernières innovations en électronique',
      buttonText: 'Explorer nos produits',
      buttonLink: '/products',
      mediaType: 'image',
      backgroundImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176'
    },
    styles: {
      backgroundColor: '#1e293b',
      textColor: '#ffffff',
      padding: '120px 0',
    },
    order: 1
  },
  {
    id: 'features-electronics-1',
    type: 'features',
    content: {
      title: 'Pourquoi nous choisir',
      subtitle: 'Votre spécialiste en technologie',
      features: [
        {
          title: 'Garantie 2 ans',
          description: 'Protection complète sur tous nos produits',
          icon: '🛡️'
        },
        {
          title: 'Support technique',
          description: 'Assistance 24/7 pour vos questions',
          icon: '🔧'
        },
        {
          title: 'Livraison rapide',
          description: 'Livraison gratuite dès 50000 CFA',
          icon: '⚡'
        }
      ]
    },
    styles: {
      backgroundColor: '#f8fafc',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 2
  },
  {
    id: 'products-electronics-1',
    type: 'products',
    content: {
      title: 'Produits Vedettes',
      subtitle: 'Découvrez notre sélection de produits high-tech',
      layout: 'grid',
      productsToShow: 8,
      showPrice: true,
      showAddToCart: true,
      showSpecifications: true,
      showWarranty: true,
      viewAllLink: '/products'
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 3
  },

  {
    id: 'testimonials-electronics-1',
    type: 'testimonials',
    content: {
      title: 'Avis de nos clients',
      layout: 'carousel',
      showImages: true,
      showProductType: true,
      testimonials: [
        {
          name: 'Thomas Martin',
          rating: 5,
          content: 'Service client exceptionnel et produits de qualité !',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
          productType: 'Smartphone'
        },
        {
          name: 'Alexandre Dubois',
          rating: 5,
          content: 'Livraison rapide et support technique au top.',
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
          productType: 'Gaming'
        }
      ]
    },
    styles: {
      backgroundColor: '#f8fafc',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 5
  },
  {
    id: 'contact-electronics-1',
    type: 'contact',
    content: {
      title: 'Support Technique',
      subtitle: 'Notre équipe d\'experts est là pour vous aider',
      showForm: true,
      showInfo: true,
      showTechnicalSupport: true,
      showWarrantyInfo: true,
      phone: '+33 1 23 45 67 89',
      email: 'support@tech-electronics.fr',
      address: '123 Rue de la Tech, 75001 Paris'
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 6
  }
];

const electronicsProductBlocks = [
  {
    id: 'hero-product-electronics',
    type: 'hero',
    content: {
      title: 'Nos Produits Électroniques',
      subtitle: 'Découvrez notre gamme complète de technologie',
      showBreadcrumb: true,
      showSearch: true,
      showCategoryFilter: true,
      showBrandFilter: true
    },
    styles: {
      backgroundColor: '#1e293b',
      textColor: '#ffffff',
      padding: '60px 0',
    },
    order: 1
  },
  {
    id: 'products-listing-electronics',
    type: 'products',
    content: {
      title: 'Collection Complète',
      layout: 'grid',
      productsToShow: 12,
      showPrice: true,
      showAddToCart: true,
      showFilters: true,
      showSorting: true,
      showSpecifications: true,
      showWarranty: true,
      categories: ['Smartphones', 'Ordinateurs', 'Gaming', 'Audio', 'Accessoires', 'Smart Home']
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 2
  }
];

const electronicsProductDetailBlocks = [
  {
    id: 'product-detail-main-electronics',
    type: 'product-detail',
    content: {
      title: 'Détail du produit',
      showImageGallery: true,
      showProductInfo: true,
      showVariantSelector: true,
      showBreadcrumb: true,
      showSpecifications: true,
      showWarranty: true,
      showTechnicalSupport: true,
      showCompatibility: true,
      showReviews: true
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '0',
    },
    order: 1
  }
];

const electronicsCategoryBlocks = [
  {
    id: 'category-main-electronics',
    type: 'category',
    content: {
      title: 'Catégories de Produits',
      showFilters: true,
      showCategoryFilter: true,
      showPriceFilter: true,
      showBrandFilter: true,
      showWarrantyFilter: true,
      layout: 'grid'
    },
    styles: {
      backgroundColor: '#1e293b',
      textColor: '#ffffff',
      padding: '40px 0',
    },
    order: 1
  }
];

const electronicsContactBlocks = [
  {
    id: 'contact-main-electronics',
    type: 'contact',
    content: {
      title: 'Support Technique',
      subtitle: 'Notre équipe d\'experts est là pour vous aider',
      showForm: true,
      showInfo: true,
      showTechnicalSupport: true,
      showWarrantyInfo: true,
      showRepairService: true,
      phone: '+33 1 23 45 67 89',
      email: 'support@tech-electronics.fr',
      address: '123 Rue de la Tech, 75001 Paris'
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 1
  }
];

const electronicsCartBlocks = [
  {
    id: 'cart-main-electronics',
    type: 'cart',
    content: {
      title: 'Mon Panier Tech',
      subtitle: 'Vérifiez vos articles avant de passer commande',
      showRecommendations: true,
      showWarrantyInfo: true,
      showTechnicalSupport: true,
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

const electronicsCheckoutBlocks = [
  {
    id: 'checkout-main-electronics',
    type: 'checkout',
    content: {
      title: 'Finaliser votre commande',
      subtitle: 'Dernière étape avant de recevoir vos produits tech',
      showOrderSummary: true,
      showWarrantyInfo: true,
      showTechnicalSupport: true,
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

export const electronicsTemplates: Template[] = [
  {
    id: 'electronics-modern',
    name: 'Tech Moderne',
    category: 'electronics',
    description: 'Template moderne pour boutique high-tech avec mise en avant des spécifications',
    thumbnail: '/placeholder.svg',
    blocks: [...electronicsHomeBlocks, electronicsFooterBlock],
    styles: {
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      fontFamily: 'Inter'
    },
    pages: {
      home: [...electronicsHomeBlocks, electronicsFooterBlock],
      product: [...electronicsProductBlocks, electronicsFooterBlock],
      'product-detail': [...electronicsProductDetailBlocks, electronicsFooterBlock],
      category: [...electronicsCategoryBlocks, electronicsFooterBlock],
      contact: [...electronicsContactBlocks, electronicsFooterBlock],
      cart: [...electronicsCartBlocks, electronicsFooterBlock],
      checkout: [...electronicsCheckoutBlocks, electronicsFooterBlock]
    }
  },
  {
    id: 'electronics-gaming',
    name: 'Gaming Pro',
    category: 'electronics',
    description: 'Parfait pour les boutiques gaming avec design dynamique et coloré',
    thumbnail: '/placeholder.svg',
    blocks: [...electronicsHomeBlocks, electronicsFooterBlock],
    styles: {
      primaryColor: '#7c3aed',
      secondaryColor: '#64748b',
      fontFamily: 'Inter'
    },
    pages: {
      home: [...electronicsHomeBlocks, electronicsFooterBlock],
      product: [...electronicsProductBlocks, electronicsFooterBlock],
      'product-detail': [...electronicsProductDetailBlocks, electronicsFooterBlock],
      category: [...electronicsCategoryBlocks, electronicsFooterBlock],
      contact: [...electronicsContactBlocks, electronicsFooterBlock],
      cart: [...electronicsCartBlocks, electronicsFooterBlock],
      checkout: [...electronicsCheckoutBlocks, electronicsFooterBlock]
    }
  }
];
