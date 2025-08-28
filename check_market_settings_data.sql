-- 🔍 Vérification des données dans market_settings
-- Pour identifier le problème de store_id

-- Voir tous les enregistrements de market_settings
SELECT 
    'Tous les enregistrements' as info,
    id,
    store_id,
    default_currency,
    enabled_currencies,
    currency_format,
    decimal_places,
    created_at,
    updated_at
FROM market_settings
ORDER BY created_at;

-- Vérifier les stores existants
SELECT 
    'Stores existants' as info,
    s.id as store_id,
    s.name as store_name,
    p.email as merchant_email,
    p.id as profile_id
FROM stores s
JOIN profiles p ON s.merchant_id = p.id
ORDER BY s.created_at;

-- Vérifier si les store_id dans market_settings correspondent aux stores
SELECT 
    'Correspondance store_id' as info,
    ms.store_id as market_settings_store_id,
    s.id as stores_id,
    s.name as store_name,
    CASE 
        WHEN s.id IS NULL THEN '❌ Store inexistant'
        ELSE '✅ Store existe'
    END as status
FROM market_settings ms
LEFT JOIN stores s ON ms.store_id = s.id
ORDER BY ms.created_at;

-- Vérifier les profiles et leurs stores
SELECT 
    'Profiles et leurs stores' as info,
    p.id as profile_id,
    p.email,
    p.user_id,
    COUNT(s.id) as stores_count,
    ARRAY_AGG(s.id) as store_ids
FROM profiles p
LEFT JOIN stores s ON p.id = s.merchant_id
GROUP BY p.id, p.email, p.user_id
ORDER BY p.created_at;
