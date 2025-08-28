-- =====================================================
-- SCRIPT COMPLET POUR CONFIGURER LA BASE DE DONNÉES
-- Tables: profiles, stores, market_settings
-- =====================================================

-- 1. CRÉER LA TABLE profiles (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  location TEXT,
  timezone TEXT DEFAULT 'UTC',
  language TEXT DEFAULT 'fr',
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. CRÉER LA TABLE stores (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS public.stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  domain TEXT,
  logo_url TEXT,
  merchant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  slug TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'suspended')),
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CRÉER LA TABLE market_settings (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS public.market_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  enabled_countries TEXT[] NOT NULL DEFAULT '{}',
  default_currency TEXT NOT NULL DEFAULT 'XOF',
  tax_settings JSONB DEFAULT '{"includeTax": false, "taxRate": 0, "taxLabel": "TVA"}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(store_id)
);

-- 4. CRÉER LES INDEX POUR LES PERFORMANCES
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_stores_merchant_id ON public.stores(merchant_id);
CREATE INDEX IF NOT EXISTS idx_stores_status ON public.stores(status);
CREATE INDEX IF NOT EXISTS idx_market_settings_store_id ON public.market_settings(store_id);
CREATE INDEX IF NOT EXISTS idx_market_settings_currency ON public.market_settings(default_currency);

-- 5. ACTIVER RLS SUR TOUTES LES TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_settings ENABLE ROW LEVEL SECURITY;

-- 6. CRÉER LES POLITIQUES RLS POUR profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. CRÉER LES POLITIQUES RLS POUR stores
DROP POLICY IF EXISTS "Public can view active stores" ON public.stores;
CREATE POLICY "Public can view active stores" ON public.stores
  FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Users can manage their own stores" ON public.stores;
CREATE POLICY "Users can manage their own stores" ON public.stores
  FOR ALL USING (
    merchant_id IN (
      SELECT id FROM public.profiles 
      WHERE user_id = auth.uid()
    )
  );

-- 8. CRÉER LES POLITIQUES RLS POUR market_settings
DROP POLICY IF EXISTS "Store owners can manage their market settings" ON public.market_settings;
CREATE POLICY "Store owners can manage their market settings" ON public.market_settings
  FOR ALL USING (
    store_id IN (
      SELECT id FROM public.stores 
      WHERE merchant_id IN (
        SELECT id FROM public.profiles 
        WHERE user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Public can read market settings" ON public.market_settings;
CREATE POLICY "Public can read market settings" ON public.market_settings
  FOR SELECT USING (true);

-- 9. CRÉER LES TRIGGERS POUR updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_stores_updated_at ON public.stores;
CREATE TRIGGER update_stores_updated_at
    BEFORE UPDATE ON public.stores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_market_settings_updated_at ON public.market_settings;
CREATE TRIGGER update_market_settings_updated_at
    BEFORE UPDATE ON public.market_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 10. FONCTION POUR CRÉER AUTOMATIQUEMENT UN PROFIL LORS DE L'INSCRIPTION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. TRIGGER POUR CRÉER AUTOMATIQUEMENT UN PROFIL
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 12. INSÉRER DES DONNÉES DE TEST POUR LES UTILISATEURS EXISTANTS
-- Créer des profils pour les utilisateurs existants qui n'en ont pas
INSERT INTO public.profiles (user_id, email, first_name, last_name)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'first_name', 'Test'),
  COALESCE(au.raw_user_meta_data->>'last_name', 'User')
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.user_id = au.id
);

-- 13. CRÉER UN STORE DE TEST POUR LES UTILISATEURS QUI N'EN ONT PAS
INSERT INTO public.stores (name, description, merchant_id, status)
SELECT 
  'Ma Boutique',
  'Boutique créée automatiquement',
  p.id,
  'active'
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.stores s WHERE s.merchant_id = p.id
);

-- 14. CRÉER DES PARAMÈTRES DE DEVISE DE TEST
INSERT INTO public.market_settings (store_id, default_currency, enabled_countries, tax_settings)
SELECT 
  s.id,
  'XOF',
  ARRAY['ML', 'CI', 'SN', 'BF'],
  '{"includeTax": false, "taxRate": 0, "taxLabel": "TVA"}'::jsonb
FROM public.stores s
WHERE NOT EXISTS (
  SELECT 1 FROM public.market_settings ms WHERE ms.store_id = s.id
);

-- 15. VÉRIFIER QUE TOUT FONCTIONNE
SELECT 
  'Configuration terminée' as status,
  (SELECT COUNT(*) FROM public.profiles) as total_profiles,
  (SELECT COUNT(*) FROM public.stores) as total_stores,
  (SELECT COUNT(*) FROM public.market_settings) as total_market_settings;
