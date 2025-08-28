// Types pour le système d'onboarding et multi-devises

export interface UserOnboarding {
  id: string;
  user_id: string;
  experience_level?: 'beginner' | 'experienced';
  business_type?: 'digital_products' | 'online_services' | 'physical_products' | 'mixed';
  sector?: 'technology' | 'fashion' | 'food' | 'health' | 'education' | 'entertainment' | 'other';
  country_code?: string;
  currency_code?: string;
  onboarding_completed: boolean;
  onboarding_step: number;
  created_at: string;
  updated_at: string;
}

export interface SupportedCurrency {
  code: string;
  name: string;
  symbol: string;
  decimals: number;
  is_active: boolean;
  exchange_rate_to_usd: number;
  last_updated: string;
}

export interface SupportedCountry {
  code: string;
  name: string;
  flag_emoji: string;
  default_currency: string;
  is_active: boolean;
  created_at: string;
}

export interface CountryCurrency {
  id: string;
  country_code: string;
  currency_code: string;
  is_primary: boolean;
  created_at: string;
}

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  component: string;
  isCompleted: boolean;
}

export interface OnboardingData {
  experience_level?: 'beginner' | 'experienced';
  business_type?: 'digital_products' | 'online_services' | 'physical_products' | 'mixed';
  sector?: 'technology' | 'fashion' | 'food' | 'health' | 'education' | 'entertainment' | 'other';
  country_code?: string;
  currency_code?: string;
  theme_preference?: 'modern' | 'classic' | 'minimal' | 'colorful';
  features_needed?: string[];
}

// Types pour les composants d'onboarding
export interface ExperienceLevelOption {
  id: 'beginner' | 'experienced';
  title: string;
  description: string;
  icon: string;
  emoji: string;
}

export interface BusinessTypeOption {
  id: 'digital_products' | 'online_services' | 'physical_products' | 'mixed';
  title: string;
  description: string;
  icon: string;
}

export interface CountryOption {
  code: string;
  name: string;
  flag_emoji: string;
  default_currency: string;
}

export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  is_primary: boolean;
}

export interface SectorOption {
  id: string;
  title: string;
  emoji: string;
  description: string;
}

// Configuration des étapes d'onboarding
export const ONBOARDING_STEPS = [
  {
    id: 1,
    title: "Expérience en ligne",
    description: "Parlez-nous de votre niveau d'expérience"
  },
  {
    id: 2,
    title: "Type de business",
    description: "Que proposerez-vous ?"
  },
  {
    id: 3,
    title: "Secteur d'activité",
    description: "Dans quel secteur travaillez-vous ?"
  },
  {
    id: 4,
    title: "Configuration géographique",
    description: "Configurons l'emplacement et la devise par défaut de votre boutique"
  },
  {
    id: 5,
    title: "Résumé et création",
    description: "Vérifiez vos choix et créez votre boutique"
  }
];

// Options pour le niveau d'expérience
export const EXPERIENCE_LEVEL_OPTIONS: ExperienceLevelOption[] = [
  {
    id: 'beginner',
    title: 'Je suis débutant',
    description: 'Je découvre le e-commerce',
    icon: '😊',
    emoji: '😊'
  },
  {
    id: 'experienced',
    title: 'Je suis expérimenté',
    description: 'J\'ai déjà vendu en ligne',
    icon: '🤓',
    emoji: '🤓'
  }
];

// Options pour le type de business
export const BUSINESS_TYPE_OPTIONS: BusinessTypeOption[] = [
  {
    id: 'digital_products',
    title: 'Produits digitaux',
    description: 'Vendez facilement vos contenus numériques : e-books, cours en ligne, modèles et fichiers téléchargeables.',
    icon: '📁'
  },
  {
    id: 'online_services',
    title: 'Services en ligne',
    description: 'Proposez vos compétences sous forme de prestations personnalisées.',
    icon: '📅'
  },
  {
    id: 'physical_products',
    title: 'Produits physiques',
    description: 'Vendez des produits tangibles avec gestion des stocks et livraison.',
    icon: '📦'
  },
  {
    id: 'mixed',
    title: 'Mixte',
    description: 'Combinez produits physiques et digitaux dans votre boutique.',
    icon: '🔄'
  }
];

export const SECTOR_OPTIONS: SectorOption[] = [
  {
    id: 'technology',
    title: 'Technologie',
    emoji: '💻',
    description: 'Logiciels, applications, services tech'
  },
  {
    id: 'fashion',
    title: 'Mode & Beauté',
    emoji: '👗',
    description: 'Vêtements, accessoires, cosmétiques'
  },
  {
    id: 'food',
    title: 'Alimentation',
    emoji: '🍕',
    description: 'Restaurants, livraison, produits alimentaires'
  },
  {
    id: 'health',
    title: 'Santé & Bien-être',
    emoji: '🏥',
    description: 'Services médicaux, fitness, bien-être'
  },
  {
    id: 'education',
    title: 'Éducation',
    emoji: '📚',
    description: 'Cours, formations, livres'
  },
  {
    id: 'entertainment',
    title: 'Divertissement',
    emoji: '🎮',
    description: 'Jeux, événements, loisirs'
  },
  {
    id: 'other',
    title: 'Autre',
    emoji: '🔧',
    description: 'Autres secteurs d\'activité'
  }
];

export const THEME_OPTIONS = [
  {
    id: 'modern',
    title: 'Moderne',
    emoji: '✨',
    description: 'Design épuré et contemporain'
  },
  {
    id: 'classic',
    title: 'Classique',
    emoji: '🏛️',
    description: 'Style traditionnel et élégant'
  },
  {
    id: 'minimal',
    title: 'Minimaliste',
    emoji: '⚪',
    description: 'Simple et épuré'
  },
  {
    id: 'colorful',
    title: 'Coloré',
    emoji: '🌈',
    description: 'Vif et dynamique'
  }
];
