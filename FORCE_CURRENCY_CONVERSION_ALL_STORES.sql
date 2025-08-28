-- Script pour forcer la conversion des montants existants pour TOUS les stores
-- À exécuter dans l'éditeur SQL de Supabase

-- Variables à modifier
DO $$
DECLARE
    old_currency VARCHAR(3) := 'XOF'; -- Ancienne devise
    new_currency VARCHAR(3) := 'EUR'; -- Nouvelle devise
    conversion_rate DECIMAL;
    store_record RECORD;
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
    
    IF conversion_rate IS NOT NULL THEN
        -- Convertir les prix des produits pour TOUS les stores
        UPDATE products 
        SET price = price * conversion_rate
        WHERE store_id IN (SELECT id FROM stores);
        
        RAISE NOTICE 'Prix des produits convertis pour tous les stores';
        
        -- Convertir les montants des commandes pour TOUS les stores
        UPDATE public_orders 
        SET total_amount = total_amount * conversion_rate
        WHERE store_id IN (SELECT id FROM stores);
        
        RAISE NOTICE 'Montants des commandes convertis pour tous les stores';
        
        -- Convertir les montants des paiements pour TOUS les stores
        UPDATE payments 
        SET amount = amount * conversion_rate
        WHERE store_id IN (SELECT id FROM stores);
        
        RAISE NOTICE 'Montants des paiements convertis pour tous les stores';
        
    ELSE
        RAISE NOTICE 'Aucun taux de conversion trouvé pour % vers %', old_currency, new_currency;
    END IF;
END $$;

-- Vérifier les résultats pour tous les stores
SELECT 
    'Produits' as table_name,
    COUNT(*) as total_count,
    AVG(price) as avg_price,
    MIN(price) as min_price,
    MAX(price) as max_price
FROM products 
UNION ALL
SELECT 
    'Commandes' as table_name,
    COUNT(*) as total_count,
    AVG(total_amount) as avg_amount,
    MIN(total_amount) as min_amount,
    MAX(total_amount) as max_amount
FROM public_orders 
UNION ALL
SELECT 
    'Paiements' as table_name,
    COUNT(*) as total_count,
    AVG(amount) as avg_amount,
    MIN(amount) as min_amount,
    MAX(amount) as max_amount
FROM payments;

-- Afficher les stores et leurs devises actuelles
SELECT 
    s.id as store_id,
    s.name as store_name,
    ms.default_currency as current_currency
FROM stores s
LEFT JOIN market_settings ms ON s.id = ms.store_id
ORDER BY s.created_at DESC;
