-- Ajouter le champ available_countries à la table shipping_methods
ALTER TABLE public.shipping_methods 
ADD COLUMN available_countries TEXT[] DEFAULT '{}';

-- Mettre à jour les méthodes existantes pour qu'elles soient disponibles dans tous les pays activés
UPDATE public.shipping_methods 
SET available_countries = (
  SELECT enabled_countries 
  FROM public.market_settings 
  WHERE market_settings.store_id = shipping_methods.store_id
)
WHERE available_countries = '{}';

-- Créer un index pour améliorer les performances des requêtes sur available_countries
CREATE INDEX idx_shipping_methods_available_countries ON public.shipping_methods USING GIN (available_countries);

-- Commentaire pour documenter le champ
COMMENT ON COLUMN public.shipping_methods.available_countries IS 'Liste des codes pays où cette méthode de livraison est disponible';
