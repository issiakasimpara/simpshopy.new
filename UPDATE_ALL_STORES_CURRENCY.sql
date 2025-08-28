-- Script pour mettre à jour la devise de TOUS les stores
-- À exécuter dans l'éditeur SQL de Supabase

-- Variables à modifier
DO $$
DECLARE
    new_currency VARCHAR(3) := 'EUR'; -- Nouvelle devise pour tous les stores
    store_record RECORD;
BEGIN
    -- Mettre à jour la devise de tous les stores
    INSERT INTO market_settings (store_id, default_currency, updated_at)
    SELECT 
        s.id as store_id,
        new_currency as default_currency,
        NOW() as updated_at
    FROM stores s
    WHERE NOT EXISTS (
        SELECT 1 FROM market_settings ms WHERE ms.store_id = s.id
    )
    ON CONFLICT (store_id) 
    DO UPDATE SET 
        default_currency = EXCLUDED.default_currency,
        updated_at = NOW();
    
    RAISE NOTICE 'Devise mise à jour vers % pour tous les stores', new_currency;
    
    -- Afficher le nombre de stores mis à jour
    SELECT COUNT(*) INTO store_record
    FROM market_settings 
    WHERE default_currency = new_currency;
    
    RAISE NOTICE 'Nombre de stores avec la devise %: %', new_currency, store_record.count;
END $$;

-- Vérifier les résultats
SELECT 
    ms.default_currency,
    COUNT(*) as nombre_stores
FROM market_settings ms
GROUP BY ms.default_currency
ORDER BY nombre_stores DESC;

-- Afficher tous les stores et leurs devises
SELECT 
    s.id as store_id,
    s.name as store_name,
    COALESCE(ms.default_currency, 'Non défini') as devise
FROM stores s
LEFT JOIN market_settings ms ON s.id = ms.store_id
ORDER BY s.created_at DESC;
