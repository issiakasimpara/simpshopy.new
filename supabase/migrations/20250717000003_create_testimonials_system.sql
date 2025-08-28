-- Créer le système de témoignages/avis clients

-- 1. Table pour les témoignages
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.public_orders(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_testimonials_store_id ON public.testimonials(store_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON public.testimonials(is_approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON public.testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON public.testimonials(rating);
CREATE INDEX IF NOT EXISTS idx_testimonials_product_id ON public.testimonials(product_id);

-- 3. RLS (Row Level Security)
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- 4. Politiques de sécurité

-- Les clients peuvent créer des témoignages
CREATE POLICY "Anyone can create testimonials" 
ON public.testimonials 
FOR INSERT 
WITH CHECK (true);

-- Les clients peuvent voir les témoignages approuvés
CREATE POLICY "Anyone can view approved testimonials" 
ON public.testimonials 
FOR SELECT 
USING (is_approved = true);

-- Les propriétaires de boutique peuvent gérer leurs témoignages
CREATE POLICY "Store owners can manage their testimonials" 
ON public.testimonials 
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

-- 5. Trigger pour mettre à jour updated_at
CREATE TRIGGER update_testimonials_updated_at 
    BEFORE UPDATE ON public.testimonials 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 6. Fonction pour calculer la note moyenne d'une boutique
CREATE OR REPLACE FUNCTION get_store_average_rating(store_uuid UUID)
RETURNS NUMERIC AS $$
BEGIN
    RETURN (
        SELECT ROUND(AVG(rating), 1)
        FROM public.testimonials 
        WHERE store_id = store_uuid 
        AND is_approved = true
    );
END;
$$ LANGUAGE plpgsql;

-- 7. Fonction pour obtenir le nombre total d'avis d'une boutique
CREATE OR REPLACE FUNCTION get_store_testimonials_count(store_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM public.testimonials 
        WHERE store_id = store_uuid 
        AND is_approved = true
    );
END;
$$ LANGUAGE plpgsql;

-- 8. Commentaires pour documenter la table
COMMENT ON TABLE public.testimonials IS 'Table pour stocker les témoignages et avis clients';
COMMENT ON COLUMN public.testimonials.rating IS 'Note de 1 à 5 étoiles';
COMMENT ON COLUMN public.testimonials.is_approved IS 'Témoignage approuvé par l''admin';
COMMENT ON COLUMN public.testimonials.is_featured IS 'Témoignage mis en avant';
COMMENT ON COLUMN public.testimonials.product_id IS 'Produit concerné (optionnel)';
COMMENT ON COLUMN public.testimonials.order_id IS 'Commande liée (optionnel)';
