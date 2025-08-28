-- Corriger les politiques RLS pour oauth_integrations
-- Problème : Les politiques RLS empêchent l'accès même si la table existe

-- 1. Vérifier l'état actuel des politiques
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'oauth_integrations';

-- 2. Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "Users can view their own oauth integrations" ON oauth_integrations;
DROP POLICY IF EXISTS "Users can insert their own oauth integrations" ON oauth_integrations;
DROP POLICY IF EXISTS "Users can update their own oauth integrations" ON oauth_integrations;
DROP POLICY IF EXISTS "Users can delete their own oauth integrations" ON oauth_integrations;

-- 3. Créer des politiques plus permissives pour le débogage
CREATE POLICY "Enable read access for authenticated users" ON oauth_integrations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON oauth_integrations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON oauth_integrations
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete access for authenticated users" ON oauth_integrations
  FOR DELETE USING (auth.role() = 'authenticated');

-- 4. Vérifier que RLS est activé
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'oauth_integrations';

-- 5. Tester l'accès à la table
SELECT COUNT(*) as total_rows FROM oauth_integrations;

-- 6. Vérifier les politiques créées
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'oauth_integrations';
