-- Migration adaptée pour l'onboarding - Utilise les tables existantes
-- Date: 2025-01-28

-- ========================================
-- 1. CRÉER LA TABLE user_onboarding
-- ========================================
CREATE TABLE IF NOT EXISTS user_onboarding (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    experience_level VARCHAR(50) NOT NULL DEFAULT 'beginner',
    business_type VARCHAR(100) NOT NULL DEFAULT 'digital_products',
    country_code VARCHAR(3) NOT NULL DEFAULT 'ML',
    currency_code VARCHAR(3) NOT NULL DEFAULT 'XOF',
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    onboarding_step INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 2. AJOUTER LES COLONNES MANQUANTES À currencies
-- ========================================
DO $$ 
BEGIN
    -- Ajouter colonne decimals si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'currencies' AND column_name = 'decimals') THEN
        ALTER TABLE currencies ADD COLUMN decimals INTEGER NOT NULL DEFAULT 2;
    END IF;
    
    -- Ajouter colonne exchange_rate_to_usd si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'currencies' AND column_name = 'exchange_rate_to_usd') THEN
        ALTER TABLE currencies ADD COLUMN exchange_rate_to_usd DECIMAL(10,6) NOT NULL DEFAULT 1.0;
    END IF;
    
    -- Ajouter colonne last_updated si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'currencies' AND column_name = 'last_updated') THEN
        ALTER TABLE currencies ADD COLUMN last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- ========================================
-- 3. CRÉER LA TABLE supported_countries (si elle n'existe pas)
-- ========================================
CREATE TABLE IF NOT EXISTS supported_countries (
    code VARCHAR(3) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    flag_emoji VARCHAR(10),
    default_currency VARCHAR(3),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 4. CRÉER LA TABLE country_currencies (si elle n'existe pas)
-- ========================================
CREATE TABLE IF NOT EXISTS country_currencies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    country_code VARCHAR(3),
    currency_code VARCHAR(3),
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(country_code, currency_code)
);

-- ========================================
-- 5. AJOUTER LES CONTRAINTES DE CLÉ ÉTRANGÈRE
-- ========================================
DO $$ 
BEGIN
    -- Contrainte pour supported_countries.default_currency
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'supported_countries' AND constraint_name = 'supported_countries_default_currency_fkey') THEN
        ALTER TABLE supported_countries 
        ADD CONSTRAINT supported_countries_default_currency_fkey 
        FOREIGN KEY (default_currency) REFERENCES currencies(code);
    END IF;
    
    -- Contraintes pour country_currencies
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'country_currencies' AND constraint_name = 'country_currencies_country_code_fkey') THEN
        ALTER TABLE country_currencies 
        ADD CONSTRAINT country_currencies_country_code_fkey 
        FOREIGN KEY (country_code) REFERENCES supported_countries(code);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'country_currencies' AND constraint_name = 'country_currencies_currency_code_fkey') THEN
        ALTER TABLE country_currencies 
        ADD CONSTRAINT country_currencies_currency_code_fkey 
        FOREIGN KEY (currency_code) REFERENCES currencies(code);
    END IF;
END $$;

