-- Mettre à jour la devise par défaut de EUR vers CFA dans la table orders
ALTER TABLE public.orders ALTER COLUMN currency SET DEFAULT 'CFA';