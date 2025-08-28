-- ========================================
-- SETUP DES TEMPLATES DE SITE WEB
-- Script pour créer les templates de site web correspondant aux secteurs
-- ========================================

-- 1. Vérifier si la table site_templates existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'site_templates'
  ) THEN
    RAISE EXCEPTION 'La table site_templates n''existe pas. Veuillez la créer d''abord.';
  END IF;
END $$;

-- 2. Insérer les templates de site web pour chaque secteur
-- Note: Ces templates seront créés automatiquement lors de la création de boutique
-- mais nous pouvons les pré-créer pour les tests

-- Template Technologie
INSERT INTO site_templates (store_id, template_id, template_data, is_published) 
SELECT 
  s.id as store_id,
  'tech-modern' as template_id,
  '{
    "theme": {
      "primary_color": "#3B82F6",
      "secondary_color": "#1F2937", 
      "accent_color": "#10B981"
    },
    "hero": {
      "title": "Solutions Technologiques Innovantes",
      "subtitle": "Découvrez nos produits tech de pointe",
      "background": "gradient-blue"
    },
    "layout": {
      "header": {"type": "modern", "show_logo": true, "show_nav": true},
      "footer": {"type": "tech", "show_social": true},
      "sidebar": {"enabled": false}
    },
    "sections": [
      {"type": "hero", "content": "tech-hero"},
      {"type": "features", "content": "tech-features"},
      {"type": "products", "content": "tech-products"},
      {"type": "testimonials", "content": "tech-testimonials"}
    ]
  }'::jsonb as template_data,
  true as is_published
FROM stores s 
WHERE s.settings->>'sector' = 'technology'
AND NOT EXISTS (
  SELECT 1 FROM site_templates st 
  WHERE st.store_id = s.id AND st.template_id = 'tech-modern'
)
LIMIT 1;

-- Template Mode
INSERT INTO site_templates (store_id, template_id, template_data, is_published) 
SELECT 
  s.id as store_id,
  'fashion-modern' as template_id,
  '{
    "theme": {
      "primary_color": "#EC4899",
      "secondary_color": "#831843",
      "accent_color": "#F59E0B"
    },
    "hero": {
      "title": "Mode & Style",
      "subtitle": "Découvrez nos dernières collections",
      "background": "gradient-pink"
    },
    "layout": {
      "header": {"type": "elegant", "show_logo": true, "show_nav": true},
      "footer": {"type": "fashion", "show_social": true},
      "sidebar": {"enabled": false}
    },
    "sections": [
      {"type": "hero", "content": "fashion-hero"},
      {"type": "collections", "content": "fashion-collections"},
      {"type": "products", "content": "fashion-products"},
      {"type": "lookbook", "content": "fashion-lookbook"}
    ]
  }'::jsonb as template_data,
  true as is_published
FROM stores s 
WHERE s.settings->>'sector' = 'fashion'
AND NOT EXISTS (
  SELECT 1 FROM site_templates st 
  WHERE st.store_id = s.id AND st.template_id = 'fashion-modern'
)
LIMIT 1;

-- Template Alimentation
INSERT INTO site_templates (store_id, template_id, template_data, is_published) 
SELECT 
  s.id as store_id,
  'food-gourmet' as template_id,
  '{
    "theme": {
      "primary_color": "#F59E0B",
      "secondary_color": "#92400E",
      "accent_color": "#10B981"
    },
    "hero": {
      "title": "Gastronomie & Saveurs",
      "subtitle": "Dégustez nos produits d''exception",
      "background": "gradient-orange"
    },
    "layout": {
      "header": {"type": "warm", "show_logo": true, "show_nav": true},
      "footer": {"type": "food", "show_social": true},
      "sidebar": {"enabled": false}
    },
    "sections": [
      {"type": "hero", "content": "food-hero"},
      {"type": "recipes", "content": "food-recipes"},
      {"type": "products", "content": "food-products"},
      {"type": "chef-recommendations", "content": "food-chef"}
    ]
  }'::jsonb as template_data,
  true as is_published
FROM stores s 
WHERE s.settings->>'sector' = 'food'
AND NOT EXISTS (
  SELECT 1 FROM site_templates st 
  WHERE st.store_id = s.id AND st.template_id = 'food-gourmet'
)
LIMIT 1;

-- Template Santé
INSERT INTO site_templates (store_id, template_id, template_data, is_published) 
SELECT 
  s.id as store_id,
  'health-wellness' as template_id,
  '{
    "theme": {
      "primary_color": "#10B981",
      "secondary_color": "#064E3B",
      "accent_color": "#3B82F6"
    },
    "hero": {
      "title": "Santé & Bien-être",
      "subtitle": "Prenez soin de vous naturellement",
      "background": "gradient-green"
    },
    "layout": {
      "header": {"type": "clean", "show_logo": true, "show_nav": true},
      "footer": {"type": "health", "show_social": true},
      "sidebar": {"enabled": false}
    },
    "sections": [
      {"type": "hero", "content": "health-hero"},
      {"type": "benefits", "content": "health-benefits"},
      {"type": "products", "content": "health-products"},
      {"type": "testimonials", "content": "health-testimonials"}
    ]
  }'::jsonb as template_data,
  true as is_published
