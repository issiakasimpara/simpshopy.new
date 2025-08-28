
import { TemplateBlock } from '@/types/template';

export const fashionHomeBlocks: TemplateBlock[] = [
  {
    id: 'hero-fashion-1',
    type: 'hero',
    content: {
      title: 'Collection Automne 2024',
      subtitle: 'Découvrez nos dernières tendances mode',
      buttonText: 'Voir la collection',
      buttonLink: '/products',
      mediaType: 'image',
      backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8'
    },
    styles: {
      backgroundColor: '#000000',
      textColor: '#ffffff',
      padding: '120px 0',
    },
    order: 1
  },
  {
    id: 'features-fashion-1',
    type: 'features',
    content: {
      title: 'Pourquoi nous choisir',
      subtitle: 'Une expérience mode unique',
      features: [
        {
          title: 'Livraison gratuite',
          description: 'Livraison offerte dès 50000 CFA d\'achat',
          icon: '🚚'
        },
        {
          title: 'Retours faciles',
          description: '30 jours pour changer d\'avis',
          icon: '↩️'
        },
        {
          title: 'Qualité premium',
          description: 'Matériaux sélectionnés avec soin',
          icon: '⭐'
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
    id: 'products-fashion-1',
    type: 'products',
    content: {
      title: 'Produits Vedettes',
      subtitle: 'Découvrez notre sélection coup de cœur',
      layout: 'grid',
      productsToShow: 8,
      showPrice: true,
      showAddToCart: true,
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
    id: 'testimonials-fashion-1',
    type: 'testimonials',
    content: {
      title: 'Ce que disent nos clients',
      layout: 'carousel',
      testimonials: [
        {
          name: 'Marie Dubois',
          rating: 5,
          content: 'Excellente qualité et livraison rapide !',
          image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1-female'
        },
        {
          name: 'Sophie Laurent',
          rating: 5,
          content: 'Des pièces uniques, je recommande vivement.',
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
        }
      ]
    },
    styles: {
      backgroundColor: '#f8f9fa',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 4
  },
  {
    id: 'contact-fashion-1',
    type: 'contact',
    content: {
      title: 'Contactez-nous',
      subtitle: 'Une question ? Notre équipe est là pour vous aider',
      showForm: true,
      showInfo: true,
      phone: '+33 1 23 45 67 89',
      email: 'contact@fashion-moderne.fr',
      address: '123 Rue de la Mode, 75001 Paris'
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 5
  },
  {
    id: 'footer-fashion-1',
    type: 'footer',
    content: {
      companyName: 'Fashion Moderne',
      description: 'Votre boutique de mode en ligne',
      links: [
        { text: 'À propos', url: '/about' },
        { text: 'Contact', url: '/contact' },
        { text: 'Mon panier', url: '/cart' },
        { text: 'CGV', url: '/terms' }
      ],
      socialLinks: [
        { platform: 'instagram', url: '#' },
        { platform: 'facebook', url: '#' }
      ]
    },
    styles: {
      backgroundColor: '#000000',
      textColor: '#ffffff',
      padding: '60px 0',
    },
    order: 6
  }
];
