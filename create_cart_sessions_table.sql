-- Création de la table cart_sessions pour les paniers abandonnés
CREATE TABLE IF NOT EXISTS cart_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  items JSONB DEFAULT '[]'::jsonb,
  customer_info JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_cart_sessions_session_id ON cart_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_sessions_store_id ON cart_sessions(store_id);
CREATE INDEX IF NOT EXISTS idx_cart_sessions_created_at ON cart_sessions(created_at);

-- RLS (Row Level Security) pour la sécurité
ALTER TABLE cart_sessions ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture des sessions de panier pour les propriétaires de boutique
CREATE POLICY "Users can view their store cart sessions" ON cart_sessions
  FOR SELECT USING (
    store_id IN (
      SELECT id FROM stores WHERE merchant_id = auth.uid()
    )
  );

-- Politique pour permettre l'insertion de sessions de panier
CREATE POLICY "Anyone can insert cart sessions" ON cart_sessions
  FOR INSERT WITH CHECK (true);

-- Politique pour permettre la mise à jour des sessions de panier
CREATE POLICY "Users can update their store cart sessions" ON cart_sessions
  FOR UPDATE USING (
    store_id IN (
      SELECT id FROM stores WHERE merchant_id = auth.uid()
    )
  );

-- Politique pour permettre la suppression des sessions de panier
CREATE POLICY "Users can delete their store cart sessions" ON cart_sessions
  FOR DELETE USING (
    store_id IN (
      SELECT id FROM stores WHERE merchant_id = auth.uid()
    )
  );

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_cart_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_cart_sessions_updated_at
  BEFORE UPDATE ON cart_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_cart_sessions_updated_at();

-- Fonction pour nettoyer automatiquement les sessions expirées
CREATE OR REPLACE FUNCTION cleanup_expired_cart_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM cart_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Commentaires pour la documentation
COMMENT ON TABLE cart_sessions IS 'Sessions de panier pour suivre les paniers abandonnés';
COMMENT ON COLUMN cart_sessions.session_id IS 'Identifiant unique de la session de panier';
COMMENT ON COLUMN cart_sessions.store_id IS 'ID de la boutique associée';
COMMENT ON COLUMN cart_sessions.items IS 'Articles dans le panier au format JSONB';
COMMENT ON COLUMN cart_sessions.customer_info IS 'Informations du client (email, nom, téléphone)';
COMMENT ON COLUMN cart_sessions.expires_at IS 'Date d''expiration de la session (30 jours par défaut)'; 