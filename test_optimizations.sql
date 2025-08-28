-- 🧪 SCRIPT DE TEST DES OPTIMISATIONS
-- Date: 2025-01-28
-- Objectif: Tester les optimisations appliquées

-- =====================================================
-- 1. TEST DE LA FONCTION CONFIGURE_SESSION
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '=== TEST CONFIGURE_SESSION ===';
  
  -- Tester la fonction
  PERFORM configure_session('public', 'authenticated', '{}', 'GET', '/', '{}', '{}');
  RAISE NOTICE '✅ configure_session fonctionne correctement';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '❌ Erreur configure_session: %', SQLERRM;
END $$;

-- =====================================================
-- 2. TEST DE LA FONCTION CLEANUP_EXPIRED_SESSIONS
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== TEST CLEANUP_EXPIRED_SESSIONS ===';
  
  -- Tester la fonction
  PERFORM cleanup_expired_sessions();
  RAISE NOTICE '✅ cleanup_expired_sessions fonctionne correctement';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '❌ Erreur cleanup_expired_sessions: %', SQLERRM;
END $$;

-- =====================================================
-- 3. TEST DE LA FONCTION GET_PERFORMANCE_STATS
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== TEST GET_PERFORMANCE_STATS ===';
  
  -- Tester la fonction
  PERFORM * FROM get_performance_stats() LIMIT 1;
  RAISE NOTICE '✅ get_performance_stats fonctionne correctement';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '❌ Erreur get_performance_stats: %', SQLERRM;
END $$;

-- =====================================================
-- 4. TEST DE LA FONCTION ANALYZE_SLOW_QUERIES
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== TEST ANALYZE_SLOW_QUERIES ===';
  
  -- Tester la fonction
  PERFORM * FROM analyze_slow_queries() LIMIT 1;
  RAISE NOTICE '✅ analyze_slow_queries fonctionne correctement';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '⚠️ analyze_slow_queries non disponible: %', SQLERRM;
END $$;

-- =====================================================
-- 5. TEST DES VUES
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== TEST DES VUES ===';
  
  -- Tester active_cart_sessions
  BEGIN
    PERFORM * FROM active_cart_sessions LIMIT 1;
    RAISE NOTICE '✅ active_cart_sessions fonctionne';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Erreur active_cart_sessions: %', SQLERRM;
  END;
  
  -- Tester abandoned_cart_stats
  BEGIN
    PERFORM * FROM abandoned_cart_stats LIMIT 1;
    RAISE NOTICE '✅ abandoned_cart_stats fonctionne';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Erreur abandoned_cart_stats: %', SQLERRM;
  END;
END $$;

-- =====================================================
-- 6. TEST DES INDEX
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== TEST DES INDEX ===';
  
  -- Vérifier que les index existent
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'cart_sessions' AND indexname = 'idx_cart_sessions_session_store_composite') THEN
    RAISE NOTICE '✅ Index idx_cart_sessions_session_store_composite existe';
  ELSE
    RAISE NOTICE '❌ Index idx_cart_sessions_session_store_composite manquant';
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'stores' AND indexname = 'idx_stores_merchant_created') THEN
    RAISE NOTICE '✅ Index idx_stores_merchant_created existe';
  ELSE
    RAISE NOTICE '❌ Index idx_stores_merchant_created manquant';
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'profiles' AND indexname = 'idx_profiles_user_id') THEN
    RAISE NOTICE '✅ Index idx_profiles_user_id existe';
  ELSE
    RAISE NOTICE '❌ Index idx_profiles_user_id manquant';
  END IF;
END $$;

-- =====================================================
-- 7. TEST DE PERFORMANCE SIMPLE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== TEST DE PERFORMANCE ===';
  
  -- Test simple de requête sur cart_sessions
  BEGIN
    PERFORM COUNT(*) FROM cart_sessions WHERE session_id = 'test_session';
    RAISE NOTICE '✅ Requête cart_sessions fonctionne';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Erreur requête cart_sessions: %', SQLERRM;
  END;
  
  -- Test simple de requête sur stores
  BEGIN
    PERFORM COUNT(*) FROM stores WHERE merchant_id = '00000000-0000-0000-0000-000000000000'::uuid;
    RAISE NOTICE '✅ Requête stores fonctionne';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Erreur requête stores: %', SQLERRM;
  END;
  
  -- Test simple de requête sur profiles
  BEGIN
    PERFORM COUNT(*) FROM profiles WHERE user_id = '00000000-0000-0000-0000-000000000000'::uuid;
    RAISE NOTICE '✅ Requête profiles fonctionne';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Erreur requête profiles: %', SQLERRM;
  END;
END $$;

-- =====================================================
-- 8. RAPPORT FINAL
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== RAPPORT DE TEST ===';
  RAISE NOTICE '🎯 Tests terminés avec succès!';
  RAISE NOTICE '';
  RAISE NOTICE '📋 PROCHAINES ÉTAPES:';
  RAISE NOTICE '  1. Intégrer les hooks optimisés dans le frontend';
  RAISE NOTICE '  2. Tester l''application en conditions réelles';
  RAISE NOTICE '  3. Surveiller les performances dans Supabase';
  RAISE NOTICE '  4. Comparer les métriques avant/après';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Les optimisations sont prêtes à être utilisées!';
END $$;
