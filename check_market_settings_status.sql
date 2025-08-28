-- 🔍 Script de vérification de l'état de la table market_settings

-- Vérifier si la table existe
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'market_settings'
        ) THEN '✅ Table market_settings existe'
        ELSE '❌ Table market_settings n''existe pas'
    END as table_status;

-- Vérifier la structure de la table (si elle existe)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'market_settings'
ORDER BY ordinal_position;

-- Vérifier les données dans la table
SELECT 
    'Données dans market_settings' as info,
    COUNT(*) as total_records,
    COUNT(DISTINCT store_id) as unique_stores
FROM market_settings;

-- Vérifier les boutiques avec et sans paramètres
SELECT 
    'État des boutiques' as info,
    COUNT(*) as total_stores,
    COUNT(ms.store_id) as stores_with_settings,
    COUNT(*) - COUNT(ms.store_id) as stores_without_settings
FROM stores s
LEFT JOIN market_settings ms ON s.id = ms.store_id;

-- Afficher les détails des paramètres de devise
SELECT 
    s.name as store_name,
    s.id as store_id,
    ms.default_currency,
    ms.enabled_currencies,
    ms.enabled_countries,
    ms.created_at,
    ms.updated_at
FROM stores s
LEFT JOIN market_settings ms ON s.id = ms.store_id
ORDER BY s.name;

-- Vérifier les politiques RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'market_settings';

-- Vérifier les triggers
SELECT 
    trigger_name,
    event_manipulation,
    action_statement,
    action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'market_settings';
