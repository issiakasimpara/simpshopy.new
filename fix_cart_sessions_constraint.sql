-- Nettoyer les doublons dans cart_sessions avant d'ajouter la contrainte unique

-- 1. Identifier les doublons
SELECT session_id, store_id, COUNT(*) as count
FROM cart_sessions 
GROUP BY session_id, store_id 
HAVING COUNT(*) > 1;

-- 2. Supprimer les doublons en gardant seulement le plus récent
DELETE FROM cart_sessions 
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY session_id, store_id 
             ORDER BY updated_at DESC
           ) as rn
    FROM cart_sessions
  ) t
  WHERE t.rn > 1
);

-- 3. Vérifier qu'il n'y a plus de doublons
SELECT session_id, store_id, COUNT(*) as count
FROM cart_sessions 
GROUP BY session_id, store_id 
HAVING COUNT(*) > 1;

-- 4. Ajouter la contrainte unique
ALTER TABLE cart_sessions DROP CONSTRAINT IF EXISTS cart_sessions_session_id_store_id_key;

ALTER TABLE cart_sessions ADD CONSTRAINT cart_sessions_session_id_store_id_key 
UNIQUE (session_id, store_id);

-- 5. Vérifier que la contrainte a été ajoutée
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'cart_sessions' 
    AND tc.constraint_type = 'UNIQUE'; 