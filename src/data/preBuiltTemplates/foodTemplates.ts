
import { Template } from '@/types/template';
import { createFooterBlock } from './shared/commonFooterBlocks';

const foodFooterBlock = createFooterBlock('food');

// Blocs spécialisés pour l'alimentation
const foodHomeBlocks = [
  {
    id: 'hero-food-1',
    type: 'hero',
    content: {
      title: 'Saveurs Authentiques',
      subtitle: 'Cuisine traditionnelle et produits du terroir',
      buttonText: 'Commander maintenant',
      buttonLink: '/products',
      mediaType: 'image',
      backgroundImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'
    },
    styles: {
      backgroundColor: '#d2691e',
      textColor: '#ffffff',
      padding: '120px 0',
    },
    order: 1
  },
  {
    id: 'features-food-1',
    type: 'features',
    content: {
      title: 'Pourquoi nous choisir',
      subtitle: 'Votre partenaire gastronomique',
      features: [
        {
          title: 'Ingrédients frais',
          description: 'Produits locaux et de saison',
          icon: '🥬'
        },
        {
          title: 'Livraison rapide',
          description: 'Livraison en 30 minutes',
          icon: '⚡'
        },
        {
          title: 'Cuisine traditionnelle',
          description: 'Recettes authentiques',
          icon: '👨‍🍳'
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
    id: 'products-food-1',
    type: 'products',
    content: {
      title: 'Notre Menu',
      subtitle: 'Découvrez nos plats signature',
      layout: 'grid',
      productsToShow: 8,
      showPrice: true,
      showAddToCart: true,
      showNutrition: true,
      showIngredients: true,
      showAllergens: true,
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
    id: 'testimonials-food-1',
    type: 'testimonials',
    content: {
      title: 'Avis de nos clients',
      layout: 'carousel',
      showImages: true,
      showRating: true,
      testimonials: [
        {
          name: 'Pierre Dubois',
          rating: 5,
          content: 'Excellente cuisine, je recommande vivement !',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
        },
        {
          name: 'Marie Laurent',
          rating: 5,
          content: 'Service impeccable et plats délicieux.',
          image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1-female'
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
    id: 'contact-food-1',
    type: 'contact',
    content: {
      title: 'Réservations',
      subtitle: 'Réservez votre table ou commandez en ligne',
      showForm: true,
      showInfo: true,
      showReservation: true,
      showDelivery: true,
      phone: '+33 1 23 45 67 89',
      email: 'contact@restaurant-gourmet.fr',
      address: '123 Rue de la Gastronomie, 75001 Paris'
    },
    styles: {
      backgroundColor: '#fef3c7',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 6
  }
];

const foodProductBlocks = [
  {
    id: 'hero-product-food',
    type: 'hero',
    content: {
      title: 'Notre Carte',
      subtitle: 'Découvrez nos plats et spécialités',
      showBreadcrumb: true,
      showSearch: true,
      showCategoryFilter: true,
      showDietaryFilter: true
    },
    styles: {
      backgroundColor: '#d2691e',
      textColor: '#ffffff',
      padding: '60px 0',
    },
    order: 1
  },
  {
    id: 'products-listing-food',
    type: 'products',
    content: {
      title: 'Menu Complet',
      layout: 'grid',
      productsToShow: 12,
      showPrice: true,
      showAddToCart: true,
      showFilters: true,
      showSorting: true,
      showNutrition: true,
      showIngredients: true,
      showAllergens: true,
      categories: ['Entrées', 'Plats', 'Desserts', 'Boissons', 'Vins', 'Cocktails']
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 2
  }
];

const foodProductDetailBlocks = [
  {
    id: 'product-detail-main-food',
    type: 'product-detail',
    content: {
      title: 'Détail du plat',
      showImageGallery: true,
      showProductInfo: true,
      showVariantSelector: true,
      showBreadcrumb: true,
      showNutrition: true,
      showIngredients: true,
      showAllergens: true,
      showCookingTime: true,
      showChefRecommendation: true
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '0',
    },
    order: 1
  }
];

const foodCategoryBlocks = [
  {
    id: 'category-main-food',
    type: 'category',
    content: {
      title: 'Catégories de Plats',
      showFilters: true,
      showCategoryFilter: true,
      showPriceFilter: true,
      showDietaryFilter: true,
      showAllergenFilter: true,
      layout: 'grid'
    },
    styles: {
      backgroundColor: '#d2691e',
      textColor: '#ffffff',
      padding: '40px 0',
    },
    order: 1
  }
];

const foodContactBlocks = [
  {
    id: 'contact-main-food',
    type: 'contact',
    content: {
      title: 'Réservations & Commandes',
      subtitle: 'Réservez votre table ou commandez en ligne',
      showForm: true,
      showInfo: true,
      showReservation: true,
      showDelivery: true,
      showTakeaway: true,
      phone: '+33 1 23 45 67 89',
      email: 'contact@restaurant-gourmet.fr',
      address: '123 Rue de la Gastronomie, 75001 Paris'
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 1
  }
];

const foodCartBlocks = [
  {
    id: 'cart-main-food',
    type: 'cart',
    content: {
      title: 'Mon Panier Gourmet',
      subtitle: 'Vérifiez votre commande avant de finaliser',
      showRecommendations: true,
      showDeliveryOptions: true,
      showSpecialInstructions: true,
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

const foodCheckoutBlocks = [
  {
    id: 'checkout-main-food',
    type: 'checkout',
    content: {
      title: 'Finaliser votre commande',
      subtitle: 'Dernière étape avant de recevoir vos plats',
      showOrderSummary: true,
      showDeliveryOptions: true,
      showSpecialInstructions: true,
      paymentMethods: ['card', 'paypal'],
      deliveryOptions: [
        { name: 'Livraison', price: 4.99, delay: '30-45 min' },
        { name: 'À emporter', price: 0, delay: '15-20 min' }
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

export const foodTemplates: Template[] = [
  {
    id: 'food-gourmet',
    name: 'Gourmet Kitchen',
    category: 'food',
    description: 'Template savoureux pour restaurant et épicerie fine',
    thumbnail: '/placeholder.svg',
    blocks: [...foodHomeBlocks, foodFooterBlock],
    styles: {
      primaryColor: '#d2691e',
      secondaryColor: '#ffffff',
      fontFamily: 'Merriweather',
    },
    pages: {
      home: [...foodHomeBlocks, foodFooterBlock],
      product: [...foodProductBlocks, foodFooterBlock],
      'product-detail': [...foodProductDetailBlocks, foodFooterBlock],
      category: [...foodCategoryBlocks, foodFooterBlock],
      contact: [...foodContactBlocks, foodFooterBlock],
      cart: [...foodCartBlocks, foodFooterBlock],
      checkout: [...foodCheckoutBlocks, foodFooterBlock]
    }
  }
];
