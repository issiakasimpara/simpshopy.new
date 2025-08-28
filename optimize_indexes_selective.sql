-- =====================================================
-- OPTIMISATION SÉLECTIVE DES INDEX (PERFORMANCE)
-- =====================================================

-- 1. SUPPRIMER LES INDEX MOINS IMPORTANTS
-- =====================================================

-- Supprimer les index redondants pour cart_sessions
DROP INDEX IF EXISTS idx_cart_sessions_created_at;
DROP INDEX IF EXISTS idx_cart_sessions_expires_at;

-- Supprimer les index redondants pour products
DROP INDEX IF EXISTS idx_products_sku_store;
DROP INDEX IF EXISTS idx_products_category_store;

-- Supprimer les index redondants pour stores
DROP INDEX IF EXISTS idx_stores_merchant_id;

-- 2. GARDER SEULEMENT LES INDEX CRITIQUES
-- =====================================================

-- Index composite principal pour cart_sessions (le plus utilisé)
-- CREATE INDEX IF NOT EXISTS idx_cart_sessions_session_store_composite 
-- ON cart_sessions(session_id, store_id);

-- Index principal pour products (le plus utilisé)
-- CREATE INDEX IF NOT EXISTS idx_products_store_status_created 
-- ON products(store_id, status, created_at DESC);

-- Index principal pour categories
-- CREATE INDEX IF NOT EXISTS idx_categories_store_id 
-- ON categories(store_id);

-- 3. OPTIMISER LE CACHE (RÉDUIRE)
-- =====================================================

-- Recommandation : Réduire le cache de 5 minutes à 2 minutes
-- Dans useProducts.tsx et useCartSessions.tsx :
-- staleTime: 2 * 60 * 1000, // 2 minutes au lieu de 5

-- 4. NETTOYAGE OPTIMISÉ
-- =====================================================

-- Fonction de nettoyage optimisée (par lots)
CREATE OR REPLACE FUNCTION cleanup_expired_cart_sessions_optimized()
RETURNS void AS $$
DECLARE
  deleted_count INTEGER := 0;
  batch_size INTEGER := 1000;
BEGIN
  LOOP
    DELETE FROM cart_sessions 
    WHERE expires_at < NOW()
    LIMIT batch_size;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    EXIT WHEN deleted_count = 0;
    
    -- Pause pour éviter de bloquer la base
    PERFORM pg_sleep(0.1);
  END LOOP;
  
  RAISE NOTICE 'Nettoyage optimisé terminé';
END;
$$ LANGUAGE plpgsql;

-- 5. VÉRIFICATION DES PERFORMANCES
-- =====================================================

-- Vérifier l'impact des index
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename IN ('cart_sessions', 'products', 'categories')
ORDER BY tablename, indexname;

-- 6. RECOMMANDATIONS DE PERFORMANCE
-- =====================================================

/*
RECOMMANDATIONS POUR ÉVITER LA LENTEUR :

1. INDEX MINIMAUX :
   - Garder seulement 2-3 index par table
   - Supprimer les index redondants
   - Prioriser les requêtes les plus fréquentes

2. CACHE MODÉRÉ :
   - Réduire staleTime à 2 minutes
   - Utiliser cacheTime de 5 minutes
   - Éviter les refetch automatiques

3. NETTOYAGE INTELLIGENT :
   - Nettoyer par petits lots
   - Programmer la nuit (2h du matin)
   - Surveiller l'impact

4. MONITORING :
   - Surveiller les temps de réponse
   - Alerter si > 2 secondes
   - Ajuster selon les besoins
*/
