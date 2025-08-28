
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ArrowRight, Plus, Calendar, User, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useOrders } from "@/hooks/useOrders";
import { getOrderStatusBadge, formatCurrency } from "@/utils/orderUtils";

const RecentOrders = () => {
  const { orders, isLoading } = useOrders();

  // Prendre les 5 dernières commandes
  const recentOrders = orders.slice(0, 5);


  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-background via-background to-muted/20 backdrop-blur-sm overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 sm:pb-6 bg-gradient-to-r from-blue-50/30 via-purple-50/30 to-pink-50/30 dark:from-blue-950/10 dark:via-purple-950/10 dark:to-pink-950/10 gap-3 sm:gap-0">
        <div className="space-y-1 sm:space-y-2">
          <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Commandes récentes
          </CardTitle>
          <CardDescription className="text-sm sm:text-base font-medium">Vos dernières ventes</CardDescription>
        </div>
        <Button variant="outline" size="default" asChild className="group hover:bg-blue-50 dark:hover:bg-blue-950/30 border-2 hover:border-blue-500/50 transition-all duration-300">
          <Link to="/orders">
            <span className="text-sm sm:text-base">Voir tout</span>
            <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6">
        {isLoading ? (
          <div className="text-center py-8 sm:py-12">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin mx-auto mb-3 sm:mb-4 text-blue-600" />
            <p className="text-sm sm:text-base text-muted-foreground">Chargement des commandes...</p>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="relative mx-auto mb-4 sm:mb-6 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center shadow-lg">
              <ShoppingCart className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-4 sm:mb-6 font-medium">Aucune commande pour le moment</p>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Link to="/products">
                <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-sm sm:text-base">Ajouter des produits</span>
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-all duration-200 gap-2 sm:gap-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                    <h4 className="font-semibold text-foreground text-sm sm:text-base">#{order.order_number}</h4>
                    {getOrderStatusBadge(order.status)}
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span className="truncate">{order.customer_name || order.customer_email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground text-sm sm:text-base">{formatCurrency(order.total_amount, order.currency)}</p>
                  <p className="text-xs text-muted-foreground">{Array.isArray(order.items) ? order.items.length : 0} article{Array.isArray(order.items) && order.items.length > 1 ? 's' : ''}</p>
                </div>
              </div>
            ))}

            {orders.length > 5 && (
              <div className="text-center pt-3 sm:pt-4">
                <Button variant="outline" asChild className="group">
                  <Link to="/orders">
                    <span className="text-sm sm:text-base">Voir toutes les commandes ({orders.length})</span>
                    <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
