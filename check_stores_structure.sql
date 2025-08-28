-- Vérifier la structure de la table stores
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'stores' 
ORDER BY ordinal_position;

-- Vérifier aussi la table profiles
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position; 