-- Migration pour créer la table market_settings
-- Cette table stocke les paramètres de devise pour chaque boutique

-- Créer la table market_settings
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

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_market_settings_store_id ON market_settings(store_id);

-- Créer un trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_market_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_market_settings_updated_at
    BEFORE UPDATE ON market_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_market_settings_updated_at();

-- Insérer les données par défaut pour les boutiques existantes
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

-- Activer RLS (Row Level Security)
ALTER TABLE market_settings ENABLE ROW LEVEL SECURITY;

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

-- Commentaires pour la documentation
COMMENT ON TABLE market_settings IS 'Paramètres de marché et devise pour chaque boutique';
COMMENT ON COLUMN market_settings.default_currency IS 'Devise par défaut de la boutique (XOF, EUR, USD, etc.)';
COMMENT ON COLUMN market_settings.enabled_currencies IS 'Liste des devises supportées par la boutique';
COMMENT ON COLUMN market_settings.enabled_countries IS 'Liste des pays supportés par la boutique';
COMMENT ON COLUMN market_settings.currency_format IS 'Format d''affichage de la devise (symbol_code, symbol_only, etc.)';
COMMENT ON COLUMN market_settings.decimal_places IS 'Nombre de décimales pour l''affichage des prix';
COMMENT ON COLUMN market_settings.exchange_rates IS 'Taux de change en JSON pour les conversions';
COMMENT ON COLUMN market_settings.auto_currency_detection IS 'Détection automatique de la devise basée sur la géolocalisation';
