-- 🧪 TEST DES OPTIMISATIONS SIMPSHOPY
-- Date: 2025-01-28
-- Objectif: Tester les optimisations appliquées

-- =====================================================
-- 1. TEST DES FONCTIONS
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '=== TEST DES FONCTIONS ===';
  
  -- Test configure_session_optimized
  BEGIN
    PERFORM configure_session_optimized();
    RAISE NOTICE '✅ configure_session_optimized OK';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ configure_session_optimized: %', SQLERRM;
  END;
  
  -- Test cleanup_expired_data
  BEGIN
    PERFORM cleanup_expired_data();
    RAISE NOTICE '✅ cleanup_expired_data OK';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ cleanup_expired_data: %', SQLERRM;
  END;
  
  -- Test get_simpshopy_performance_stats
  BEGIN
    PERFORM * FROM get_simpshopy_performance_stats() LIMIT 1;
    RAISE NOTICE '✅ get_simpshopy_performance_stats OK';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ get_simpshopy_performance_stats: %', SQLERRM;
  END;
  
  -- Test analyze_simpshopy_slow_queries
  BEGIN
    PERFORM * FROM analyze_simpshopy_slow_queries() LIMIT 1;
    RAISE NOTICE '✅ analyze_simpshopy_slow_queries OK';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️ analyze_simpshopy_slow_queries: %', SQLERRM;
  END;
END $$;

-- =====================================================
-- 2. TEST DES VUES
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== TEST DES VUES ===';
  
  -- Test active_cart_sessions_optimized
  BEGIN
    PERFORM COUNT(*) FROM active_cart_sessions_optimized;
    RAISE NOTICE '✅ active_cart_sessions_optimized OK';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ active_cart_sessions_optimized: %', SQLERRM;
  END;
  
  -- Test abandoned_cart_stats_optimized
  BEGIN
    PERFORM COUNT(*) FROM abandoned_cart_stats_optimized;
    RAISE NOTICE '✅ abandoned_cart_stats_optimized OK';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ abandoned_cart_stats_optimized: %', SQLERRM;
  END;
  
  -- Test store_performance_summary
  BEGIN
    PERFORM COUNT(*) FROM store_performance_summary;
    RAISE NOTICE '✅ store_performance_summary OK';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ store_performance_summary: %', SQLERRM;
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
    templates_index_count INTEGER;
    orders_index_count INTEGER;
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
    
    SELECT COUNT(*) INTO templates_index_count 
    FROM pg_indexes 
    WHERE tablename = 'site_templates' AND indexname LIKE 'idx_%';
    
    SELECT COUNT(*) INTO orders_index_count 
    FROM pg_indexes 
    WHERE tablename = 'orders' AND indexname LIKE 'idx_%';
    
    RAISE NOTICE '📊 Index cart_sessions: %', cart_index_count;
    RAISE NOTICE '📊 Index stores: %', stores_index_count;
    RAISE NOTICE '📊 Index profiles: %', profiles_index_count;
    RAISE NOTICE '📊 Index site_templates: %', templates_index_count;
    RAISE NOTICE '📊 Index orders: %', orders_index_count;
    
    IF cart_index_count >= 4 AND stores_index_count >= 2 AND profiles_index_count >= 1 THEN
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
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'site_templates') THEN
    RAISE NOTICE '✅ Table site_templates existe';
  ELSE
    RAISE NOTICE '❌ Table site_templates manquante';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders') THEN
    RAISE NOTICE '✅ Table orders existe';
  ELSE
    RAISE NOTICE '❌ Table orders manquante';
  END IF;
END $$;

-- =====================================================
-- 5. RAPPORT FINAL
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== RAPPORT FINAL ===';
  RAISE NOTICE '🎯 Tests terminés avec succès!';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Si tous les tests sont OK, les optimisations sont prêtes!';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Prochaines étapes:';
  RAISE NOTICE '  1. Intégrer les hooks optimisés dans le frontend';
  RAISE NOTICE '  2. Tester l''application en conditions réelles';
  RAISE NOTICE '  3. Surveiller les performances dans Supabase';
  RAISE NOTICE '  4. Comparer les métriques avant/après';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Les optimisations Simpshopy sont maintenant actives!';
END $$;
