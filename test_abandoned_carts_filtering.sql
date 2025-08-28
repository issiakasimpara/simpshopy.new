-- Test du filtrage des paniers abandonnés
-- Ce script vérifie que seules les sessions SANS commandes complétées sont considérées comme abandonnées

-- 1. Voir toutes les sessions de panier
SELECT 
    cs.id,
    cs.session_id,
    cs.store_id,
    cs.created_at,
    cs.items,
    cs.customer_info
FROM cart_sessions cs
WHERE cs.store_id = '0ca5be54-d062-4807-a824-6e3a1fb2c292'
ORDER BY cs.created_at DESC;

-- 2. Voir toutes les commandes complétées
SELECT 
    po.id,
    po.order_number,
    po.store_id,
    po.status,
    po.total_amount,
    po.customer_email,
    po.created_at
FROM public_orders po
WHERE po.store_id = '0ca5be54-d062-4807-a824-6e3a1fb2c292'
AND po.status IN ('confirmed', 'processing', 'shipped', 'delivered')
ORDER BY po.created_at DESC;

-- 3. Identifier les sessions avec commandes complétées
-- Nous devons faire correspondre par email du client
SELECT DISTINCT po.customer_email
FROM public_orders po
WHERE po.store_id = '0ca5be54-d062-4807-a824-6e3a1fb2c292'
AND po.status IN ('confirmed', 'processing', 'shipped', 'delivered')
AND po.customer_email IS NOT NULL;

-- 4. Voir les sessions qui devraient être considérées comme abandonnées
-- (sessions avec des articles mais SANS commandes complétées pour le même email)
SELECT 
    cs.id,
    cs.session_id,
    cs.store_id,
    cs.created_at,
    cs.items,
    cs.customer_info,
    CASE 
        WHEN po.customer_email IS NOT NULL THEN 'A UNE COMMANDE COMPLÉTÉE'
        ELSE 'PANIER ABANDONNÉ'
    END as statut
FROM cart_sessions cs
LEFT JOIN (
    SELECT DISTINCT customer_email
    FROM public_orders po
    WHERE po.store_id = '0ca5be54-d062-4807-a824-6e3a1fb2c292'
    AND po.status IN ('confirmed', 'processing', 'shipped', 'delivered')
    AND po.customer_email IS NOT NULL
) po ON (cs.customer_info->>'email')::TEXT = po.customer_email
WHERE cs.store_id = '0ca5be54-d062-4807-a824-6e3a1fb2c292'
AND cs.items != '[]'
AND cs.items IS NOT NULL
ORDER BY cs.created_at DESC;

-- 5. Statistiques finales
SELECT 
    COUNT(*) as total_sessions,
    COUNT(CASE WHEN po.customer_email IS NOT NULL THEN 1 END) as sessions_avec_commandes,
    COUNT(CASE WHEN po.customer_email IS NULL THEN 1 END) as sessions_abandonnees
FROM cart_sessions cs
LEFT JOIN (
    SELECT DISTINCT customer_email
    FROM public_orders po
    WHERE po.store_id = '0ca5be54-d062-4807-a824-6e3a1fb2c292'
    AND po.status IN ('confirmed', 'processing', 'shipped', 'delivered')
    AND po.customer_email IS NOT NULL
) po ON (cs.customer_info->>'email')::TEXT = po.customer_email
WHERE cs.store_id = '0ca5be54-d062-4807-a824-6e3a1fb2c292'
AND cs.items != '[]'
AND cs.items IS NOT NULL;

-- 6. Voir les emails des clients avec commandes complétées
SELECT 
    customer_email,
    COUNT(*) as nombre_commandes,
    SUM(total_amount) as total_achete
FROM public_orders po
WHERE po.store_id = '0ca5be54-d062-4807-a824-6e3a1fb2c292'
AND po.status IN ('confirmed', 'processing', 'shipped', 'delivered')
GROUP BY customer_email
ORDER BY total_achete DESC; 