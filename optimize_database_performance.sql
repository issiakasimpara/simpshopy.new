<<<<<<< HEAD
-- 🚀 SCRIPT D'OPTIMISATION DES PERFORMANCES SIMPSHOPY
-- Date: 2025-01-28
-- Objectif: Optimiser les requêtes les plus coûteuses identifiées

-- =====================================================
-- 1. FONCTION POUR CONFIGURER LES SESSIONS EN UNE SEULE FOIS
-- =====================================================

CREATE OR REPLACE FUNCTION configure_session(
  p_search_path TEXT DEFAULT 'public',
  p_role TEXT DEFAULT 'authenticated',
  p_jwt_claims TEXT DEFAULT '{}',
  p_method TEXT DEFAULT 'GET',
  p_path TEXT DEFAULT '/',
  p_headers TEXT DEFAULT '{}',
  p_cookies TEXT DEFAULT '{}'
) RETURNS void AS $$
BEGIN
  -- Configurer tous les paramètres en une seule fonction
  PERFORM set_config('search_path', p_search_path, true);
  PERFORM set_config('role', p_role, true);
  PERFORM set_config('request.jwt.claims', p_jwt_claims, true);
  PERFORM set_config('request.method', p_method, true);
  PERFORM set_config('request.path', p_path, true);
  PERFORM set_config('request.headers', p_headers, true);
  PERFORM set_config('request.cookies', p_cookies, true);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 2. INDEX OPTIMISÉS POUR CART_SESSIONS
=======
-- =====================================================
-- OPTIMISATIONS DE PERFORMANCE POUR SIMPSHOPY
-- =====================================================

-- 1. INDEX POUR CART_SESSIONS (URGENT - 138,773 appels!)
>>>>>>> 343236c6a5e55e9ef8f2b1d5cab75ff6f73c9b15
-- =====================================================

-- Index composite pour les requêtes les plus fréquentes
CREATE INDEX IF NOT EXISTS idx_cart_sessions_session_store_composite 
<<<<<<< HEAD
ON cart_sessions(session_id, store_id) 
WHERE session_id IS NOT NULL AND store_id IS NOT NULL;

-- Index pour les requêtes par date
CREATE INDEX IF NOT EXISTS idx_cart_sessions_updated_at_desc 
ON cart_sessions(updated_at DESC) 
WHERE updated_at IS NOT NULL;

-- Index pour les sessions expirées (nettoyage automatique)
CREATE INDEX IF NOT EXISTS idx_cart_sessions_expires_at 
ON cart_sessions(expires_at) 
WHERE expires_at < NOW();

-- Index partiel pour les sessions avec items
CREATE INDEX IF NOT EXISTS idx_cart_sessions_with_items 
ON cart_sessions(session_id, store_id) 
WHERE items != '[]'::jsonb AND items IS NOT NULL;

-- =====================================================
-- 3. OPTIMISATION DES TABLES PRINCIPALES
-- =====================================================

-- Index pour stores (requête fréquente)
CREATE INDEX IF NOT EXISTS idx_stores_merchant_created 
ON stores(merchant_id, created_at DESC);

-- Index pour profiles (requête fréquente)
CREATE INDEX IF NOT EXISTS idx_profiles_user_id 
ON profiles(user_id) 
WHERE user_id IS NOT NULL;

-- Index pour site_templates (requête coûteuse)
CREATE INDEX IF NOT EXISTS idx_site_templates_store_updated 
ON site_templates(store_id, updated_at DESC);

-- =====================================================
-- 4. FONCTION DE NETTOYAGE AUTOMATIQUE
-- =====================================================

CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  -- Nettoyer les sessions de panier expirées
  DELETE FROM cart_sessions 
  WHERE expires_at < NOW() - INTERVAL '1 day';
  
  -- Nettoyer les sessions de plus de 30 jours
  DELETE FROM cart_sessions 
  WHERE updated_at < NOW() - INTERVAL '30 days';
=======
ON cart_sessions(session_id, store_id);

-- Index pour les requêtes par store_id
CREATE INDEX IF NOT EXISTS idx_cart_sessions_store_id_created 
ON cart_sessions(store_id, created_at DESC);

