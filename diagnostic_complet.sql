-- ========================================
-- DIAGNOSTIC COMPLET DE LA BASE DE DONNÉES
-- ========================================

-- EXÉCUTEZ CHAQUE SECTION SÉPARÉMENT
-- Copiez et exécutez une section à la fois

-- ========================================
-- SECTION 1: TABLES EXISTANTES
-- ========================================
SELECT 'SECTION 1: TABLES EXISTANTES' as diagnostic;
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_onboarding', 'supported_currencies', 'supported_countries', 'country_currencies')
ORDER BY table_name;

-- ========================================
-- SECTION 2: STRUCTURE supported_currencies
-- ========================================
SELECT 'SECTION 2: STRUCTURE supported_currencies' as diagnostic;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'supported_currencies' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- ========================================
-- SECTION 3: STRUCTURE supported_countries
-- ========================================
SELECT 'SECTION 3: STRUCTURE supported_countries' as diagnostic;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'supported_countries' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- ========================================
-- SECTION 4: STRUCTURE country_currencies
-- ========================================
SELECT 'SECTION 4: STRUCTURE country_currencies' as diagnostic;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'country_currencies' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- ========================================
-- SECTION 5: STRUCTURE user_onboarding
-- ========================================
SELECT 'SECTION 5: STRUCTURE user_onboarding' as diagnostic;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_onboarding' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- ========================================
-- SECTION 6: CONTRAINTES
-- ========================================
SELECT 'SECTION 6: CONTRAINTES' as diagnostic;
SELECT tc.table_name, tc.constraint_name, tc.constraint_type, kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public' 
AND tc.table_name IN ('user_onboarding', 'supported_currencies', 'supported_countries', 'country_currencies')
ORDER BY tc.table_name, tc.constraint_type;

-- ========================================
-- SECTION 7: INDEX
-- ========================================
SELECT 'SECTION 7: INDEX' as diagnostic;
SELECT tablename, indexname
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('user_onboarding', 'supported_currencies', 'supported_countries', 'country_currencies')
ORDER BY tablename, indexname;

-- ========================================
-- SECTION 8: POLITIQUES RLS
-- ========================================
SELECT 'SECTION 8: POLITIQUES RLS' as diagnostic;
SELECT tablename, policyname, cmd
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('user_onboarding', 'supported_currencies', 'supported_countries', 'country_currencies')
ORDER BY tablename, policyname;

-- ========================================
-- SECTION 9: DONNÉES EXISTANTES
-- ========================================
SELECT 'SECTION 9: DONNÉES EXISTANTES' as diagnostic;

-- Compter les données de supported_currencies
SELECT 'supported_currencies' as table_name, COUNT(*) as row_count 
FROM supported_currencies;

-- Compter les données de supported_countries (si elle existe)
SELECT 'supported_countries' as table_name, COUNT(*) as row_count 
FROM supported_countries;

-- Compter les données de country_currencies (si elle existe)
SELECT 'country_currencies' as table_name, COUNT(*) as row_count 
FROM country_currencies;

-- Compter les données de user_onboarding (si elle existe)
SELECT 'user_onboarding' as table_name, COUNT(*) as row_count 
FROM user_onboarding;
