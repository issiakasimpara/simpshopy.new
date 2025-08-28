-- 🧪 SCRIPT DE TEST SIMPLE
-- Date: 2025-01-28
-- Objectif: Test simple sans problèmes de types

-- =====================================================
-- 1. TEST DES FONCTIONS
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '=== TEST DES FONCTIONS ===';
  
  -- Test configure_session
  BEGIN
    PERFORM configure_session();
    RAISE NOTICE '✅ configure_session OK';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ configure_session: %', SQLERRM;
  END;
  
  -- Test cleanup_expired_sessions
  BEGIN
    PERFORM cleanup_expired_sessions();
    RAISE NOTICE '✅ cleanup_expired_sessions OK';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ cleanup_expired_sessions: %', SQLERRM;
  END;
  
  -- Test get_performance_stats
  BEGIN
    PERFORM * FROM get_performance_stats() LIMIT 1;
    RAISE NOTICE '✅ get_performance_stats OK';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ get_performance_stats: %', SQLERRM;
  END;
  
  -- Test analyze_slow_queries
  BEGIN
    PERFORM * FROM analyze_slow_queries() LIMIT 1;
    RAISE NOTICE '✅ analyze_slow_queries OK';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️ analyze_slow_queries: %', SQLERRM;
  END;
END $$;

-- =====================================================
-- 2. TEST DES VUES
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== TEST DES VUES ===';
  
  -- Test active_cart_sessions
  BEGIN
    PERFORM COUNT(*) FROM active_cart_sessions;
    RAISE NOTICE '✅ active_cart_sessions OK';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ active_cart_sessions: %', SQLERRM;
  END;
  
  -- Test abandoned_cart_stats
  BEGIN
    PERFORM COUNT(*) FROM abandoned_cart_stats;
    RAISE NOTICE '✅ abandoned_cart_stats OK';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ abandoned_cart_stats: %', SQLERRM;
  END;
END $$;

-- =====================================================
-- 3. TEST DES INDEX
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== TEST DES INDEX ===';
  
  -- Compter les index pour cart_sessions
  DECLARE
    cart_index_count INTEGER;
    stores_index_count INTEGER;
    profiles_index_count INTEGER;
  BEGIN
    SELECT COUNT(*) INTO cart_index_count 
    FROM pg_indexes 
    WHERE tablename = 'cart_sessions' AND indexname LIKE 'idx_%';
    
    SELECT COUNT(*) INTO stores_index_count 
    FROM pg_indexes 
    WHERE tablename = 'stores' AND indexname LIKE 'idx_%';
    
    SELECT COUNT(*) INTO profiles_index_count 
    FROM pg_indexes 
    WHERE tablename = 'profiles' AND indexname LIKE 'idx_%';
    
    RAISE NOTICE '📊 Index cart_sessions: %', cart_index_count;
    RAISE NOTICE '📊 Index stores: %', stores_index_count;
    RAISE NOTICE '📊 Index profiles: %', profiles_index_count;
    
    IF cart_index_count >= 4 AND stores_index_count >= 1 AND profiles_index_count >= 1 THEN
      RAISE NOTICE '✅ Tous les index principaux sont créés';
    ELSE
      RAISE NOTICE '⚠️ Certains index sont manquants';
    END IF;
  END;
END $$;

-- =====================================================
-- 4. TEST DES TABLES
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== TEST DES TABLES ===';
  
  -- Vérifier que les tables existent
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cart_sessions') THEN
    RAISE NOTICE '✅ Table cart_sessions existe';
  ELSE
    RAISE NOTICE '❌ Table cart_sessions manquante';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'stores') THEN
    RAISE NOTICE '✅ Table stores existe';
  ELSE
    RAISE NOTICE '❌ Table stores manquante';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
    RAISE NOTICE '✅ Table profiles existe';
  ELSE
    RAISE NOTICE '❌ Table profiles manquante';
  END IF;
END $$;

-- =====================================================
-- 5. RAPPORT FINAL
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== RAPPORT FINAL ===';
  RAISE NOTICE '🎯 Tests terminés!';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Si tous les tests sont OK, les optimisations sont prêtes!';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Prochaines étapes:';
  RAISE NOTICE '  1. Intégrer les hooks optimisés dans le frontend';
  RAISE NOTICE '  2. Tester l''application';
  RAISE NOTICE '  3. Surveiller les performances';
END $$;
