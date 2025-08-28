-- Script de diagnostic simple et fiable
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Vérifier quelles tables existent
SELECT '=== TABLES EXISTANTES ===' as info;
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_onboarding', 'supported_currencies', 'supported_countries', 'country_currencies')
ORDER BY table_name;

-- 2. Structure de supported_currencies (si elle existe)
SELECT '=== STRUCTURE supported_currencies ===' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'supported_currencies' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Structure de supported_countries (si elle existe)
SELECT '=== STRUCTURE supported_countries ===' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'supported_countries' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Structure de country_currencies (si elle existe)
SELECT '=== STRUCTURE country_currencies ===' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'country_currencies' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Structure de user_onboarding (si elle existe)
SELECT '=== STRUCTURE user_onboarding ===' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_onboarding' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 6. Contraintes existantes
SELECT '=== CONTRAINTES ===' as info;
SELECT tc.table_name, tc.constraint_name, tc.constraint_type, kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public' 
AND tc.table_name IN ('user_onboarding', 'supported_currencies', 'supported_countries', 'country_currencies')
ORDER BY tc.table_name, tc.constraint_type;

-- 7. Index existants
SELECT '=== INDEX ===' as info;
SELECT tablename, indexname
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('user_onboarding', 'supported_currencies', 'supported_countries', 'country_currencies')
ORDER BY tablename, indexname;

-- 8. Politiques RLS
SELECT '=== POLITIQUES RLS ===' as info;
SELECT tablename, policyname, cmd
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('user_onboarding', 'supported_currencies', 'supported_countries', 'country_currencies')
ORDER BY tablename, policyname;
