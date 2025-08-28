-- =====================================================
-- VÉRIFICATION DU SYSTÈME DE DEVISE
-- =====================================================

-- 1. Vérifier que la table market_settings existe
SELECT 
  'Table market_settings' as table_name,
  EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'market_settings'
  ) as exists;

-- 2. Vérifier les données dans market_settings
SELECT 
  'Données market_settings' as info,
  COUNT(*) as total_records,
  COUNT(DISTINCT store_id) as unique_stores
FROM public.market_settings;

-- 3. Vérifier les politiques RLS
SELECT 
  'Politiques RLS market_settings' as info,
  policyname,
  permissive,
  cmd
FROM pg_policies 
WHERE tablename = 'market_settings';

-- 4. Vérifier les stores et leurs devises
SELECT 
  s.name as store_name,
  s.status as store_status,
  ms.default_currency,
  ms.enabled_countries,
  ms.updated_at
FROM public.stores s
LEFT JOIN public.market_settings ms ON s.id = ms.store_id
ORDER BY s.created_at DESC;

-- 5. Vérifier les profils et stores
SELECT 
  p.email,
  s.name as store_name,
  s.id as store_id,
  ms.default_currency
FROM public.profiles p
LEFT JOIN public.stores s ON p.id = s.merchant_id
LEFT JOIN public.market_settings ms ON s.id = ms.store_id
ORDER BY p.created_at DESC;
