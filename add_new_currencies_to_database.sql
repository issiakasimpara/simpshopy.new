-- Script pour ajouter les nouvelles devises à la base de données
-- Ce script met à jour les contraintes et ajoute les nouvelles devises

-- 1. Vérifier si la table market_settings existe et ajouter les nouvelles devises
DO $$
BEGIN
    -- Ajouter les nouvelles devises à la contrainte si elle existe
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'market_settings_currency_check' 
        AND table_name = 'market_settings'
    ) THEN
        -- Supprimer l'ancienne contrainte
        ALTER TABLE market_settings DROP CONSTRAINT market_settings_currency_check;
        
        -- Recréer la contrainte avec toutes les devises
        ALTER TABLE market_settings ADD CONSTRAINT market_settings_currency_check 
        CHECK (default_currency IN (
            'XOF', 'XAF', 'GHS', 'NGN', 'EUR', 'USD', 'GBP', 'JPY', 'CAD', 'AUD',
            'CHF', 'CNY', 'INR', 'BRL', 'MXN', 'ZAR', 'EGP', 'KES', 'UGX', 'TZS'
        ));
        
        RAISE NOTICE 'Contrainte market_settings_currency_check mise à jour avec les nouvelles devises';
    ELSE
        RAISE NOTICE 'Contrainte market_settings_currency_check non trouvée, création...';
        ALTER TABLE market_settings ADD CONSTRAINT market_settings_currency_check 
        CHECK (default_currency IN (
            'XOF', 'XAF', 'GHS', 'NGN', 'EUR', 'USD', 'GBP', 'JPY', 'CAD', 'AUD',
            'CHF', 'CNY', 'INR', 'BRL', 'MXN', 'ZAR', 'EGP', 'KES', 'UGX', 'TZS'
        ));
    END IF;
END $$;

-- 2. Mettre à jour les entrées existantes dans market_settings pour s'assurer qu'elles utilisent des devises valides
UPDATE market_settings 
SET default_currency = 'XOF' 
WHERE default_currency NOT IN (
    'XOF', 'XAF', 'GHS', 'NGN', 'EUR', 'USD', 'GBP', 'JPY', 'CAD', 'AUD',
    'CHF', 'CNY', 'INR', 'BRL', 'MXN', 'ZAR', 'EGP', 'KES', 'UGX', 'TZS'
);

-- 3. Vérifier que toutes les entrées market_settings ont une devise valide
SELECT 
    store_id,
    default_currency,
    CASE 
        WHEN default_currency IN ('XOF', 'XAF', 'GHS', 'NGN', 'EUR', 'USD', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL', 'MXN', 'ZAR', 'EGP', 'KES', 'UGX', 'TZS') 
        THEN '✅ Valide' 
        ELSE '❌ Invalide' 
    END as status
FROM market_settings;

-- 4. Afficher un résumé des devises supportées
SELECT 'Devises supportées dans la base de données:' as info;
SELECT unnest(ARRAY[
    'XOF', 'XAF', 'GHS', 'NGN', 'EUR', 'USD', 'GBP', 'JPY', 'CAD', 'AUD',
    'CHF', 'CNY', 'INR', 'BRL', 'MXN', 'ZAR', 'EGP', 'KES', 'UGX', 'TZS'
]) as supported_currency
ORDER BY supported_currency;

-- 5. Vérifier les contraintes actuelles
SELECT 
    tc.constraint_name,
    tc.table_name,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'market_settings' 
AND tc.constraint_type = 'CHECK';
