// Liste statique des intégrations disponibles dans l'App Store
export interface Integration {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  category: string;
  website?: string;
}

export const INTEGRATIONS: Integration[] = [
  {
    id: 'kit',
    name: 'Kit (ex ConvertKit)',
    description: "Kit (anciennement ConvertKit) est un outil d’emailing fiable et puissant pour les créateurs qui construisent une entreprise de valeur.",
    iconUrl: '/public/kit.png',
    category: 'Emailing',
    website: 'https://convertkit.com/',
  },
  {
    id: 'wachap',
    name: 'WaChap',
    description: "WaChap est une application web qui vous permet d’automatiser votre marketing sur WhatsApp et de gérer vos relations clients.",
    iconUrl: '/public/wachap.png',
    category: 'WhatsApp',
    website: 'https://wachap.com/',
  },
  {
    id: 'green-api',
    name: 'Green API',
    description: "Green-Api est une API WhatsApp non officielle qui vous permet d’envoyer et de recevoir des messages de WhatsApp.",
    iconUrl: '/public/greenapi.webp',
    category: 'WhatsApp',
    website: 'https://green-api.com/',
  },
  {
    id: 'brevo',
    name: 'Brevo (ex Sendinblue)',
    description: "Brevo (ex Sendinblue) est une plateforme d’automatisation marketing qui vous aide à gérer et à communiquer avec vos clients et autres parties intéressées.",
    iconUrl: '/public/brevo.png',
    category: 'Emailing',
    website: 'https://www.brevo.com/',
  },
  {
    id: 'mailerlite',
    name: 'MailerLite',
    description: "MailerLite est un outil de marketing digital qui aide les entreprises à créer et gérer des campagnes d’email, à construire des sites web et à développer leur audience.",
    iconUrl: '/public/mailerlite.webp',
    category: 'Emailing',
    website: 'https://www.mailerlite.com/',
  },
  {
    id: 'systeme-io',
    name: 'Systeme IO',
    description: "Systeme.io est la plateforme marketing tout-en-un la plus puissante pour maximiser vos ventes. Créez, automatisez et vendez en ligne grâce à une plateforme tout-en-un.",
    iconUrl: '/public/systemeio.jpg',
    category: 'Marketing',
    website: 'https://systeme.io/',
  },
  {
    id: 'active-campaign',
    name: 'Active Campaign',
    description: "Active Campaign est une plateforme d’automatisation marketing qui vous aide à gérer et à communiquer avec vos clients et autres parties intéressées.",
    iconUrl: '/public/activecampaign.png',
    category: 'Emailing',
    website: 'https://www.activecampaign.com/',
  },
  {
    id: 'teachable',
    name: 'Teachable',
    description: "Teachable est une plateforme qui vous permet de créer et d’héberger des cours en ligne.",
    iconUrl: '/public/teachable.png',
    category: 'Formation',
    website: 'https://teachable.com/',
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: "Mailchimp est une plateforme marketing tout-en-un qui vous aide à gérer et à communiquer avec vos clients et autres parties intéressées.",
    iconUrl: '/mailchimp-logo.svg',
    category: 'Emailing',
    website: 'https://mailchimp.com/',
  },
  {
    id: 'dsers',
    name: 'DSERS Dropshipping',
    description: "DSERS vous permet d'importer facilement des produits AliExpress dans votre boutique avec synchronisation automatique des prix et stocks.",
    iconUrl: '/dsers-logo.svg',
    category: 'Dropshipping',
    website: 'https://dsers.com/',
  },
]; 