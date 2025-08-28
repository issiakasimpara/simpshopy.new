-- 🔧 Script corrigé pour ajouter les colonnes manquantes à market_settings
-- Basé sur la structure réelle de votre table

-- Ajouter les colonnes manquantes pour le système de devise dynamique
ALTER TABLE market_settings 
ADD COLUMN IF NOT EXISTS enabled_currencies TEXT[] DEFAULT ARRAY['XOF', 'EUR', 'USD', 'NGN', 'GHS', 'XAF'],
ADD COLUMN IF NOT EXISTS currency_format VARCHAR(50) DEFAULT 'symbol_code',
ADD COLUMN IF NOT EXISTS decimal_places INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS exchange_rates JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS auto_currency_detection BOOLEAN DEFAULT true;

-- Mettre à jour les données existantes avec les valeurs par défaut
UPDATE market_settings 
SET 
    enabled_currencies = ARRAY['XOF', 'EUR', 'USD', 'NGN', 'GHS', 'XAF'],
    currency_format = 'symbol_code',
    decimal_places = 0,
    exchange_rates = '{}',
    auto_currency_detection = true
WHERE enabled_currencies IS NULL 
   OR currency_format IS NULL 
   OR decimal_places IS NULL 
   OR exchange_rates IS NULL 
   OR auto_currency_detection IS NULL;

-- Ajouter les contraintes de validation (gestion d'erreur pour éviter les doublons)
DO $$
BEGIN
    -- Vérifier si la contrainte existe déjà
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'market_settings_currency_check'
    ) THEN
        ALTER TABLE market_settings 
        ADD CONSTRAINT market_settings_currency_check 
        CHECK (default_currency IN ('XOF', 'XAF', 'GHS', 'NGN', 'EUR', 'USD'));
    END IF;
END $$;

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_market_settings_store_id ON market_settings(store_id);

-- Créer la fonction de mise à jour updated_at (si elle n'existe pas)
CREATE OR REPLACE FUNCTION update_market_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger (en supprimant d'abord s'il existe)
DROP TRIGGER IF EXISTS trigger_update_market_settings_updated_at ON market_settings;
CREATE TRIGGER trigger_update_market_settings_updated_at
    BEFORE UPDATE ON market_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_market_settings_updated_at();

-- Activer RLS (Row Level Security) - si pas déjà activé
ALTER TABLE market_settings ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes pour éviter les conflits
DROP POLICY IF EXISTS "Users can view their own store market settings" ON market_settings;
DROP POLICY IF EXISTS "Users can update their own store market settings" ON market_settings;
DROP POLICY IF EXISTS "Users can insert market settings for their own stores" ON market_settings;

-- Créer les politiques RLS
CREATE POLICY "Users can view their own store market settings" ON market_settings
    FOR SELECT USING (
        store_id IN (
            SELECT s.id FROM stores s
            JOIN profiles p ON s.merchant_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own store market settings" ON market_settings
    FOR UPDATE USING (
        store_id IN (
            SELECT s.id FROM stores s
            JOIN profiles p ON s.merchant_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert market settings for their own stores" ON market_settings
    FOR INSERT WITH CHECK (
        store_id IN (
            SELECT s.id FROM stores s
            JOIN profiles p ON s.merchant_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Vérifier que toutes les colonnes ont été ajoutées
SELECT 
    'Colonnes ajoutées avec succès!' as status,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'market_settings'
AND column_name IN ('enabled_currencies', 'currency_format', 'decimal_places', 'exchange_rates', 'auto_currency_detection')
ORDER BY column_name;

-- Vérifier les données mises à jour
SELECT 
    'Données mises à jour' as info,
    COUNT(*) as total_records,
    COUNT(CASE WHEN enabled_currencies IS NOT NULL THEN 1 END) as with_enabled_currencies,
    COUNT(CASE WHEN currency_format IS NOT NULL THEN 1 END) as with_currency_format,
    COUNT(CASE WHEN decimal_places IS NOT NULL THEN 1 END) as with_decimal_places
FROM market_settings;
