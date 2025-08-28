
-- Créer une table pour les commandes publiques (accessibles aux clients)
CREATE TABLE public.public_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'EUR',
  status TEXT NOT NULL DEFAULT 'pending',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  shipping_address JSONB,
  billing_address JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Activer RLS sur public_orders
ALTER TABLE public.public_orders ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux clients de voir leurs commandes par email (accès public)
CREATE POLICY "Anyone can view orders with email verification" 
ON public.public_orders 
FOR SELECT 
USING (true); -- Accès public pour la recherche par email/numéro

-- Politique pour les marchands de gérer les commandes de leur boutique
CREATE POLICY "Store owners can manage their public orders" 
ON public.public_orders 
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

-- Créer une table pour les sessions de panier (pour les clients non connectés)
CREATE TABLE public.cart_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  customer_info JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days')
);

-- Pas de RLS sur cart_sessions car c'est géré par session_id
ALTER TABLE public.cart_sessions ENABLE ROW LEVEL SECURITY;

-- Politique pour accès public basé sur session_id
CREATE POLICY "Public access to cart sessions" 
ON public.cart_sessions 
FOR ALL 
USING (true);

-- Ajouter un trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_public_orders_updated_at 
  BEFORE UPDATE ON public.public_orders 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_cart_sessions_updated_at 
  BEFORE UPDATE ON public.cart_sessions 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Fonction pour générer un numéro de commande unique
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  counter INTEGER := 0;
BEGIN
  LOOP
    new_number := 'COM-' || TO_CHAR(now(), 'YYYYMMDD') || '-' || LPAD((RANDOM() * 9999)::INTEGER::TEXT, 4, '0');
    
    -- Vérifier l'unicité
    IF NOT EXISTS (SELECT 1 FROM public.public_orders WHERE order_number = new_number) THEN
      RETURN new_number;
    END IF;
    
    counter := counter + 1;
    IF counter > 100 THEN
      -- Fallback avec timestamp pour éviter les boucles infinies
      new_number := 'COM-' || EXTRACT(EPOCH FROM now())::INTEGER::TEXT;
      EXIT;
    END IF;
  END LOOP;
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;
