import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  ExternalLink, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Activity,
  RefreshCw,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { DsersService } from '@/services/dsersService';
import { useToast } from '@/hooks/use-toast';
import { useStores } from '@/hooks/useStores';
import type { DsersIntegration, DsersProduct, DsersOrder, DsersSyncLog, DsersStats } from '@/types/dsers';
import DsersInstallButton from '@/components/integrations/DsersInstallButton';

export default function DsersIntegration() {
  const { store: selectedStore } = useStores();
  const { toast } = useToast();
  
  const [integration, setIntegration] = useState<DsersIntegration | null>(null);
  const [products, setProducts] = useState<DsersProduct[]>([]);
  const [orders, setOrders] = useState<DsersOrder[]>([]);
  const [syncLogs, setSyncLogs] = useState<DsersSyncLog[]>([]);
  const [stats, setStats] = useState<DsersStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (selectedStore) {
      loadIntegrationData();
    }
  }, [selectedStore]);

  const loadIntegrationData = async () => {
    if (!selectedStore) return;

    setIsLoading(true);
    try {
      // Charger l'intégration
      const integrationResult = await DsersService.getIntegration(selectedStore.id);
      if (integrationResult.success && integrationResult.data) {
        setIntegration(integrationResult.data);
        
        // Charger les données associées
        await Promise.all([
          loadProducts(),
          loadOrders(),
          loadSyncLogs(),
          loadStats()
        ]);
      }
    } catch (error) {
      console.error('Erreur chargement intégration DSERS:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProducts = async () => {
    if (!selectedStore) return;
    
    const result = await DsersService.getProducts(selectedStore.id);
    if (result.success) {
      setProducts(result.data || []);
    }
  };

  const loadOrders = async () => {
    if (!selectedStore) return;
    
    const result = await DsersService.getOrders(selectedStore.id);
    if (result.success) {
      setOrders(result.data || []);
    }
  };

  const loadSyncLogs = async () => {
    if (!selectedStore) return;
    
    const result = await DsersService.getSyncLogs(selectedStore.id);
    if (result.success) {
      setSyncLogs(result.data || []);
    }
  };

  const loadStats = async () => {
    if (!selectedStore) return;
    
    const result = await DsersService.getStats(selectedStore.id);
    if (result.success) {
      setStats(result.data || null);
    }
  };

  const handleSync = async (syncType: 'products' | 'orders' | 'prices' | 'stocks') => {
    if (!selectedStore) return;

    setIsSyncing(true);
    try {
      const result = await DsersService.syncData({
        store_id: selectedStore.id,
        sync_type: syncType
      });

      if (result.success) {
        toast({
          title: "Succès",
          description: `Synchronisation ${syncType} terminée avec succès`,
        });
        await loadIntegrationData(); // Recharger les données
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Erreur lors de la synchronisation",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la synchronisation",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const openDsersDashboard = () => {
    window.open('https://app.dsers.com', '_blank');
  };

  if (!selectedStore) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun store sélectionné</h3>
          <p className="text-muted-foreground">Veuillez sélectionner un store pour configurer DSERS</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!integration) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">DSERS Dropshipping</h1>
          <p className="text-muted-foreground">
            Importez des produits AliExpress automatiquement dans votre boutique
          </p>
        </div>
        
        <DsersInstallButton 
          storeId={selectedStore.id} 
          onInstallSuccess={loadIntegrationData}
        />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">DSERS Dropshipping</h1>
            <p className="text-muted-foreground">
              Intégration active - Synchronisation automatique des produits AliExpress
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3" />
              <span>Connecté</span>
            </Badge>
            <Button variant="outline" onClick={openDsersDashboard}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Ouvrir DSERS
            </Button>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Produits</p>
                  <p className="text-2xl font-bold">{stats.total_products}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Commandes</p>
                  <p className="text-2xl font-bold">{stats.total_orders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Revenus</p>
                  <p className="text-2xl font-bold">${stats.total_revenue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Statut</p>
                  <Badge variant={stats.sync_status === 'healthy' ? 'default' : 'destructive'}>
                    {stats.sync_status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions rapides */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>Synchronisez vos données DSERS</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              onClick={() => handleSync('products')}
              disabled={isSyncing}
              variant="outline"
              className="flex items-center space-x-2"
            >
              {isSyncing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span>Produits</span>
            </Button>
            
            <Button 
              onClick={() => handleSync('orders')}
              disabled={isSyncing}
              variant="outline"
              className="flex items-center space-x-2"
            >
              {isSyncing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span>Commandes</span>
            </Button>
            
            <Button 
              onClick={() => handleSync('prices')}
              disabled={isSyncing}
              variant="outline"
              className="flex items-center space-x-2"
            >
              {isSyncing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span>Prix</span>
            </Button>
            
            <Button 
              onClick={() => handleSync('stocks')}
              disabled={isSyncing}
              variant="outline"
              className="flex items-center space-x-2"
            >
              {isSyncing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span>Stocks</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Onglets */}
      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">Produits ({products.length})</TabsTrigger>
          <TabsTrigger value="orders">Commandes ({orders.length})</TabsTrigger>
          <TabsTrigger value="logs">Logs de sync</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Produits importés</CardTitle>
              <CardDescription>Produits AliExpress importés via DSERS</CardDescription>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucun produit importé pour le moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {product.product_data.images[0] && (
                          <img 
                            src={product.product_data.images[0]} 
                            alt={product.product_data.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <h4 className="font-medium">{product.product_data.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            ${product.product_data.price} - Stock: {product.product_data.stock_quantity}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={product.import_status === 'imported' ? 'default' : 'secondary'}>
                          {product.import_status}
                        </Badge>
                        <Badge variant={product.sync_status === 'synced' ? 'default' : 'outline'}>
                          {product.sync_status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commandes DSERS</CardTitle>
              <CardDescription>Commandes synchronisées avec DSERS</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucune commande pour le moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Commande #{order.order_data.order_number}</h4>
                        <p className="text-sm text-muted-foreground">
                          {order.order_data.customer_info.name} - ${order.order_data.total_amount}
                        </p>
                      </div>
                      <Badge variant={
                        order.fulfillment_status === 'delivered' ? 'default' :
                        order.fulfillment_status === 'shipped' ? 'secondary' :
                        'outline'
                      }>
                        {order.fulfillment_status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs de synchronisation</CardTitle>
              <CardDescription>Historique des synchronisations DSERS</CardDescription>
            </CardHeader>
            <CardContent>
              {syncLogs.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucun log de synchronisation</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {syncLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          log.status === 'success' ? 'bg-green-100 text-green-600' :
                          log.status === 'failed' ? 'bg-red-100 text-red-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {log.status === 'success' ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : log.status === 'failed' ? (
                            <AlertCircle className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium capitalize">{log.sync_type}</h4>
                          <p className="text-sm text-muted-foreground">
                            {log.items_succeeded} succès, {log.items_failed} échecs
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Date(log.started_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {log.duration_ms}ms
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres DSERS</CardTitle>
              <CardDescription>Configuration de l'intégration DSERS</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Markup prix (%)</label>
                    <p className="text-sm text-muted-foreground">
                      {integration.settings.price_markup_percentage}%
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Intervalle de sync</label>
                    <p className="text-sm text-muted-foreground">
                      {integration.settings.sync_interval_minutes} minutes
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className={`h-4 w-4 ${
                      integration.settings.auto_sync_prices ? 'text-green-600' : 'text-gray-400'
                    }`} />
                    <span className="text-sm">Synchronisation automatique des prix</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className={`h-4 w-4 ${
                      integration.settings.auto_sync_stocks ? 'text-green-600' : 'text-gray-400'
                    }`} />
                    <span className="text-sm">Synchronisation automatique des stocks</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className={`h-4 w-4 ${
                      integration.settings.auto_fulfill_orders ? 'text-green-600' : 'text-gray-400'
                    }`} />
                    <span className="text-sm">Fulfillment automatique des commandes</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Dernière synchronisation</p>
                    <p className="text-sm text-muted-foreground">
                      {integration.last_sync ? 
                        new Date(integration.last_sync).toLocaleString() : 
                        'Jamais'
                      }
                    </p>
                  </div>
                  <Button variant="outline" onClick={loadIntegrationData}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualiser
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </DashboardLayout>
  );
}
