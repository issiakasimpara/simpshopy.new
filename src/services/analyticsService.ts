import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  ordersByStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
}

class AnalyticsService {
  async getStoreAnalytics(storeId: string): Promise<AnalyticsData> {
    try {
      console.log('📊 Récupération analytics boutique:', storeId);

      // Récupérer toutes les commandes de la boutique
      const { data: orders, error } = await supabase
        .from('public_orders')
        .select('*')
        .eq('store_id', storeId);

      if (error) {
        console.error('❌ Erreur récupération commandes:', error);
        throw error;
      }

      if (!orders || orders.length === 0) {
        console.log('ℹ️ Aucune commande trouvée');
        return this.getEmptyAnalytics();
      }

      // Calculer les métriques de base
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
      const averageOrderValue = totalRevenue / totalOrders;

      // Compter les clients uniques
      const uniqueCustomers = new Set(orders.map(order => order.customer_email)).size;

      // Calculer les métriques de croissance (comparaison avec le mois précédent)
      const now = new Date();
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      const currentMonthOrders = orders.filter(order => 
        new Date(order.created_at) >= currentMonth
      );
      const previousMonthOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= previousMonth && orderDate < currentMonth;
      });

      const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + order.total_amount, 0);
      const previousMonthRevenue = previousMonthOrders.reduce((sum, order) => sum + order.total_amount, 0);

      const revenueGrowth = previousMonthRevenue > 0 
        ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
        : 0;

      const ordersGrowth = previousMonthOrders.length > 0 
        ? ((currentMonthOrders.length - previousMonthOrders.length) / previousMonthOrders.length) * 100 
        : 0;

      const currentMonthCustomers = new Set(currentMonthOrders.map(order => order.customer_email)).size;
      const previousMonthCustomers = new Set(previousMonthOrders.map(order => order.customer_email)).size;

      const customersGrowth = previousMonthCustomers > 0 
        ? ((currentMonthCustomers - previousMonthCustomers) / previousMonthCustomers) * 100 
        : 0;

      // Analyser les produits les plus vendus
      const productSales = new Map<string, { sales: number; revenue: number }>();
      
      orders.forEach(order => {
        if (Array.isArray(order.items)) {
          order.items.forEach((item: any) => {
            const productName = item.name || 'Produit inconnu';
            const quantity = item.quantity || 1;
            const price = item.price || 0;
            
            if (!productSales.has(productName)) {
              productSales.set(productName, { sales: 0, revenue: 0 });
            }
            
            const current = productSales.get(productName)!;
            current.sales += quantity;
            current.revenue += quantity * price;
          });
        }
      });

      const topProducts = Array.from(productSales.entries())
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Analyser les revenus par mois (6 derniers mois)
      const revenueByMonth = [];
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        
        const monthOrders = orders.filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate >= monthDate && orderDate < nextMonth;
        });

        revenueByMonth.push({
          month: monthDate.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
          revenue: monthOrders.reduce((sum, order) => sum + order.total_amount, 0),
          orders: monthOrders.length
        });
      }

      // Analyser les commandes par statut
      const statusCounts = new Map<string, number>();
      orders.forEach(order => {
        const status = order.status || 'pending';
        statusCounts.set(status, (statusCounts.get(status) || 0) + 1);
      });

      const ordersByStatus = Array.from(statusCounts.entries()).map(([status, count]) => ({
        status,
        count,
        percentage: (count / totalOrders) * 100
      }));

      console.log('✅ Analytics calculées:', {
        totalRevenue,
        totalOrders,
        totalCustomers: uniqueCustomers
      });

      return {
        totalRevenue,
        totalOrders,
        totalCustomers: uniqueCustomers,
        averageOrderValue,
        revenueGrowth,
        ordersGrowth,
        customersGrowth,
        topProducts,
        revenueByMonth,
        ordersByStatus
      };
    } catch (error) {
      console.error('❌ Erreur service analytics:', error);
      throw error;
    }
  }

  private getEmptyAnalytics(): AnalyticsData {
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      averageOrderValue: 0,
      revenueGrowth: 0,
      ordersGrowth: 0,
      customersGrowth: 0,
      topProducts: [],
      revenueByMonth: [],
      ordersByStatus: []
    };
  }
}

export const analyticsService = new AnalyticsService();
