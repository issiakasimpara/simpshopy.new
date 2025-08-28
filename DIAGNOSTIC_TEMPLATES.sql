-- ========================================
-- DIAGNOSTIC DES TEMPLATES
-- Script pour vérifier l'état des templates dans la base de données
-- ========================================

-- 1. Vérifier si la table store_templates existe
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'store_templates'
    ) THEN '✅ Table store_templates existe'
    ELSE '❌ Table store_templates N''EXISTE PAS'
  END as status_table;

-- 2. Si la table existe, vérifier son contenu
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'store_templates'
  ) THEN
    RAISE NOTICE '=== CONTENU DE LA TABLE store_templates ===';
    RAISE NOTICE 'Nombre total de templates: %', (SELECT COUNT(*) FROM store_templates);
    RAISE NOTICE 'Templates par secteur:';
    FOR r IN SELECT sector, COUNT(*) as count FROM store_templates GROUP BY sector ORDER BY sector
    LOOP
      RAISE NOTICE '  - %: % templates', r.sector, r.count;
    END LOOP;
    
    RAISE NOTICE 'Détail des templates:';
    FOR r IN SELECT name, sector, is_active, is_default FROM store_templates ORDER BY sector, name
    LOOP
      RAISE NOTICE '  - % (%): actif=%, défaut=%', r.name, r.sector, r.is_active, r.is_default;
    END LOOP;
  ELSE
    RAISE NOTICE '❌ La table store_templates n''existe pas';
  END IF;
END $$;

-- 3. Vérifier si la table site_templates existe (pour comprendre la confusion)
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'site_templates'
    ) THEN '✅ Table site_templates existe'
    ELSE '❌ Table site_templates N''EXISTE PAS'
  END as status_site_templates;

-- 4. Si site_templates existe, vérifier son contenu
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'site_templates'
  ) THEN
    RAISE NOTICE '=== CONTENU DE LA TABLE site_templates ===';
    RAISE NOTICE 'Nombre total de templates de site: %', (SELECT COUNT(*) FROM site_templates);
    
    RAISE NOTICE 'Détail des templates de site:';
    FOR r IN SELECT store_id, template_id, is_published FROM site_templates ORDER BY created_at DESC LIMIT 10
    LOOP
      RAISE NOTICE '  - Store: %, Template: %, Publié: %', r.store_id, r.template_id, r.is_published;
    END LOOP;
  ELSE
    RAISE NOTICE '❌ La table site_templates n''existe pas';
  END IF;
END $$;

-- 5. Vérifier les boutiques existantes et leurs templates
SELECT 
  '=== BOUTIQUES EXISTANTES ===' as info;

SELECT 
  s.id as store_id,
  s.name as store_name,
  s.settings->>'template_id' as template_id,
  s.settings->>'sector' as sector,
  s.created_at
FROM stores s
ORDER BY s.created_at DESC
LIMIT 10;

-- 6. Résumé des problèmes potentiels
SELECT 
  '=== DIAGNOSTIC FINAL ===' as info;

SELECT 
  CASE 
    WHEN NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'store_templates')
    THEN '🚨 PROBLÈME: Table store_templates manquante - Exécutez SETUP_STORE_TEMPLATES.sql'
    WHEN (SELECT COUNT(*) FROM store_templates) = 0
    THEN '🚨 PROBLÈME: Table store_templates vide - Exécutez SETUP_STORE_TEMPLATES.sql'
    ELSE '✅ Table store_templates OK'
  END as diagnostic_store_templates;

SELECT 
  CASE 
    WHEN EXISTS (SELECT FROM stores WHERE settings->>'template_id' IS NULL)
    THEN '⚠️ ATTENTION: Certaines boutiques n''ont pas de template_id'
    ELSE '✅ Toutes les boutiques ont un template_id'
  END as diagnostic_store_templates_assignment;
