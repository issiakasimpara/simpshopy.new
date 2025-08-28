import { supabase } from '@/integrations/supabase/client';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  product_id?: string;
}

export interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface CreateOrderData {
  storeId: string;
  storeName: string;
  items: OrderItem[];
  customerInfo: CustomerInfo;
  paymentMethod: string;
  totalAmount: number;
  currency: string;
  shippingCost?: number;
  shippingMethod?: {
    id: string;
    name: string;
    delivery_time: string;
    price: number;
  };
  shippingCountry?: string;
}

export interface Order {
  id: string;
  order_number: string;
  store_id: string | null;
  customer_email: string;
  customer_name: string | null;
  customer_phone: string | null;
  items: OrderItem[];
  total_amount: number;
  currency: string;
  status: string;
  shipping_address?: any;
  billing_address?: any;
  shipping_method?: {
    id: string;
    name: string;
    delivery_time: string;
    price: number;
  };
  shipping_country?: string;
  created_at: string;
  updated_at: string;
}

class OrderService {
  // Générer un numéro de commande unique
  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `ORD-${timestamp}-${random}`.toUpperCase();
  }

  // Créer une nouvelle commande
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    try {
      console.log('🛒 Création de commande:', orderData);

      const orderNumber = this.generateOrderNumber();

      console.log('📝 Création commande avec public_orders');

      const { data, error } = await supabase
        .from('public_orders')
        .insert({
          order_number: orderNumber,
          store_id: orderData.storeId,
          customer_email: orderData.customerInfo.email.toLowerCase().trim(),
          customer_name: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`.trim(),
          customer_phone: orderData.customerInfo.phone || null,
          items: orderData.items,
          total_amount: orderData.totalAmount,
          currency: orderData.currency,
          status: 'pending',
          shipping_address: {
            street: orderData.customerInfo.address,
            city: orderData.customerInfo.city,
            postal_code: orderData.customerInfo.postalCode,
            country: orderData.customerInfo.country
          },
          billing_address: {
            street: orderData.customerInfo.address,
            city: orderData.customerInfo.city,
            postal_code: orderData.customerInfo.postalCode,
            country: orderData.customerInfo.country
          },
          shipping_method: orderData.shippingMethod || null,
          shipping_country: orderData.shippingCountry || orderData.customerInfo.country,
          shipping_cost: orderData.shippingCost || 0
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur création commande:', error);
        throw error;
      }

      console.log('✅ Commande créée:', data);
      return data as Order;
    } catch (error) {
      console.error('❌ Erreur service commande:', error);
      throw error;
    }
  }

  // Récupérer les commandes d'une boutique (pour le marchand)
  async getStoreOrders(storeId: string): Promise<Order[]> {
    try {
      console.log('📊 Récupération commandes boutique:', storeId);

      const { data, error } = await supabase
        .from('public_orders')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur récupération commandes:', error);
        throw error;
      }

      console.log('✅ Commandes récupérées:', data?.length || 0);
      return (data || []) as Order[];
    } catch (error) {
      console.error('❌ Erreur service commandes:', error);
      throw error;
    }
  }

  // Récupérer les commandes d'un client
  async getCustomerOrders(email: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('public_orders')
        .select('*')
        .eq('customer_email', email.toLowerCase().trim())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Order[];
    } catch (error) {
      console.error('❌ Erreur récupération commandes client:', error);
      throw error;
    }
  }

  // Mettre à jour le statut d'une commande
  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    try {
      const { data, error } = await supabase
        .from('public_orders')
        .update({
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data as Order;
    } catch (error) {
      console.error('❌ Erreur mise à jour statut:', error);
      throw error;
    }
  }

  // Mettre à jour le statut de paiement
  async updatePaymentStatus(orderId: string, status: string): Promise<Order> {
    try {
      // Note: public_orders n'a pas de colonne payment_status
      // On pourrait l'ajouter ou utiliser le champ status pour le paiement
      const { data, error } = await supabase
        .from('public_orders')
        .update({
          status: status === 'paid' ? 'confirmed' : 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data as Order;
    } catch (error) {
      console.error('❌ Erreur mise à jour paiement:', error);
      throw error;
    }
  }

  // Statistiques pour le dashboard
  async getStoreStats(storeId: string) {
    try {
      console.log('📈 Récupération statistiques boutique:', storeId);

      const { data: orders, error } = await supabase
        .from('public_orders')
        .select('total_amount, status, created_at')
        .eq('store_id', storeId);

      if (error) throw error;

      const stats = {
        totalRevenue: 0,
        totalOrders: orders?.length || 0,
        pendingOrders: 0,
        completedOrders: 0,
        todayOrders: 0,
        todayRevenue: 0
      };

      if (orders) {
        const today = new Date().toISOString().split('T')[0];

        orders.forEach(order => {
          stats.totalRevenue += order.total_amount;

          if (order.status === 'pending') stats.pendingOrders++;
          if (order.status === 'delivered' || order.status === 'confirmed') stats.completedOrders++;

          if (order.created_at.startsWith(today)) {
            stats.todayOrders++;
            stats.todayRevenue += order.total_amount;
          }
        });
      }

      console.log('✅ Statistiques calculées:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Erreur statistiques:', error);
      throw error;
    }
  }
}

export const orderService = new OrderService();
