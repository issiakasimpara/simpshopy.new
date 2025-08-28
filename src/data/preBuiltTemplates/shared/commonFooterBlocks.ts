
import { TemplateBlock } from '@/types/template';

export const createFooterBlock = (category: string): TemplateBlock => {
  const footerConfigs = {
    fashion: {
      companyName: 'Fashion Moderne',
      description: 'Votre destination mode pour un style contemporain et élégant. Découvrez nos collections exclusives.',
      quickLinks: [
        { text: 'Nouveautés', url: '/nouveautes' },
        { text: 'Femme', url: '/femme' },
        { text: 'Homme', url: '/homme' },
        { text: 'Accessoires', url: '/accessoires' },
        { text: 'Soldes', url: '/soldes' }
      ],
      legalLinks: [
        { text: 'Conditions Générales', url: '/cgv' },
        { text: 'Politique de Retour', url: '/retours' },
        { text: 'Guide des Tailles', url: '/tailles' },
        { text: 'Livraison', url: '/livraison' }
      ],
      contactInfo: {
        address: '123 Rue de la Mode\n75001 Paris, France',
        phone: '+33 1 42 86 85 85',
        email: 'contact@fashion-moderne.fr'
      },
      backgroundColor: '#1f2937',
      textColor: '#ffffff'
    },
    electronics: {
      companyName: 'Tech Store',
      description: 'Votre expert en technologie et électronique. Innovation, qualité et service depuis plus de 15 ans.',
      quickLinks: [
        { text: 'Smartphones', url: '/smartphones' },
        { text: 'Ordinateurs', url: '/ordinateurs' },
        { text: 'Gaming', url: '/gaming' },
        { text: 'Audio', url: '/audio' },
        { text: 'Support', url: '/support' }
      ],
      legalLinks: [
        { text: 'Garanties', url: '/garanties' },
        { text: 'Service Après-Vente', url: '/sav' },
        { text: 'Réparations', url: '/reparations' },
        { text: 'Trade-in', url: '/reprise' }
      ],
      contactInfo: {
        address: '456 Avenue Technologique\n69000 Lyon, France',
        phone: '+33 4 78 92 45 67',
        email: 'support@techstore.fr'
      },
      backgroundColor: '#1e293b',
      textColor: '#ffffff'
    },
    beauty: {
      companyName: 'Beauty Elegant',
      description: 'Cosmétiques haut de gamme et soins de beauté pour révéler votre éclat naturel.',
      quickLinks: [
        { text: 'Soins Visage', url: '/soins-visage' },
        { text: 'Maquillage', url: '/maquillage' },
        { text: 'Parfums', url: '/parfums' },
        { text: 'Conseils', url: '/conseils' },
        { text: 'Rendez-vous', url: '/rdv' }
      ],
      legalLinks: [
        { text: 'Test Patch', url: '/test-patch' },
        { text: 'Ingrédients', url: '/ingredients' },
        { text: 'Allergènes', url: '/allergenes' },
        { text: 'Consultation', url: '/consultation' }
      ],
      contactInfo: {
        address: '789 Boulevard Beauté\n06000 Nice, France',
        phone: '+33 4 93 87 65 43',
        email: 'conseil@beauty-elegant.fr'
      },
      backgroundColor: '#be185d',
      textColor: '#ffffff'
    },
    food: {
      companyName: 'Gourmet Kitchen',
      description: 'Restaurant gastronomique et traiteur. Saveurs authentiques et produits du terroir.',
      quickLinks: [
        { text: 'Menu', url: '/menu' },
        { text: 'Réservation', url: '/reservation' },
        { text: 'Traiteur', url: '/traiteur' },
        { text: 'Événements', url: '/evenements' },
        { text: 'Livraison', url: '/livraison' }
      ],
      legalLinks: [
        { text: 'Allergènes', url: '/allergenes' },
        { text: 'Origine Produits', url: '/origine' },
        { text: 'Nutrition', url: '/nutrition' },
        { text: 'Hygiène', url: '/hygiene' }
      ],
      contactInfo: {
        address: '321 Place Gastronomie\n33000 Bordeaux, France',
        phone: '+33 5 56 78 91 23',
        email: 'reservation@gourmet-kitchen.fr'
      },
      backgroundColor: '#92400e',
      textColor: '#ffffff'
    },
    default: {
      companyName: 'Mon Entreprise',
      description: 'Description de votre entreprise et de vos valeurs principales.',
      quickLinks: [
        { text: 'Accueil', url: '/' },
        { text: 'Produits', url: '/produits' },
        { text: 'Services', url: '/services' },
        { text: 'À propos', url: '/apropos' },
        { text: 'Contact', url: '/contact' }
      ],
      legalLinks: [
        { text: 'Mentions légales', url: '/mentions' },
        { text: 'CGV', url: '/cgv' },
        { text: 'Confidentialité', url: '/confidentialite' },
        { text: 'Cookies', url: '/cookies' }
      ],
      contactInfo: {
        address: '123 Rue Example\n75001 Paris, France',
        phone: '+33 1 23 45 67 89',
        email: 'contact@exemple.fr'
      },
      backgroundColor: '#1f2937',
      textColor: '#ffffff'
    }
  };

  const config = footerConfigs[category] || footerConfigs.default;

  return {
    id: `footer-${category}`,
    type: 'footer',
    content: {
      companyName: config.companyName,
      description: config.description,
      quickLinks: config.quickLinks,
      legalLinks: config.legalLinks,
      contactAddress: config.contactInfo.address,
      contactPhone: config.contactInfo.phone,
      contactEmail: config.contactInfo.email,
      showNewsletter: true,
      newsletterTitle: 'Restez Informé',
      newsletterDescription: 'Recevez nos dernières actualités et offres exclusives',
      showSocialMedia: true,
      socialLinks: [
        { platform: 'facebook', url: '#', label: 'Facebook' },
        { platform: 'instagram', url: '#', label: 'Instagram' },
        { platform: 'twitter', url: '#', label: 'Twitter' }
      ],
      showCopyright: true,
      copyrightText: `© ${new Date().getFullYear()} ${config.companyName}. Tous droits réservés.`
    },
    styles: {
      backgroundColor: config.backgroundColor,
      textColor: config.textColor,
      padding: '80px 0 40px 0',
    },
    order: 100
  };
};
