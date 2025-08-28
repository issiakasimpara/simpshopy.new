-- 🔍 Script pour vérifier la devise de la boutique spécifique
-- Boutique: b7f0e6e2-7a29-4dc4-9e19-abafd9817203

-- 1. Vérifier les informations de la boutique
SELECT 
    'Informations de la boutique' as info,
    s.id,
    s.name,
    s.slug,
    s.created_at
FROM stores s
WHERE s.id = 'b7f0e6e2-7a29-4dc4-9e19-abafd9817203';

-- 2. Vérifier les paramètres de devise
SELECT 
    'Paramètres de devise' as info,
    ms.store_id,
    ms.default_currency,
    ms.enabled_countries,
    ms.created_at,
    ms.updated_at
FROM market_settings ms
WHERE ms.store_id = 'b7f0e6e2-7a29-4dc4-9e19-abafd9817203';

-- 3. Vérifier si la table market_settings existe et a des données
SELECT 
    'État de la table market_settings' as info,
    COUNT(*) as total_records,
    COUNT(DISTINCT store_id) as unique_stores
FROM market_settings;

-- 4. Vérifier toutes les boutiques et leurs devises
SELECT 
    'Toutes les boutiques et leurs devises' as info,
    s.id as store_id,
    s.name as store_name,
    COALESCE(ms.default_currency, 'AUCUNE') as currency,
    ms.enabled_countries,
    CASE 
        WHEN ms.store_id IS NULL THEN '❌ Pas de paramètres'
        ELSE '✅ Paramètres configurés'
    END as status
FROM stores s
LEFT JOIN market_settings ms ON s.id = ms.store_id
ORDER BY s.created_at DESC;

-- 5. Vérifier les produits de cette boutique
SELECT 
    'Produits de la boutique' as info,
    p.id,
    p.name,
    p.price,
    p.currency,
    p.created_at
FROM products p
WHERE p.store_id = 'b7f0e6e2-7a29-4dc4-9e19-abafd9817203'
LIMIT 5;
