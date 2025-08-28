
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePayments } from '@/hooks/usePayments';
import { useStores } from '@/hooks/useStores';
import { useStoreCurrency } from '@/hooks/useStoreCurrency';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Download
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Payments = () => {
  const navigate = useNavigate();
  const { stores, store: currentStore } = useStores();
  const { formatConvertedPrice } = useStoreCurrency(currentStore?.id);
  const { payments, paymentStats, isLoading, verifyPayment } = usePayments(currentStore?.id);
  const { toast } = useToast();


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Payé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Échoué</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800"><AlertCircle className="w-3 h-3 mr-1" />Annulé</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    // Utiliser formatPrice si la devise correspond à celle du store, sinon utiliser la devise spécifiée
    if (currency && currency !== 'XOF') {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currency
      }).format(amount);
    }
    // Utiliser formatConvertedPrice pour la devise du store
    return formatConvertedPrice(amount, 'XOF');
  };

  if (!currentStore) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune boutique sélectionnée</h3>
            <p className="text-muted-foreground mb-4">
              {stores.length > 0 
                ? "Sélectionnez une boutique pour voir les paiements"
                : "Vous n'avez pas encore créé de boutique"
              }
            </p>
            {stores.length === 0 && (
              <Button onClick={() => navigate('/dashboard')}>
                Créer une boutique
              </Button>
            )}
            {stores.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Vos boutiques :</p>
                {stores.map((store) => (
                  <Button 
                    key={store.id} 
                    variant="outline" 
                    onClick={() => {
                      // Ici on pourrait implémenter un système de sélection de boutique
                      // Pour l'instant, on redirige vers le dashboard
                      navigate('/dashboard');
                    }}
                  >
                    {store.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* En-tête */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Paiements</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gérez les paiements de votre boutique {currentStore.name}
          </p>
        </div>

        {/* Statistiques */}
        {paymentStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total des ventes</p>
                    <p className="text-lg sm:text-2xl font-bold">{formatConvertedPrice(paymentStats.totalAmount, 'XOF')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Paiements réussis</p>
                    <p className="text-lg sm:text-2xl font-bold">{paymentStats.completed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">En attente</p>
                    <p className="text-lg sm:text-2xl font-bold">{paymentStats.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Échoués</p>
                    <p className="text-lg sm:text-2xl font-bold">{paymentStats.failed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Liste des paiements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Historique des paiements</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : payments && payments.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base truncate">{payment.customer_name}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">{payment.customer_email}</p>
                        </div>
                        <div className="text-right sm:text-left">
                          <p className="font-bold text-base sm:text-lg">{formatAmount(payment.amount, payment.currency)}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {format(new Date(payment.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                          </p>
                        </div>
                      </div>
                      {payment.description && (
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2">{payment.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(payment.status)}
                      {payment.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => verifyPayment(payment.id)}
                          className="text-xs sm:text-sm"
                        >
                          Vérifier
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun paiement trouvé</h3>
                <p className="text-muted-foreground">
                  Les paiements de votre boutique apparaîtront ici.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informations importantes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Informations importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Comment ça marche :</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Paiements automatiques</strong> : Tous les paiements sont gérés par Moneroo</li>
                <li>• <strong>Paiements reçus</strong> : Les fonds sont reçus par Simpshopy</li>
                <li>• <strong>Demande de retrait</strong> : Contactez-nous pour demander un retrait</li>
                <li>• <strong>Statuts en temps réel</strong> : Les statuts se mettent à jour automatiquement</li>
              </ul>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Demande de retrait :</h4>
              <p className="text-sm text-yellow-700">
                Pour demander un retrait de vos fonds, contactez-nous à <strong>support@simpshopy.com</strong> 
                avec votre ID boutique et le montant souhaité.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Payments;
