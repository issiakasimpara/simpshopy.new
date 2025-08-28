-- ========================================
-- FIX: ACCÈS PUBLIC AUX TEMPLATES
-- Permettre l'accès public en lecture seule aux templates publiés des boutiques actives
-- ========================================

-- 1. Vérifier si RLS est activé sur la table site_templates
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

-- 2. Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Public can view published templates from active stores" ON public.site_templates;
DROP POLICY IF EXISTS "Users can manage their own templates" ON public.site_templates;

-- 3. Créer une politique pour l'accès public en lecture seule aux templates publiés des boutiques actives
CREATE POLICY "Public can view published templates from active stores" ON public.site_templates
    FOR SELECT 
    USING (
        is_published = true AND
        store_id IN (
            SELECT id FROM public.stores 
            WHERE status = 'active'
        )
    );

-- 4. Créer une politique pour permettre aux utilisateurs authentifiés de gérer leurs templates
CREATE POLICY "Users can manage their own templates" ON public.site_templates
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
WHERE tablename = 'site_templates';

-- 6. Test: Vérifier qu'on peut lire les templates publiés des boutiques actives sans authentification
SELECT COUNT(*) as public_templates_count 
FROM public.site_templates st
JOIN public.stores s ON st.store_id = s.id
WHERE st.is_published = true AND s.status = 'active'; 