-- Script de test pour vérifier que les nouvelles devises fonctionnent
-- Ce script teste le changement de devise pour toutes les nouvelles devises

-- 1. Vérifier la contrainte actuelle
SELECT 
    tc.constraint_name,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'market_settings' 
AND tc.constraint_type = 'CHECK'
AND tc.constraint_name = 'market_settings_currency_check';

-- 2. Tester l'insertion/mise à jour avec les nouvelles devises
-- Récupérer le premier store_id pour les tests
DO $$
DECLARE
    test_store_id UUID;
    test_currency TEXT;
    currencies_to_test TEXT[] := ARRAY[
        'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL', 'MXN', 'ZAR', 'EGP', 'KES', 'UGX', 'TZS'
    ];
BEGIN
    -- Récupérer le premier store_id
    SELECT id INTO test_store_id FROM stores LIMIT 1;
    
    IF test_store_id IS NULL THEN
        RAISE NOTICE 'Aucun store trouvé pour les tests';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Tests avec store_id: %', test_store_id;
    
    -- Tester chaque nouvelle devise
    FOREACH test_currency IN ARRAY currencies_to_test
    LOOP
        BEGIN
            -- Essayer de mettre à jour la devise
            UPDATE market_settings 
            SET default_currency = test_currency,
                updated_at = NOW()
            WHERE store_id = test_store_id;
            
            RAISE NOTICE '✅ Devise % mise à jour avec succès', test_currency;
            
            -- Vérifier que la mise à jour a fonctionné
            SELECT default_currency INTO test_currency 
            FROM market_settings 
            WHERE store_id = test_store_id;
            
            RAISE NOTICE '   Devise actuelle: %', test_currency;
            
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE '❌ Erreur avec la devise %: %', test_currency, SQLERRM;
        END;
    END LOOP;
    
    -- Remettre XOF comme devise par défaut
    UPDATE market_settings 
    SET default_currency = 'XOF',
        updated_at = NOW()
    WHERE store_id = test_store_id;
    
    RAISE NOTICE '✅ Tests terminés, devise remise à XOF';
END $$;

-- 3. Afficher le statut final
SELECT 
    store_id,
    default_currency,
    updated_at,
    CASE 
        WHEN default_currency IN ('XOF', 'XAF', 'GHS', 'NGN', 'EUR', 'USD', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL', 'MXN', 'ZAR', 'EGP', 'KES', 'UGX', 'TZS') 
        THEN '✅ Valide' 
        ELSE '❌ Invalide' 
    END as status
FROM market_settings
ORDER BY updated_at DESC;
