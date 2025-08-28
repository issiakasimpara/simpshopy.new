-- Migration pour l'intégration DSERS Dropshipping
-- 20250120000004_create_dsers_integration.sql

-- Table pour les intégrations DSERS
CREATE TABLE IF NOT EXISTS dsers_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  api_key TEXT NOT NULL,
  api_secret TEXT NOT NULL,
  webhook_url TEXT,
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  last_sync TIMESTAMP,
  sync_interval INTEGER DEFAULT 3600, -- en secondes
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, store_id)
);

-- Table pour les produits importés via DSERS
CREATE TABLE IF NOT EXISTS dsers_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  dsers_product_id VARCHAR(255) NOT NULL,
  ali_express_url TEXT,
  product_data JSONB NOT NULL,
  import_status VARCHAR(50) DEFAULT 'pending', -- pending, imported, failed, syncing
  sync_status VARCHAR(50) DEFAULT 'pending', -- pending, synced, failed
  price_sync BOOLEAN DEFAULT true,
  stock_sync BOOLEAN DEFAULT true,
  last_price_sync TIMESTAMP,
  last_stock_sync TIMESTAMP,
  last_full_sync TIMESTAMP,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(store_id, dsers_product_id)
);

-- Table pour les commandes DSERS
CREATE TABLE IF NOT EXISTS dsers_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  dsers_order_id VARCHAR(255) NOT NULL,
  simpshopy_order_id UUID REFERENCES orders(id),
  order_data JSONB NOT NULL,
  fulfillment_status VARCHAR(50) DEFAULT 'pending', -- pending, fulfilled, shipped, delivered
  tracking_number TEXT,
  tracking_url TEXT,
  fulfillment_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(store_id, dsers_order_id)
);

-- Table pour les logs de synchronisation
CREATE TABLE IF NOT EXISTS dsers_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  sync_type VARCHAR(50) NOT NULL, -- products, orders, prices, stocks
  status VARCHAR(50) NOT NULL, -- success, failed, partial
  items_processed INTEGER DEFAULT 0,
  items_succeeded INTEGER DEFAULT 0,
  items_failed INTEGER DEFAULT 0,
  error_details JSONB,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  duration_ms INTEGER
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_dsers_integrations_user_store ON dsers_integrations(user_id, store_id);
CREATE INDEX IF NOT EXISTS idx_dsers_products_store_status ON dsers_products(store_id, import_status);
CREATE INDEX IF NOT EXISTS idx_dsers_products_sync_status ON dsers_products(store_id, sync_status);
CREATE INDEX IF NOT EXISTS idx_dsers_orders_store_status ON dsers_orders(store_id, fulfillment_status);
CREATE INDEX IF NOT EXISTS idx_dsers_sync_logs_store_type ON dsers_sync_logs(store_id, sync_type);

-- RLS Policies pour dsers_integrations
ALTER TABLE dsers_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own DSERS integrations" ON dsers_integrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own DSERS integrations" ON dsers_integrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own DSERS integrations" ON dsers_integrations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own DSERS integrations" ON dsers_integrations
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies pour dsers_products
ALTER TABLE dsers_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store owners can view their DSERS products" ON dsers_products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stores 
      JOIN profiles ON stores.merchant_id = profiles.id
      WHERE stores.id = dsers_products.store_id 
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Store owners can insert DSERS products" ON dsers_products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM stores 
      JOIN profiles ON stores.merchant_id = profiles.id
      WHERE stores.id = dsers_products.store_id 
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Store owners can update their DSERS products" ON dsers_products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM stores 
      JOIN profiles ON stores.merchant_id = profiles.id
      WHERE stores.id = dsers_products.store_id 
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Store owners can delete their DSERS products" ON dsers_products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM stores 
      JOIN profiles ON stores.merchant_id = profiles.id
      WHERE stores.id = dsers_products.store_id 
      AND profiles.user_id = auth.uid()
    )
  );

-- RLS Policies pour dsers_orders
ALTER TABLE dsers_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store owners can view their DSERS orders" ON dsers_orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stores 
      JOIN profiles ON stores.merchant_id = profiles.id
      WHERE stores.id = dsers_orders.store_id 
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Store owners can insert DSERS orders" ON dsers_orders
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM stores 
      JOIN profiles ON stores.merchant_id = profiles.id
      WHERE stores.id = dsers_orders.store_id 
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Store owners can update their DSERS orders" ON dsers_orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM stores 
      JOIN profiles ON stores.merchant_id = profiles.id
      WHERE stores.id = dsers_orders.store_id 
      AND profiles.user_id = auth.uid()
    )
  );

-- RLS Policies pour dsers_sync_logs
ALTER TABLE dsers_sync_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store owners can view their DSERS sync logs" ON dsers_sync_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stores 
      JOIN profiles ON stores.merchant_id = profiles.id
      WHERE stores.id = dsers_sync_logs.store_id 
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Store owners can insert DSERS sync logs" ON dsers_sync_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM stores 
      JOIN profiles ON stores.merchant_id = profiles.id
      WHERE stores.id = dsers_sync_logs.store_id 
      AND profiles.user_id = auth.uid()
    )
  );

-- Triggers pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_dsers_integrations_updated_at 
  BEFORE UPDATE ON dsers_integrations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dsers_products_updated_at 
  BEFORE UPDATE ON dsers_products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dsers_orders_updated_at 
  BEFORE UPDATE ON dsers_orders 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour nettoyer les anciens logs
CREATE OR REPLACE FUNCTION cleanup_old_dsers_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM dsers_sync_logs 
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Commentaires pour documentation
COMMENT ON TABLE dsers_integrations IS 'Intégrations DSERS pour chaque store';
COMMENT ON TABLE dsers_products IS 'Produits importés via DSERS depuis AliExpress';
COMMENT ON TABLE dsers_orders IS 'Commandes synchronisées avec DSERS';
COMMENT ON TABLE dsers_sync_logs IS 'Logs de synchronisation DSERS';
