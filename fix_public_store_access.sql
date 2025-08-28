-- ========================================
-- FIX: ACCÈS PUBLIC AUX BOUTIQUES
-- Permettre l'accès public en lecture seule aux boutiques actives
-- ========================================

-- 1. Vérifier si RLS est activé sur la table stores
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

-- 2. Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Public can view active stores" ON public.stores;
DROP POLICY IF EXISTS "Users can manage their own stores" ON public.stores;

-- 3. Créer une politique pour l'accès public en lecture seule aux boutiques actives
CREATE POLICY "Public can view active stores" ON public.stores
    FOR SELECT 
    USING (status = 'active');

-- 4. Créer une politique pour permettre aux utilisateurs authentifiés de gérer leurs boutiques
CREATE POLICY "Users can manage their own stores" ON public.stores
    FOR ALL 
    USING (
        merchant_id IN (
            SELECT id FROM public.profiles 
            WHERE user_id = auth.uid()
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
WHERE tablename = 'stores';

-- 6. Test: Vérifier qu'on peut lire les boutiques actives sans authentification
-- (Cette requête devrait fonctionner même pour les utilisateurs non authentifiés)
SELECT COUNT(*) as active_stores_count 
FROM public.stores 
WHERE status = 'active'; 