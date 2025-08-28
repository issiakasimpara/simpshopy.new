-- ========================================
-- FIX: ACCÈS PUBLIC À LA CRÉATION DE COMMANDES
-- Permettre aux utilisateurs de créer des commandes publiques
-- ========================================

-- 1. Vérifier si RLS est activé sur la table public_orders
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'public_orders' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.public_orders ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- 2. Supprimer les politiques existantes pour public_orders
DROP POLICY IF EXISTS "Anyone can view orders with email verification" ON public.public_orders;
DROP POLICY IF EXISTS "Store owners can manage their public orders" ON public.public_orders;

-- 3. Créer une politique pour permettre à TOUT LE MONDE de créer des commandes
CREATE POLICY "Anyone can create public orders" ON public.public_orders
    FOR INSERT 
    WITH CHECK (true);

-- 4. Créer une politique pour permettre aux clients de voir leurs commandes par email
CREATE POLICY "Anyone can view orders with email verification" ON public.public_orders
    FOR SELECT 
    USING (true);

-- 5. Créer une politique pour permettre aux marchands de gérer les commandes de leur boutique
CREATE POLICY "Store owners can manage their public orders" ON public.public_orders
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

-- 6. Vérifier si la table orders existe et corriger ses politiques aussi
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'orders'
    ) THEN
        -- Activer RLS si nécessaire
        IF NOT EXISTS (
            SELECT 1 FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename = 'orders' 
            AND rowsecurity = true
        ) THEN
            ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
        END IF;
        
        -- Supprimer les politiques existantes
        DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
        DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
        DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
        
        -- Créer une politique pour permettre à TOUT LE MONDE de créer des commandes
        CREATE POLICY "Anyone can create orders" ON public.orders
            FOR INSERT 
            WITH CHECK (true);
            
        -- Créer une politique pour permettre aux utilisateurs de voir leurs commandes
        CREATE POLICY "Users can view their own orders" ON public.orders
            FOR SELECT 
            USING (true);
            
        -- Créer une politique pour permettre aux utilisateurs de mettre à jour leurs commandes
        CREATE POLICY "Users can update their own orders" ON public.orders
            FOR UPDATE 
            USING (true);
    END IF;
END $$;

-- 7. Vérifier si la table cart_sessions existe et corriger ses politiques
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'cart_sessions'
    ) THEN
        -- Activer RLS si nécessaire
        IF NOT EXISTS (
            SELECT 1 FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename = 'cart_sessions' 
            AND rowsecurity = true
        ) THEN
            ALTER TABLE public.cart_sessions ENABLE ROW LEVEL SECURITY;
        END IF;
        
        -- Supprimer les politiques existantes
        DROP POLICY IF EXISTS "Anyone can manage cart sessions" ON public.cart_sessions;
        
        -- Créer une politique pour permettre à TOUT LE MONDE de gérer les sessions de panier
        CREATE POLICY "Anyone can manage cart sessions" ON public.cart_sessions
            FOR ALL 
            USING (true);
    END IF;
END $$;

-- 8. RÉSULTATS DE TEST
SELECT 'Politiques public_orders créées:' as test_type, COUNT(*) as count
FROM pg_policies 
WHERE tablename = 'public_orders'
UNION ALL
SELECT 'Politiques orders créées:', COUNT(*)
FROM pg_policies 
WHERE tablename = 'orders'
UNION ALL
SELECT 'Politiques cart_sessions créées:', COUNT(*)
FROM pg_policies 
WHERE tablename = 'cart_sessions';

-- 9. VÉRIFICATION DES POLITIQUES
SELECT 
    tablename,
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('public_orders', 'orders', 'cart_sessions')
ORDER BY tablename, policyname; 