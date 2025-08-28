-- 🔍 ANALYSE DE LA STRUCTURE DE LA BASE DE DONNÉES
-- Date: 2025-01-28
-- Objectif: Comprendre la structure exacte avant optimisation

-- =====================================================
-- 1. LISTE DES TABLES ET LEURS COLONNES
-- =====================================================

SELECT 
  t.table_name,
  c.column_name,
  c.data_type,
  c.is_nullable,
  c.column_default,
  c.character_maximum_length,
  c.numeric_precision,
  c.numeric_scale
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public' 
  AND t.table_type = 'BASE TABLE'
  AND t.table_name IN (
    'cart_sessions', 'stores', 'profiles', 'site_templates',
    'orders', 'products', 'categories', 'users', 'merchants'
  )
ORDER BY t.table_name, c.ordinal_position;

-- =====================================================
-- 2. INDEX EXISTANTS
-- =====================================================

SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
  AND tablename IN (
    'cart_sessions', 'stores', 'profiles', 'site_templates',
    'orders', 'products', 'categories', 'users', 'merchants'
  )
ORDER BY tablename, indexname;

-- =====================================================
-- 3. CONTRAINTES (PRIMARY KEYS, FOREIGN KEYS)
-- =====================================================

SELECT 
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage ccu 
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.table_name IN (
    'cart_sessions', 'stores', 'profiles', 'site_templates',
    'orders', 'products', 'categories', 'users', 'merchants'
  )
ORDER BY tc.table_name, tc.constraint_type, tc.constraint_name;

-- =====================================================
-- 4. STATISTIQUES DES TABLES
-- =====================================================

SELECT 
  schemaname,
  relname as table_name,
  n_tup_ins + n_tup_upd + n_tup_del as total_operations,
  n_live_tup as live_rows,
  n_dead_tup as dead_rows,
  pg_size_pretty(pg_relation_size(relid)) as table_size,
  pg_size_pretty(pg_total_relation_size(relid)) as total_size
FROM pg_stat_user_tables
WHERE schemaname = 'public'
  AND relname IN (
    'cart_sessions', 'stores', 'profiles', 'site_templates',
    'orders', 'products', 'categories', 'users', 'merchants'
  )
ORDER BY total_operations DESC;

-- =====================================================
-- 5. FONCTIONS EXISTANTES
-- =====================================================

SELECT 
  p.proname as function_name,
  pg_get_function_arguments(p.oid) as arguments,
  pg_get_function_result(p.oid) as return_type,
  l.lanname as language
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
JOIN pg_language l ON p.prolang = l.oid
WHERE n.nspname = 'public'
  AND p.proname LIKE '%cart%' 
     OR p.proname LIKE '%session%'
     OR p.proname LIKE '%store%'
     OR p.proname LIKE '%profile%'
ORDER BY p.proname;

-- =====================================================
-- 6. VUES EXISTANTES
-- =====================================================

SELECT 
  table_name,
  view_definition
FROM information_schema.views
WHERE table_schema = 'public'
  AND (table_name LIKE '%cart%' 
       OR table_name LIKE '%session%'
       OR table_name LIKE '%store%'
       OR table_name LIKE '%profile%')
ORDER BY table_name;

-- =====================================================
-- 7. TRIGGERS EXISTANTS
-- =====================================================

SELECT 
  t.trigger_name,
  t.event_manipulation,
  t.action_timing,
  t.event_object_table,
  t.action_statement
FROM information_schema.triggers t
WHERE t.trigger_schema = 'public'
  AND t.event_object_table IN (
    'cart_sessions', 'stores', 'profiles', 'site_templates',
    'orders', 'products', 'categories', 'users', 'merchants'
  )
ORDER BY t.event_object_table, t.trigger_name;

-- =====================================================
-- 8. RÉSUMÉ DES TABLES PRINCIPALES
-- =====================================================

DO $$
DECLARE
  table_record RECORD;
BEGIN
  RAISE NOTICE '=== RÉSUMÉ DES TABLES PRINCIPALES ===';
  
  FOR table_record IN 
    SELECT 
      t.table_name,
      COUNT(c.column_name) as column_count,
      pg_size_pretty(pg_relation_size(t.table_name::regclass)) as size
    FROM information_schema.tables t
    LEFT JOIN information_schema.columns c ON t.table_name = c.table_name
    WHERE t.table_schema = 'public' 
      AND t.table_type = 'BASE TABLE'
      AND t.table_name IN (
        'cart_sessions', 'stores', 'profiles', 'site_templates',
        'orders', 'products', 'categories', 'users', 'merchants'
      )
    GROUP BY t.table_name
    ORDER BY t.table_name
  LOOP
    RAISE NOTICE '📊 %: % colonnes, %', 
      table_record.table_name, 
      table_record.column_count, 
      table_record.size;
  END LOOP;
END $$;
