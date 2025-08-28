-- ========================================
-- FIX: ACCÈS PUBLIC AUX PRODUITS
-- Permettre l'accès public en lecture seule aux produits des boutiques actives
-- ========================================

-- 1. Vérifier si RLS est activé sur la table products
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'products' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- 2. Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Public can view products from active stores" ON public.products;
DROP POLICY IF EXISTS "Users can manage their own products" ON public.products;

-- 3. Créer une politique pour l'accès public en lecture seule aux produits des boutiques actives
CREATE POLICY "Public can view products from active stores" ON public.products
    FOR SELECT 
    USING (
        store_id IN (
            SELECT id FROM public.stores 
            WHERE status = 'active'
        )
    );

-- 4. Créer une politique pour permettre aux utilisateurs authentifiés de gérer leurs produits
CREATE POLICY "Users can manage their own products" ON public.products
    FOR ALL 
    USING (
        store_id IN (
            SELECT s.id FROM public.stores s
            JOIN public.profiles p ON s.merchant_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- 5. Vérifier que les politiques sont créées
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'products';

-- 6. Test: Vérifier qu'on peut lire les produits des boutiques actives sans authentification
SELECT COUNT(*) as public_products_count 
FROM public.products p
JOIN public.stores s ON p.store_id = s.id
WHERE s.status = 'active'; 