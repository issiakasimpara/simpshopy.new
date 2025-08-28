-- Ajouter les champs manquants à la table orders pour supporter le système de commandes complet

-- Ajouter les champs pour les informations client
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT,
ADD COLUMN IF NOT EXISTS customer_address TEXT,
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;

-- Créer un index pour les recherches par email client
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);

-- Créer un index pour les recherches par numéro de commande
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);

-- Créer un index pour les recherches par boutique et statut
CREATE INDEX IF NOT EXISTS idx_orders_store_status ON public.orders(store_id, status);

-- Créer un index pour les recherches par date
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Mettre à jour les politiques RLS pour permettre aux marchands de voir leurs commandes
DROP POLICY IF EXISTS "Store owners can manage their orders" ON public.orders;

CREATE POLICY "Store owners can manage their orders" 
ON public.orders 
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

-- Politique pour permettre aux clients de voir leurs commandes par email (lecture seule)
CREATE POLICY "Customers can view their orders by email" 
ON public.orders 
FOR SELECT 
USING (customer_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Fonction pour créer une commande avec toutes les informations
CREATE OR REPLACE FUNCTION create_order_with_customer_info(
  p_store_id UUID,
  p_order_number TEXT,
  p_customer_email TEXT,
  p_customer_name TEXT,
  p_customer_phone TEXT DEFAULT NULL,
  p_customer_address TEXT DEFAULT NULL,
  p_items JSONB DEFAULT '[]'::jsonb,
  p_total_amount NUMERIC DEFAULT 0,
  p_subtotal NUMERIC DEFAULT 0,
  p_tax_amount NUMERIC DEFAULT 0,
  p_shipping_amount NUMERIC DEFAULT 0,
  p_currency TEXT DEFAULT 'CFA',
  p_payment_method TEXT DEFAULT 'card',
  p_shipping_address JSONB DEFAULT NULL,
  p_billing_address JSONB DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_order_id UUID;
BEGIN
  INSERT INTO public.orders (
    store_id,
    order_number,
    customer_email,
    customer_name,
    customer_phone,
    customer_address,
    items,
    total_amount,
    subtotal,
    tax_amount,
    shipping_amount,
    currency,
    payment_method,
    payment_status,
    status,
    shipping_address,
    billing_address,
    notes
  ) VALUES (
    p_store_id,
    p_order_number,
    p_customer_email,
    p_customer_name,
    p_customer_phone,
    p_customer_address,
    p_items,
    p_total_amount,
    p_subtotal,
    p_tax_amount,
    p_shipping_amount,
    p_currency,
    p_payment_method,
    'pending',
    'pending',
    p_shipping_address,
    p_billing_address,
    p_notes
  ) RETURNING id INTO new_order_id;
  
  RETURN new_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour mettre à jour le statut d'une commande
CREATE OR REPLACE FUNCTION update_order_status(
  p_order_id UUID,
  p_status TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.orders 
  SET 
    status = p_status::order_status,
    updated_at = now()
  WHERE id = p_order_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour mettre à jour le statut de paiement
CREATE OR REPLACE FUNCTION update_payment_status(
  p_order_id UUID,
  p_payment_status TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.orders 
  SET 
    payment_status = p_payment_status,
    updated_at = now()
  WHERE id = p_order_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les statistiques d'une boutique
CREATE OR REPLACE FUNCTION get_store_stats(p_store_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
  today_date DATE := CURRENT_DATE;
BEGIN
  SELECT json_build_object(
    'totalRevenue', COALESCE(SUM(total_amount), 0),
    'totalOrders', COUNT(*),
    'pendingOrders', COUNT(*) FILTER (WHERE status = 'pending'),
    'completedOrders', COUNT(*) FILTER (WHERE status = 'delivered'),
    'todayOrders', COUNT(*) FILTER (WHERE DATE(created_at) = today_date),
    'todayRevenue', COALESCE(SUM(total_amount) FILTER (WHERE DATE(created_at) = today_date), 0)
  ) INTO result
  FROM public.orders
  WHERE store_id = p_store_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
