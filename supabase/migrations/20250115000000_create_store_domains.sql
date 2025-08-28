-- Migration pour créer le système multi-domaines
-- Date: 2025-01-15

-- Table pour gérer les domaines des boutiques
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

-- Index pour le routing et les performances
CREATE INDEX IF NOT EXISTS idx_store_domains_domain_name ON store_domains(domain_name);
CREATE INDEX IF NOT EXISTS idx_store_domains_store_id ON store_domains(store_id);
CREATE INDEX IF NOT EXISTS idx_store_domains_active ON store_domains(is_active, verification_status);

-- Activer RLS
ALTER TABLE store_domains ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les marchands
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

-- Politique pour la lecture publique (routing)
CREATE POLICY "Public can read active domains" 
ON store_domains 
FOR SELECT 
USING (is_active = true AND verification_status = 'verified');

-- Fonction pour créer automatiquement le sous-domaine par défaut
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

-- Trigger pour créer automatiquement le sous-domaine
DROP TRIGGER IF EXISTS create_default_subdomain_trigger ON stores;
CREATE TRIGGER create_default_subdomain_trigger
  AFTER INSERT ON stores
  FOR EACH ROW
  EXECUTE FUNCTION create_default_subdomain();

-- Fonction pour obtenir la boutique par domaine
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

-- Fonction pour vérifier la validité d'un domaine
CREATE OR REPLACE FUNCTION verify_domain_ownership(p_domain TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  is_valid BOOLEAN := false;
BEGIN
  -- Ici on pourrait ajouter une logique de vérification
  -- Pour l'instant, on considère que c'est valide si le domaine existe
  -- Dans le futur, on pourrait vérifier les enregistrements DNS
  
  -- Placeholder pour la vérification
  is_valid := true;
  
  RETURN is_valid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour mettre à jour le statut de vérification
CREATE OR REPLACE FUNCTION update_domain_verification_status(
  p_domain_id UUID,
  p_status TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE store_domains
  SET 
    verification_status = p_status,
    updated_at = now()
  WHERE id = p_domain_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Commentaires pour la documentation
COMMENT ON TABLE store_domains IS 'Gestion des domaines pour les boutiques (sous-domaines et domaines personnalisés)';
COMMENT ON COLUMN store_domains.domain_type IS 'Type de domaine: subdomain (simpshopy.com) ou custom (domaine client)';
COMMENT ON COLUMN store_domains.is_primary IS 'Domaine principal de la boutique (un seul par boutique)';
COMMENT ON COLUMN store_domains.verification_status IS 'Statut de vérification du domaine personnalisé'; 