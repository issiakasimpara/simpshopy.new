import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Package, Calendar, CreditCard, CheckCircle, Clock, Truck, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { usePublicOrders, PublicOrder } from '@/hooks/usePublicOrders';
import { getOrderStatusBadge, formatCurrency } from '@/utils/orderUtils';

const CustomerOrders = () => {
  const [searchEmail, setSearchEmail] = useState('');
  const [searchOrderNumber, setSearchOrderNumber] = useState('');
  const [searchResults, setSearchResults] = useState<PublicOrder[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();
  const { isLoading, searchOrders } = usePublicOrders();

  const handleSearch = async () => {
    if (!searchEmail && !searchOrderNumber) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir votre email ou votre numéro de commande.",
        variant: "destructive"
      });
      return;
    }
    
    setHasSearched(true);
    
    try {
      const results = await searchOrders(searchEmail, searchOrderNumber);
      setSearchResults(results);
      
      if (results && results.length > 0) {
        toast({
          title: "Succès",
          description: `${results.length} commande${results.length > 1 ? 's' : ''} trouvée${results.length > 1 ? 's' : ''}.`,
        });
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue.",
        variant: "destructive"
      });
      setSearchResults([]);
    }
  };



  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'processing':
        return <Package className="h-4 w-4 text-orange-600" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-purple-600" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Votre commande est en cours de traitement';
      case 'confirmed':
        return 'Votre commande a été confirmée';
      case 'processing':
        return 'Votre commande est en préparation';
      case 'shipped':
        return 'Votre commande a été expédiée';
      case 'delivered':
        return 'Votre commande a été livrée';
      case 'cancelled':
        return 'Votre commande a été annulée';
      default:
        return 'Statut en cours de mise à jour';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Suivi de mes commandes
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Recherchez vos commandes en utilisant votre email ou votre numéro de commande
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8 shadow-lg border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Search className="h-5 w-5 text-emerald-600" />
              Rechercher une commande
            </CardTitle>
            <CardDescription className="text-base">
              Entrez votre adresse email ou votre numéro de commande pour retrouver vos achats
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="h-12 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderNumber" className="text-sm font-medium">Numéro de commande</Label>
                <Input
                  id="orderNumber"
                  placeholder="COM-20241212-1234"
                  value={searchOrderNumber}
                  onChange={(e) => setSearchOrderNumber(e.target.value)}
                  className="h-12 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isLoading || (!searchEmail && !searchOrderNumber)}
              className="w-full h-12 text-lg bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Recherche en cours...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Rechercher mes commandes
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Search Results */}
        {hasSearched && searchResults.length === 0 && !isLoading && (
          <Card className="shadow-lg border-0">
            <CardContent className="text-center py-16">
              <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl w-fit mx-auto mb-6">
                <Package className="h-16 w-16 mx-auto text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Aucune commande trouvée
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg max-w-md mx-auto">
                Nous n'avons trouvé aucune commande correspondant à vos critères de recherche.
              </p>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-amber-800 dark:text-amber-200 text-sm">
                  💡 <strong>Conseil :</strong> Vérifiez l'orthographe de votre adresse email ou assurez-vous que le numéro de commande est correct.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {searchResults.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Vos commandes ({searchResults.length})
              </h2>
            </div>
            
            {searchResults.map((order) => (
              <Card key={order.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-xl text-gray-800 dark:text-gray-200">
                            Commande #{order.order_number}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <Calendar className="h-4 w-4" />
                            Commandé le {new Date(order.created_at).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          {getOrderStatusBadge(order.status)}
                          <div className="flex items-center gap-2 mt-2 text-xl font-bold text-gray-800 dark:text-gray-200">
                            <CreditCard className="h-5 w-5" />
                            {formatCurrency(order.total_amount, order.currency)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(order.status)}
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              {getStatusDescription(order.status)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Dernière mise à jour : {new Date(order.updated_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      {order.items && order.items.length > 0 && (
                        <div className="border-t pt-4">
                          <h4 className="font-medium mb-3 text-gray-800 dark:text-gray-200">
                            Articles commandés ({order.items.length})
                          </h4>
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between items-center text-sm bg-white dark:bg-gray-800 p-3 rounded-lg">
                                <span className="text-gray-800 dark:text-gray-200">
                                  {item.name || 'Article'} × {item.quantity || 1}
                                </span>
                                <span className="font-medium text-gray-800 dark:text-gray-200">
                                  {Number(item.price || 0).toLocaleString()} {order.currency}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Help Section */}
        <Card className="mt-12 shadow-lg border-0 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20">
          <CardContent className="p-8 text-center">
            <h3 className="font-bold text-xl mb-4 text-gray-800 dark:text-gray-200">
              Besoin d'aide ?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
              Si vous ne trouvez pas votre commande ou si vous avez des questions concernant votre achat, 
              notre équipe de support client est là pour vous aider.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="bg-white/70 dark:bg-gray-800/70 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/20">
                <Package className="mr-2 h-4 w-4" />
                FAQ Commandes
              </Button>
              <Button className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700">
                Nous contacter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerOrders;
