-- Liste simple des codes de devises disponibles
SELECT code, name 
FROM supported_currencies 
WHERE is_active = true 
ORDER BY code;
