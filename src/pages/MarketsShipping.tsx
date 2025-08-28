// ========================================
// PAGE MARCHÉS ET LIVRAISONS (COMME SHOPIFY)
// ========================================

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useStores } from '@/hooks/useStores';
import { useMarkets } from '@/hooks/useMarkets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Truck, Globe, Store, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import NoStoreSelected from '@/components/products/NoStoreSelected';
import CreateMarketDialog from '@/components/markets/CreateMarketDialog';
import CreateShippingMethodDialog from '@/components/markets/CreateShippingMethodDialog';
import InitializeMarketsDatabase from '@/components/markets/InitializeMarketsDatabase';

// Mapping des codes pays vers les noms complets
const COUNTRY_NAMES: Record<string, string> = {
  'BJ': 'Bénin',
  'BF': 'Burkina Faso',
  'BI': 'Burundi',
  'CM': 'Cameroun',
  'CF': 'Centrafrique',
  'KM': 'Comores',
  'CG': 'Congo',
  'CD': 'Congo (RDC)',
  'CI': "Côte d'Ivoire",
  'DJ': 'Djibouti',
  'GA': 'Gabon',
  'GN': 'Guinée',
  'GQ': 'Guinée équatoriale',
  'MG': 'Madagascar',
  'ML': 'Mali',
  'MA': 'Maroc',
  'MU': 'Maurice',
  'MR': 'Mauritanie',
  'NE': 'Niger',
  'RW': 'Rwanda',
  'SN': 'Sénégal',
  'SC': 'Seychelles',
  'TD': 'Tchad',
  'TG': 'Togo',
  'TN': 'Tunisie'
};

