import { supabase } from '../integrations/supabase/client';

export async function applyMarketSettingsMigration() {
  try {
    console.log('🔄 Application de la migration market_settings...');

    // Créer la table market_settings
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS market_settings (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
          default_currency VARCHAR(3) NOT NULL DEFAULT 'XOF',
          enabled_currencies TEXT[] DEFAULT ARRAY['XOF', 'EUR', 'USD', 'NGN', 'GHS', 'XAF'],
          enabled_countries TEXT[] DEFAULT ARRAY['ML', 'BF', 'CI', 'SN', 'TG', 'BJ', 'NE', 'GW'],
          currency_format VARCHAR(50) DEFAULT 'symbol_code',
          decimal_places INTEGER DEFAULT 0,
          exchange_rates JSONB DEFAULT '{}',
          auto_currency_detection BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          
          CONSTRAINT market_settings_store_id_unique UNIQUE (store_id),
          CONSTRAINT market_settings_currency_check CHECK (default_currency IN ('XOF', 'XAF', 'GHS', 'NGN', 'EUR', 'USD'))
        );
      `
    });

    if (createTableError) {
      console.error('❌ Erreur lors de la création de la table:', createTableError);
      return false;
    }

    // Créer l'index
    const { error: createIndexError } = await supabase.rpc('exec_sql', {
      sql: 'CREATE INDEX IF NOT EXISTS idx_market_settings_store_id ON market_settings(store_id);'
    });

    if (createIndexError) {
      console.error('❌ Erreur lors de la création de l\'index:', createIndexError);
    }

    // Insérer les données par défaut
    const { error: insertError } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO market_settings (store_id, default_currency, enabled_currencies, enabled_countries)
        SELECT 
          s.id,
          'XOF' as default_currency,
          ARRAY['XOF', 'EUR', 'USD', 'NGN', 'GHS', 'XAF'] as enabled_currencies,
          ARRAY['ML', 'BF', 'CI', 'SN', 'TG', 'BJ', 'NE', 'GW'] as enabled_countries
        FROM stores s
        WHERE NOT EXISTS (
          SELECT 1 FROM market_settings ms WHERE ms.store_id = s.id
        );
      `
    });

    if (insertError) {
      console.error('❌ Erreur lors de l\'insertion des données:', insertError);
    }

    console.log('✅ Migration market_settings appliquée avec succès');
    return true;

  } catch (error) {
    console.error('❌ Erreur lors de l\'application de la migration:', error);
    return false;
  }
}

// Fonction pour vérifier si la table existe
export async function checkMarketSettingsTable() {
  try {
    const { data, error } = await supabase
      .from('market_settings')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ Table market_settings n\'existe pas:', error.message);
      return false;
    }

    console.log('✅ Table market_settings existe');
    return true;

  } catch (error) {
    console.log('❌ Erreur lors de la vérification de la table:', error);
    return false;
  }
}
