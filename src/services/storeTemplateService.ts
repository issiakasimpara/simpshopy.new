import { supabase } from '@/integrations/supabase/client';

export interface StoreTemplate {
  id: string;
  name: string;
  sector: string;
  description: string;
  features: string[];
  theme: {
    primary_color: string;
    secondary_color: string;
    accent_color: string;
  };
  default_products: Array<{
    name: string;
    description: string;
    price: number;
    category: string;
  }>;
  settings: {
    enable_reviews: boolean;
    enable_wishlist: boolean;
    enable_related_products: boolean;
    enable_newsletter: boolean;
    enable_social_sharing: boolean;
  };
}

export interface TemplateConfig {
  sector: string;
  template: StoreTemplate;
  is_default: boolean;
}

export class StoreTemplateService {
  /**
   * Récupérer le template approprié basé sur le secteur
   */
  static async getTemplateForSector(sector: string): Promise<StoreTemplate | null> {
    try {
      console.log('🔍 getTemplateForSector appelé avec secteur:', sector);
      
      // Si le secteur est "other" ou vide, utiliser un template aléatoire
      if (!sector || sector === 'other') {
        console.log('🔄 Secteur "other" ou vide, utilisation d\'un template aléatoire');
        return this.getRandomTemplate();
      }

      // Chercher un template spécifique pour le secteur
      console.log('🔍 Recherche du template pour le secteur:', sector);
      const { data, error } = await supabase
        .from('store_templates')
        .select('*')
        .eq('sector', sector)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('❌ Erreur lors de la recherche du template:', error);
        console.log('🔄 Utilisation du template par défaut');
        return this.getDefaultTemplate();
      }

      if (!data) {
        console.log(`⚠️ Aucun template trouvé pour le secteur: ${sector}`);
        console.log('🔄 Utilisation du template par défaut');
        return this.getDefaultTemplate();
      }

      console.log('✅ Template trouvé:', data.name, 'pour le secteur:', data.sector);
      return data as StoreTemplate;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du template:', error);
      return this.getDefaultTemplate();
    }
  }

  /**
   * Récupérer un template aléatoire
   */
  static async getRandomTemplate(): Promise<StoreTemplate> {
    try {
      const { data, error } = await supabase
        .from('store_templates')
        .select('*')
        .eq('is_active', true)
        .limit(1);

      if (error || !data || data.length === 0) {
        return this.getDefaultTemplate();
      }

      return data[0] as StoreTemplate;
    } catch (error) {
      console.error('Erreur lors de la récupération du template aléatoire:', error);
      return this.getDefaultTemplate();
    }
  }

  /**
   * Template par défaut (fallback)
   */
  static getDefaultTemplate(): StoreTemplate {
    return {
      id: 'default',
      name: 'Boutique Standard',
      sector: 'general',
      description: 'Template de base pour tous types de boutiques',
      features: [
        'Catalogue de produits',
        'Panier d\'achat',
        'Paiement sécurisé',
        'Gestion des commandes',
        'Tableau de bord'
      ],
      theme: {
        primary_color: '#3B82F6',
        secondary_color: '#1F2937',
        accent_color: '#10B981'
      },
      default_products: [
        {
          name: 'Produit Exemple',
          description: 'Description du produit exemple',
          price: 29.99,
          category: 'Général'
        }
      ],
      settings: {
        enable_reviews: true,
        enable_wishlist: true,
        enable_related_products: true,
        enable_newsletter: true,
        enable_social_sharing: true
      }
    };
  }

  /**
   * Créer une boutique avec le template approprié
   */
  static async createStoreWithTemplate(
    userId: string,
    storeName: string,
    sector: string,
    onboardingData: any
  ): Promise<{ success: boolean; storeId?: string; template?: StoreTemplate }> {
    try {
      // Récupérer le template approprié
      const template = await this.getTemplateForSector(sector);
      
      if (!template) {
        console.error('Impossible de récupérer un template');
        return { success: false };
      }

      console.log('🎯 Template sélectionné pour la boutique:', template.name, 'secteur:', template.sector);

      // Créer la boutique
      const { data: store, error: storeError } = await supabase
        .from('stores')
        .insert({
          user_id: userId,
          name: storeName,
          description: `Boutique créée avec le template ${template.name}`,
          status: 'active',
          settings: {
            ...template.settings,
            sector: sector,
            template_id: template.id,
            onboarding_data: onboardingData
          }
        })
        .select()
        .single();

      if (storeError) {
        console.error('Erreur lors de la création de la boutique:', storeError);
        return { success: false };
      }

      console.log('✅ Boutique créée avec succès, ID:', store.id);

      // CRÉER LE TEMPLATE DE SITE WEB CORRESPONDANT
      const siteTemplateId = this.getSiteTemplateIdForSector(sector);
      console.log('🌐 Création du template de site web avec ID:', siteTemplateId);

      const { error: siteTemplateError } = await supabase
        .from('site_templates')
        .insert({
          store_id: store.id,
          template_id: siteTemplateId,
          template_data: this.getDefaultSiteTemplateData(sector),
          is_published: true
        });

      if (siteTemplateError) {
        console.error('❌ Erreur lors de la création du template de site web:', siteTemplateError);
      } else {
        console.log('✅ Template de site web créé avec succès');
      }

      // Créer les produits par défaut si le template en a
      if (template.default_products && template.default_products.length > 0) {
        const productsToInsert = template.default_products.map(product => ({
          store_id: store.id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          status: 'active'
        }));

        const { error: productsError } = await supabase
          .from('products')
          .insert(productsToInsert);

        if (productsError) {
          console.error('Erreur lors de la création des produits par défaut:', productsError);
        }
      }

      return { 
        success: true, 
        storeId: store.id, 
        template 
      };

    } catch (error) {
      console.error('Erreur lors de la création de la boutique avec template:', error);
      return { success: false };
    }
  }

  /**
   * Obtenir l'ID du template de site web correspondant au secteur
   */
  private static getSiteTemplateIdForSector(sector: string): string {
    const sectorToTemplateMap: { [key: string]: string } = {
      'technology': 'tech-modern',
      'fashion': 'fashion-modern',
      'food': 'food-gourmet',
      'health': 'health-wellness',
      'education': 'learning-hub',
      'entertainment': 'entertainment-store',
      'other': 'general-modern',
      'general': 'general-modern'
    };

    return sectorToTemplateMap[sector] || 'general-modern';
  }

  /**
   * Obtenir les données par défaut du template de site web
   */
  private static getDefaultSiteTemplateData(sector: string): any {
    const baseTemplate = {
      theme: {
        primary_color: '#3B82F6',
        secondary_color: '#1F2937',
        accent_color: '#10B981'
      },
      layout: {
        header: { type: 'standard', show_logo: true, show_nav: true },
        footer: { type: 'standard', show_social: true },
        sidebar: { enabled: false }
      }
    };

    // Personnaliser selon le secteur
    const sectorCustomizations: { [key: string]: any } = {
      'technology': {
        theme: {
          primary_color: '#3B82F6',
          secondary_color: '#1F2937',
          accent_color: '#10B981'
        },
        hero: {
          title: 'Solutions Technologiques Innovantes',
          subtitle: 'Découvrez nos produits tech de pointe'
        }
      },
      'fashion': {
        theme: {
          primary_color: '#EC4899',
          secondary_color: '#831843',
          accent_color: '#F59E0B'
        },
        hero: {
          title: 'Mode & Style',
          subtitle: 'Découvrez nos dernières collections'
        }
      },
      'food': {
        theme: {
          primary_color: '#F59E0B',
          secondary_color: '#92400E',
          accent_color: '#10B981'
        },
        hero: {
          title: 'Gastronomie & Saveurs',
          subtitle: 'Dégustez nos produits d\'exception'
        }
      },
      'health': {
        theme: {
          primary_color: '#10B981',
          secondary_color: '#064E3B',
          accent_color: '#3B82F6'
        },
        hero: {
          title: 'Santé & Bien-être',
          subtitle: 'Prenez soin de vous naturellement'
        }
      },
      'education': {
        theme: {
          primary_color: '#8B5CF6',
          secondary_color: '#4C1D95',
          accent_color: '#F59E0B'
        },
        hero: {
          title: 'Apprentissage & Formation',
          subtitle: 'Développez vos compétences'
        }
      },
      'entertainment': {
        theme: {
          primary_color: '#EF4444',
          secondary_color: '#7F1D1D',
          accent_color: '#F59E0B'
        },
        hero: {
          title: 'Divertissement & Loisirs',
          subtitle: 'Vivez des expériences uniques'
        }
      }
    };

    return {
      ...baseTemplate,
      ...(sectorCustomizations[sector] || sectorCustomizations['general'])
    };
  }

  /**
   * Récupérer tous les templates disponibles
   */
  static async getAllTemplates(): Promise<StoreTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('store_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Erreur lors de la récupération des templates:', error);
        return [];
      }

      return data as StoreTemplate[];
    } catch (error) {
      console.error('Erreur lors de la récupération des templates:', error);
      return [];
    }
  }

  /**
   * Récupérer les templates par secteur
   */
  static async getTemplatesBySector(sector: string): Promise<StoreTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('store_templates')
        .select('*')
        .eq('sector', sector)
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Erreur lors de la récupération des templates par secteur:', error);
        return [];
      }

      return data as StoreTemplate[];
    } catch (error) {
      console.error('Erreur lors de la récupération des templates par secteur:', error);
      return [];
    }
  }
}
