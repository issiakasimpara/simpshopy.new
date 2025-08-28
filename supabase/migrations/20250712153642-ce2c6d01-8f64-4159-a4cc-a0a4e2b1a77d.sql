
-- Créer les attributs de base (couleur et taille) s'ils n'existent pas déjà
INSERT INTO product_attributes (name, type) 
VALUES 
  ('Couleur', 'color'),
  ('Taille', 'size')
ON CONFLICT DO NOTHING;

-- Créer quelques valeurs d'attributs communes pour les couleurs
WITH color_attribute AS (
  SELECT id FROM product_attributes WHERE name = 'Couleur' AND type = 'color' LIMIT 1
)
INSERT INTO attribute_values (attribute_id, value, hex_color, sort_order)
SELECT 
  color_attribute.id,
  color_name,
  hex_value,
  sort_order
FROM color_attribute,
(VALUES 
  ('Rouge', '#FF0000', 1),
  ('Bleu', '#0000FF', 2),
  ('Vert', '#008000', 3),
  ('Noir', '#000000', 4),
  ('Blanc', '#FFFFFF', 5),
  ('Gris', '#808080', 6),
  ('Rose', '#FFC0CB', 7),
  ('Jaune', '#FFFF00', 8),
  ('Orange', '#FFA500', 9),
  ('Violet', '#800080', 10)
) AS colors(color_name, hex_value, sort_order)
ON CONFLICT DO NOTHING;

-- Créer quelques valeurs d'attributs communes pour les tailles
WITH size_attribute AS (
  SELECT id FROM product_attributes WHERE name = 'Taille' AND type = 'size' LIMIT 1
)
INSERT INTO attribute_values (attribute_id, value, sort_order)
SELECT 
  size_attribute.id,
  size_value,
  sort_order
FROM size_attribute,
(VALUES 
  ('XS', 1),
  ('S', 2),
  ('M', 3),
  ('L', 4),
  ('XL', 5),
  ('XXL', 6),
  ('36', 7),
  ('37', 8),
  ('38', 9),
  ('39', 10),
  ('40', 11),
  ('41', 12),
  ('42', 13),
  ('43', 14),
  ('44', 15),
  ('45', 16)
) AS sizes(size_value, sort_order)
ON CONFLICT DO NOTHING;
