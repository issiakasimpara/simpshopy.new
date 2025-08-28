-- Script pour nettoyer les anciennes tables de conversion
-- À exécuter dans l'éditeur SQL de Supabase

-- Supprimer les anciennes tables de conversion (optionnel)
-- DROP TABLE IF EXISTS currency_rates CASCADE;

-- Supprimer les fonctions PostgreSQL (optionnel)
-- DROP FUNCTION IF EXISTS convert_currency(amount DECIMAL, from_currency VARCHAR(3), to_currency VARCHAR(3));
-- DROP FUNCTION IF EXISTS get_exchange_rate(from_currency VARCHAR(3), to_currency VARCHAR(3));

-- Supprimer les jobs du scheduler (optionnel)
-- SELECT cron.unschedule('update-currency-rates-daily');
-- SELECT cron.unschedule('update-currency-rates-hourly');

-- Vérifier que la table market_settings existe et fonctionne
SELECT 
    'market_settings' as table_name,
    COUNT(*) as record_count
FROM market_settings
UNION ALL
SELECT 
    'stores' as table_name,
    COUNT(*) as record_count
FROM stores;

-- Afficher les stores et leurs devises actuelles
SELECT 
    s.id as store_id,
    s.name as store_name,
    COALESCE(ms.default_currency, 'Non défini') as devise_actuelle
FROM stores s
LEFT JOIN market_settings ms ON s.id = ms.store_id
ORDER BY s.created_at DESC;
