-- 🔧 Ajouter l'enregistrement manquant dans market_settings
-- Pour le store_id correct : 75f9d56b-c257-45c2-9165-ac0bbae485fd

-- Vérifier d'abord si l'enregistrement existe déjà
SELECT 
    'Vérification avant insertion' as info,
    COUNT(*) as existing_records
FROM market_settings 
WHERE store_id = '75f9d56b-c257-45c2-9165-ac0bbae485fd';

-- Insérer l'enregistrement manquant (seulement s'il n'existe pas)
INSERT INTO market_settings (
    store_id,
    default_currency,
    enabled_currencies,
    currency_format,
    decimal_places,
    exchange_rates,
    auto_currency_detection
)
SELECT 
    '75f9d56b-c257-45c2-9165-ac0bbae485fd' as store_id,
    'XOF' as default_currency,
    ARRAY['XOF', 'EUR', 'USD', 'NGN', 'GHS', 'XAF'] as enabled_currencies,
    'symbol_code' as currency_format,
    0 as decimal_places,
    '{}' as exchange_rates,
    true as auto_currency_detection
WHERE NOT EXISTS (
    SELECT 1 FROM market_settings 
    WHERE store_id = '75f9d56b-c257-45c2-9165-ac0bbae485fd'
);

-- Vérifier que l'insertion a fonctionné
SELECT 
    'Après insertion' as info,
    id,
    store_id,
    default_currency,
    enabled_currencies,
    currency_format,
    decimal_places,
    created_at,
    updated_at
FROM market_settings 
WHERE store_id = '75f9d56b-c257-45c2-9165-ac0bbae485fd';

-- Vérifier le total d'enregistrements
SELECT 
    'Total enregistrements' as info,
    COUNT(*) as total_records
FROM market_settings;
