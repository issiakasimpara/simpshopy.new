-- Script pour vérifier et corriger le système de sous-domaines
-- Exécutez ce script dans votre dashboard Supabase SQL Editor

-- 1. Vérifier les boutiques existantes
SELECT 
  id,
  name,
  slug,
  status,
  created_at
FROM stores 
WHERE status = 'active'
ORDER BY created_at DESC;

-- 2. Vérifier les sous-domaines existants
SELECT 
  sd.id,
  sd.domain_name,
  sd.domain_type,
  sd.is_active,
  sd.verification_status,
  s.name as store_name,
  s.slug as store_slug
FROM store_domains sd
LEFT JOIN stores s ON sd.store_id = s.id
ORDER BY sd.created_at DESC;

-- 3. Créer les sous-domaines manquants pour les boutiques existantes
INSERT INTO store_domains (
  store_id,
  domain_type,
  domain_name,
  is_primary,
  is_active,
  verification_status
)
SELECT 
  s.id,
  'subdomain',
  s.slug || '.simpshopy.com',
  true,
  true,
  'verified'
FROM stores s
WHERE s.status = 'active'
  AND s.slug IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM store_domains sd 
    WHERE sd.store_id = s.id 
    AND sd.domain_type = 'subdomain'
  );

-- 4. Vérifier que le trigger existe
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'create_default_subdomain_trigger';

-- 5. Recréer le trigger si nécessaire
DROP TRIGGER IF EXISTS create_default_subdomain_trigger ON stores;

CREATE TRIGGER create_default_subdomain_trigger
  AFTER INSERT ON stores
  FOR EACH ROW
  EXECUTE FUNCTION create_default_subdomain();

-- 6. Vérifier la fonction get_store_by_domain
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_name = 'get_store_by_domain';

-- 7. Test de la fonction get_store_by_domain
SELECT get_store_by_domain('bestboutique.simpshopy.com') as store_id;

-- 8. Vérifier les politiques RLS
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
WHERE tablename = 'store_domains';

-- 9. Résumé final
SELECT 
  'Boutiques actives' as type,
  COUNT(*) as count
FROM stores 
WHERE status = 'active'

UNION ALL

SELECT 
  'Sous-domaines créés' as type,
  COUNT(*) as count
FROM store_domains 
WHERE domain_type = 'subdomain' AND is_active = true;
