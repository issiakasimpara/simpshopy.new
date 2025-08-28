import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, TrendingDown, DollarSign, Calendar, Mail, Trash2 } from 'lucide-react';
import { useAbandonedCarts } from '@/hooks/useAbandonedCarts';
import { useStoreCurrency } from '@/hooks/useStoreCurrency';
import { useStores } from '@/hooks/useStores';

interface AbandonedCartsWidgetProps {
  maxItems?: number;
}

const AbandonedCartsWidget: React.FC<AbandonedCartsWidgetProps> = ({ maxItems = 3 }) => {
  const { store } = useStores();
  const { formatConvertedPrice } = useStoreCurrency(store?.id);
  const {
    abandonedCarts,
    stats: abandonedStats,
    isLoading,
    deleteAbandonedCart,
    sendReminderEmail
  } = useAbandonedCarts(store?.id);

  // Prendre seulement les premiers éléments pour le widget
  const recentAbandonedCarts = abandonedCarts.slice(0, maxItems);

  if (isLoading) {
    return (
      <Card className="col-span-full lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Paniers abandonnés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-orange-600" />
          Paniers abandonnés
          <Badge variant="secondary" className="ml-auto">
            {abandonedStats.totalAbandoned}
          </Badge>
        </CardTitle>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {formatConvertedPrice(abandonedStats.totalValue, 'XOF')}
            </span>
            <span className="flex items-center gap-1">
              <TrendingDown className="h-4 w-4" />
              {abandonedStats.recentAbandoned} aujourd'hui
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {recentAbandonedCarts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm">Aucun panier abandonné</p>
            <p className="text-xs">Tous vos clients finalisent leurs achats !</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentAbandonedCarts.map((cart) => (
              <div key={cart.id} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        #{cart.session_id.slice(-6)}
                      </span>
                      <Badge 
                        variant={cart.days_abandoned > 7 ? "destructive" : cart.days_abandoned > 3 ? "secondary" : "default"}
                        className="text-xs"
                      >
                        {cart.days_abandoned}j
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {cart.items.length} article{cart.items.length > 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(cart.created_at).toLocaleDateString()}
                    </p>
                    {cart.customer_email && (
                      <p className="text-xs text-gray-500 truncate">
                        {cart.customer_email}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatConvertedPrice(cart.total_value, 'XOF')}
                    </p>
                    <div className="flex gap-1 mt-2">
                      {cart.customer_email && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => sendReminderEmail(cart)}
                          className="h-6 w-6 p-0"
                        >
                          <Mail className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAbandonedCart(cart.id)}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {abandonedCarts.length > maxItems && (
              <div className="text-center pt-2">
                <Button variant="outline" size="sm" className="text-xs">
                  Voir tous ({abandonedCarts.length})
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AbandonedCartsWidget;
