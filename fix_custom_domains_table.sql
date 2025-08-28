-- Ajouter la colonne dns_configured à la table custom_domains
ALTER TABLE custom_domains 
ADD COLUMN IF NOT EXISTS dns_configured BOOLEAN DEFAULT FALSE;

-- Mettre à jour les enregistrements existants
UPDATE custom_domains 
SET dns_configured = verified 
WHERE dns_configured IS NULL;

-- Vérifier la structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'custom_domains' 
ORDER BY ordinal_position; 