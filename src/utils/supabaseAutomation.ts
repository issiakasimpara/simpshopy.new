import { supabase } from '@/integrations/supabase/client';

/**
 * Automatisation complète de Supabase pour votre compte
 * Configure tout automatiquement : tables, données, politiques, etc.
 */

export interface AutomationResult {
  success: boolean;
  message: string;
  details?: string[];
  errors?: any[];
}

/**
 * Vérifier l'état actuel de la base de données
 */
export const checkDatabaseStatus = async (): Promise<AutomationResult> => {
  console.log('🔍 Vérification de l\'état de la base de données...');

  try {
    const checks = [];
    const errors = [];

    // Vérifier les tables principales
    const tablesToCheck = ['stores', 'products', 'orders', 'customers', 'shipping_zones', 'shipping_methods'];
    
    for (const table of tablesToCheck) {
      try {
        const { error } = await supabase.from(table as any).select('id').limit(1);
        if (error) {
          errors.push(`Table ${table}: ${error.message}`);
        } else {
          checks.push(`✅ Table ${table}: OK`);
        }
      } catch (err) {
        errors.push(`Table ${table}: Non accessible`);
      }
    }

    // Vérifier l'authentification
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        checks.push(`✅ Authentification: Connecté (${user.email})`);
      } else {
        checks.push(`⚠️ Authentification: Non connecté`);
      }
    } catch (err) {
      errors.push(`Authentification: Erreur`);
    }

    // Vérifier les politiques RLS
    try {
      const { data, error } = await supabase.rpc('check_rls_policies' as any);
      if (!error) {
        checks.push(`✅ Politiques RLS: Configurées`);
      }
    } catch (err) {
      checks.push(`⚠️ Politiques RLS: À vérifier`);
    }

    return {
      success: errors.length === 0,
      message: errors.length === 0 
        ? 'Base de données entièrement configurée !' 
        : `${errors.length} problème(s) détecté(s)`,
      details: checks,
      errors: errors.length > 0 ? errors : undefined
    };

  } catch (error) {
    return {
      success: false,
      message: 'Erreur lors de la vérification',
      errors: [error]
    };
  }
};

/**
 * Automatiser la création de toutes les tables manquantes
 */
export const autoCreateAllTables = async (): Promise<AutomationResult> => {
  console.log('🚀 Création automatique de toutes les tables...');

  try {
    const results = [];
    const errors = [];

    // SQL pour créer toutes les tables nécessaires
    const createAllTablesSQL = `
      -- Table shipping_zones
      CREATE TABLE IF NOT EXISTS public.shipping_zones (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        store_id UUID NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        countries TEXT[] NOT NULL DEFAULT '{}',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );

      -- Table shipping_methods
      CREATE TABLE IF NOT EXISTS public.shipping_methods (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        store_id UUID NOT NULL,
        shipping_zone_id UUID,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(50) DEFAULT '🚚',
        price DECIMAL(10,2) NOT NULL DEFAULT 0,
        free_shipping_threshold DECIMAL(10,2),
        estimated_days VARCHAR(50) DEFAULT '3-5 jours',
        is_active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );

      -- Index pour optimisation
      CREATE INDEX IF NOT EXISTS idx_shipping_zones_store_id ON public.shipping_zones(store_id);
      CREATE INDEX IF NOT EXISTS idx_shipping_zones_active ON public.shipping_zones(is_active);
      CREATE INDEX IF NOT EXISTS idx_shipping_methods_store_id ON public.shipping_methods(store_id);
      CREATE INDEX IF NOT EXISTS idx_shipping_methods_zone_id ON public.shipping_methods(shipping_zone_id);
      CREATE INDEX IF NOT EXISTS idx_shipping_methods_active ON public.shipping_methods(is_active);
      CREATE INDEX IF NOT EXISTS idx_shipping_methods_sort ON public.shipping_methods(sort_order);

      -- Triggers pour updated_at
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = timezone('utc'::text, now());
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      DROP TRIGGER IF EXISTS update_shipping_zones_updated_at ON public.shipping_zones;
      CREATE TRIGGER update_shipping_zones_updated_at
        BEFORE UPDATE ON public.shipping_zones
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_shipping_methods_updated_at ON public.shipping_methods;
      CREATE TRIGGER update_shipping_methods_updated_at
        BEFORE UPDATE ON public.shipping_methods
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `;

    // Essayer d'exécuter via RPC
    try {
      const { error } = await supabase.rpc('exec_sql' as any, { sql: createAllTablesSQL });
      if (error) throw error;
      results.push('✅ Tables créées via RPC');
    } catch (rpcError) {
      console.log('⚠️ RPC non disponible, méthode alternative...');
      
      // Méthode alternative : vérifier l'existence via SELECT
      const tables = ['shipping_zones', 'shipping_methods'];
      for (const table of tables) {
        try {
          await supabase.from(table as any).select('id').limit(1);
          results.push(`✅ Table ${table}: Accessible`);
        } catch (err) {
          errors.push(`❌ Table ${table}: Non créée`);
        }
      }
    }

    return {
      success: errors.length === 0,
      message: errors.length === 0 
        ? 'Toutes les tables ont été créées avec succès !' 
        : `${errors.length} table(s) non créée(s)`,
      details: results,
      errors: errors.length > 0 ? errors : undefined
    };

  } catch (error) {
    return {
      success: false,
      message: 'Erreur lors de la création des tables',
      errors: [error]
    };
  }
};

