import { supabase } from '@/integrations/supabase/client';

export interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  firstOrderDate: string;
  status: 'active' | 'inactive';
}

export interface CustomerStats {
  totalCustomers: number;
  newCustomersThisMonth: number;
  activeCustomers: number;
  averageOrderValue: number;
}

class CustomerService {
  // Récupérer les clients d'une boutique depuis les commandes
  async getStoreCustomers(storeId: string): Promise<Customer[]> {
    try {
      console.log('📊 Récupération clients boutique:', storeId);

      // Récupérer toutes les commandes de la boutique
      const { data: orders, error } = await supabase
        .from('public_orders')
        .select('customer_email, customer_name, customer_phone, total_amount, created_at')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur récupération commandes:', error);
        throw error;
      }

      if (!orders || orders.length === 0) {
        console.log('ℹ️ Aucune commande trouvée');
        return [];
      }

      // Grouper les commandes par client (email)
      const customerMap = new Map<string, {
        email: string;
        name: string;
        phone?: string;
        orders: Array<{ amount: number; date: string }>;
      }>();

      orders.forEach(order => {
        const email = order.customer_email.toLowerCase().trim();
        
        if (!customerMap.has(email)) {
          customerMap.set(email, {
            email,
            name: order.customer_name || 'Client anonyme',
            phone: order.customer_phone || undefined,
            orders: []
          });
        }

        customerMap.get(email)!.orders.push({
          amount: order.total_amount,
          date: order.created_at
        });
      });

      // Convertir en tableau de clients avec statistiques
      const customers: Customer[] = Array.from(customerMap.entries()).map(([email, data]) => {
        const sortedOrders = data.orders.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const totalSpent = data.orders.reduce((sum, order) => sum + order.amount, 0);
        const lastOrderDate = sortedOrders[sortedOrders.length - 1].date;
        const firstOrderDate = sortedOrders[0].date;
        
        // Considérer un client comme actif s'il a commandé dans les 90 derniers jours
        const lastOrder = new Date(lastOrderDate);
        const now = new Date();
        const daysSinceLastOrder = (now.getTime() - lastOrder.getTime()) / (1000 * 60 * 60 * 24);
        const isActive = daysSinceLastOrder <= 90;

        return {
          id: email, // Utiliser l'email comme ID unique
          email,
          name: data.name,
          phone: data.phone,
          totalOrders: data.orders.length,
          totalSpent,
          lastOrderDate,
          firstOrderDate,
          status: isActive ? 'active' : 'inactive'
        };
      });

      // Trier par total dépensé (clients les plus importants en premier)
      customers.sort((a, b) => b.totalSpent - a.totalSpent);

      console.log('✅ Clients récupérés:', customers.length);
      return customers;
    } catch (error) {
      console.error('❌ Erreur service clients:', error);
      throw error;
    }
  }

  // Récupérer les statistiques des clients
  async getCustomerStats(storeId: string): Promise<CustomerStats> {
    try {
      const customers = await this.getStoreCustomers(storeId);
      
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const newCustomersThisMonth = customers.filter(customer => 
        new Date(customer.firstOrderDate) >= startOfMonth
      ).length;
      
      const activeCustomers = customers.filter(customer => 
        customer.status === 'active'
      ).length;
      
      const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
      const totalOrders = customers.reduce((sum, customer) => sum + customer.totalOrders, 0);
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      return {
        totalCustomers: customers.length,
        newCustomersThisMonth,
        activeCustomers,
        averageOrderValue
      };
    } catch (error) {
      console.error('❌ Erreur statistiques clients:', error);
      throw error;
    }
  }
}

export const customerService = new CustomerService();