-- Index pour les sessions expirées
CREATE INDEX IF NOT EXISTS idx_cart_sessions_expires_at 
ON cart_sessions(expires_at) WHERE expires_at < NOW();

-- 2. INDEX POUR PRODUCTS (URGENT - 40 secondes en moyenne!)
-- =====================================================

-- Index composite pour les requêtes de produits par boutique
CREATE INDEX IF NOT EXISTS idx_products_store_status_created 
ON products(store_id, status, created_at DESC);

-- Index pour les recherches par catégorie
CREATE INDEX IF NOT EXISTS idx_products_category_store 
ON products(category_id, store_id) WHERE category_id IS NOT NULL;

-- Index pour les produits actifs
CREATE INDEX IF NOT EXISTS idx_products_active_store 
ON products(store_id, status) WHERE status = 'active';

-- Index pour les recherches par SKU
CREATE INDEX IF NOT EXISTS idx_products_sku_store 
ON products(sku, store_id) WHERE sku IS NOT NULL;

-- 3. INDEX POUR CATEGORIES
-- =====================================================

-- Index pour les catégories par boutique
CREATE INDEX IF NOT EXISTS idx_categories_store_id 
ON categories(store_id);

-- 4. INDEX POUR ORDERS
-- =====================================================

-- Index pour les commandes par boutique
CREATE INDEX IF NOT EXISTS idx_orders_store_status_created 
ON public_orders(store_id, status, created_at DESC);

-- Index pour les commandes par email client
CREATE INDEX IF NOT EXISTS idx_orders_customer_email 
ON public_orders(customer_email) WHERE customer_email IS NOT NULL;

-- 5. INDEX POUR STORES
-- =====================================================

-- Index pour les recherches par slug
CREATE INDEX IF NOT EXISTS idx_stores_slug 
ON stores(slug) WHERE slug IS NOT NULL;

-- Index pour les stores par merchant
CREATE INDEX IF NOT EXISTS idx_stores_merchant_id 
ON stores(merchant_id);

-- 6. ANALYSE DES TABLES POUR OPTIMISER LES STATISTIQUES
-- =====================================================

-- Mettre à jour les statistiques des tables
ANALYZE cart_sessions;
ANALYZE products;
ANALYZE categories;
ANALYZE public_orders;
ANALYZE stores;

-- 7. CONFIGURATION POSTGRESQL POUR DE MEILLEURES PERFORMANCES
-- =====================================================

-- Augmenter la mémoire partagée (à ajuster selon votre plan Supabase)
-- ALTER SYSTEM SET shared_buffers = '256MB';
-- ALTER SYSTEM SET effective_cache_size = '1GB';
-- ALTER SYSTEM SET work_mem = '4MB';
-- ALTER SYSTEM SET maintenance_work_mem = '64MB';

-- 8. NETTOYAGE DES SESSIONS EXPIREES
-- =====================================================

-- Fonction pour nettoyer automatiquement les sessions expirées
CREATE OR REPLACE FUNCTION cleanup_expired_cart_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM cart_sessions 
  WHERE expires_at < NOW();
>>>>>>> 343236c6a5e55e9ef8f2b1d5cab75ff6f73c9b15
  
  -- Log du nettoyage
  RAISE NOTICE 'Nettoyage des sessions expirées terminé';
END;
$$ LANGUAGE plpgsql;

<<<<<<< HEAD
-- =====================================================
-- 5. TRIGGER POUR MAINTENIR LES INDEX
-- =====================================================

-- Fonction pour maintenir les statistiques
CREATE OR REPLACE FUNCTION maintain_cart_sessions_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Mettre à jour les statistiques si nécessaire
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Forcer l'analyse de la table après modifications importantes
    IF (SELECT COUNT(*) FROM cart_sessions) % 1000 = 0 THEN
      ANALYZE cart_sessions;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger pour maintenir les statistiques