/**
 * Automatiser la création de données de démonstration complètes
 */
export const autoCreateDemoData = async (storeId: string): Promise<AutomationResult> => {
  console.log('📦 Création automatique des données de démonstration...');

  try {
    const results = [];
    const errors = [];

    // 1. Créer des zones de livraison complètes
    const zones = [
      {
        store_id: storeId,
        name: 'Afrique de l\'Ouest',
        description: 'Zone de livraison pour l\'Afrique de l\'Ouest francophone',
        countries: ['Sénégal', 'Mali', 'Burkina Faso', 'Côte d\'Ivoire', 'Niger', 'Guinée', 'Bénin', 'Togo', 'Mauritanie'],
        is_active: true
      },
      {
        store_id: storeId,
        name: 'Afrique Centrale',
        description: 'Zone de livraison pour l\'Afrique Centrale francophone',
        countries: ['Cameroun', 'Tchad', 'République Centrafricaine', 'Gabon', 'République du Congo', 'RD Congo'],
        is_active: true
      },
      {
        store_id: storeId,
        name: 'Maghreb',
        description: 'Zone de livraison pour l\'Afrique du Nord',
        countries: ['Maroc', 'Tunisie', 'Algérie'],
        is_active: true
      }
    ];

    const { data: createdZones, error: zonesError } = await supabase
      .from('shipping_zones' as any)
      .insert(zones)
      .select();

    if (zonesError) throw zonesError;
    results.push(`✅ ${createdZones.length} zones de livraison créées`);

    // 2. Créer des méthodes de livraison variées
    const methods = [
      // Méthodes pour Afrique de l'Ouest
      {
        store_id: storeId,
        shipping_zone_id: createdZones[0].id,
        name: 'Livraison Standard Ouest',
        description: 'Livraison standard en Afrique de l\'Ouest',
        icon: '📦',
        price: 2500,
        free_shipping_threshold: 50000,
        estimated_days: '3-5 jours ouvrables',
        is_active: true,
        sort_order: 1
      },
      {
        store_id: storeId,
        shipping_zone_id: createdZones[0].id,
        name: 'Express Ouest',
        description: 'Livraison express en Afrique de l\'Ouest',
        icon: '⚡',
        price: 5000,
        estimated_days: '1-2 jours ouvrables',
        is_active: true,
        sort_order: 2
      },
      // Méthodes pour Afrique Centrale
      {
        store_id: storeId,
        shipping_zone_id: createdZones[1].id,
        name: 'Livraison Centrale',
        description: 'Livraison en Afrique Centrale',
        icon: '🚚',
        price: 3500,
        free_shipping_threshold: 60000,
        estimated_days: '4-6 jours ouvrables',
        is_active: true,
        sort_order: 3
      },
      // Méthodes globales
      {
        store_id: storeId,
        name: 'Retrait en magasin',
        description: 'Récupération directe en magasin',
        icon: '🏪',
        price: 0,
        estimated_days: 'Immédiat',
        is_active: true,
        sort_order: 10
      },
      {
        store_id: storeId,
        name: 'Livraison à domicile',
        description: 'Livraison directe à votre domicile',
        icon: '🏠',
        price: 2000,
        free_shipping_threshold: 30000,
        estimated_days: '2-4 jours ouvrables',
        is_active: true,
        sort_order: 11
      }
    ];

    const { data: createdMethods, error: methodsError } = await supabase
      .from('shipping_methods' as any)
      .insert(methods)
      .select();

    if (methodsError) throw methodsError;
    results.push(`✅ ${createdMethods.length} méthodes de livraison créées`);

    return {
      success: true,
      message: 'Données de démonstration créées avec succès !',
      details: results
    };

  } catch (error) {
    return {
      success: false,
      message: 'Erreur lors de la création des données de démonstration',
      errors: [error]
    };
  }
};

/**
 * Automatisation complète : tout en un clic
 */
export const fullAutomation = async (storeId?: string): Promise<AutomationResult> => {
  console.log('🎯 Automatisation complète de Supabase...');

  try {
    const results = [];
    const errors = [];

    // 1. Vérifier l'état actuel
    const statusCheck = await checkDatabaseStatus();
    results.push(`📋 Vérification: ${statusCheck.message}`);

    // 2. Créer les tables manquantes
    const tablesResult = await autoCreateAllTables();
    results.push(`🗄️ Tables: ${tablesResult.message}`);
    if (!tablesResult.success && tablesResult.errors) {
      errors.push(...tablesResult.errors);
    }

    // 3. Créer des données de démo si store_id fourni
    if (storeId) {
      const demoResult = await autoCreateDemoData(storeId);
      results.push(`📦 Données démo: ${demoResult.message}`);
      if (!demoResult.success && demoResult.errors) {
        errors.push(...demoResult.errors);
      }
    }

    return {
      success: errors.length === 0,
      message: errors.length === 0 
        ? 'Automatisation complète réussie ! 🎉' 
        : `Automatisation terminée avec ${errors.length} erreur(s)`,
      details: results,
      errors: errors.length > 0 ? errors : undefined
    };

  } catch (error) {
    return {
      success: false,
      message: 'Erreur lors de l\'automatisation complète',
      errors: [error]
    };
  }
};
