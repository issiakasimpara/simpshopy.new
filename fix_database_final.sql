-- Script final pour corriger la table custom_domains
-- À exécuter dans Supabase SQL Editor

-- 1. Ajouter la colonne dns_configured si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'custom_domains' 
        AND column_name = 'dns_configured'
    ) THEN
        ALTER TABLE custom_domains ADD COLUMN dns_configured BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Colonne dns_configured ajoutée';
    ELSE
        RAISE NOTICE 'Colonne dns_configured existe déjà';
    END IF;
END $$;

-- 2. Mettre à jour les enregistrements existants
UPDATE custom_domains 
SET dns_configured = verified 
WHERE dns_configured IS NULL;

-- 3. Vérifier la structure finale
SELECT 
    'Structure de la table custom_domains:' as info,
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'custom_domains' 
ORDER BY ordinal_position;

-- 4. Afficher les domaines existants
SELECT 
    'Domaines existants:' as info,
    id,
    custom_domain,
    verified,
    ssl_enabled,
    dns_configured,
    created_at
FROM custom_domains 
ORDER BY created_at DESC; 