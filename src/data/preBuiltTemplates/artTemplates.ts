
import { Template } from '@/types/template';
import { createFooterBlock } from './shared/commonFooterBlocks';

const artFooterBlock = createFooterBlock('art');

// Blocs spécialisés pour l'art
const artHomeBlocks = [
  {
    id: 'hero-art-1',
    type: 'hero',
    content: {
      title: 'Art & Créativité',
      subtitle: 'Œuvres uniques et créations artisanales',
      buttonText: 'Explorer',
      buttonLink: '/products',
      mediaType: 'image',
      backgroundImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262'
    },
    styles: {
      backgroundColor: '#4a4a4a',
      textColor: '#ffffff',
      padding: '120px 0',
    },
    order: 1
  },
  {
    id: 'features-art-1',
    type: 'features',
    content: {
      title: 'Pourquoi nous choisir',
      subtitle: 'Votre galerie d\'art en ligne',
      features: [
        {
          title: 'Artistes certifiés',
          description: 'Sélection rigoureuse des créateurs',
          icon: '🎨'
        },
        {
          title: 'Œuvres uniques',
          description: 'Pièces originales et numérotées',
          icon: '✨'
        },
        {
          title: 'Livraison sécurisée',
          description: 'Emballage professionnel et assuré',
          icon: '🛡️'
        }
      ]
    },
    styles: {
      backgroundColor: '#f8f9fa',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 2
  },
  {
    id: 'products-art-1',
    type: 'products',
    content: {
      title: 'Œuvres Vedettes',
      subtitle: 'Découvrez notre sélection d\'artistes',
      layout: 'grid',
      productsToShow: 8,
      showPrice: true,
      showAddToCart: true,
      showArtist: true,
      showTechnique: true,
      showDimensions: true,
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
    id: 'gallery-art-1',
    type: 'gallery',
    content: {
      title: 'Notre Galerie',
      subtitle: 'Découvrez nos collections par style',
      layout: 'masonry',
      showOverlay: true,
      showArtist: true,
      showTechnique: true,
      categories: [
        {
          name: 'Peinture',
          icon: '🖼️',
          description: 'Huiles, acryliques, aquarelles',
          productCount: 45
        },
        {
          name: 'Sculpture',
          icon: '🗿',
          description: 'Bronze, marbre, bois',
          productCount: 32
        },
        {
          name: 'Photographie',
          icon: '📸',
          description: 'Tirages limités',
          productCount: 28
        },
        {
          name: 'Art numérique',
          icon: '💻',
          description: 'Créations digitales',
          productCount: 24
        }
      ]
    },
    styles: {
      backgroundColor: '#4a4a4a',
      textColor: '#ffffff',
      padding: '80px 0',
    },
    order: 4
  },
  {
    id: 'testimonials-art-1',
    type: 'testimonials',
    content: {
      title: 'Avis des Collectionneurs',
      layout: 'grid',
      showImages: true,
      showArtist: true,
      testimonials: [
        {
          name: 'Marie Dubois',
          rating: 5,
          content: 'Une œuvre magnifique qui illumine mon salon !',
          image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1-female',
          artist: 'Claude Monet'
        },
        {
          name: 'Pierre Martin',
          rating: 5,
          content: 'Service impeccable et œuvres de qualité.',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
          artist: 'Vincent van Gogh'
        }
      ]
    },
    styles: {
      backgroundColor: '#f8f9fa',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 5
  },
  {
    id: 'contact-art-1',
    type: 'contact',
    content: {
      title: 'Commission d\'Œuvre',
      subtitle: 'Commandez une œuvre personnalisée',
      showForm: true,
      showInfo: true,
      showCommission: true,
      showExhibition: true,
      phone: '+33 1 23 45 67 89',
      email: 'contact@galerie-art.fr',
      address: '123 Rue de l\'Art, 75001 Paris'
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 6
  }
];

const artProductBlocks = [
  {
    id: 'hero-product-art',
    type: 'hero',
    content: {
      title: 'Notre Collection d\'Art',
      subtitle: 'Découvrez nos œuvres uniques',
      showBreadcrumb: true,
      showSearch: true,
      showStyleFilter: true,
      showArtistFilter: true
    },
    styles: {
      backgroundColor: '#4a4a4a',
      textColor: '#ffffff',
      padding: '60px 0',
    },
    order: 1
  },
  {
    id: 'products-listing-art',
    type: 'products',
    content: {
      title: 'Galerie Complète',
      layout: 'grid',
      productsToShow: 12,
      showPrice: true,
      showAddToCart: true,
      showFilters: true,
      showSorting: true,
      showArtist: true,
      showTechnique: true,
      showDimensions: true,
      categories: ['Peinture', 'Sculpture', 'Photographie', 'Art numérique', 'Dessin', 'Gravure']
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 2
  }
];

const artProductDetailBlocks = [
  {
    id: 'product-detail-main-art',
    type: 'product-detail',
    content: {
      title: 'Détail de l\'œuvre',
      showImageGallery: true,
      showProductInfo: true,
      showVariantSelector: true,
      showBreadcrumb: true,
      showArtist: true,
      showTechnique: true,
      showDimensions: true,
      showCertificate: true,
      showProvenance: true
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '0',
    },
    order: 1
  }
];

const artCategoryBlocks = [
  {
    id: 'category-main-art',
    type: 'category',
    content: {
      title: 'Catégories d\'Art',
      showFilters: true,
      showStyleFilter: true,
      showPriceFilter: true,
      showArtistFilter: true,
      showTechniqueFilter: true,
      layout: 'grid'
    },
    styles: {
      backgroundColor: '#4a4a4a',
      textColor: '#ffffff',
      padding: '40px 0',
    },
    order: 1
  }
];

const artContactBlocks = [
  {
    id: 'contact-main-art',
    type: 'contact',
    content: {
      title: 'Commission d\'Œuvre',
      subtitle: 'Commandez une œuvre personnalisée',
      showForm: true,
      showInfo: true,
      showCommission: true,
      showExhibition: true,
      showValuation: true,
      phone: '+33 1 23 45 67 89',
      email: 'contact@galerie-art.fr',
      address: '123 Rue de l\'Art, 75001 Paris'
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 1
  }
];

const artCartBlocks = [
  {
    id: 'cart-main-art',
    type: 'cart',
    content: {
      title: 'Mon Panier Art',
      subtitle: 'Vérifiez vos œuvres avant de passer commande',
      showRecommendations: true,
      showCertificate: true,
      showInsurance: true,
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

const artCheckoutBlocks = [
  {
    id: 'checkout-main-art',
    type: 'checkout',
    content: {
      title: 'Finaliser votre commande',
      subtitle: 'Dernière étape avant de recevoir votre œuvre',
      showOrderSummary: true,
      showCertificate: true,
      showInsurance: true,
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

export const artTemplates: Template[] = [
  {
    id: 'art-gallery',
    name: 'Art Gallery',
    category: 'art',
    description: 'Template artistique pour œuvres d\'art et créations',
    thumbnail: '/placeholder.svg',
    blocks: [...artHomeBlocks, artFooterBlock],
    styles: {
      primaryColor: '#4a4a4a',
      secondaryColor: '#ffffff',
      fontFamily: 'Crimson Text',
    },
    pages: {
      home: [...artHomeBlocks, artFooterBlock],
      product: [...artProductBlocks, artFooterBlock],
      'product-detail': [...artProductDetailBlocks, artFooterBlock],
      category: [...artCategoryBlocks, artFooterBlock],
      contact: [...artContactBlocks, artFooterBlock],
      cart: [...artCartBlocks, artFooterBlock],
      checkout: [...artCheckoutBlocks, artFooterBlock]
    }
  }
];
