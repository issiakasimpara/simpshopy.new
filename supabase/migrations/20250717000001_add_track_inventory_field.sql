-- Migration pour ajouter le champ track_inventory à la table products
-- Créé le 17/07/2025

-- Ajouter le champ track_inventory à la table products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS track_inventory BOOLEAN DEFAULT true;

-- Ajouter un commentaire pour documenter le champ
COMMENT ON COLUMN public.products.track_inventory IS 'Indique si le suivi de stock est activé pour ce produit';

-- Mettre à jour les produits existants pour activer le suivi par défaut
UPDATE public.products 
SET track_inventory = true 
WHERE track_inventory IS NULL;
