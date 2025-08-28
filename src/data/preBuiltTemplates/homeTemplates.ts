
import { Template } from '@/types/template';
import { createFooterBlock } from './shared/commonFooterBlocks';

const homeFooterBlock = createFooterBlock('home');

// Blocs spécialisés pour la maison
const homeHomeBlocks = [
  {
    id: 'hero-home-1',
    type: 'hero',
    content: {
      title: 'Votre Maison Idéale',
      subtitle: 'Mobilier et décoration pour un intérieur unique',
      buttonText: 'Découvrir',
      buttonLink: '/products',
      mediaType: 'image',
      backgroundImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7'
    },
    styles: {
      backgroundColor: '#8b4513',
      textColor: '#ffffff',
      padding: '120px 0',
    },
    order: 1
  },
  {
    id: 'features-home-1',
    type: 'features',
    content: {
      title: 'Pourquoi nous choisir',
      subtitle: 'Votre partenaire décoration',
      features: [
        {
          title: 'Qualité premium',
          description: 'Matériaux nobles et durables',
          icon: '⭐'
        },
        {
          title: 'Design sur mesure',
          description: 'Personnalisation selon vos goûts',
          icon: '🎨'
        },
        {
          title: 'Livraison gratuite',
          description: 'Dès 75000 CFA d\'achat',
          icon: '🚚'
        }
      ]
    },
    styles: {
      backgroundColor: '#fef3c7',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 2
  },
  {
    id: 'products-home-1',
    type: 'products',
    content: {
      title: 'Notre Collection',
      subtitle: 'Découvrez nos pièces signature',
      layout: 'grid',
      productsToShow: 8,
      showPrice: true,
      showAddToCart: true,
      showMaterials: true,
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
    id: 'testimonials-home-1',
    type: 'testimonials',
    content: {
      title: 'Avis de nos clients',
      layout: 'carousel',
      showImages: true,
      showRoomType: true,
      testimonials: [
        {
          name: 'Sophie Martin',
          rating: 5,
          content: 'Mon salon est magnifique grâce à vos conseils !',
          image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1-female',
          roomType: 'Salon'
        },
        {
          name: 'Pierre Dubois',
          rating: 5,
          content: 'Qualité exceptionnelle et service impeccable.',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
          roomType: 'Chambre'
        }
      ]
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 5
  },
  {
    id: 'contact-home-1',
    type: 'contact',
    content: {
      title: 'Conseils Déco',
      subtitle: 'Notre équipe d\'experts est là pour vous conseiller',
      showForm: true,
      showInfo: true,
      showConsultation: true,
      showInstallation: true,
      phone: '+33 1 23 45 67 89',
      email: 'conseils@maison-deco.fr',
      address: '123 Rue de la Décoration, 75001 Paris'
    },
    styles: {
      backgroundColor: '#fef3c7',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 6
  }
];

const homeProductBlocks = [
  {
    id: 'hero-product-home',
    type: 'hero',
    content: {
      title: 'Notre Mobilier',
      subtitle: 'Découvrez notre gamme complète de décoration',
      showBreadcrumb: true,
      showSearch: true,
      showRoomFilter: true,
      showStyleFilter: true
    },
    styles: {
      backgroundColor: '#8b4513',
      textColor: '#ffffff',
      padding: '60px 0',
    },
    order: 1
  },
  {
    id: 'products-listing-home',
    type: 'products',
    content: {
      title: 'Collection Complète',
      layout: 'grid',
      productsToShow: 12,
      showPrice: true,
      showAddToCart: true,
      showFilters: true,
      showSorting: true,
      showMaterials: true,
      showDimensions: true,
      categories: ['Salon', 'Chambre', 'Cuisine', 'Salle de bain', 'Bureau', 'Extérieur']
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 2
  }
];

const homeProductDetailBlocks = [
  {
    id: 'product-detail-main-home',
    type: 'product-detail',
    content: {
      title: 'Détail du produit',
      showImageGallery: true,
      showProductInfo: true,
      showVariantSelector: true,
      showBreadcrumb: true,
      showMaterials: true,
      showDimensions: true,
      showCare: true,
      showAssembly: true
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '0',
    },
    order: 1
  }
];

const homeCategoryBlocks = [
  {
    id: 'category-main-home',
    type: 'category',
    content: {
      title: 'Catégories de Produits',
      showFilters: true,
      showRoomFilter: true,
      showPriceFilter: true,
      showStyleFilter: true,
      showMaterialFilter: true,
      layout: 'grid'
    },
    styles: {
      backgroundColor: '#8b4513',
      textColor: '#ffffff',
      padding: '40px 0',
    },
    order: 1
  }
];

const homeContactBlocks = [
  {
    id: 'contact-main-home',
    type: 'contact',
    content: {
      title: 'Conseils Déco',
      subtitle: 'Notre équipe d\'experts est là pour vous conseiller',
      showForm: true,
      showInfo: true,
      showConsultation: true,
      showInstallation: true,
      showDelivery: true,
      phone: '+33 1 23 45 67 89',
      email: 'conseils@maison-deco.fr',
      address: '123 Rue de la Décoration, 75001 Paris'
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 1
  }
];

const homeCartBlocks = [
  {
    id: 'cart-main-home',
    type: 'cart',
    content: {
      title: 'Mon Panier Déco',
      subtitle: 'Vérifiez vos articles avant de passer commande',
      showRecommendations: true,
      showInstallationOptions: true,
      showDeliveryOptions: true,
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

const homeCheckoutBlocks = [
  {
    id: 'checkout-main-home',
    type: 'checkout',
    content: {
      title: 'Finaliser votre commande',
      subtitle: 'Dernière étape avant de recevoir vos meubles',
      showOrderSummary: true,
      showInstallationOptions: true,
      showDeliveryOptions: true,
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

export const homeTemplates: Template[] = [
  {
    id: 'home-cozy',
    name: 'Cozy Home',
    category: 'home',
    description: 'Template chaleureux pour décoration et mobilier',
    thumbnail: '/placeholder.svg',
    blocks: [...homeHomeBlocks, homeFooterBlock],
    styles: {
      primaryColor: '#8b4513',
      secondaryColor: '#ffffff',
      fontFamily: 'Georgia',
    },
    pages: {
      home: [...homeHomeBlocks, homeFooterBlock],
      product: [...homeProductBlocks, homeFooterBlock],
      'product-detail': [...homeProductDetailBlocks, homeFooterBlock],
      category: [...homeCategoryBlocks, homeFooterBlock],
      contact: [...homeContactBlocks, homeFooterBlock],
      cart: [...homeCartBlocks, homeFooterBlock],
      checkout: [...homeCheckoutBlocks, homeFooterBlock]
    }
  }
];
