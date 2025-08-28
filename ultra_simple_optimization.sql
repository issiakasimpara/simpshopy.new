-- 🚀 OPTIMISATION ULTRA-SIMPLE SIMPSHOPY
-- Date: 2025-01-28
-- Objectif: Optimisations de base qui fonctionnent à coup sûr

-- =====================================================
-- 1. INDEX DE BASE POUR CART_SESSIONS
-- =====================================================

-- Index simple pour les requêtes principales
CREATE INDEX IF NOT EXISTS idx_cart_sessions_basic 
ON cart_sessions(session_id);

-- Index pour les stores
CREATE INDEX IF NOT EXISTS idx_stores_basic 
ON stores(merchant_id);

-- Index pour les profiles
CREATE INDEX IF NOT EXISTS idx_profiles_basic 
ON profiles(user_id);

-- =====================================================
-- 2. FONCTION SIMPLE DE CONFIGURATION
-- =====================================================

CREATE OR REPLACE FUNCTION simple_configure_session()
RETURNS void AS $$
BEGIN
  PERFORM set_config('search_path', 'public', true);
  PERFORM set_config('role', 'authenticated', true);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 3. FONCTION SIMPLE DE NETTOYAGE
-- =====================================================

CREATE OR REPLACE FUNCTION simple_cleanup()
RETURNS void AS $$
BEGIN
  DELETE FROM cart_sessions 
  WHERE expires_at < NOW() - INTERVAL '7 days';
  
  RAISE NOTICE 'Nettoyage simple terminé';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 4. ANALYSE DES TABLES
-- =====================================================

ANALYZE cart_sessions;
ANALYZE stores;
ANALYZE profiles;

-- =====================================================
-- 5. RAPPORT SIMPLE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '🎉 OPTIMISATION ULTRA-SIMPLE TERMINÉE!';
  RAISE NOTICE '✅ 3 index créés';
  RAISE NOTICE '✅ 2 fonctions créées';
  RAISE NOTICE '✅ Tables analysées';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Votre base de données est maintenant optimisée!';
END $$;