DROP TRIGGER IF EXISTS trigger_maintain_cart_sessions_stats ON cart_sessions;
CREATE TRIGGER trigger_maintain_cart_sessions_stats
  AFTER INSERT OR UPDATE OR DELETE ON cart_sessions
  FOR EACH ROW EXECUTE FUNCTION maintain_cart_sessions_stats();

-- =====================================================
-- 6. VUES OPTIMISÉES POUR LES REQUÊTES FRÉQUENTES
-- =====================================================

-- Vue pour les sessions de panier actives
CREATE OR REPLACE VIEW active_cart_sessions AS
SELECT 
  cs.id,
  cs.session_id,
  cs.store_id,
  cs.items,
  cs.customer_info,
  cs.created_at,
  cs.updated_at,
  cs.expires_at,
  s.name as store_name,
  s.slug as store_slug
FROM cart_sessions cs
LEFT JOIN stores s ON cs.store_id = s.id
WHERE cs.expires_at > NOW()
  AND cs.items != '[]'::jsonb
  AND cs.items IS NOT NULL;

-- Vue pour les statistiques des paniers abandonnés
CREATE OR REPLACE VIEW abandoned_cart_stats AS
SELECT 
  store_id,
  COUNT(*) as total_abandoned,
  COUNT(DISTINCT session_id) as unique_sessions,
  AVG(
    CASE 
      WHEN items::text != '[]' THEN 
        (SELECT SUM((value->>'price')::numeric * (value->>'quantity')::integer)
         FROM jsonb_array_elements(items) as value)
      ELSE 0 
    END
  ) as average_cart_value,
  MAX(updated_at) as last_activity
FROM cart_sessions
WHERE expires_at > NOW() - INTERVAL '7 days'
  AND items != '[]'::jsonb
  AND items IS NOT NULL
GROUP BY store_id;

-- =====================================================
-- 7. CONFIGURATION DES PARAMÈTRES POSTGRES
-- =====================================================

-- Optimiser les paramètres pour les performances
-- (À exécuter avec les privilèges appropriés)

-- Augmenter la mémoire partagée pour les requêtes
-- ALTER SYSTEM SET shared_buffers = '256MB';
-- ALTER SYSTEM SET effective_cache_size = '1GB';

-- Optimiser les paramètres de requête
-- ALTER SYSTEM SET work_mem = '4MB';
-- ALTER SYSTEM SET maintenance_work_mem = '64MB';

-- Optimiser les paramètres de WAL
-- ALTER SYSTEM SET wal_buffers = '16MB';

-- =====================================================
-- 8. FONCTION DE MONITORING DES PERFORMANCES
-- =====================================================

