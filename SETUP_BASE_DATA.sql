-- Script pour vérifier et créer les données de base
-- Exécutez ce script dans votre base de données Supabase

-- 1. Vérifier si les tables existent
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('supported_countries', 'supported_currencies', 'country_currencies');

-- 2. Créer la table supported_countries si elle n'existe pas
CREATE TABLE IF NOT EXISTS supported_countries (
  code VARCHAR(3) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  flag_emoji VARCHAR(10),
  default_currency VARCHAR(3),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Créer la table supported_currencies si elle n'existe pas
CREATE TABLE IF NOT EXISTS supported_currencies (
  code VARCHAR(3) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  symbol VARCHAR(10),
  decimals INTEGER DEFAULT 2,
  is_active BOOLEAN DEFAULT true,
  exchange_rate_to_usd DECIMAL(10,6) DEFAULT 1.0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Créer la table country_currencies si elle n'existe pas
CREATE TABLE IF NOT EXISTS country_currencies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code VARCHAR(3) REFERENCES supported_countries(code),
  currency_code VARCHAR(3) REFERENCES supported_currencies(code),
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(country_code, currency_code)
);

-- 5. Insérer les pays supportés
INSERT INTO supported_countries (code, name, flag_emoji, default_currency, is_active) VALUES
('ML', 'Mali', '🇲🇱', 'CFA', true),
('CI', 'Côte d''Ivoire', '🇨🇮', 'CFA', true),
('SN', 'Sénégal', '🇸🇳', 'CFA', true),
('BF', 'Burkina Faso', '🇧🇫', 'CFA', true),
('TG', 'Togo', '🇹🇬', 'CFA', true),
('BJ', 'Bénin', '🇧🇯', 'CFA', true),
('NE', 'Niger', '🇳🇪', 'CFA', true),
('GW', 'Guinée-Bissau', '🇬🇼', 'CFA', true),
('FR', 'France', '🇫🇷', 'EUR', true),
('US', 'États-Unis', '🇺🇸', 'USD', true),
('GB', 'Royaume-Uni', '🇬🇧', 'GBP', true)
ON CONFLICT (code) DO NOTHING;

-- 6. Insérer les devises supportées
INSERT INTO supported_currencies (code, name, symbol, decimals, is_active, exchange_rate_to_usd) VALUES
('CFA', 'Franc CFA', 'CFA', 0, true, 0.00166),
('EUR', 'Euro', '€', 2, true, 1.09),
('USD', 'Dollar US', '$', 2, true, 1.0),
('GBP', 'Livre Sterling', '£', 2, true, 1.27)
ON CONFLICT (code) DO NOTHING;

-- 7. Insérer les relations pays-devises
INSERT INTO country_currencies (country_code, currency_code, is_primary) VALUES
-- Pays CFA
('ML', 'CFA', true),
('CI', 'CFA', true),
('SN', 'CFA', true),
('BF', 'CFA', true),
('TG', 'CFA', true),
('BJ', 'CFA', true),
('NE', 'CFA', true),
('GW', 'CFA', true),
-- Autres pays
('FR', 'EUR', true),
('US', 'USD', true),
('GB', 'GBP', true)
ON CONFLICT (country_code, currency_code) DO NOTHING;

-- 8. Vérifier les données insérées
SELECT 'Pays supportés:' as info;
SELECT code, name, flag_emoji, default_currency FROM supported_countries WHERE is_active = true ORDER BY name;

SELECT 'Devises supportées:' as info;
SELECT code, name, symbol, exchange_rate_to_usd FROM supported_currencies WHERE is_active = true ORDER BY name;

SELECT 'Relations pays-devises:' as info;
SELECT 
  cc.country_code,
  sc.name as country_name,
  cc.currency_code,
  scur.name as currency_name,
  cc.is_primary
FROM country_currencies cc
JOIN supported_countries sc ON cc.country_code = sc.code
JOIN supported_currencies scur ON cc.currency_code = scur.code
ORDER BY sc.name, cc.is_primary DESC;
