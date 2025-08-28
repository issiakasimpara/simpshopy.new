// Types pour l'intégration DSERS Dropshipping

export interface DsersIntegration {
  id: string;
  user_id: string;
  store_id: string;
  api_key: string;
  api_secret: string;
  webhook_url?: string;
  is_active: boolean;
  settings: DsersSettings;
  last_sync?: string;
  sync_interval: number;
  created_at: string;
  updated_at: string;
}

export interface DsersSettings {
  auto_sync_prices: boolean;
  auto_sync_stocks: boolean;
  auto_fulfill_orders: boolean;
  price_markup_percentage: number;
  sync_interval_minutes: number;
  notification_email?: string;
}

export interface DsersProduct {
  id: string;
  store_id: string;
  dsers_product_id: string;
  ali_express_url?: string;
  product_data: DsersProductData;
  import_status: 'pending' | 'imported' | 'failed' | 'syncing';
  sync_status: 'pending' | 'synced' | 'failed';
  price_sync: boolean;
  stock_sync: boolean;
  last_price_sync?: string;
  last_stock_sync?: string;
  last_full_sync?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface DsersProductData {
  title: string;
  description: string;
  images: string[];
  price: number;
  original_price: number;
  currency: string;
  stock_quantity: number;
  variants: DsersProductVariant[];
  categories: string[];
  tags: string[];
  shipping_info: DsersShippingInfo;
  supplier_info: DsersSupplierInfo;
  ali_express_data: any; // Données brutes AliExpress
}

export interface DsersProductVariant {
  id: string;
  name: string;
  value: string;
  price: number;
  stock_quantity: number;
  images?: string[];
}

export interface DsersShippingInfo {
  free_shipping: boolean;
  shipping_cost: number;
  shipping_time_min: number;
  shipping_time_max: number;
  shipping_methods: string[];
}

export interface DsersSupplierInfo {
  name: string;
  rating: number;
  feedback_score: number;
  response_rate: number;
  response_time: number;
}

export interface DsersOrder {
  id: string;
  store_id: string;
  dsers_order_id: string;
  simpshopy_order_id?: string;
  order_data: DsersOrderData;
  fulfillment_status: 'pending' | 'fulfilled' | 'shipped' | 'delivered';
  tracking_number?: string;
  tracking_url?: string;
  fulfillment_date?: string;
  created_at: string;
  updated_at: string;
}

export interface DsersOrderData {
  order_number: string;
  customer_info: DsersCustomerInfo;
  items: DsersOrderItem[];
  total_amount: number;
  currency: string;
  shipping_address: DsersShippingAddress;
  payment_status: string;
  order_status: string;
  created_at: string;
}

export interface DsersCustomerInfo {
  name: string;
  email: string;
  phone?: string;
}

export interface DsersOrderItem {
  product_id: string;
  variant_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_title: string;
  variant_name?: string;
}

export interface DsersShippingAddress {
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface DsersSyncLog {
  id: string;
  store_id: string;
  sync_type: 'products' | 'orders' | 'prices' | 'stocks';
  status: 'success' | 'failed' | 'partial';
  items_processed: number;
  items_succeeded: number;
  items_failed: number;
  error_details?: any;
  started_at: string;
  completed_at?: string;
  duration_ms?: number;
}

// Types pour les requêtes API DSERS
export interface DsersApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DsersImportProductRequest {
  ali_express_url: string;
  store_id: string;
  category_id?: string;
  price_markup_percentage?: number;
  auto_sync?: boolean;
}

export interface DsersSyncRequest {
  store_id: string;
  sync_type: 'products' | 'orders' | 'prices' | 'stocks';
  force_full_sync?: boolean;
}

export interface DsersFulfillOrderRequest {
  order_id: string;
  tracking_number?: string;
  tracking_url?: string;
  notes?: string;
}

// Types pour les webhooks DSERS
export interface DsersWebhookPayload {
  event_type: 'order_created' | 'order_updated' | 'product_updated' | 'stock_updated';
  store_id: string;
  data: any;
  timestamp: string;
  signature: string;
}

// Types pour les statistiques DSERS
export interface DsersStats {
  total_products: number;
  active_products: number;
  total_orders: number;
  pending_orders: number;
  fulfilled_orders: number;
  total_revenue: number;
  last_sync: string;
  sync_status: 'healthy' | 'warning' | 'error';
}

// Types pour les erreurs DSERS
export interface DsersError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Types pour les notifications DSERS
export interface DsersNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  data?: any;
  created_at: string;
  read: boolean;
}
