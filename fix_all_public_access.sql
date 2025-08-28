-- ========================================
-- FIX COMPLET: ACCÈS PUBLIC AUX BOUTIQUES
-- Permettre l'accès public en lecture seule à toutes les données publiques
-- ========================================

-- 1. FIX BOUTIQUES (stores)
-- Activer RLS si nécessaire
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'stores' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Supprimer et recréer les politiques pour stores
DROP POLICY IF EXISTS "Public can view active stores" ON public.stores;
DROP POLICY IF EXISTS "Users can manage their own stores" ON public.stores;

CREATE POLICY "Public can view active stores" ON public.stores
    FOR SELECT 
    USING (status = 'active');

CREATE POLICY "Users can manage their own stores" ON public.stores
    FOR ALL 
    USING (
        merchant_id IN (
            SELECT id FROM public.profiles 
            WHERE user_id = auth.uid()
        )
    );

-- 2. FIX PRODUITS (products)
-- Activer RLS si nécessaire
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

-- Supprimer et recréer les politiques pour products
DROP POLICY IF EXISTS "Public can view products from active stores" ON public.products;
DROP POLICY IF EXISTS "Users can manage their own products" ON public.products;

CREATE POLICY "Public can view products from active stores" ON public.products
    FOR SELECT 
    USING (
        store_id IN (
            SELECT id FROM public.stores 
            WHERE status = 'active'
        )
    );

CREATE POLICY "Users can manage their own products" ON public.products
    FOR ALL 
    USING (
        store_id IN (
            SELECT s.id FROM public.stores s
            JOIN public.profiles p ON s.merchant_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- 3. FIX TEMPLATES (site_templates)
-- Activer RLS si nécessaire
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'site_templates' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.site_templates ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Supprimer et recréer les politiques pour site_templates
DROP POLICY IF EXISTS "Public can view published templates from active stores" ON public.site_templates;
DROP POLICY IF EXISTS "Users can manage their own templates" ON public.site_templates;

CREATE POLICY "Public can view published templates from active stores" ON public.site_templates
    FOR SELECT 
    USING (
        is_published = true AND
        store_id IN (
            SELECT id FROM public.stores 
            WHERE status = 'active'
        )
    );

CREATE POLICY "Users can manage their own templates" ON public.site_templates
    FOR ALL 
    USING (
        store_id IN (
            SELECT s.id FROM public.stores s
            JOIN public.profiles p ON s.merchant_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- 4. RÉSULTATS DE TEST
SELECT 'Boutiques actives accessibles publiquement:' as test_type, COUNT(*) as count
FROM public.stores 
WHERE status = 'active'
UNION ALL
SELECT 'Produits des boutiques actives accessibles publiquement:', COUNT(*)
FROM public.products p
JOIN public.stores s ON p.store_id = s.id
WHERE s.status = 'active'
UNION ALL
SELECT 'Templates publiés accessibles publiquement:', COUNT(*)
FROM public.site_templates st
JOIN public.stores s ON st.store_id = s.id
WHERE st.is_published = true AND s.status = 'active';

-- 5. VÉRIFICATION DES POLITIQUES
SELECT 
    tablename,
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('stores', 'products', 'site_templates')
ORDER BY tablename, policyname; 