-- ========================================
-- 6. CRÉER LES INDEX
-- ========================================
CREATE INDEX IF NOT EXISTS idx_user_onboarding_user_id ON user_onboarding(user_id);
CREATE INDEX IF NOT EXISTS idx_user_onboarding_completed ON user_onboarding(onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_supported_countries_active ON supported_countries(is_active);
CREATE INDEX IF NOT EXISTS idx_country_currencies_country ON country_currencies(country_code);

-- ========================================
-- 7. CONFIGURER RLS
-- ========================================
ALTER TABLE user_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE supported_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_currencies ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 8. CRÉER LES POLITIQUES RLS
-- ========================================
-- Policies pour user_onboarding
DROP POLICY IF EXISTS "Users can view their own onboarding data" ON user_onboarding;
CREATE POLICY "Users can view their own onboarding data" ON user_onboarding
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own onboarding data" ON user_onboarding;
CREATE POLICY "Users can insert their own onboarding data" ON user_onboarding
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own onboarding data" ON user_onboarding;
CREATE POLICY "Users can update their own onboarding data" ON user_onboarding
    FOR UPDATE USING (auth.uid() = user_id);

-- Policies pour les tables publiques (lecture seule)
DROP POLICY IF EXISTS "Anyone can view supported countries" ON supported_countries;
CREATE POLICY "Anyone can view supported countries" ON supported_countries
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can view country currencies" ON country_currencies;
CREATE POLICY "Anyone can view country currencies" ON country_currencies
    FOR SELECT USING (true);

-- ========================================
-- 9. CRÉER LE TRIGGER POUR updated_at
-- ========================================
CREATE OR REPLACE FUNCTION update_user_onboarding_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_user_onboarding_updated_at ON user_onboarding;
CREATE TRIGGER trigger_update_user_onboarding_updated_at
    BEFORE UPDATE ON user_onboarding
    FOR EACH ROW
    EXECUTE FUNCTION update_user_onboarding_updated_at();

-- ========================================
-- 10. INSÉRER LES PAYS DE BASE
-- ========================================
INSERT INTO supported_countries (code, name, flag_emoji, default_currency) VALUES
('ML', 'Mali', '🇲🇱', 'XOF'),
('SN', 'Sénégal', '🇸🇳', 'XOF'),
('CI', 'Côte d''Ivoire', '🇨🇮', 'XOF'),
('BF', 'Burkina Faso', '🇧🇫', 'XOF'),
('NE', 'Niger', '🇳🇪', 'XOF'),
('TG', 'Togo', '🇹🇬', 'XOF'),
('BJ', 'Bénin', '🇧🇯', 'XOF'),
('GW', 'Guinée-Bissau', '🇬🇼', 'XOF'),
('CM', 'Cameroun', '🇨🇲', 'XAF'),
('TD', 'Tchad', '🇹🇩', 'XAF'),
('CF', 'République centrafricaine', '🇨🇫', 'XAF'),
('CG', 'République du Congo', '🇨🇬', 'XAF'),
('GQ', 'Guinée équatoriale', '🇬🇶', 'XAF'),
('GA', 'Gabon', '🇬🇦', 'XAF'),
('GH', 'Ghana', '🇬🇭', 'GHS'),
('NG', 'Nigeria', '🇳🇬', 'NGN'),
('FR', 'France', '🇫🇷', 'EUR'),
('US', 'États-Unis', '🇺🇸', 'USD'),
('GB', 'Royaume-Uni', '🇬🇧', 'GBP'),
('DE', 'Allemagne', '🇩🇪', 'EUR'),
('CA', 'Canada', '🇨🇦', 'CAD'),
('AU', 'Australie', '🇦🇺', 'AUD'),
('JP', 'Japon', '🇯🇵', 'JPY'),
('CN', 'Chine', '🇨🇳', 'CNY'),
('IN', 'Inde', '🇮🇳', 'INR'),
('BR', 'Brésil', '🇧🇷', 'BRL'),
('MX', 'Mexique', '🇲🇽', 'MXN'),
('ZA', 'Afrique du Sud', '🇿🇦', 'ZAR'),
('EG', 'Égypte', '🇪🇬', 'EGP'),
('KE', 'Kenya', '🇰🇪', 'KES'),
('UG', 'Ouganda', '🇺🇬', 'UGX'),
('TZ', 'Tanzanie', '🇹🇿', 'TZS')
ON CONFLICT (code) DO NOTHING;

-- ========================================
-- 11. INSÉRER LES RELATIONS PAYS-DEVISES
-- ========================================
INSERT INTO country_currencies (country_code, currency_code, is_primary) VALUES
-- Pays XOF
('ML', 'XOF', true), ('ML', 'EUR', false), ('ML', 'USD', false),
('SN', 'XOF', true), ('SN', 'EUR', false), ('SN', 'USD', false),
('CI', 'XOF', true), ('CI', 'EUR', false), ('CI', 'USD', false),
('BF', 'XOF', true), ('BF', 'EUR', false), ('BF', 'USD', false),
('NE', 'XOF', true), ('NE', 'EUR', false), ('NE', 'USD', false),
('TG', 'XOF', true), ('TG', 'EUR', false), ('TG', 'USD', false),
('BJ', 'XOF', true), ('BJ', 'EUR', false), ('BJ', 'USD', false),
('GW', 'XOF', true), ('GW', 'EUR', false), ('GW', 'USD', false),
-- Pays XAF
('CM', 'XAF', true), ('CM', 'EUR', false), ('CM', 'USD', false),
('TD', 'XAF', true), ('TD', 'EUR', false), ('TD', 'USD', false),
('CF', 'XAF', true), ('CF', 'EUR', false), ('CF', 'USD', false),
('CG', 'XAF', true), ('CG', 'EUR', false), ('CG', 'USD', false),
('GQ', 'XAF', true), ('GQ', 'EUR', false), ('GQ', 'USD', false),
('GA', 'XAF', true), ('GA', 'EUR', false), ('GA', 'USD', false),
-- Autres pays africains
('GH', 'GHS', true), ('GH', 'USD', false), ('GH', 'EUR', false),
('NG', 'NGN', true), ('NG', 'USD', false), ('NG', 'EUR', false),
('ZA', 'ZAR', true), ('ZA', 'USD', false), ('ZA', 'EUR', false),
('EG', 'EGP', true), ('EG', 'USD', false), ('EG', 'EUR', false),
('KE', 'KES', true), ('KE', 'USD', false), ('KE', 'EUR', false),
('UG', 'UGX', true), ('UG', 'USD', false), ('UG', 'EUR', false),
('TZ', 'TZS', true), ('TZ', 'USD', false), ('TZ', 'EUR', false),
-- Pays occidentaux
('FR', 'EUR', true), ('FR', 'USD', false),
('US', 'USD', true), ('US', 'EUR', false),
('GB', 'GBP', true), ('GB', 'EUR', false), ('GB', 'USD', false),
('DE', 'EUR', true), ('DE', 'USD', false),
('CA', 'CAD', true), ('CA', 'USD', false), ('CA', 'EUR', false),
('AU', 'AUD', true), ('AU', 'USD', false), ('AU', 'EUR', false),
('JP', 'JPY', true), ('JP', 'USD', false), ('JP', 'EUR', false),
('CN', 'CNY', true), ('CN', 'USD', false), ('CN', 'EUR', false),
('IN', 'INR', true), ('IN', 'USD', false), ('IN', 'EUR', false),
('BR', 'BRL', true), ('BR', 'USD', false), ('BR', 'EUR', false),
('MX', 'MXN', true), ('MX', 'USD', false), ('MX', 'EUR', false)
ON CONFLICT (country_code, currency_code) DO NOTHING;
