-- Script pour forcer la conversion des montants existants
-- À exécuter dans l'éditeur SQL de Supabase

-- Remplacez ces valeurs par votre store_id et les devises
-- Exemple : '75f9d56b-c257-45c2-9165-ac0bbae485fd' pour store_id
-- Exemple : 'XOF' pour oldCurrency et 'EUR' pour newCurrency

-- Variables à modifier
DO $$
DECLARE
    store_id_param UUID := '75f9d56b-c257-45c2-9165-ac0bbae485fd'; -- Remplacez par votre store_id
    old_currency VARCHAR(3) := 'XOF'; -- Ancienne devise
    new_currency VARCHAR(3) := 'EUR'; -- Nouvelle devise
    conversion_rate DECIMAL;
BEGIN
    -- Obtenir le taux de conversion
    SELECT rate INTO conversion_rate
    FROM currency_rates
    WHERE base_currency = old_currency 
    AND target_currency = new_currency
    AND last_updated >= NOW() - INTERVAL '7 days'
    LIMIT 1;
    
    -- Si pas de taux direct, essayer l'inverse
    IF conversion_rate IS NULL THEN
        SELECT 1/rate INTO conversion_rate
        FROM currency_rates
        WHERE base_currency = new_currency 
        AND target_currency = old_currency
        AND last_updated >= NOW() - INTERVAL '7 days'
        LIMIT 1;
    END IF;
    
    -- Afficher le taux trouvé
    RAISE NOTICE 'Taux de conversion % vers %: %', old_currency, new_currency, conversion_rate;
    
    -- Convertir les prix des produits
    IF conversion_rate IS NOT NULL THEN
        UPDATE products 
        SET price = price * conversion_rate
        WHERE store_id = store_id_param;
        
        RAISE NOTICE 'Prix des produits convertis';
        
        -- Convertir les montants des commandes
        UPDATE public_orders 
        SET total_amount = total_amount * conversion_rate
        WHERE store_id = store_id_param;
        
        RAISE NOTICE 'Montants des commandes convertis';
        
        -- Convertir les montants des paiements
        UPDATE payments 
        SET amount = amount * conversion_rate
        WHERE store_id = store_id_param;
        
        RAISE NOTICE 'Montants des paiements convertis';
        
    ELSE
        RAISE NOTICE 'Aucun taux de conversion trouvé pour % vers %', old_currency, new_currency;
    END IF;
END $$;

-- Vérifier les résultats
SELECT 
    'Produits' as table_name,
    COUNT(*) as count,
    AVG(price) as avg_price
FROM products 
WHERE store_id = '75f9d56b-c257-45c2-9165-ac0bbae485fd'
UNION ALL
SELECT 
    'Commandes' as table_name,
    COUNT(*) as count,
    AVG(total_amount) as avg_amount
FROM public_orders 
WHERE store_id = '75f9d56b-c257-45c2-9165-ac0bbae485fd'
UNION ALL
SELECT 
    'Paiements' as table_name,
    COUNT(*) as count,
    AVG(amount) as avg_amount
FROM payments 
WHERE store_id = '75f9d56b-c257-45c2-9165-ac0bbae485fd';
