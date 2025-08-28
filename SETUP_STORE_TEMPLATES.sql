-- Script pour créer et configurer les templates de boutique
-- Exécutez ce script dans votre base de données Supabase

-- 1. Créer la table store_templates
CREATE TABLE IF NOT EXISTS store_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  sector VARCHAR(50) NOT NULL,
  description TEXT,
  features JSONB DEFAULT '[]',
  theme JSONB DEFAULT '{}',
  default_products JSONB DEFAULT '[]',
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, sector)
);

-- 2. Insérer les templates par secteur
INSERT INTO store_templates (name, sector, description, features, theme, default_products, settings, is_default) VALUES
-- Template Technologie
(
  'Tech Store Pro',
  'technology',
  'Template spécialisé pour les boutiques de technologie et gadgets',
  '["Catalogue avancé", "Comparaison de produits", "Avis techniques", "Support client", "Garantie étendue", "Mise à jour automatique"]',
  '{"primary_color": "#3B82F6", "secondary_color": "#1F2937", "accent_color": "#10B981"}',
  '[
    {"name": "Smartphone Premium", "description": "Dernier modèle avec fonctionnalités avancées", "price": 899.99, "category": "Smartphones"},
    {"name": "Laptop Gaming", "description": "Ordinateur portable optimisé pour les jeux", "price": 1299.99, "category": "Ordinateurs"},
    {"name": "Écouteurs Sans Fil", "description": "Qualité audio exceptionnelle", "price": 199.99, "category": "Audio"}
  ]',
  '{"enable_reviews": true, "enable_wishlist": true, "enable_related_products": true, "enable_newsletter": true, "enable_social_sharing": true, "enable_product_comparison": true}',
  false
),

-- Template Mode
(
  'Fashion Boutique',
  'fashion',
  'Template élégant pour les boutiques de mode et accessoires',
  '["Galerie de photos", "Guide des tailles", "Mode saisonnière", "Lookbook", "Retours gratuits", "Styling personnalisé"]',
  '{"primary_color": "#EC4899", "secondary_color": "#831843", "accent_color": "#F59E0B"}',
  '[
    {"name": "Robe Élégante", "description": "Robe parfaite pour toutes occasions", "price": 89.99, "category": "Robes"},
    {"name": "Sneakers Trendy", "description": "Chaussures confortables et stylées", "price": 129.99, "category": "Chaussures"},
    {"name": "Sac à Main Designer", "description": "Accessoire indispensable", "price": 159.99, "category": "Accessoires"}
  ]',
  '{"enable_reviews": true, "enable_wishlist": true, "enable_related_products": true, "enable_newsletter": true, "enable_social_sharing": true, "enable_size_guide": true}',
  false
),

-- Template Alimentation
(
  'Food & Gourmet',
  'food',
  'Template spécialisé pour les boutiques alimentaires et gastronomiques',
  '["Recettes", "Ingrédients frais", "Livraison rapide", "Allergies", "Valeurs nutritionnelles", "Chef recommandations"]',
  '{"primary_color": "#F59E0B", "secondary_color": "#92400E", "accent_color": "#10B981"}',
  '[
    {"name": "Huile d''Olive Premium", "description": "Huile d''olive extra vierge de qualité supérieure", "price": 24.99, "category": "Huiles"},
    {"name": "Chocolat Artisanal", "description": "Chocolat noir 70% cacao", "price": 12.99, "category": "Chocolats"},
    {"name": "Épices du Monde", "description": "Assortiment d''épices rares", "price": 18.99, "category": "Épices"}
  ]',
  '{"enable_reviews": true, "enable_wishlist": true, "enable_related_products": true, "enable_newsletter": true, "enable_social_sharing": true, "enable_recipe_suggestions": true}',
  false
),

