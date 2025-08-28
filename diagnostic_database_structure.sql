-- Script de diagnostic pour analyser la structure de la base de données
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Vérifier si les tables existent
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_onboarding', 'supported_currencies', 'supported_countries', 'country_currencies')
ORDER BY table_name;

-- 2. Si supported_currencies existe, voir sa structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'supported_currencies' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Si supported_countries existe, voir sa structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'supported_countries' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Si country_currencies existe, voir sa structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'country_currencies' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Si user_onboarding existe, voir sa structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_onboarding' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 6. Vérifier les contraintes existantes
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_schema = 'public' 
AND tc.table_name IN ('user_onboarding', 'supported_currencies', 'supported_countries', 'country_currencies')
ORDER BY tc.table_name, tc.constraint_type;

-- 7. Vérifier les index existants
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('user_onboarding', 'supported_currencies', 'supported_countries', 'country_currencies')
ORDER BY tablename, indexname;

-- 8. Vérifier les politiques RLS existantes
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
WHERE schemaname = 'public' 
AND tablename IN ('user_onboarding', 'supported_currencies', 'supported_countries', 'country_currencies')
ORDER BY tablename, policyname;

-- 9. Compter les données existantes (avec vérification d'existence)
DO $$
DECLARE
    table_exists BOOLEAN;
    result_text TEXT := '';
BEGIN
    -- Vérifier supported_currencies
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'supported_currencies'
    ) INTO table_exists;
    
    IF table_exists THEN
        EXECUTE 'SELECT COUNT(*) FROM supported_currencies' INTO result_text;
        RAISE NOTICE 'supported_currencies: % lignes', result_text;
    ELSE
        RAISE NOTICE 'supported_currencies: Table n''existe pas';
    END IF;
    
    -- Vérifier supported_countries
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'supported_countries'
    ) INTO table_exists;
    
    IF table_exists THEN
        EXECUTE 'SELECT COUNT(*) FROM supported_countries' INTO result_text;
        RAISE NOTICE 'supported_countries: % lignes', result_text;
    ELSE
        RAISE NOTICE 'supported_countries: Table n''existe pas';
    END IF;
    
    -- Vérifier country_currencies
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'country_currencies'
    ) INTO table_exists;
    
    IF table_exists THEN
        EXECUTE 'SELECT COUNT(*) FROM country_currencies' INTO result_text;
        RAISE NOTICE 'country_currencies: % lignes', result_text;
    ELSE
        RAISE NOTICE 'country_currencies: Table n''existe pas';
    END IF;
    
    -- Vérifier user_onboarding
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'user_onboarding'
    ) INTO table_exists;
    
    IF table_exists THEN
        EXECUTE 'SELECT COUNT(*) FROM user_onboarding' INTO result_text;
        RAISE NOTICE 'user_onboarding: % lignes', result_text;
    ELSE
        RAISE NOTICE 'user_onboarding: Table n''existe pas';
    END IF;
END $$;
