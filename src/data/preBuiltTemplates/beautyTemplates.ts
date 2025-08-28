
import { Template } from '@/types/template';
import { createFooterBlock } from './shared/commonFooterBlocks';

const beautyFooterBlock = createFooterBlock('beauty');

// Blocs spécialisés pour la beauté
const beautyHomeBlocks = [
  {
    id: 'hero-beauty-1',
    type: 'hero',
    content: {
      title: 'Votre Beauté Naturelle',
      subtitle: 'Cosmétiques bio et produits de soin personnalisés',
      buttonText: 'Découvrir nos produits',
      buttonLink: '/products',
      mediaType: 'image',
      backgroundImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03'
    },
    styles: {
      backgroundColor: '#fdf2f8',
      textColor: '#831843',
      padding: '120px 0',
    },
    order: 1
  },
  {
    id: 'features-beauty-1',
    type: 'features',
    content: {
      title: 'Pourquoi nous choisir',
      subtitle: 'Votre partenaire beauté de confiance',
      features: [
        {
          title: '100% Bio',
          description: 'Ingrédients naturels et certifiés bio',
          icon: '🌿'
        },
        {
          title: 'Testé dermatologiquement',
          description: 'Sans paraben, sans sulfate',
          icon: '✅'
        },
        {
          title: 'Livraison gratuite',
          description: 'Dès 25000 CFA d\'achat',
          icon: '🚚'
        }
      ]
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 2
  },
  {
    id: 'products-beauty-1',
    type: 'products',
    content: {
      title: 'Nos Produits Vedettes',
      subtitle: 'Découvrez notre sélection coup de cœur',
      layout: 'grid',
      productsToShow: 8,
      showPrice: true,
      showAddToCart: true,
      showSkinType: true,
      showIngredients: true,
      viewAllLink: '/products'
    },
    styles: {
      backgroundColor: '#fdf2f8',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 3
  },

  {
    id: 'testimonials-beauty-1',
    type: 'testimonials',
    content: {
      title: 'Avis de nos clientes',
      layout: 'carousel',
      showImages: true,
      showSkinType: true,
      testimonials: [
        {
          name: 'Marie Dubois',
          rating: 5,
          content: 'Ma peau n\'a jamais été aussi belle !',
          image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1-female',
          skinType: 'Peau mixte'
        },
        {
          name: 'Sophie Laurent',
          rating: 5,
          content: 'Produits efficaces et naturels, je recommande !',
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
          skinType: 'Peau sèche'
        }
      ]
    },
    styles: {
      backgroundColor: '#fdf2f8',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 5
  },
  {
    id: 'contact-beauty-1',
    type: 'contact',
    content: {
      title: 'Conseils Personnalisés',
      subtitle: 'Notre équipe d\'experts est là pour vous conseiller',
      showForm: true,
      showInfo: true,
      showConsultation: true,
      phone: '+33 1 23 45 67 89',
      email: 'conseils@beaute-naturelle.fr',
      address: '123 Rue de la Beauté, 75001 Paris'
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 6
  }
];

const beautyProductBlocks = [
  {
    id: 'hero-product-beauty',
    type: 'hero',
    content: {
      title: 'Nos Produits de Beauté',
      subtitle: 'Découvrez notre gamme complète de cosmétiques',
      showBreadcrumb: true,
      showSearch: true,
      showSkinTypeFilter: true
    },
    styles: {
      backgroundColor: '#fdf2f8',
      textColor: '#000000',
      padding: '60px 0',
    },
    order: 1
  },
  {
    id: 'products-listing-beauty',
    type: 'products',
    content: {
      title: 'Collection Complète',
      layout: 'grid',
      productsToShow: 12,
      showPrice: true,
      showAddToCart: true,
      showFilters: true,
      showSorting: true,
      showSkinType: true,
      showIngredients: true,
      categories: ['Soins visage', 'Soins corps', 'Maquillage', 'Parfums', 'Accessoires']
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 2
  }
];

const beautyProductDetailBlocks = [
  {
    id: 'product-detail-main-beauty',
    type: 'product-detail',
    content: {
      title: 'Détail du produit',
      showImageGallery: true,
      showProductInfo: true,
      showVariantSelector: true,
      showBreadcrumb: true,
      showSkinType: true,
      showIngredients: true,
      showUsageInstructions: true,
      showSafetyInfo: true
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '0',
    },
    order: 1
  }
];

const beautyCategoryBlocks = [
  {
    id: 'category-main-beauty',
    type: 'category',
    content: {
      title: 'Catégories de Produits',
      showFilters: true,
      showSkinTypeFilter: true,
      showPriceFilter: true,
      showBrandFilter: true,
      layout: 'grid'
    },
    styles: {
      backgroundColor: '#fdf2f8',
      textColor: '#000000',
      padding: '40px 0',
    },
    order: 1
  }
];

const beautyContactBlocks = [
  {
    id: 'contact-main-beauty',
    type: 'contact',
    content: {
      title: 'Conseils Personnalisés',
      subtitle: 'Notre équipe d\'experts est là pour vous conseiller',
      showForm: true,
      showInfo: true,
      showConsultation: true,
      showSkinAnalysis: true,
      phone: '+33 1 23 45 67 89',
      email: 'conseils@beaute-naturelle.fr',
      address: '123 Rue de la Beauté, 75001 Paris'
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 1
  }
];

const beautyCartBlocks = [
  {
    id: 'cart-main-beauty',
    type: 'cart',
    content: {
      title: 'Mon Panier Beauté',
      subtitle: 'Vérifiez vos articles avant de passer commande',
      showRecommendations: true,
      showSkinTypeRecommendations: true,
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

const beautyCheckoutBlocks = [
  {
    id: 'checkout-main-beauty',
    type: 'checkout',
    content: {
      title: 'Finaliser votre commande',
      subtitle: 'Dernière étape avant de recevoir vos produits de beauté',
      showOrderSummary: true,
      showSkinTypeRecommendations: true,
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

export const beautyTemplates: Template[] = [
  {
    id: 'beauty-elegant',
    name: 'Beauté Élégante',
    category: 'beauty',
    description: 'Template raffiné pour cosmétiques avec couleurs douces et design féminin',
    thumbnail: '/placeholder.svg',
    blocks: [...beautyHomeBlocks, beautyFooterBlock],
    styles: {
      primaryColor: '#ec4899',
      secondaryColor: '#9ca3af',
      fontFamily: 'Playfair Display'
    },
    pages: {
      home: [...beautyHomeBlocks, beautyFooterBlock],
      product: [...beautyProductBlocks, beautyFooterBlock],
      'product-detail': [...beautyProductDetailBlocks, beautyFooterBlock],
      category: [...beautyCategoryBlocks, beautyFooterBlock],
      contact: [...beautyContactBlocks, beautyFooterBlock],
      cart: [...beautyCartBlocks, beautyFooterBlock],
      checkout: [...beautyCheckoutBlocks, beautyFooterBlock]
    }
  },
  {
    id: 'beauty-natural',
    name: 'Beauté Naturelle',
    category: 'beauty',
    description: 'Design organique pour produits naturels avec tons verts et earthy',
    thumbnail: '/placeholder.svg',
    blocks: [...beautyHomeBlocks, beautyFooterBlock],
    styles: {
      primaryColor: '#059669',
      secondaryColor: '#6b7280',
      fontFamily: 'Inter'
    },
    pages: {
      home: [...beautyHomeBlocks, beautyFooterBlock],
      product: [...beautyProductBlocks, beautyFooterBlock],
      'product-detail': [...beautyProductDetailBlocks, beautyFooterBlock],
      category: [...beautyCategoryBlocks, beautyFooterBlock],
      contact: [...beautyContactBlocks, beautyFooterBlock],
      cart: [...beautyCartBlocks, beautyFooterBlock],
      checkout: [...beautyCheckoutBlocks, beautyFooterBlock]
    }
  }
];