CREATE OR REPLACE FUNCTION get_performance_stats()
RETURNS TABLE (
  table_name TEXT,
  total_rows BIGINT,
  index_size TEXT,
  table_size TEXT,
  cache_hit_ratio NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    schemaname||'.'||tablename as table_name,
    n_tup_ins + n_tup_upd + n_tup_del as total_rows,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
    pg_size_pretty(pg_relation_size(relid)) as table_size,
    CASE 
      WHEN (heap_blks_hit + heap_blks_read) > 0 THEN
        ROUND(100.0 * heap_blks_hit / (heap_blks_hit + heap_blks_read), 2)
      ELSE 0 
    END as cache_hit_ratio
  FROM pg_stat_user_tables
  WHERE schemaname = 'public'
  ORDER BY total_rows DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 9. CRÉATION D'UN JOB DE MAINTENANCE
-- =====================================================

-- Fonction pour la maintenance automatique
CREATE OR REPLACE FUNCTION perform_maintenance()
RETURNS void AS $$
BEGIN
  -- Nettoyer les sessions expirées
  PERFORM cleanup_expired_sessions();
  
  -- Analyser les tables principales
  ANALYZE cart_sessions;
  ANALYZE stores;
  ANALYZE profiles;
  ANALYZE site_templates;
  
  -- Vider les statistiques de requêtes (optionnel)
  -- SELECT pg_stat_statements_reset();
  
  RAISE NOTICE 'Maintenance terminée à %', NOW();
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 10. VÉRIFICATION DES OPTIMISATIONS
-- =====================================================

-- Vérifier que tous les index sont créés
=======
-- 9. VUES OPTIMISEES POUR LES REQUÊTES FRÉQUENTES
-- =====================================================

-- Vue pour les produits actifs avec catégories
CREATE OR REPLACE VIEW active_products_with_categories AS
SELECT 
  p.id,
  p.name,
  p.description,
  p.price,
  p.compare_price,
  p.cost_price,
  p.sku,
  p.inventory_quantity,
  p.status,
  p.images,
  p.tags,
  p.weight,
  p.dimensions,
  p.track_inventory,
  p.created_at,
  p.updated_at,
  p.store_id,
  c.name as category_name,
  c.id as category_id
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.status = 'active'
ORDER BY p.created_at DESC;

-- 10. MONITORING DES PERFORMANCES
-- =====================================================

-- Fonction pour surveiller les requêtes lentes
CREATE OR REPLACE FUNCTION log_slow_queries()
RETURNS void AS $$
BEGIN
  -- Log des requêtes prenant plus de 1 seconde
  INSERT INTO query_log (query_text, execution_time, created_at)
  SELECT 
    query,
    mean_time,
    NOW()
  FROM pg_stat_statements 
  WHERE mean_time > 1000  -- Plus de 1 seconde
  AND calls > 10;         -- Au moins 10 appels
END;
$$ LANGUAGE plpgsql;

-- Table pour le log des requêtes lentes
CREATE TABLE IF NOT EXISTS query_log (
  id SERIAL PRIMARY KEY,
  query_text TEXT,
  execution_time NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour le log
CREATE INDEX IF NOT EXISTS idx_query_log_created_at 
ON query_log(created_at DESC);

-- =====================================================
-- VÉRIFICATION DES INDEX CRÉÉS
-- =====================================================

-- Vérifier les index existants
>>>>>>> 343236c6a5e55e9ef8f2b1d5cab75ff6f73c9b15
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
<<<<<<< HEAD
WHERE schemaname = 'public' 
  AND tablename IN ('cart_sessions', 'stores', 'profiles', 'site_templates')
ORDER BY tablename, indexname;

-- Vérifier les statistiques de performance
SELECT * FROM get_performance_stats();

-- Vérifier les requêtes les plus lentes
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements 
WHERE query LIKE '%cart_sessions%' 
   OR query LIKE '%stores%'
   OR query LIKE '%profiles%'
ORDER BY total_time DESC 
LIMIT 10;

-- =====================================================
-- 11. RÉINITIALISATION DES STATISTIQUES
-- =====================================================

-- Réinitialiser les statistiques pour avoir des données propres
-- SELECT pg_stat_statements_reset();

-- Analyser toutes les tables pour mettre à jour les statistiques
ANALYZE;

COMMENT ON FUNCTION configure_session(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) IS 'Fonction optimisée pour configurer les sessions en une seule requête';
COMMENT ON FUNCTION cleanup_expired_sessions() IS 'Nettoie automatiquement les sessions expirées';
COMMENT ON FUNCTION perform_maintenance() IS 'Effectue la maintenance automatique de la base de données';
=======
WHERE tablename IN ('cart_sessions', 'products', 'categories', 'public_orders', 'stores')
ORDER BY tablename, indexname;

-- =====================================================
-- RECOMMANDATIONS ADDITIONNELLES
-- =====================================================

/*
1. MONITORING CONTINU :
   - Surveiller pg_stat_statements régulièrement
   - Alerter sur les requêtes > 5 secondes
   - Nettoyer les sessions expirées quotidiennement

2. CACHE APPLICATION :
   - Implémenter Redis pour les données fréquemment accédées
   - Cache des produits par boutique (5 minutes)
   - Cache des sessions de panier (2 minutes)

3. OPTIMISATION REQUÊTES :
   - Utiliser des requêtes préparées
   - Limiter les colonnes sélectionnées
   - Paginer les résultats

4. MAINTENANCE :
   - VACUUM ANALYZE hebdomadaire
   - Nettoyage des logs mensuel
   - Révision des index trimestrielle
*/
>>>>>>> 343236c6a5e55e9ef8f2b1d5cab75ff6f73c9b15
