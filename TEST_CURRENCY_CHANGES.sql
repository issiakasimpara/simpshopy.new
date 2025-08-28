-- =====================================================
-- TEST DES CHANGEMENTS DE DEVISE
-- =====================================================

-- 1. Vérifier la table market_settings
SELECT 
  'Test market_settings' as test_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT store_id) as unique_stores
FROM public.market_settings;

-- 2. Vérifier les devises actuelles
SELECT 
  s.name as store_name,
  ms.default_currency,
  ms.updated_at
FROM public.stores s
LEFT JOIN public.market_settings ms ON s.id = ms.store_id
ORDER BY s.created_at DESC;

-- 3. Tester un changement de devise
-- Remplacez 'STORE_ID_HERE' par l'ID de votre store
UPDATE public.market_settings 
SET default_currency = 'EUR', updated_at = NOW()
WHERE store_id = (
  SELECT s.id 
  FROM public.stores s 
  JOIN public.profiles p ON s.merchant_id = p.id 
  WHERE p.user_id = auth.uid() 
  LIMIT 1
);

-- 4. Vérifier le changement
SELECT 
  'Après changement' as status,
  s.name as store_name,
  ms.default_currency,
  ms.updated_at
FROM public.stores s
LEFT JOIN public.market_settings ms ON s.id = ms.store_id
WHERE s.merchant_id IN (
  SELECT id FROM public.profiles WHERE user_id = auth.uid()
);

-- 5. Remettre en XOF pour le test
UPDATE public.market_settings 
SET default_currency = 'XOF', updated_at = NOW()
WHERE store_id = (
  SELECT s.id 
  FROM public.stores s 
  JOIN public.profiles p ON s.merchant_id = p.id 
  WHERE p.user_id = auth.uid() 
  LIMIT 1
);

-- 6. Vérifier le retour
SELECT 
  'Après retour' as status,
  s.name as store_name,
  ms.default_currency,
  ms.updated_at
FROM public.stores s
LEFT JOIN public.market_settings ms ON s.id = ms.store_id
WHERE s.merchant_id IN (
  SELECT id FROM public.profiles WHERE user_id = auth.uid()
);
