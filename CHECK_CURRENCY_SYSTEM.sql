-- =====================================================
-- VÉRIFICATION DU SYSTÈME DE DEVISE
-- =====================================================

-- 1. Vérifier que la table market_settings existe
SELECT 
  'Vérification table market_settings' as test,
  EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'market_settings'
  ) as table_exists;

-- 2. Vérifier la structure de la table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'market_settings'
ORDER BY ordinal_position;

-- 3. Vérifier les politiques RLS
SELECT 
  policyname,
  permissive,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'market_settings';

-- 4. Vérifier les données existantes
SELECT 
  'Données market_settings' as info,
  COUNT(*) as total_records,
  COUNT(DISTINCT store_id) as unique_stores
FROM public.market_settings;

-- 5. Vérifier les devises actuelles
SELECT 
  s.name as store_name,
  s.id as store_id,
  ms.default_currency,
  ms.enabled_countries,
  ms.updated_at,
  ms.created_at
FROM public.stores s
LEFT JOIN public.market_settings ms ON s.id = ms.store_id
ORDER BY s.created_at DESC;

-- 6. Vérifier les utilisateurs et leurs stores
SELECT 
  au.email,
  p.id as profile_id,
  s.id as store_id,
  s.name as store_name,
  ms.default_currency
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.user_id
LEFT JOIN public.stores s ON p.id = s.merchant_id
LEFT JOIN public.market_settings ms ON s.id = ms.store_id
ORDER BY au.created_at DESC;

-- 7. Tester un changement de devise (remplacez USER_EMAIL par votre email)
-- UPDATE public.market_settings 
-- SET default_currency = 'EUR', updated_at = NOW()
-- WHERE store_id IN (
--   SELECT s.id 
--   FROM public.stores s 
--   JOIN public.profiles p ON s.merchant_id = p.id 
--   JOIN auth.users au ON p.user_id = au.id 
--   WHERE au.email = 'USER_EMAIL'
-- );

-- 8. Vérifier les triggers
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'market_settings';
