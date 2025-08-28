-- Migration pour corriger le système de sous-domaines
-- Date: 2025-01-28

-- 1. S'assurer que la table store_domains existe
CREATE TABLE IF NOT EXISTS store_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  domain_type TEXT NOT NULL CHECK (domain_type IN ('subdomain', 'custom')),
  domain_name TEXT NOT NULL UNIQUE,
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Créer les index nécessaires
CREATE INDEX IF NOT EXISTS idx_store_domains_domain_name ON store_domains(domain_name);
CREATE INDEX IF NOT EXISTS idx_store_domains_store_id ON store_domains(store_id);
CREATE INDEX IF NOT EXISTS idx_store_domains_active ON store_domains(is_active, verification_status);

-- 3. Activer RLS
ALTER TABLE store_domains ENABLE ROW LEVEL SECURITY;

-- 4. Politiques RLS pour les marchands
DROP POLICY IF EXISTS "Store owners can manage their domains" ON store_domains;
CREATE POLICY "Store owners can manage their domains" 
ON store_domains 
FOR ALL 
USING (store_id IN (
  SELECT stores.id 
  FROM stores 
  WHERE stores.merchant_id IN (
    SELECT profiles.id 
    FROM profiles 
    WHERE profiles.user_id = auth.uid()
  )
));

-- 5. Politique pour la lecture publique (routing)
DROP POLICY IF EXISTS "Public can read active domains" ON store_domains;
CREATE POLICY "Public can read active domains" 
ON store_domains 
FOR SELECT 
USING (is_active = true AND verification_status = 'verified');

-- 6. Créer les sous-domaines pour toutes les boutiques existantes qui n'en ont pas
INSERT INTO store_domains (
  store_id,
  domain_type,
  domain_name,
  is_primary,
  is_active,
  verification_status
)
SELECT 
  s.id,
  'subdomain',
  s.slug || '.simpshopy.com',
  true,
  true,
  'verified'
FROM stores s
WHERE s.status = 'active'
  AND s.slug IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM store_domains sd 
    WHERE sd.store_id = s.id 
    AND sd.domain_type = 'subdomain'
  );

-- 7. Mettre à jour la fonction get_store_by_domain pour être plus robuste
CREATE OR REPLACE FUNCTION get_store_by_domain(p_domain TEXT)
RETURNS UUID AS $$
DECLARE
  store_uuid UUID;
BEGIN
  -- Vérifier si c'est un domaine personnalisé
  SELECT store_id INTO store_uuid
  FROM store_domains
  WHERE domain_name = p_domain
    AND domain_type = 'custom'
    AND is_active = true
    AND verification_status = 'verified'
  LIMIT 1;

  -- Si trouvé, retourner
  IF store_uuid IS NOT NULL THEN
    RETURN store_uuid;
  END IF;

  -- Vérifier si c'est un sous-domaine simpshopy.com
  IF p_domain LIKE '%.simpshopy.com' THEN
    SELECT store_id INTO store_uuid
    FROM store_domains
    WHERE domain_name = p_domain
      AND domain_type = 'subdomain'
      AND is_active = true
      AND verification_status = 'verified'
    LIMIT 1;
  END IF;

  RETURN store_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Fonction pour créer automatiquement le sous-domaine par défaut
CREATE OR REPLACE FUNCTION create_default_subdomain()
RETURNS TRIGGER AS $$
BEGIN
  -- Créer automatiquement le sous-domaine basé sur le slug de la boutique
  INSERT INTO store_domains (
    store_id,
    domain_type,
    domain_name,
    is_primary,
    is_active,
    verification_status
  ) VALUES (
    NEW.id,
    'subdomain',
    NEW.slug || '.simpshopy.com',
    true,
    true,
    'verified'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Trigger pour créer automatiquement le sous-domaine
DROP TRIGGER IF EXISTS create_default_subdomain_trigger ON stores;
CREATE TRIGGER create_default_subdomain_trigger
  AFTER INSERT ON stores
  FOR EACH ROW
  EXECUTE FUNCTION create_default_subdomain();

-- 10. Fonction pour nettoyer les domaines orphelins
CREATE OR REPLACE FUNCTION cleanup_orphaned_domains()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM store_domains
  WHERE store_id NOT IN (SELECT id FROM stores);
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Exécuter le nettoyage
SELECT cleanup_orphaned_domains();

-- 12. Commentaires pour la documentation
COMMENT ON TABLE store_domains IS 'Gestion des domaines pour les boutiques (sous-domaines et domaines personnalisés)';
COMMENT ON COLUMN store_domains.domain_type IS 'Type de domaine: subdomain (simpshopy.com) ou custom (domaine client)';
COMMENT ON COLUMN store_domains.is_primary IS 'Domaine principal de la boutique (un seul par boutique)';
COMMENT ON COLUMN store_domains.verification_status IS 'Statut de vérification du domaine personnalisé';

-- 13. Log des domaines créés
DO $$
DECLARE
  domain_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO domain_count FROM store_domains WHERE domain_type = 'subdomain';
  RAISE NOTICE 'Migration terminée: % sous-domaines créés', domain_count;
END $$;
