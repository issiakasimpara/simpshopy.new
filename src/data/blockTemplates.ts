export const blockTemplates = [
  {
    type: 'announcement',
    name: 'Barre d\'annonces',
    description: 'Barre défilante pour promotions et annonces importantes',
    icon: '📢',
    content: {
      announcements: [
        { id: '1', text: '🔥 SOLDES D\'ÉTÉ : -40% sur tout le site !', icon: '🔥' },
        { id: '2', text: '📦 Livraison gratuite dès 50€ d\'achat', icon: '📦' },
        { id: '3', text: '⭐ Plus de 10 000 clients satisfaits', icon: '⭐' }
      ],
      backgroundColor: '#3B82F6',
      textColor: '#FFFFFF',
      speed: 30,
      isEnabled: true,
      isSticky: false
    },
    styles: {
      backgroundColor: '#3B82F6',
      textColor: '#FFFFFF',
      padding: '12px 0'
    }
  },
  {
    type: 'hero',
    name: 'Section Hero',
    description: 'Bannière d\'accueil avec titre, sous-titre et bouton',
    icon: '🏠',
    content: {
      title: 'Bienvenue sur notre site',
      subtitle: 'Découvrez nos produits exceptionnels',
      buttonText: 'Découvrir',
      buttonLink: '',
      backgroundImage: '',
      mediaType: 'image'
    },
    styles: {
      backgroundColor: '#3B82F6',
      textColor: '#FFFFFF',
      padding: '80px 0'
    }
  },
  {
    type: 'branding',
    name: 'Configuration de marque',
    description: 'Gérez le logo, favicon et identité de votre boutique',
    icon: '🏢',
    content: {
      logo: '',
      favicon: '',
      brandName: '',
      tagline: '',
      description: '',
      logoPosition: 'left'
    },
    styles: {
      backgroundColor: '#f8fafc',
      textColor: '#000000',
      padding: '40px 0'
    }
  },
  {
    type: 'products',
    name: 'Grille de produits',
    description: 'Affichage de vos produits en grille',
    icon: '🛍️',
    content: {
      title: 'Nos produits',
      productsToShow: 8,
      layout: 'grid',
      showPrice: true,
      showAddToCart: true
    },
    styles: {
      backgroundColor: '#FFFFFF',
      textColor: '#000000',
      padding: '60px 0'
    }
  },
  {
    type: 'text-image',
    name: 'Texte et Image',
    description: 'Section avec texte et image côte à côte',
    icon: '📝',
    content: {
      title: 'À propos de nous',
      text: 'Nous sommes une entreprise dédiée à fournir les meilleurs produits à nos clients.',
      buttonText: 'En savoir plus',
      buttonLink: '',
      imageUrl: '',
      layout: 'image-right'
    },
    styles: {
      backgroundColor: '#F8FAFC',
      textColor: '#1F2937',
      padding: '60px 0'
    }
  },
  {
    type: 'text-video',
    name: 'Texte et Vidéo',
    description: 'Section avec texte et vidéo côte à côte',
    icon: '🎬',
    content: {
      title: 'Découvrez notre histoire',
      text: 'Regardez cette vidéo pour mieux comprendre notre mission et nos valeurs.',
      buttonText: 'En savoir plus',
      buttonLink: '',
      videoUrl: '',
      layout: 'video-right',
      autoplay: false,
      controls: true
    },
    styles: {
      backgroundColor: '#F8FAFC',
      textColor: '#1F2937',
      padding: '60px 0'
    }
  },
  {
    type: 'gallery',
    name: 'Galerie d\'images',
    description: 'Galerie de photos avec effet hover',
    icon: '🖼️',
    content: {
      title: 'Notre galerie',
      images: [],
      columns: 3,
      showTitles: true
    },
    styles: {
      backgroundColor: '#FFFFFF',
      textColor: '#000000',
      padding: '60px 0'
    }
  },
  {
    type: 'features',
    name: 'Fonctionnalités',
    description: 'Mise en avant des caractéristiques',
    icon: '⭐',
    content: {
      title: 'Nos avantages',
      features: [
        { title: 'Livraison rapide', description: 'Livraison en 24h', icon: '🚚' },
        { title: 'Support 24/7', description: 'Assistance disponible', icon: '💬' },
        { title: 'Garantie qualité', description: 'Produits certifiés', icon: '✅' }
      ]
    },
    styles: {
      backgroundColor: '#F3F4F6',
      textColor: '#374151',
      padding: '60px 0'
    }
  },
  {
    type: 'testimonials',
    name: 'Témoignages',
    description: 'Avis et témoignages clients',
    icon: '💬',
    content: {
      title: 'Ce que disent nos clients',
      testimonials: [
        { name: 'Marie D.', content: 'Excellent service !', rating: 5 },
        { name: 'Pierre L.', content: 'Très satisfait de mon achat', rating: 5 }
      ]
    },
    styles: {
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      padding: '60px 0'
    }
  },
  {
    type: 'comparison',
    name: 'Nous vs Eux',
    description: 'Tableau de comparaison avec avantages concurrentiels',
    icon: '⚖️',
    content: {
      title: 'Pourquoi nous choisir ?',
      subtitle: 'Découvrez nos avantages par rapport à la concurrence',
      ourColumn: 'Nous',
      theirColumn: 'Autres',
      buttonText: 'Choisir notre solution',
      features: [
        { name: 'Effort minimal', us: true, them: false },
        { name: 'Adapté à tous types', us: true, them: false },
        { name: 'Design sécurisé', us: true, them: false },
        { name: 'Prix abordable', us: true, them: false },
        { name: 'Support premium', us: true, them: false }
      ]
    },
    styles: {
      backgroundColor: '#F9FAFB',
      textColor: '#111827',
      padding: '60px 0'
    }
  },

  {
    type: 'faq',
    name: 'FAQ',
    description: 'Questions fréquemment posées avec réponses repliables',
    icon: '❓',
    content: {
      title: 'Questions Fréquentes',
      subtitle: 'Trouvez rapidement les réponses à vos questions',
      faqs: [
        {
          question: 'Comment passer commande ?',
          answer: 'Vous pouvez passer commande directement sur notre site en ajoutant les produits à votre panier et en suivant le processus de commande.'
        },
        {
          question: 'Quels sont les délais de livraison ?',
          answer: 'Les délais de livraison varient entre 2 à 5 jours ouvrés selon votre localisation et le mode de livraison choisi.'
        },
        {
          question: 'Puis-je retourner un produit ?',
          answer: 'Oui, vous disposez de 14 jours pour retourner un produit non conforme ou ne vous convenant pas.'
        },
        {
          question: 'Comment contacter le service client ?',
          answer: 'Vous pouvez nous contacter par email, téléphone ou via le formulaire de contact disponible sur notre site.'
        }
      ]
    },
    styles: {
      backgroundColor: '#FFFFFF',
      textColor: '#374151',
      padding: '60px 0'
    }
  },
  {
    type: 'newsletter',
    name: 'Newsletter',
    description: 'Inscription à la newsletter',
    icon: '📧',
    content: {
      title: 'Restez informé',
      subtitle: 'Inscrivez-vous à notre newsletter pour recevoir nos dernières offres',
      buttonText: 'S\'inscrire',
      placeholder: 'Votre email'
    },
    styles: {
      backgroundColor: '#1F2937',
      textColor: '#FFFFFF',
      padding: '40px 0'
    }
  },
  {
    type: 'contact',
    name: 'Contact',
    description: 'Formulaire et informations de contact',
    icon: '📞',
    content: {
      title: 'Contactez-nous',
      address: '123 Rue Example, 75001 Paris',
      phone: '+33 1 23 45 67 89',
      email: 'contact@example.com',
      showForm: true,
      showMap: false,
      showInfo: true
    },
    styles: {
      backgroundColor: '#FFFFFF',
      textColor: '#374151',
      padding: '60px 0'
    }
  },
  {
    type: 'video',
    name: 'Vidéo',
    description: 'Lecteur vidéo intégré',
    icon: '🎥',
    content: {
      title: 'Regardez notre vidéo',
      videoUrl: '',
      autoplay: false,
      controls: true
    },
    styles: {
      backgroundColor: '#000000',
      textColor: '#FFFFFF',
      padding: '40px 0'
    }
  },
  {
    type: 'footer',
    name: 'Pied de page',
    description: 'Pied de page complet avec newsletter, liens légaux et informations',
    icon: '🦶',
    content: {
      companyName: 'Mon Entreprise',
      description: 'Description de votre entreprise et de vos valeurs.',
      showNewsletter: true,
      newsletterTitle: 'Restez informé',
      newsletterDescription: 'Inscrivez-vous à notre newsletter pour recevoir nos dernières offres',
      showSocialMedia: true,
      socialLinks: [
        { platform: 'facebook', url: '#', label: 'Facebook' },
        { platform: 'instagram', url: '#', label: 'Instagram' },
        { platform: 'twitter', url: '#', label: 'Twitter' }
      ],
      legalLinks: [
        { title: 'Conditions générales de vente', url: '/cgv' },
        { title: 'Conditions générales d\'utilisation', url: '/cgu' },
        { title: 'Politique de confidentialité', url: '/confidentialite' },
        { title: 'Mentions légales', url: '/mentions-legales' }
      ],
      quickLinks: [
        { title: 'À propos', url: '/about' },
        { title: 'Contact', url: '/contact' },
        { title: 'FAQ', url: '/faq' },
        { title: 'Support', url: '/support' }
      ],
      contactInfo: {
        address: '123 Rue Example, 75001 Paris',
        phone: '+33 1 23 45 67 89',
        email: 'contact@example.com'
      },
      showCopyright: true,
      copyrightText: '© 2024 Mon Entreprise. Tous droits réservés.'
    },
    styles: {
      backgroundColor: '#1F2937',
      textColor: '#F9FAFB',
      padding: '60px 0 20px 0'
    }
  },
  {
    type: 'before-after',
    name: 'Avant-Après',
    description: 'Comparaison d\'images avant/après avec curseur glissant',
    icon: '⚖️',
    content: {
      title: 'Transformation incroyable',
      subtitle: 'Découvrez le résultat de notre service',
      beforeImage: '',
      afterImage: '',
      beforeLabel: 'Avant',
      afterLabel: 'Après',
      showLabels: true
    },
    styles: {
      backgroundColor: '#FFFFFF',
      textColor: '#374151',
      padding: '60px 0'
    }
  },
  {
    type: 'guarantees',
    name: 'Garanties',
    description: 'Affichez vos garanties et politiques de retour',
    icon: '🛡️',
    content: {
      title: 'Nos Garanties',
      subtitle: 'Votre satisfaction est notre priorité',
      guarantees: [
        {
          title: 'Livraison gratuite',
          description: 'Dès 50€ d\'achat',
          icon: '🚚'
        },
        {
          title: 'Retour gratuit',
          description: 'Sous 30 jours',
          icon: '↩️'
        },
        {
          title: 'Support 24/7',
          description: 'Assistance clientèle',
          icon: '💬'
        }
      ]
    },
    styles: {
      backgroundColor: '#f8fafc',
      textColor: '#000000',
      padding: '60px 0'
    }
  },

];
