-- ========================================
-- SYSTÈME MARCHÉS ET LIVRAISONS (COMME SHOPIFY)
-- Migration complète pour le système de livraison
-- ========================================

-- 1. TABLE MARKETS (Zones de vente)
CREATE TABLE IF NOT EXISTS public.markets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    countries TEXT[] NOT NULL DEFAULT '{}', -- Ex: ['ML', 'CI', 'SN']
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLE SHIPPING_METHODS (Méthodes de livraison)
CREATE TABLE IF NOT EXISTS public.shipping_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    market_id UUID NOT NULL REFERENCES public.markets(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    estimated_min_days INTEGER DEFAULT 1,
    estimated_max_days INTEGER DEFAULT 7,
    is_active BOOLEAN DEFAULT TRUE,
    conditions JSONB DEFAULT NULL, -- {"free_over": 10000, "max_weight": 2}
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLE SHIPPING_ADDRESSES (Adresses de livraison)
CREATE TABLE IF NOT EXISTS public.shipping_addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    country VARCHAR(10) NOT NULL,
    city VARCHAR(255),
    address_line TEXT,
    postal_code VARCHAR(20),
    phone VARCHAR(30),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. INDEXES POUR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_markets_store_id ON public.markets(store_id);
CREATE INDEX IF NOT EXISTS idx_shipping_methods_store_id ON public.shipping_methods(store_id);
CREATE INDEX IF NOT EXISTS idx_shipping_methods_market_id ON public.shipping_methods(market_id);
CREATE INDEX IF NOT EXISTS idx_shipping_methods_active ON public.shipping_methods(is_active);
CREATE INDEX IF NOT EXISTS idx_shipping_addresses_order_id ON public.shipping_addresses(order_id);

-- 5. CONTRAINTES
ALTER TABLE public.markets ADD CONSTRAINT markets_name_store_unique UNIQUE(store_id, name);
ALTER TABLE public.shipping_methods ADD CONSTRAINT shipping_methods_name_market_unique UNIQUE(market_id, name);

-- 6. RLS (Row Level Security)
ALTER TABLE public.markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_addresses ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour markets
CREATE POLICY "Users can view markets of their stores" ON public.markets
    FOR SELECT USING (
        store_id IN (
            SELECT s.id FROM public.stores s
            JOIN public.profiles p ON s.merchant_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage markets of their stores" ON public.markets
    FOR ALL USING (
        store_id IN (
            SELECT s.id FROM public.stores s
            JOIN public.profiles p ON s.merchant_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Politiques RLS pour shipping_methods
CREATE POLICY "Users can view shipping methods of their stores" ON public.shipping_methods
    FOR SELECT USING (
        store_id IN (
            SELECT s.id FROM public.stores s
            JOIN public.profiles p ON s.merchant_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage shipping methods of their stores" ON public.shipping_methods
    FOR ALL USING (
        store_id IN (
            SELECT s.id FROM public.stores s
            JOIN public.profiles p ON s.merchant_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Politiques RLS pour shipping_addresses (lecture publique pour checkout)
CREATE POLICY "Anyone can read shipping addresses" ON public.shipping_addresses
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create shipping addresses" ON public.shipping_addresses
    FOR INSERT WITH CHECK (true);

-- 7. FONCTIONS UTILITAIRES
CREATE OR REPLACE FUNCTION get_available_shipping_methods(
    p_store_id UUID,
    p_country TEXT
)
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    description TEXT,
    price DECIMAL(10,2),
    estimated_min_days INTEGER,
    estimated_max_days INTEGER,
    estimated_days TEXT,
    market_name VARCHAR(255)
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sm.id,
        sm.name,
        sm.description,
        sm.price,
        sm.estimated_min_days,
        sm.estimated_max_days,
        CASE 
            WHEN sm.estimated_min_days = sm.estimated_max_days THEN 
                sm.estimated_min_days::TEXT || ' jour' || CASE WHEN sm.estimated_min_days > 1 THEN 's' ELSE '' END
            ELSE 
                sm.estimated_min_days::TEXT || '-' || sm.estimated_max_days::TEXT || ' jours'
        END as estimated_days,
        m.name as market_name
    FROM public.shipping_methods sm
    JOIN public.markets m ON sm.market_id = m.id
    WHERE sm.store_id = p_store_id
      AND sm.is_active = TRUE
      AND m.is_active = TRUE
      AND p_country = ANY(m.countries)
    ORDER BY sm.sort_order, sm.price;
END;
$$;

-- 8. DONNÉES DE TEST (optionnel)
-- Sera ajouté via l'interface admin

COMMENT ON TABLE public.markets IS 'Zones de vente (marchés) pour chaque boutique';
COMMENT ON TABLE public.shipping_methods IS 'Méthodes de livraison par marché';
COMMENT ON TABLE public.shipping_addresses IS 'Adresses de livraison des commandes';
COMMENT ON FUNCTION get_available_shipping_methods IS 'Récupère les méthodes de livraison disponibles pour un pays donné';