const MarketsShipping = () => {
  const { stores, isLoading: isLoadingStores } = useStores();
  const [createMarketOpen, setCreateMarketOpen] = useState(false);
  const [createMethodOpen, setCreateMethodOpen] = useState(false);
  const [editingShippingMethod, setEditingShippingMethod] = useState<any>(null);
  const [editingMarket, setEditingMarket] = useState<any>(null);

  // Sélectionner automatiquement la première boutique
  const currentStore = stores.length > 0 ? stores[0] : null;
  const storeId = currentStore?.id || '';

  const {
    markets,
    allShippingMethods,
    isLoading,
    createMarket,
    updateMarket,
    deleteMarket,
    createShippingMethod,
    updateShippingMethod,
    deleteShippingMethod,
    isCreatingMarket,
    isUpdatingMarket,
    isDeletingMarket,
    isCreatingMethod,
    isUpdatingMethod,
    isDeletingMethod,
    marketsError,
    methodsError
  } = useMarkets(storeId);

  // Handlers pour les marchés
  const handleEditMarket = (market: any) => {
    setEditingMarket(market);
    setCreateMarketOpen(true);
  };

  const handleDeleteMarket = (marketId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce marché ? Toutes les méthodes de livraison associées seront également supprimées.')) {
      deleteMarket(marketId);
    }
  };

  // Handlers pour les méthodes de livraison
  const handleEditShippingMethod = (method: any) => {
    setEditingShippingMethod(method);
    setCreateMethodOpen(true);
  };

  const handleDeleteShippingMethod = (methodId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette méthode de livraison ?')) {
      deleteShippingMethod(methodId);
    }
  };

  // Vérifier si les tables existent (erreur de table non trouvée)
  const tablesNotExist = marketsError?.message?.includes('relation "public.markets" does not exist') ||
                        methodsError?.message?.includes('relation "public.shipping_methods" does not exist');

  if (isLoadingStores) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!currentStore) {
    return (
      <DashboardLayout>
        <NoStoreSelected />
      </DashboardLayout>
    );
  }

  // Si les tables n'existent pas, afficher le composant d'initialisation
  if (tablesNotExist) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Marchés et Livraisons</h1>
            <p className="text-gray-600 mt-1">
              Configuration initiale requise
            </p>
          </div>
          <InitializeMarketsDatabase />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Marchés et Livraisons</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Gérez vos zones de vente et méthodes de livraison comme sur Shopify
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
            <span className="text-xs sm:text-sm text-gray-600">{currentStore.name}</span>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Marchés actifs</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {markets.filter(m => m.is_active).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Truck className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Méthodes de livraison</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {allShippingMethods.filter(m => m.is_active).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Store className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pays couverts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {[...new Set(markets.flatMap(m => m.countries))].length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="markets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="markets" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Marchés
            </TabsTrigger>
            <TabsTrigger value="methods" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Méthodes de livraison
            </TabsTrigger>
          </TabsList>

          {/* Onglet Marchés */}
          <TabsContent value="markets" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Marchés (Zones de vente)
                    </CardTitle>
                    <CardDescription>
                      Créez des marchés pour définir où vous vendez vos produits
                    </CardDescription>
                  </div>
                  <Button onClick={() => setCreateMarketOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau marché
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Chargement des marchés...</p>
                  </div>
                ) : markets.length === 0 ? (
                  <div className="text-center py-12">
                    <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucun marché configuré
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Créez votre premier marché pour commencer à vendre
                    </p>
                    <Button onClick={() => setCreateMarketOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Créer un marché
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {markets.map((market) => (
                      <div
                        key={market.id}
                        className="border rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{market.name}</h3>
                            <p className="text-sm text-gray-600">
                              {market.countries.length} pays : {market.countries.map(code => COUNTRY_NAMES[code] || code).join(', ')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              market.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {market.is_active ? 'Actif' : 'Inactif'}
                            </span>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEditMarket(market)}
                                  className="flex items-center gap-2"
                                >
                                  <Edit className="h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteMarket(market.id)}
                                  className="flex items-center gap-2 text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Méthodes de livraison */}
          <TabsContent value="methods" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Méthodes de livraison
                    </CardTitle>
                    <CardDescription>
                      Configurez vos options de livraison pour chaque marché
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => setCreateMethodOpen(true)}
                    disabled={markets.length === 0}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle méthode
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {markets.length === 0 ? (
                  <div className="text-center py-12">
                    <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Créez d'abord un marché
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Vous devez créer au moins un marché avant d'ajouter des méthodes de livraison
                    </p>
                    <Button onClick={() => setCreateMarketOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Créer un marché
                    </Button>
                  </div>
                ) : allShippingMethods.length === 0 ? (
                  <div className="text-center py-12">
                    <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucune méthode de livraison
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Ajoutez des méthodes de livraison pour vos marchés
                    </p>
                    <Button onClick={() => setCreateMethodOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une méthode
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allShippingMethods.map((method) => (
                      <div
                        key={method.id}
                        className="border rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{method.name}</h3>
                            <p className="text-sm text-gray-600">
                              {method.market?.name} • {method.price} CFA • {
                                method.conditions?.display_text ||
                                (method.estimated_min_days === 0 && method.estimated_max_days === 0
                                  ? 'Instantané'
                                  : `${method.estimated_min_days}-${method.estimated_max_days} jours`)
                              }
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              method.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {method.is_active ? 'Actif' : 'Inactif'}
                            </span>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEditShippingMethod(method)}
                                  className="flex items-center gap-2"
                                >
                                  <Edit className="h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteShippingMethod(method.id)}
                                  className="flex items-center gap-2 text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialogues de création */}
        <CreateMarketDialog
          open={createMarketOpen}
          onOpenChange={(open) => {
            setCreateMarketOpen(open);
            if (!open) {
              setEditingMarket(null);
            }
          }}
          storeId={storeId}
          editingMarket={editingMarket}
          onSuccess={() => {
            setCreateMarketOpen(false);
            setEditingMarket(null);
          }}
        />

        <CreateShippingMethodDialog
          open={createMethodOpen}
          onOpenChange={(open) => {
            setCreateMethodOpen(open);
            if (!open) {
              setEditingShippingMethod(null);
            }
          }}
          storeId={storeId}
          markets={markets}
          editingMethod={editingShippingMethod}
          onSuccess={() => {
            setCreateMethodOpen(false);
            setEditingShippingMethod(null);
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default MarketsShipping;
