// ========================================
// TYPES POUR LE SYSTÈME MARCHÉS ET LIVRAISONS
// ========================================

export interface Market {
  id: string;
  store_id: string;
  name: string;
  countries: string[]; // ['ML', 'CI', 'SN']
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MarketInsert {
  store_id: string;
  name: string;
  countries: string[];
  is_active?: boolean;
}

export interface ShippingMethod {
  id: string;
  store_id: string;
  market_id: string;
  name: string;
  description?: string;
  price: number;
  estimated_min_days: number;
  estimated_max_days: number;
  is_active: boolean;
  conditions?: any;
  sort_order: number;
  created_at: string;
  updated_at: string;
  market?: Market;
}

export interface ShippingMethodInsert {
  store_id: string;
  market_id: string;
  name: string;
  description?: string;
  price: number;
  estimated_min_days: number;
  estimated_max_days: number;
  is_active?: boolean;
  conditions?: any;
  sort_order?: number;
}

// Pays supportés
export const SUPPORTED_COUNTRIES = {
  'ML': { name: 'Mali', flag: '🇲🇱' },
  'SN': { name: 'Sénégal', flag: '🇸🇳' },
  'BF': { name: 'Burkina Faso', flag: '🇧🇫' },
  'CI': { name: 'Côte d\'Ivoire', flag: '🇨🇮' },
  'NE': { name: 'Niger', flag: '🇳🇪' },
  'TG': { name: 'Togo', flag: '🇹🇬' },
  'BJ': { name: 'Bénin', flag: '🇧🇯' },
  'GN': { name: 'Guinée', flag: '🇬🇳' }
} as const;

export type CountryCode = keyof typeof SUPPORTED_COUNTRIES;
