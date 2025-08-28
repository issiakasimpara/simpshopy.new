-- Script pour vérifier les codes de devises existants
-- Exécutez ceci d'abord pour voir quelles devises sont disponibles

SELECT 'CODES DE DEVISES DISPONIBLES:' as info;
SELECT code, name, symbol, country 
FROM supported_currencies 
WHERE is_active = true 
ORDER BY code;

SELECT 'NOMBRE TOTAL DE DEVISES:' as info;
SELECT COUNT(*) as total_currencies 
FROM supported_currencies 
WHERE is_active = true;
