-- 🔧 Script SQL corrigé pour créer la table market_settings
-- Gère les éléments déjà existants

-- Créer la table market_settings (si elle n'existe pas)
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
    
    -- Contraintes
    CONSTRAINT market_settings_store_id_unique UNIQUE (store_id),
    CONSTRAINT market_settings_currency_check CHECK (default_currency IN ('XOF', 'XAF', 'GHS', 'NGN', 'EUR', 'USD'))
);

-- Créer un index pour améliorer les performances (si il n'existe pas)
CREATE INDEX IF NOT EXISTS idx_market_settings_store_id ON market_settings(store_id);

-- Créer la fonction de mise à jour (si elle n'existe pas)
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

-- Insérer les données par défaut pour les boutiques existantes (si pas déjà fait)
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

-- Vérifier que la table a été créée et les données insérées
SELECT 
    'Table market_settings configurée avec succès!' as status,
    COUNT(*) as total_stores,
    COUNT(ms.store_id) as stores_with_settings,
    CASE 
        WHEN COUNT(ms.store_id) = COUNT(*) THEN '✅ Toutes les boutiques ont des paramètres'
        ELSE '⚠️ Certaines boutiques n''ont pas de paramètres'
    END as status_message
FROM stores s
LEFT JOIN market_settings ms ON s.id = ms.store_id;
