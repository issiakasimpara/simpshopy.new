-- Créer la table pour les paramètres de marché
CREATE TABLE public.market_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  enabled_countries TEXT[] NOT NULL DEFAULT '{}',
  default_currency TEXT NOT NULL DEFAULT 'XOF',
  tax_settings JSONB DEFAULT '{
    "includeTax": false,
    "taxRate": 0,
    "taxLabel": "TVA"
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contrainte pour s'assurer qu'il n'y a qu'un seul paramètre par boutique
  UNIQUE(store_id)
);

-- Créer la table pour les méthodes de livraison
CREATE TABLE public.shipping_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  estimated_days TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '📦',
  is_active BOOLEAN NOT NULL DEFAULT true,
  conditions JSONB DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer la table pour les zones de livraison (optionnel pour plus tard)
CREATE TABLE public.shipping_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  countries TEXT[] NOT NULL DEFAULT '{}',
  shipping_methods UUID[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer les index pour améliorer les performances
CREATE INDEX idx_market_settings_store_id ON public.market_settings(store_id);
CREATE INDEX idx_shipping_methods_store_id ON public.shipping_methods(store_id);
CREATE INDEX idx_shipping_methods_active ON public.shipping_methods(store_id, is_active);
CREATE INDEX idx_shipping_zones_store_id ON public.shipping_zones(store_id);

-- Activer RLS (Row Level Security)
ALTER TABLE public.market_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS pour market_settings
CREATE POLICY "Users can view their own market settings" ON public.market_settings
  FOR SELECT USING (
    store_id IN (
      SELECT id FROM public.stores WHERE merchant_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own market settings" ON public.market_settings
  FOR INSERT WITH CHECK (
    store_id IN (
      SELECT id FROM public.stores WHERE merchant_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own market settings" ON public.market_settings
  FOR UPDATE USING (
    store_id IN (
      SELECT id FROM public.stores WHERE merchant_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own market settings" ON public.market_settings
  FOR DELETE USING (
    store_id IN (
      SELECT id FROM public.stores WHERE merchant_id = auth.uid()
    )
  );

-- Créer les politiques RLS pour shipping_methods
CREATE POLICY "Users can view their own shipping methods" ON public.shipping_methods
  FOR SELECT USING (
    store_id IN (
      SELECT id FROM public.stores WHERE merchant_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own shipping methods" ON public.shipping_methods
  FOR INSERT WITH CHECK (
    store_id IN (
      SELECT id FROM public.stores WHERE merchant_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own shipping methods" ON public.shipping_methods
  FOR UPDATE USING (
    store_id IN (
      SELECT id FROM public.stores WHERE merchant_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own shipping methods" ON public.shipping_methods
  FOR DELETE USING (
    store_id IN (
      SELECT id FROM public.stores WHERE merchant_id = auth.uid()
    )
  );

-- Créer les politiques RLS pour shipping_zones
CREATE POLICY "Users can view their own shipping zones" ON public.shipping_zones
  FOR SELECT USING (
    store_id IN (
      SELECT id FROM public.stores WHERE merchant_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own shipping zones" ON public.shipping_zones
  FOR INSERT WITH CHECK (
    store_id IN (
      SELECT id FROM public.stores WHERE merchant_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own shipping zones" ON public.shipping_zones
  FOR UPDATE USING (
    store_id IN (
      SELECT id FROM public.stores WHERE merchant_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own shipping zones" ON public.shipping_zones
  FOR DELETE USING (
    store_id IN (
      SELECT id FROM public.stores WHERE merchant_id = auth.uid()
    )
  );

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Créer les triggers pour updated_at
CREATE TRIGGER update_market_settings_updated_at 
  BEFORE UPDATE ON public.market_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipping_methods_updated_at 
  BEFORE UPDATE ON public.shipping_methods 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipping_zones_updated_at 
  BEFORE UPDATE ON public.shipping_zones 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insérer des données de test (optionnel)
-- Vous pouvez décommenter ces lignes pour avoir des données de test

/*
-- Exemple de paramètres de marché pour une boutique de test
INSERT INTO public.market_settings (store_id, enabled_countries, default_currency, tax_settings)
VALUES (
  (SELECT id FROM public.stores LIMIT 1),
  ARRAY['BF', 'CI', 'SN', 'ML'],
  'XOF',
  '{
    "includeTax": false,
    "taxRate": 18,
    "taxLabel": "TVA"
  }'::jsonb
);

-- Exemples de méthodes de livraison
INSERT INTO public.shipping_methods (store_id, name, description, price, estimated_days, icon, conditions)
VALUES 
  (
    (SELECT id FROM public.stores LIMIT 1),
    'Livraison standard',
    'Livraison par transporteur local dans les principales villes',
    2500,
    '3-7 jours',
    '📦',
    '{
      "minOrderAmount": 5000,
      "freeShippingThreshold": 25000
    }'::jsonb
  ),
  (
    (SELECT id FROM public.stores LIMIT 1),
    'Livraison express',
    'Livraison rapide en 24-48h dans les grandes villes',
    5000,
    '1-2 jours',
    '⚡',
    '{
      "minOrderAmount": 10000
    }'::jsonb
  ),
  (
    (SELECT id FROM public.stores LIMIT 1),
    'Retrait en magasin',
    'Récupération directe dans notre boutique',
    0,
    'Immédiat',
    '🏪',
    NULL
  );
*/
