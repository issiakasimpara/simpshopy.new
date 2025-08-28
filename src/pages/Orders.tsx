import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Package, Calendar, Eye, Edit, Loader2, ShoppingCart, Mail, Trash2, TrendingUp, DollarSign, Users } from 'lucide-react';
import { useStores } from '@/hooks/useStores';
import { useOrders } from '@/hooks/useOrders';
import { useAbandonedCarts } from '@/hooks/useAbandonedCarts';
import { useStoreCurrency } from '@/hooks/useStoreCurrency';
import { useToast } from '@/hooks/use-toast';
import { Order } from '@/services/orderService';
import { getOrderStatusBadge, getPaymentStatusBadge, formatCurrency } from '@/utils/orderUtils';
import DashboardLayout from '@/components/DashboardLayout';
import OrderDetailsModal from '@/components/OrderDetailsModal';

const Orders = () => {
  const { store } = useStores();
  const { formatConvertedPrice } = useStoreCurrency(store?.id);
  const { toast } = useToast();
  const {
    orders,
    isLoading,
    updateOrderStatus,
    updatePaymentStatus,
    isUpdatingStatus,
    isUpdatingPayment,
    refetchOrders
  } = useOrders();

  const {
    abandonedCarts,
    stats: abandonedStats,
    isLoading: isLoadingAbandoned,
    fetchAbandonedCarts,
    deleteAbandonedCart,
    sendReminderEmail
  } = useAbandonedCarts(store?.id);

  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const filterOrders = () => {
    let results = [...orders];

    if (searchTerm) {
      results = results.filter(order =>
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customer_name && order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.customer_phone && order.customer_phone.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      results = results.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(results);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrderStatus({ orderId, status: newStatus });
  };

  const handlePaymentStatusChange = (orderId: string, newStatus: string) => {
    updatePaymentStatus({ orderId, status: newStatus });
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsOrderModalOpen(false);
    setSelectedOrder(null);
  };



  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="p-2 sm:p-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200">
            Gestion des commandes
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Visualisez et gérez les commandes et paniers abandonnés de votre boutique
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orders" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Package className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Commandes</span>
              <span className="sm:hidden">Cmd</span>
              ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="abandoned" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Paniers abandonnés</span>
              <span className="sm:hidden">Paniers</span>
              ({abandonedCarts.length})
            </TabsTrigger>
          </TabsList>

          {/* Onglet Commandes */}
          <TabsContent value="orders" className="space-y-4 sm:space-y-6">
            {/* Filters */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Rechercher une commande..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Select onValueChange={handleStatusFilterChange}>
                      <SelectTrigger className="w-full bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Filtrer par statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="confirmed">Confirmée</SelectItem>
                        <SelectItem value="processing">En traitement</SelectItem>
                        <SelectItem value="shipped">Expédiée</SelectItem>
                        <SelectItem value="delivered">Livrée</SelectItem>
                        <SelectItem value="cancelled">Annulée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Orders List */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement des commandes...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <Card className="shadow-lg border-0">
                <CardContent className="text-center py-16">
                  <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-2xl w-fit mx-auto mb-6">
                    <Package className="h-12 w-12 mx-auto text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Aucune commande trouvée
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg max-w-md mx-auto">
                    Il n'y a aucune commande correspondant à vos critères de recherche.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {filteredOrders.map(order => (
                  <Card key={order.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                    <CardContent className="p-3 sm:p-4 lg:p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
                        <div className="flex-1 space-y-2">
                          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                            Commande #{order.order_number}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            <Calendar className="inline-block h-4 w-4 mr-1" />
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            Client: {order.customer_name || order.customer_email}
                          </p>
                        </div>
                        <div className="text-right">
                          {getOrderStatusBadge(order.status)}
                          <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                            {formatCurrency(order.total_amount, order.currency)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </Button>
                        <Button>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Onglet Paniers abandonnés */}
          <TabsContent value="abandoned" className="space-y-6">
            {/* Statistiques des paniers abandonnés */}
            {abandonedStats.totalAbandoned > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border-red-200/50 dark:border-red-800/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-600 dark:text-red-400">Total abandonnés</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{abandonedStats.totalAbandoned}</p>
                      </div>
                      <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                        <ShoppingCart className="h-5 w-5 text-red-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-orange-200/50 dark:border-orange-800/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Valeur perdue</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{formatConvertedPrice(abandonedStats.totalValue, 'XOF')}</p>
                      </div>
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                        <DollarSign className="h-5 w-5 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200/50 dark:border-blue-800/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Récent (24h)</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{abandonedStats.recentAbandoned}</p>
                      </div>
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200/50 dark:border-green-800/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">Taux conversion</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{abandonedStats.conversionRate.toFixed(1)}%</p>
                      </div>
                      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {isLoadingAbandoned ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement des paniers abandonnés...</p>
              </div>
            ) : abandonedCarts.length === 0 ? (
              <Card className="shadow-lg border-0">
                <CardContent className="text-center py-16">
                  <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-2xl w-fit mx-auto mb-6">
                    <ShoppingCart className="h-12 w-12 mx-auto text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Aucun panier abandonné
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg max-w-md mx-auto">
                    Excellent ! Tous vos clients finalisent leurs achats.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {abandonedCarts.map(cart => (
                  <Card key={cart.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                              Session #{cart.session_id.slice(-8)}
                            </h3>
                            <Badge variant={cart.days_abandoned > 7 ? "destructive" : cart.days_abandoned > 3 ? "secondary" : "default"}>
                              {cart.days_abandoned} jour{cart.days_abandoned > 1 ? 's' : ''}
                            </Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">
                            <Calendar className="inline-block h-4 w-4 mr-1" />
                            {new Date(cart.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {cart.items.length} article{cart.items.length > 1 ? 's' : ''} • 
                            {cart.customer_email ? ` Client: ${cart.customer_email}` : ' Client anonyme'}
                          </p>
                          <div className="text-sm text-gray-500">
                            Articles: {cart.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                            {formatConvertedPrice(cart.total_value, 'XOF')}
                          </p>
                          <p className="text-sm text-gray-500">
                            Valeur perdue
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => sendReminderEmail(cart)}
                          disabled={!cart.customer_email}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Envoyer rappel
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteAbandonedCart(cart.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal des détails de commande */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isOrderModalOpen}
        onClose={handleCloseModal}
      />
    </DashboardLayout>
  );
};

export default Orders;
