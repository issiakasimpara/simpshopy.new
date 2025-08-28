-- ========================================
-- VÉRIFIER LE TEMPLATE DE LA BOUTIQUE ACTUELLE
-- ========================================

-- 1. Vérifier les paramètres de la boutique la plus récente
SELECT 
  '=== BOUTIQUE LA PLUS RÉCENTE ===' as info;

SELECT 
  s.id as store_id,
  s.name as store_name,
  s.settings->>'template_id' as template_id,
  s.settings->>'sector' as sector,
  s.settings->>'onboarding_data' as onboarding_data,
  s.created_at
FROM stores s
ORDER BY s.created_at DESC
LIMIT 1;

-- 2. Vérifier si le template_id correspond à un template dans store_templates
SELECT 
  '=== VÉRIFICATION DU TEMPLATE ===' as info;

WITH latest_store AS (
  SELECT 
    s.settings->>'template_id' as template_id,
    s.settings->>'sector' as sector
  FROM stores s
  ORDER BY s.created_at DESC
  LIMIT 1
)
SELECT 
  ls.template_id,
  ls.sector,
  st.name as template_name,
  st.sector as template_sector,
  CASE 
    WHEN st.id IS NOT NULL THEN '✅ Template trouvé dans store_templates'
    ELSE '❌ Template NON trouvé dans store_templates'
  END as status
FROM latest_store ls
LEFT JOIN store_templates st ON st.id::text = ls.template_id;

-- 3. Vérifier tous les templates disponibles pour le secteur "technology"
SELECT 
  '=== TEMPLATES DISPONIBLES POUR TECHNOLOGY ===' as info;

SELECT 
  id,
  name,
  sector,
  is_active,
  is_default
FROM store_templates 
WHERE sector = 'technology'
ORDER BY name;

-- 4. Vérifier si la boutique a un template dans site_templates
SELECT 
  '=== TEMPLATE SITE WEB ===' as info;

WITH latest_store AS (
  SELECT id FROM stores ORDER BY created_at DESC LIMIT 1
)
SELECT 
  st.store_id,
  st.template_id,
  st.is_published,
  st.created_at
FROM site_templates st
JOIN latest_store ls ON st.store_id = ls.id;
