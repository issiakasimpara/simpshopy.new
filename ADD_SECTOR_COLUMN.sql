-- Script pour ajouter la colonne sector à la table user_onboarding
-- Exécutez ce script dans votre base de données Supabase

-- 1. Ajouter la colonne sector
ALTER TABLE user_onboarding 
ADD COLUMN IF NOT EXISTS sector VARCHAR(50);

-- 2. Ajouter un commentaire pour documenter la colonne
COMMENT ON COLUMN user_onboarding.sector IS 'Secteur d''activité choisi par l''utilisateur (technology, fashion, food, health, education, entertainment, other)';

-- 3. Vérifier que la colonne a été ajoutée
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_onboarding' 
AND column_name = 'sector';

-- 4. Afficher la structure actuelle de la table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_onboarding'
ORDER BY ordinal_position;
