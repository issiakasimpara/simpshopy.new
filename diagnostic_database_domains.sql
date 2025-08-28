-- 🔍 DIAGNOSTIC DES PROBLÈMES DE DOMAINES
-- Date: 2025-08-28

-- 1. Vérifier les tables de domaines existantes
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_name LIKE '%domain%' 
  AND table_schema = 'public'
ORDER BY table_name;

-- 2. Vérifier la structure de chaque table
-- Table domains
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'domains' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Table store_domains
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'store_domains' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Table custom_domains
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'custom_domains' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Vérifier les données dans chaque table
-- Domains
SELECT 
  'domains' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_records,
  COUNT(CASE WHEN is_verified = true THEN 1 END) as verified_records
FROM domains;

-- Store domains
SELECT 
  'store_domains' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_records,
  COUNT(CASE WHEN verification_status = 'verified' THEN 1 END) as verified_records
FROM store_domains;

-- Custom domains
SELECT 
  'custom_domains' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN verified = true THEN 1 END) as verified_records
FROM custom_domains;

-- 4. Vérifier les politiques RLS
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
WHERE tablename LIKE '%domain%'
ORDER BY tablename, policyname;

-- 5. Vérifier les triggers
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table LIKE '%domain%'
  AND trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- 6. Vérifier les fonctions liées aux domaines
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines 
WHERE routine_name LIKE '%domain%'
  AND routine_schema = 'public'
ORDER BY routine_name;

-- 7. Vérifier les contraintes
SELECT 
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.table_name LIKE '%domain%'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_type;

-- 8. Vérifier les index
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename LIKE '%domain%'
  AND schemaname = 'public'
ORDER BY tablename, indexname;
