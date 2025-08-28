-- Table pour tracker les visiteurs actifs en temps réel
CREATE TABLE IF NOT EXISTS public.active_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    user_agent TEXT,
    ip_address TEXT,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_active_sessions_store_id ON public.active_sessions(store_id);
CREATE INDEX IF NOT EXISTS idx_active_sessions_last_activity ON public.active_sessions(last_activity);
CREATE INDEX IF NOT EXISTS idx_active_sessions_session_id ON public.active_sessions(session_id);

-- Index composite pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_active_sessions_store_activity ON public.active_sessions(store_id, last_activity);

-- RLS (Row Level Security) pour la sécurité multi-tenant
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion/mise à jour par tous (nécessaire pour le tracking)
CREATE POLICY "Allow insert for tracking" ON public.active_sessions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for tracking" ON public.active_sessions
    FOR UPDATE USING (true);

-- Politique pour permettre la lecture par les propriétaires de boutique
CREATE POLICY "Allow read for store owners" ON public.active_sessions
    FOR SELECT USING (
        store_id IN (
            SELECT id FROM public.stores 
            WHERE merchant_id = (
                SELECT id FROM public.profiles 
                WHERE user_id = auth.uid()
            )
        )
    );

-- Politique pour permettre la suppression par les propriétaires de boutique
CREATE POLICY "Allow delete for store owners" ON public.active_sessions
    FOR DELETE USING (
        store_id IN (
            SELECT id FROM public.stores 
            WHERE merchant_id = (
                SELECT id FROM public.profiles 
                WHERE user_id = auth.uid()
            )
        )
    );

-- Fonction pour nettoyer automatiquement les sessions expirées
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM public.active_sessions 
    WHERE last_activity < NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql;

-- Trigger pour nettoyer automatiquement (optionnel - peut être géré côté application)
-- CREATE OR REPLACE FUNCTION trigger_cleanup_expired_sessions()
-- RETURNS trigger AS $$
-- BEGIN
--     PERFORM cleanup_expired_sessions();
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER cleanup_expired_sessions_trigger
--     AFTER INSERT ON public.active_sessions
--     EXECUTE FUNCTION trigger_cleanup_expired_sessions();

-- Commentaires pour la documentation
COMMENT ON TABLE public.active_sessions IS 'Table pour tracker les visiteurs actifs en temps réel sur les boutiques';
COMMENT ON COLUMN public.active_sessions.store_id IS 'ID de la boutique';
COMMENT ON COLUMN public.active_sessions.session_id IS 'ID unique de session du visiteur';
COMMENT ON COLUMN public.active_sessions.user_agent IS 'User agent du navigateur';
COMMENT ON COLUMN public.active_sessions.ip_address IS 'Adresse IP du visiteur';
COMMENT ON COLUMN public.active_sessions.last_activity IS 'Dernière activité du visiteur';
COMMENT ON COLUMN public.active_sessions.created_at IS 'Date de création de la session';
