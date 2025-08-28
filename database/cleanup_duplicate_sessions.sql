-- Script pour nettoyer les sessions dupliquées existantes
-- À exécuter une seule fois après la correction du système

-- 1. Supprimer toutes les sessions existantes (nettoyage complet)
DELETE FROM public.active_sessions;

-- 2. Vérifier que la table est vide
SELECT COUNT(*) as sessions_count FROM public.active_sessions;

-- 3. Réinitialiser les séquences si nécessaire
-- (Pas nécessaire pour UUID, mais au cas où)

-- 4. Vérifier les politiques RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'active_sessions';

-- 5. Vérifier les index
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'active_sessions';

-- Commentaire : Après ce nettoyage, le nouveau système de tracking
-- utilisera des session_id stables et ne créera plus de doublons