-- Template Santé
(
  'Health & Wellness',
  'health',
  'Template pour les boutiques de santé et bien-être',
  '["Conseils santé", "Produits naturels", "Certifications", "Consultation", "Suivi santé", "Livraison discrète"]',
  '{"primary_color": "#10B981", "secondary_color": "#064E3B", "accent_color": "#3B82F6"}',
  '[
    {"name": "Vitamines Naturelles", "description": "Complexe vitaminique bio", "price": 34.99, "category": "Vitamines"},
    {"name": "Huile Essentielle", "description": "Lavande pour relaxation", "price": 19.99, "category": "Aromathérapie"},
    {"name": "Thé Détox", "description": "Mélange de plantes purifiantes", "price": 14.99, "category": "Thés"}
  ]',
  '{"enable_reviews": true, "enable_wishlist": true, "enable_related_products": true, "enable_newsletter": true, "enable_social_sharing": true, "enable_health_advice": true}',
  false
),

-- Template Éducation
(
  'Learning Hub',
  'education',
  'Template pour les boutiques de livres et matériel éducatif',
  '["Livres numériques", "Cours en ligne", "Support pédagogique", "Évaluations", "Certifications", "Communauté"]',
  '{"primary_color": "#8B5CF6", "secondary_color": "#4C1D95", "accent_color": "#F59E0B"}',
  '[
    {"name": "Cours en Ligne", "description": "Formation complète sur un sujet", "price": 99.99, "category": "Formations"},
    {"name": "Livre Éducatif", "description": "Guide pratique et théorique", "price": 29.99, "category": "Livres"},
    {"name": "Kit d''Apprentissage", "description": "Matériel pédagogique complet", "price": 49.99, "category": "Kits"}
  ]',
  '{"enable_reviews": true, "enable_wishlist": true, "enable_related_products": true, "enable_newsletter": true, "enable_social_sharing": true, "enable_certificates": true}',
  false
),

-- Template Divertissement
(
  'Entertainment Store',
  'entertainment',
  'Template pour les boutiques de divertissement et loisirs',
  '["Événements", "Billets", "Merchandising", "Fan Zone", "Exclusivités", "Collectors"]',
  '{"primary_color": "#EF4444", "secondary_color": "#7F1D1D", "accent_color": "#F59E0B"}',
  '[
    {"name": "Billet Concert", "description": "Place pour concert exclusif", "price": 79.99, "category": "Billets"},
    {"name": "Goodies Officiels", "description": "Produits dérivés authentiques", "price": 24.99, "category": "Merchandising"},
    {"name": "Édition Collector", "description": "Produit limité numéroté", "price": 149.99, "category": "Collectors"}
  ]',
  '{"enable_reviews": true, "enable_wishlist": true, "enable_related_products": true, "enable_newsletter": true, "enable_social_sharing": true, "enable_event_tickets": true}',
  false
),

-- Template Général (par défaut)
(
  'Boutique Standard',
  'general',
  'Template polyvalent pour tous types de boutiques',
  '["Catalogue de produits", "Panier d''achat", "Paiement sécurisé", "Gestion des commandes", "Tableau de bord", "Support client"]',
  '{"primary_color": "#3B82F6", "secondary_color": "#1F2937", "accent_color": "#10B981"}',
  '[
    {"name": "Produit Exemple", "description": "Description du produit exemple", "price": 29.99, "category": "Général"}
  ]',
  '{"enable_reviews": true, "enable_wishlist": true, "enable_related_products": true, "enable_newsletter": true, "enable_social_sharing": true}',
  true
)

ON CONFLICT (name, sector) DO NOTHING;

-- 3. Créer un index pour optimiser les recherches par secteur
CREATE INDEX IF NOT EXISTS idx_store_templates_sector ON store_templates(sector);
CREATE INDEX IF NOT EXISTS idx_store_templates_active ON store_templates(is_active);

-- 4. Vérifier les templates créés
SELECT 'Templates créés:' as info;
SELECT 
  name,
  sector,
  description,
  is_default,
  is_active
FROM store_templates 
ORDER BY sector, name;

-- 5. Afficher les statistiques
SELECT 'Statistiques des templates:' as info;
SELECT 
  sector,
  COUNT(*) as nombre_templates,
  COUNT(CASE WHEN is_default = true THEN 1 END) as templates_par_defaut
FROM store_templates 
GROUP BY sector
ORDER BY sector;
