-- 🚀 OPTIMISATIONS FRONTEND COMPLÈTES SIMPSHOPY
-- Date: 2025-01-28
-- Objectif: Créer la fonction RPC pour les optimisations frontend

-- =====================================================
-- 1. FONCTION RPC POUR CONFIGURATION DE SESSION OPTIMISÉE
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
  -- Configuration optimisée en une seule fonction
  PERFORM set_config('search_path', p_search_path, true);
  PERFORM set_config('role', p_role, true);
  PERFORM set_config('request.jwt.claims', p_jwt_claims, true);
  PERFORM set_config('request.method', p_method, true);
  PERFORM set_config('request.path', p_path, true);
  PERFORM set_config('request.headers', p_headers, true);
  PERFORM set_config('request.cookies', p_cookies, true);
  
  -- Log pour monitoring
  RAISE NOTICE 'Session configurée: % % %', p_role, p_method, p_path;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 2. FONCTION POUR NETTOYER LES SESSIONS EXPIRÉES
-- =====================================================

CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  -- Nettoyer les sessions de panier expirées
  DELETE FROM cart_sessions 
  WHERE expires_at < NOW() - INTERVAL '7 days';
  
  -- Nettoyer les sessions utilisateur expirées (si table existe)
  -- DELETE FROM user_sessions WHERE expires_at < NOW();
  
  RAISE NOTICE 'Nettoyage des sessions expirées terminé';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 3. FONCTION POUR ANALYSER LES PERFORMANCES
-- =====================================================

CREATE OR REPLACE FUNCTION get_frontend_performance_stats()
RETURNS TABLE (
  metric_name TEXT,
  metric_value TEXT,
  description TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'total_sessions'::TEXT,
    COUNT(*)::TEXT,
    'Nombre total de sessions de panier actives'::TEXT
  FROM cart_sessions
  WHERE expires_at > NOW()
  
  UNION ALL
  
  SELECT 
    'expired_sessions'::TEXT,
    COUNT(*)::TEXT,
    'Nombre de sessions expirées à nettoyer'::TEXT
  FROM cart_sessions
  WHERE expires_at < NOW() - INTERVAL '7 days'
  
  UNION ALL
  
  SELECT 
    'active_stores'::TEXT,
    COUNT(DISTINCT merchant_id)::TEXT,
    'Nombre de boutiques actives'::TEXT
  FROM stores;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 4. INDEX OPTIMISÉS POUR LES REQUÊTES FRONTEND
-- =====================================================

-- Index pour les sessions de panier (optimisation frontend)
CREATE INDEX IF NOT EXISTS idx_cart_sessions_frontend 
ON cart_sessions(session_id, store_id, expires_at);

-- Index pour les stores (optimisation frontend)
CREATE INDEX IF NOT EXISTS idx_stores_frontend 
ON stores(merchant_id, created_at);

-- Index pour les profiles (optimisation frontend)
CREATE INDEX IF NOT EXISTS idx_profiles_frontend 
ON profiles(user_id, created_at);

-- =====================================================
-- 5. VUES OPTIMISÉES POUR LE FRONTEND
-- =====================================================

-- Vue pour les sessions de panier actives
CREATE OR REPLACE VIEW active_cart_sessions_frontend AS
SELECT 
  session_id,
  store_id,
  created_at,
  updated_at,
  expires_at,
  CASE 
    WHEN expires_at > NOW() THEN 'active'
    ELSE 'expired'
  END as status
FROM cart_sessions
WHERE expires_at > NOW() - INTERVAL '1 day';

-- Vue pour les statistiques de performance frontend
CREATE OR REPLACE VIEW frontend_performance_summary AS
SELECT 
  'cart_sessions' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN expires_at > NOW() THEN 1 END) as active_records,
  COUNT(CASE WHEN expires_at < NOW() - INTERVAL '7 days' THEN 1 END) as expired_records
FROM cart_sessions

UNION ALL

SELECT 
  'stores' as table_name,
  COUNT(*) as total_records,
  COUNT(*) as active_records,
  0 as expired_records
FROM stores;

-- =====================================================
-- 6. FONCTION DE MAINTENANCE AUTOMATIQUE
-- =====================================================

CREATE OR REPLACE FUNCTION perform_frontend_maintenance()
RETURNS void AS $$
BEGIN
  -- Nettoyer les sessions expirées
  PERFORM cleanup_expired_sessions();
  
  -- Analyser les tables pour optimiser les requêtes
  ANALYZE cart_sessions;
  ANALYZE stores;
  ANALYZE profiles;
  
  -- Log de maintenance
  RAISE NOTICE 'Maintenance frontend terminée à %', NOW();
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. RAPPORT DE CRÉATION
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '🎉 OPTIMISATIONS FRONTEND CRÉÉES AVEC SUCCÈS!';
  RAISE NOTICE '✅ Fonction configure_session créée';
  RAISE NOTICE '✅ Fonction cleanup_expired_sessions créée';
  RAISE NOTICE '✅ Fonction get_frontend_performance_stats créée';
  RAISE NOTICE '✅ 3 index optimisés créés';
  RAISE NOTICE '✅ 2 vues optimisées créées';
  RAISE NOTICE '✅ Fonction de maintenance créée';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Votre frontend est maintenant optimisé!';
  RAISE NOTICE '📊 Utilisez get_frontend_performance_stats() pour surveiller';
  RAISE NOTICE '🧹 Utilisez perform_frontend_maintenance() pour la maintenance';
END $$;
