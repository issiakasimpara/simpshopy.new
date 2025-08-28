-- ========================================
-- FIX: ACCÈS PUBLIC AUX MÉTHODES DE LIVRAISON
-- Permettre l'accès public en lecture seule aux méthodes de livraison des boutiques actives
-- ========================================

-- 1. Vérifier et corriger les politiques RLS pour shipping_methods
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'shipping_methods' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.shipping_methods ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- 2. Supprimer toutes les politiques existantes pour shipping_methods
DROP POLICY IF EXISTS "Users can view shipping methods of their stores" ON public.shipping_methods;
DROP POLICY IF EXISTS "Users can manage shipping methods of their stores" ON public.shipping_methods;
DROP POLICY IF EXISTS "Users can view their own shipping methods" ON public.shipping_methods;
DROP POLICY IF EXISTS "Users can insert their own shipping methods" ON public.shipping_methods;
DROP POLICY IF EXISTS "Users can update their own shipping methods" ON public.shipping_methods;
DROP POLICY IF EXISTS "Users can delete their own shipping methods" ON public.shipping_methods;
DROP POLICY IF EXISTS "Users can manage their store shipping methods" ON public.shipping_methods;
DROP POLICY IF EXISTS "Public can read active shipping methods" ON public.shipping_methods;

-- 3. Créer une politique pour l'accès public en lecture seule aux méthodes de livraison actives des boutiques actives
CREATE POLICY "Public can view active shipping methods from active stores" ON public.shipping_methods
    FOR SELECT 
    USING (
        is_active = true AND
        store_id IN (
            SELECT id FROM public.stores 
            WHERE status = 'active'
        )
    );

-- 4. Créer une politique pour permettre aux utilisateurs authentifiés de gérer leurs méthodes de livraison
CREATE POLICY "Users can manage their own shipping methods" ON public.shipping_methods
    FOR ALL 
    USING (
        store_id IN (
            SELECT s.id FROM public.stores s
            JOIN public.profiles p ON s.merchant_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- 5. Vérifier et corriger les politiques RLS pour markets (si nécessaire)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'markets' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.markets ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- 6. Supprimer et recréer les politiques pour markets
DROP POLICY IF EXISTS "Users can view markets of their stores" ON public.markets;
DROP POLICY IF EXISTS "Users can manage markets of their stores" ON public.markets;

-- 7. Créer une politique pour l'accès public en lecture seule aux marchés des boutiques actives
CREATE POLICY "Public can view markets from active stores" ON public.markets
    FOR SELECT 
    USING (
        is_active = true AND
        store_id IN (
            SELECT id FROM public.stores 
            WHERE status = 'active'
        )
    );

-- 8. Créer une politique pour permettre aux utilisateurs authentifiés de gérer leurs marchés
CREATE POLICY "Users can manage their own markets" ON public.markets
    FOR ALL 
    USING (
        store_id IN (
            SELECT s.id FROM public.stores s
            JOIN public.profiles p ON s.merchant_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- 9. Vérifier et corriger les politiques RLS pour shipping_zones (si la table existe)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'shipping_zones'
    ) THEN
        -- Activer RLS si nécessaire
        IF NOT EXISTS (
            SELECT 1 FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename = 'shipping_zones' 
            AND rowsecurity = true
        ) THEN
            ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;
        END IF;
        
        -- Supprimer les politiques existantes
        DROP POLICY IF EXISTS "Users can view shipping zones for their stores" ON public.shipping_zones;
        DROP POLICY IF EXISTS "Users can insert shipping zones for their stores" ON public.shipping_zones;
        DROP POLICY IF EXISTS "Users can update shipping zones for their stores" ON public.shipping_zones;
        DROP POLICY IF EXISTS "Users can delete shipping zones for their stores" ON public.shipping_zones;
        
        -- Créer une politique pour l'accès public
        CREATE POLICY "Public can view shipping zones from active stores" ON public.shipping_zones
            FOR SELECT 
            USING (
                store_id IN (
                    SELECT id FROM public.stores 
                    WHERE status = 'active'
                )
            );
            
        -- Créer une politique pour la gestion par les utilisateurs
        CREATE POLICY "Users can manage their own shipping zones" ON public.shipping_zones
            FOR ALL 
            USING (
                store_id IN (
                    SELECT s.id FROM public.stores s
                    JOIN public.profiles p ON s.merchant_id = p.id
                    WHERE p.user_id = auth.uid()
                )
            );
    END IF;
END $$;

-- 10. RÉSULTATS DE TEST
SELECT 'Méthodes de livraison actives accessibles publiquement:' as test_type, COUNT(*) as count
FROM public.shipping_methods sm
JOIN public.stores s ON sm.store_id = s.id
WHERE sm.is_active = true AND s.status = 'active'
UNION ALL
SELECT 'Marchés actifs accessibles publiquement:', COUNT(*)
FROM public.markets m
JOIN public.stores s ON m.store_id = s.id
WHERE m.is_active = true AND s.status = 'active';

-- 11. VÉRIFICATION DES POLITIQUES
SELECT 
    tablename,
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('shipping_methods', 'markets', 'shipping_zones')
ORDER BY tablename, policyname; 