import { supabase } from '@/integrations/supabase/client';

/**
 * Utilitaires pour automatiser la connexion et configuration Supabase
 */

export interface ConnectionStatus {
  connected: boolean;
  projectId: string;
  url: string;
  user?: any;
  tables: string[];
  errors: string[];
}

/**
 * Vérifier le statut de connexion Supabase
 */
export const checkSupabaseConnection = async (): Promise<ConnectionStatus> => {
  console.log('🔍 Vérification de la connexion Supabase...');

  const status: ConnectionStatus = {
    connected: false,
    projectId: 'grutldacuowplosarucp',
    url: 'https://grutldacuowplosarucp.supabase.co',
    tables: [],
    errors: []
  };

  try {
    // 1. Vérifier la connexion de base
    const { data, error } = await supabase.from('stores').select('id').limit(1);
    
    if (error) {
      status.errors.push(`Connexion DB: ${error.message}`);
    } else {
      status.connected = true;
      status.tables.push('stores');
    }

    // 2. Vérifier l'authentification
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        status.errors.push(`Auth: ${authError.message}`);
      } else if (user) {
        status.user = {
          id: user.id,
          email: user.email,
          created_at: user.created_at
        };
      }
    } catch (authErr) {
      status.errors.push('Auth: Non configuré');
    }

    // 3. Vérifier les tables principales
    const tablesToCheck = ['products', 'orders', 'customers', 'shipping_zones', 'shipping_methods'];
    
    for (const table of tablesToCheck) {
      try {
        const { error: tableError } = await supabase.from(table as any).select('id').limit(1);
        if (!tableError) {
          status.tables.push(table);
        } else {
          status.errors.push(`Table ${table}: ${tableError.message}`);
        }
      } catch (err) {
        status.errors.push(`Table ${table}: Non accessible`);
      }
    }

    console.log('✅ Vérification terminée:', status);
    return status;

  } catch (error) {
    status.errors.push(`Erreur générale: ${error}`);
    return status;
  }
};

/**
 * Automatiser la création des tables manquantes
 */
export const autoSetupMissingTables = async (): Promise<{ success: boolean; message: string; details: string[] }> => {
  console.log('🔧 Configuration automatique des tables manquantes...');

  try {
    const details = [];
    
    // SQL pour créer toutes les tables nécessaires
    const setupSQL = `
      -- Créer les tables de livraisons si elles n'existent pas
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

      -- Créer les index
      CREATE INDEX IF NOT EXISTS idx_shipping_zones_store_id ON public.shipping_zones(store_id);
      CREATE INDEX IF NOT EXISTS idx_shipping_methods_store_id ON public.shipping_methods(store_id);
    `;

    // Essayer d'exécuter le SQL
    try {
      const { error } = await supabase.rpc('exec_sql' as any, { sql: setupSQL });
      if (error) throw error;
      details.push('✅ Tables créées via RPC');
    } catch (rpcError) {
      // Méthode alternative : vérifier via SELECT
      details.push('⚠️ RPC non disponible, vérification alternative...');
      
      const tables = ['shipping_zones', 'shipping_methods'];
      for (const table of tables) {
        try {
          await supabase.from(table as any).select('id').limit(1);
          details.push(`✅ Table ${table}: Accessible`);
        } catch (err) {
          details.push(`❌ Table ${table}: À créer manuellement`);
        }
      }
    }

    return {
      success: true,
      message: 'Configuration automatique terminée',
      details
    };

  } catch (error) {
    return {
      success: false,
      message: `Erreur lors de la configuration: ${error}`,
      details: []
    };
  }
};

/**
 * Fonction principale d'automatisation complète
 */
export const fullSupabaseAutomation = async () => {
  console.log('🚀 Automatisation complète de Supabase...');

  try {
    // 1. Vérifier la connexion
    const connectionStatus = await checkSupabaseConnection();
    
    // 2. Configurer les tables manquantes
    const setupResult = await autoSetupMissingTables();
    
    // 3. Retourner le résumé
    return {
      connection: connectionStatus,
      setup: setupResult,
      summary: {
        connected: connectionStatus.connected,
        tablesFound: connectionStatus.tables.length,
        errorsCount: connectionStatus.errors.length,
        setupSuccess: setupResult.success
      }
    };

  } catch (error) {
    return {
      connection: null,
      setup: null,
      summary: {
        connected: false,
        tablesFound: 0,
        errorsCount: 1,
        setupSuccess: false
      },
      error
    };
  }
};

/**
 * Créer des données de test complètes
 */
export const createCompleteTestData = async (storeId: string) => {
  console.log('📦 Création de données de test complètes...');

  try {
    // Créer des zones de livraison
    const zones = [
      {
        store_id: storeId,
        name: 'Afrique de l\'Ouest',
        description: 'Livraison en Afrique de l\'Ouest francophone',
        countries: ['Sénégal', 'Mali', 'Burkina Faso', 'Côte d\'Ivoire', 'Niger', 'Guinée', 'Bénin', 'Togo'],
        is_active: true
      },
      {
        store_id: storeId,
        name: 'Afrique Centrale',
        description: 'Livraison en Afrique Centrale francophone',
        countries: ['Cameroun', 'Tchad', 'République Centrafricaine', 'Gabon', 'Congo'],
        is_active: true
      }
    ];

    const { data: createdZones, error: zonesError } = await supabase
      .from('shipping_zones' as any)
      .insert(zones)
      .select();

    if (zonesError) throw zonesError;

    // Créer des méthodes de livraison
    const methods = [
      {
        store_id: storeId,
        shipping_zone_id: createdZones[0].id,
        name: 'Livraison Standard',
        description: 'Livraison standard 3-5 jours',
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
        name: 'Livraison Express',
        description: 'Livraison express 24-48h',
        icon: '⚡',
        price: 5000,
        estimated_days: '1-2 jours ouvrables',
        is_active: true,
        sort_order: 2
      },
      {
        store_id: storeId,
        name: 'Retrait en magasin',
        description: 'Récupération en magasin',
        icon: '🏪',
        price: 0,
        estimated_days: 'Immédiat',
        is_active: true,
        sort_order: 3
      }
    ];

    const { data: createdMethods, error: methodsError } = await supabase
      .from('shipping_methods' as any)
      .insert(methods)
      .select();

    if (methodsError) throw methodsError;

    return {
      success: true,
      message: `Données créées: ${createdZones.length} zones, ${createdMethods.length} méthodes`,
      data: { zones: createdZones, methods: createdMethods }
    };

  } catch (error) {
    return {
      success: false,
      message: `Erreur: ${error}`,
      data: null
    };
  }
};
