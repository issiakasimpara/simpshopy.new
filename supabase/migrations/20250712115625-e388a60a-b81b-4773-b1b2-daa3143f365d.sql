
-- Ajouter une contrainte d'unicité pour s'assurer qu'un merchant ne peut avoir qu'une seule boutique
ALTER TABLE public.stores 
ADD CONSTRAINT unique_merchant_store UNIQUE (merchant_id);

-- Optionnel: Mettre à jour le commentaire de la table pour documenter cette contrainte
COMMENT ON CONSTRAINT unique_merchant_store ON public.stores IS 'Un merchant ne peut avoir qu''une seule boutique';
