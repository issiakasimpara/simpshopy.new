-- Migration pour initialiser les devises des boutiques existantes
-- Date: 2025-01-28

-- 1. S'assurer que la table market_settings existe
CREATE TABLE IF NOT EXISTS market_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  enabled_countries TEXT[] NOT NULL DEFAULT '{}',
  default_currency TEXT NOT NULL DEFAULT 'XOF',
  tax_settings JSONB DEFAULT '{"includeTax": false, "taxRate": 0, "taxLabel": "TVA"}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(store_id)
);

-- 2. Initialiser les devises pour les boutiques existantes qui n'en ont pas
INSERT INTO market_settings (store_id, default_currency, enabled_countries, tax_settings)
SELECT 
  s.id as store_id,
  'XOF' as default_currency,
  ARRAY['ML', 'CI', 'SN', 'BF'] as enabled_countries,
  '{"includeTax": false, "taxRate": 0, "taxLabel": "TVA"}'::jsonb as tax_settings
FROM stores s
WHERE NOT EXISTS (
  SELECT 1 FROM market_settings ms WHERE ms.store_id = s.id
)
ON CONFLICT (store_id) DO NOTHING;

-- 3. Créer les index pour les performances
CREATE INDEX IF NOT EXISTS idx_market_settings_store_id ON market_settings(store_id);
CREATE INDEX IF NOT EXISTS idx_market_settings_currency ON market_settings(default_currency);

-- 4. Activer RLS si pas déjà fait
ALTER TABLE market_settings ENABLE ROW LEVEL SECURITY;

-- 5. Créer les politiques RLS si elles n'existent pas
DO $$
BEGIN
  -- Politique pour les propriétaires de boutique
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'market_settings' AND policyname = 'Store owners can manage their market settings') THEN
    CREATE POLICY "Store owners can manage their market settings" ON market_settings
      FOR ALL USING (
        store_id IN (
          SELECT id FROM stores WHERE merchant_id = auth.uid()
        )
      );
  END IF;

  -- Politique pour la lecture publique (pour l'affichage des devises)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'market_settings' AND policyname = 'Public can read market settings') THEN
    CREATE POLICY "Public can read market settings" ON market_settings
      FOR SELECT USING (true);
  END IF;
END $$;

-- 6. Créer le trigger pour updated_at si pas déjà fait
CREATE OR REPLACE FUNCTION update_market_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_market_settings_updated_at ON market_settings;
CREATE TRIGGER trigger_update_market_settings_updated_at
    BEFORE UPDATE ON market_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_market_settings_updated_at();

-- 7. Vérification
SELECT 
  'Migration terminée' as status,
  COUNT(*) as stores_with_currency,
  (SELECT COUNT(*) FROM stores) as total_stores
FROM market_settings;
