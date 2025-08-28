
import { Template } from '@/types/template';
import { createFooterBlock } from './shared/commonFooterBlocks';

const sportsFooterBlock = createFooterBlock('sports');

// Blocs spécialisés pour le sport
const sportsHomeBlocks = [
  {
    id: 'hero-sports-1',
    type: 'hero',
    content: {
      title: 'Performance & Passion',
      subtitle: 'Équipements et vêtements pour tous les sports',
      buttonText: 'Découvrir',
      buttonLink: '/products',
      mediaType: 'image',
      backgroundImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b'
    },
    styles: {
      backgroundColor: '#1e40af',
      textColor: '#ffffff',
      padding: '120px 0',
    },
    order: 1
  },
  {
    id: 'features-sports-1',
    type: 'features',
    content: {
      title: 'Pourquoi nous choisir',
      subtitle: 'Votre partenaire sport',
      features: [
        {
          title: 'Équipements pro',
          description: 'Marques officielles et qualité garantie',
          icon: '🏆'
        },
        {
          title: 'Livraison rapide',
          description: 'Livraison gratuite dès 35000 CFA',
          icon: '⚡'
        },
        {
          title: 'Conseils experts',
          description: 'Équipe de sportifs passionnés',
          icon: '👨‍💼'
        }
      ]
    },
    styles: {
      backgroundColor: '#f1f5f9',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 2
  },
  {
    id: 'products-sports-1',
    type: 'products',
    content: {
      title: 'Produits Vedettes',
      subtitle: 'Découvrez notre sélection d\'équipements',
      layout: 'grid',
      productsToShow: 8,
      showPrice: true,
      showAddToCart: true,
      showSize: true,
      showBrand: true,
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
    id: 'testimonials-sports-1',
    type: 'testimonials',
    content: {
      title: 'Avis de nos sportifs',
      layout: 'carousel',
      showImages: true,
      showSport: true,
      testimonials: [
        {
          name: 'Thomas Martin',
          rating: 5,
          content: 'Équipements de qualité pour mes compétitions !',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
          sport: 'Football'
        },
        {
          name: 'Sophie Dubois',
          rating: 5,
          content: 'Service impeccable et conseils personnalisés.',
          image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1-female',
          sport: 'Fitness'
        }
      ]
    },
    styles: {
      backgroundColor: '#f1f5f9',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 5
  },
  {
    id: 'contact-sports-1',
    type: 'contact',
    content: {
      title: 'Conseils Sport',
      subtitle: 'Notre équipe d\'experts est là pour vous conseiller',
      showForm: true,
      showInfo: true,
      showConsultation: true,
      showFitting: true,
      phone: '+33 1 23 45 67 89',
      email: 'conseils@sport-performance.fr',
      address: '123 Rue du Sport, 75001 Paris'
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 6
  }
];

const sportsProductBlocks = [
  {
    id: 'hero-product-sports',
    type: 'hero',
    content: {
      title: 'Nos Équipements Sport',
      subtitle: 'Découvrez notre gamme complète',
      showBreadcrumb: true,
      showSearch: true,
      showSportFilter: true,
      showSizeFilter: true
    },
    styles: {
      backgroundColor: '#1e40af',
      textColor: '#ffffff',
      padding: '60px 0',
    },
    order: 1
  },
  {
    id: 'products-listing-sports',
    type: 'products',
    content: {
      title: 'Collection Complète',
      layout: 'grid',
      productsToShow: 12,
      showPrice: true,
      showAddToCart: true,
      showFilters: true,
      showSorting: true,
      showSize: true,
      showBrand: true,
      categories: ['Football', 'Basketball', 'Fitness', 'Running', 'Tennis', 'Natation']
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 2
  }
];

const sportsProductDetailBlocks = [
  {
    id: 'product-detail-main-sports',
    type: 'product-detail',
    content: {
      title: 'Détail du produit',
      showImageGallery: true,
      showProductInfo: true,
      showVariantSelector: true,
      showBreadcrumb: true,
      showSize: true,
      showBrand: true,
      showWarranty: true,
      showCare: true
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '0',
    },
    order: 1
  }
];

const sportsCategoryBlocks = [
  {
    id: 'category-main-sports',
    type: 'category',
    content: {
      title: 'Catégories Sport',
      showFilters: true,
      showSportFilter: true,
      showPriceFilter: true,
      showSizeFilter: true,
      showBrandFilter: true,
      layout: 'grid'
    },
    styles: {
      backgroundColor: '#1e40af',
      textColor: '#ffffff',
      padding: '40px 0',
    },
    order: 1
  }
];

const sportsContactBlocks = [
  {
    id: 'contact-main-sports',
    type: 'contact',
    content: {
      title: 'Conseils Sport',
      subtitle: 'Notre équipe d\'experts est là pour vous conseiller',
      showForm: true,
      showInfo: true,
      showConsultation: true,
      showFitting: true,
      showTraining: true,
      phone: '+33 1 23 45 67 89',
      email: 'conseils@sport-performance.fr',
      address: '123 Rue du Sport, 75001 Paris'
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 1
  }
];

const sportsCartBlocks = [
  {
    id: 'cart-main-sports',
    type: 'cart',
    content: {
      title: 'Mon Panier Sport',
      subtitle: 'Vérifiez vos articles avant de passer commande',
      showRecommendations: true,
      showSizeGuide: true,
      showFitting: true,
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

const sportsCheckoutBlocks = [
  {
    id: 'checkout-main-sports',
    type: 'checkout',
    content: {
      title: 'Finaliser votre commande',
      subtitle: 'Dernière étape avant de recevoir vos équipements',
      showOrderSummary: true,
      showSizeGuide: true,
      showFitting: true,
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

export const sportsTemplates: Template[] = [
  {
    id: 'sports-performance',
    name: 'Sport Performance',
    category: 'sports',
    description: 'Template dynamique pour équipements et vêtements sportifs',
    thumbnail: '/placeholder.svg',
    blocks: [...sportsHomeBlocks, sportsFooterBlock],
    styles: {
      primaryColor: '#1e40af',
      secondaryColor: '#64748b',
      fontFamily: 'Inter',
    },
    pages: {
      home: [...sportsHomeBlocks, sportsFooterBlock],
      product: [...sportsProductBlocks, sportsFooterBlock],
      'product-detail': [...sportsProductDetailBlocks, sportsFooterBlock],
      category: [...sportsCategoryBlocks, sportsFooterBlock],
      contact: [...sportsContactBlocks, sportsFooterBlock],
      cart: [...sportsCartBlocks, sportsFooterBlock],
      checkout: [...sportsCheckoutBlocks, sportsFooterBlock]
    }
  }
];
