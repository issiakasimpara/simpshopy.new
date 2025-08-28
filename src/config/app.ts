/**
 * Configuration globale de l'application Simpshopy
 */

export const APP_CONFIG = {
  // Informations de base
  name: 'Simpshopy',
  tagline: 'Votre boutique en ligne simple et efficace',
  description: 'La plateforme e-commerce internationale qui vous aide à vendre en ligne facilement.',
  
  // URLs et domaines
  domain: 'simpshopy.com',
  website: 'https://simpshopy.com',
  supportEmail: 'support@simpshopy.com',
  salesEmail: 'ventes@simpshopy.com',
  
  // Réseaux sociaux
  social: {
    facebook: 'https://facebook.com/simpshopy',
    twitter: 'https://twitter.com/simpshopy',
    instagram: 'https://instagram.com/simpshopy',
    linkedin: 'https://linkedin.com/company/simpshopy',
    youtube: 'https://youtube.com/@simpshopy'
  },
  
  // Configuration régionale
  region: {
    primary: 'International',
    countries: ['US', 'CA', 'GB', 'FR', 'DE', 'ES', 'IT', 'AU', 'JP', 'BR', 'IN', 'MX'],
    defaultCurrency: 'USD',
    defaultLocale: 'en-US',
    timezone: 'UTC'
  },
  
  // Tarification (en dollars USD)
  pricing: {
    starter: {
      name: 'Starter',
      price: 29,
      currency: 'USD',
      period: 'mois',
      description: 'Parfait pour débuter',
      features: [
        '100 produits inclus',
        'Boutique responsive',
        'Support email',
        'SSL & sécurité',
        'Templates premium',
        'Paiements en devises locales'
      ]
    },
    business: {
      name: 'Business',
      price: 79,
      currency: 'USD',
      period: 'mois',
      description: 'Pour la croissance',
      features: [
        'Produits illimités',
        'Analytics avancées',
        'Support prioritaire',
        'API personnalisée',
        'Multi-devises',
        'Abandon cart recovery',
        'Intégration paiements locaux'
      ],
      popular: true
    },
    enterprise: {
      name: 'Enterprise',
      price: 199,
      currency: 'USD',
      period: 'mois',
      description: 'Performance maximale',
      features: [
        'Tout Business +',
        'Manager dédié',
        'Infrastructure dédiée',
        'SLA 99.99%',
        'Formation équipe',
        'White-label complet',
        'Intégration bancaire complète'
      ]
    }
  },
  
  // Moyens de paiement supportés
  paymentMethods: {
    international: [
      {
        name: 'Cartes Visa/Mastercard',
        countries: ['ALL'],
        icon: '💳'
      },
      {
        name: 'PayPal',
        countries: ['200+'],
        icon: '🔵'
      },
      {
        name: 'Stripe',
        countries: ['ALL'],
        icon: '🟣'
      }
    ],
    local: [
      {
        name: 'Paiements locaux',
        countries: ['ALL'],
        icon: '🏦'
      },
      {
        name: 'Virements bancaires',
        countries: ['ALL'],
        icon: '🏦'
      },
      {
        name: 'Paiement à la livraison',
        countries: ['URBAN'],
        icon: '💵'
      }
    ]
  },
  
  // Fonctionnalités
  features: {
    core: [
      {
        title: 'Boutique en ligne simple',
        description: 'Créez votre boutique en quelques clics avec des templates professionnels',
        icon: 'store'
      },
      {
        title: 'Gestion produits intuitive',
        description: 'Ajoutez vos produits facilement, gérez vos stocks et organisez vos catégories',
        icon: 'shopping-cart'
      },
      {
        title: 'Suivi des ventes',
        description: 'Tableaux de bord clairs pour suivre vos commandes, revenus et clients',
        icon: 'bar-chart'
      },
      {
        title: 'Paiements internationaux',
        description: 'Cartes bancaires, PayPal, Stripe et paiements en devises locales',
        icon: 'credit-card'
      },
      {
        title: 'Multi-pays international',
        description: 'Vendez dans le monde entier avec support multi-devises',
        icon: 'globe'
      },
      {
        title: 'Rapide et fiable',
        description: 'Sites optimisés pour tous les types de connexions',
        icon: 'zap'
      }
    ]
  },
  
  // Statistiques (pour la page d'accueil)
  stats: {
    stores: '100+',
    revenue: '$2M+ USD',
    customers: '5K+',
    countries: '50+'
  },
  
  // Configuration technique
  technical: {
    apiVersion: 'v1',
    maxFileSize: '10MB',
    supportedImageFormats: ['jpg', 'jpeg', 'png', 'webp'],
    maxProductsPerStore: {
      starter: 100,
      business: -1, // illimité
      enterprise: -1
    }
  },
  
  // Support et contact
  support: {
    phone: '+1 XXX XXX XXXX',
    whatsapp: '+1 XXX XXX XXXX',
    hours: '24/7 Global Support',
    languages: ['français', 'english', 'español'],
    responseTime: '< 2h'
  }
};

export default APP_CONFIG;
