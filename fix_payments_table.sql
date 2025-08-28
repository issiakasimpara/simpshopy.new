-- Script de correction pour la table payments
-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Store owners can view their payments" ON payments;
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;
DROP POLICY IF EXISTS "Allow webhook insertions" ON payments;
DROP POLICY IF EXISTS "Allow webhook updates" ON payments;

-- Recréer les politiques avec le bon nom de colonne (owner_id au lieu de user_id)
CREATE POLICY "Store owners can view their payments" ON payments
    FOR SELECT USING (
        store_id IN (
            SELECT id FROM stores WHERE owner_id = auth.uid()
        )
    );

-- Policy pour les admins
CREATE POLICY "Admins can view all payments" ON payments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policy pour l'insertion (webhooks)
CREATE POLICY "Allow webhook insertions" ON payments
    FOR INSERT WITH CHECK (true);

-- Policy pour les mises à jour (webhooks)
CREATE POLICY "Allow webhook updates" ON payments
    FOR UPDATE USING (true);

-- Vérifier que la table existe et a les bonnes colonnes
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'payments' 
ORDER BY ordinal_position; 