FROM stores s 
WHERE s.settings->>'sector' = 'health'
AND NOT EXISTS (
  SELECT 1 FROM site_templates st 
  WHERE st.store_id = s.id AND st.template_id = 'health-wellness'
)
LIMIT 1;

-- Template Éducation
INSERT INTO site_templates (store_id, template_id, template_data, is_published) 
SELECT 
  s.id as store_id,
  'learning-hub' as template_id,
  '{
    "theme": {
      "primary_color": "#8B5CF6",
      "secondary_color": "#4C1D95",
      "accent_color": "#F59E0B"
    },
    "hero": {
      "title": "Apprentissage & Formation",
      "subtitle": "Développez vos compétences",
      "background": "gradient-purple"
    },
    "layout": {
      "header": {"type": "academic", "show_logo": true, "show_nav": true},
      "footer": {"type": "education", "show_social": true},
      "sidebar": {"enabled": false}
    },
    "sections": [
      {"type": "hero", "content": "education-hero"},
      {"type": "courses", "content": "education-courses"},
      {"type": "products", "content": "education-products"},
      {"type": "certificates", "content": "education-certificates"}
    ]
  }'::jsonb as template_data,
  true as is_published
FROM stores s 
WHERE s.settings->>'sector' = 'education'
AND NOT EXISTS (
  SELECT 1 FROM site_templates st 
  WHERE st.store_id = s.id AND st.template_id = 'learning-hub'
)
LIMIT 1;

-- Template Divertissement
INSERT INTO site_templates (store_id, template_id, template_data, is_published) 
SELECT 
  s.id as store_id,
  'entertainment-store' as template_id,
  '{
    "theme": {
      "primary_color": "#EF4444",
      "secondary_color": "#7F1D1D",
      "accent_color": "#F59E0B"
    },
    "hero": {
      "title": "Divertissement & Loisirs",
      "subtitle": "Vivez des expériences uniques",
      "background": "gradient-red"
    },
    "layout": {
      "header": {"type": "dynamic", "show_logo": true, "show_nav": true},
      "footer": {"type": "entertainment", "show_social": true},
      "sidebar": {"enabled": false}
    },
    "sections": [
      {"type": "hero", "content": "entertainment-hero"},
      {"type": "events", "content": "entertainment-events"},
      {"type": "products", "content": "entertainment-products"},
      {"type": "fan-zone", "content": "entertainment-fan-zone"}
    ]
  }'::jsonb as template_data,
  true as is_published
FROM stores s 
WHERE s.settings->>'sector' = 'entertainment'
AND NOT EXISTS (
  SELECT 1 FROM site_templates st 
  WHERE st.store_id = s.id AND st.template_id = 'entertainment-store'
)
LIMIT 1;

-- Template Général (par défaut)
INSERT INTO site_templates (store_id, template_id, template_data, is_published) 
SELECT 
  s.id as store_id,
  'general-modern' as template_id,
  '{
    "theme": {
      "primary_color": "#3B82F6",
      "secondary_color": "#1F2937",
      "accent_color": "#10B981"
    },
    "hero": {
      "title": "Bienvenue sur notre boutique",
      "subtitle": "Découvrez nos produits exceptionnels",
      "background": "gradient-blue"
    },
    "layout": {
      "header": {"type": "standard", "show_logo": true, "show_nav": true},
      "footer": {"type": "standard", "show_social": true},
      "sidebar": {"enabled": false}
    },
    "sections": [
      {"type": "hero", "content": "general-hero"},
      {"type": "features", "content": "general-features"},
      {"type": "products", "content": "general-products"},
      {"type": "testimonials", "content": "general-testimonials"}
    ]
  }'::jsonb as template_data,
  true as is_published
FROM stores s 
WHERE s.settings->>'sector' = 'general'
AND NOT EXISTS (
  SELECT 1 FROM site_templates st 
  WHERE st.store_id = s.id AND st.template_id = 'general-modern'
)
LIMIT 1;

-- 3. Vérifier les templates créés
SELECT 
  '=== TEMPLATES DE SITE WEB CRÉÉS ===' as info;

SELECT 
  st.store_id,
  st.template_id,
  st.is_published,
  s.name as store_name,
  s.settings->>'sector' as store_sector
FROM site_templates st
JOIN stores s ON st.store_id = s.id
ORDER BY st.created_at DESC;

-- 4. Statistiques
SELECT 
  '=== STATISTIQUES ===' as info;

SELECT 
  template_id,
  COUNT(*) as nombre_boutiques,
  COUNT(CASE WHEN is_published = true THEN 1 END) as boutiques_publiees
FROM site_templates
GROUP BY template_id
ORDER BY nombre_boutiques DESC;
