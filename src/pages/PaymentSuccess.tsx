
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MonerooService } from '@/services/monerooService';
import { useOrders } from '@/hooks/useOrders';

interface PaymentStatus {
  status: 'success' | 'pending' | 'failed' | 'cancelled';
  message: string;
  orderNumber?: string;
  amount?: number;
  currency?: string;
}

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createOrder } = useOrders();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handlePaymentReturn = async () => {
      try {
        // Récupérer les paramètres de l'URL
        const monerooPaymentId = searchParams.get('monerooPaymentId');
        const monerooPaymentStatus = searchParams.get('monerooPaymentStatus');
        const orderNumber = searchParams.get('order');
        const tempOrder = searchParams.get('temp_order');
        const preview = searchParams.get('preview');

        console.log('🔍 Paramètres de retour:', {
          monerooPaymentId,
          monerooPaymentStatus,
          orderNumber,
          tempOrder,
          preview
        });

        // Si c'est un aperçu, simuler le succès
        if (preview === 'true') {
          setPaymentStatus({
            status: 'success',
            message: 'Paiement simulé avec succès (mode aperçu)',
            orderNumber: orderNumber || 'PREVIEW-001'
          });
          setIsLoading(false);
          return;
        }

        // Si pas d'ID de paiement, afficher une erreur
        if (!monerooPaymentId) {
          setPaymentStatus({
            status: 'failed',
            message: 'Aucun ID de paiement trouvé'
          });
          setIsLoading(false);
          return;
        }

        // Vérifier le statut du paiement avec Moneroo
        const paymentResult = await MonerooService.verifyPayment(monerooPaymentId);
        console.log('📡 Résultat vérification Moneroo:', paymentResult);

        // Mettre à jour le statut dans la base de données
        const { error: updateError } = await supabase
          .from('payments')
          .update({ 
            status: paymentResult.data.status,
            updated_at: new Date().toISOString()
          })
          .eq('moneroo_payment_id', monerooPaymentId);

        if (updateError) {
          console.error('❌ Erreur mise à jour paiement:', updateError);
        }

        // Déterminer le statut et le message
        let status: PaymentStatus['status'];
        let message: string;

        switch (paymentResult.data.status) {
          case 'completed':
            status = 'success';
            message = 'Paiement effectué avec succès !';
            
            // Si c'est un paiement réussi, créer la commande
            if (tempOrder) {
              await createOrderFromPayment(tempOrder, monerooPaymentId, paymentResult);
            }
            break;
          case 'pending':
            status = 'pending';
            message = 'Paiement en cours de traitement...';
            break;
          case 'failed':
            status = 'failed';
            message = 'Le paiement a échoué';
            break;
          case 'cancelled':
            status = 'cancelled';
            message = 'Paiement annulé';
            break;
          default:
            status = 'failed';
            message = 'Statut de paiement inconnu';
        }

        setPaymentStatus({
          status,
          message,
          orderNumber: orderNumber || paymentResult.data.metadata?.order_number,
          amount: paymentResult.data.amount,
          currency: paymentResult.data.currency
        });

        // Afficher une notification
        if (status === 'success') {
          toast({
            title: "Paiement réussi !",
            description: "Votre commande a été confirmée",
          });
        } else if (status === 'failed') {
          toast({
            title: "Paiement échoué",
            description: "Veuillez réessayer ou contacter le support",
            variant: "destructive"
          });
        }

      } catch (error) {
        console.error('❌ Erreur traitement retour paiement:', error);
        setPaymentStatus({
          status: 'failed',
          message: 'Erreur lors du traitement du paiement'
        });
      } finally {
        setIsLoading(false);
      }
    };

    const createOrderFromPayment = async (tempOrder: string, monerooPaymentId: string, paymentResult: any) => {
      try {
        // Récupérer les données de commande depuis sessionStorage
        const orderDataString = sessionStorage.getItem('pendingOrderData');
        if (!orderDataString) {
          console.error('❌ Données de commande non trouvées');
          return;
        }

        const orderData = JSON.parse(orderDataString);
        console.log('📝 Création de la commande depuis le paiement:', orderData);

        // Créer la commande
        createOrder(orderData, {
          onSuccess: (order) => {
            console.log('✅ Commande créée après paiement:', order);
            
            // Mettre à jour le paiement avec l'ID de commande
            supabase
              .from('payments')
              .update({ 
                order_id: order.id,
                updated_at: new Date().toISOString()
              })
              .eq('moneroo_payment_id', monerooPaymentId);

            // Nettoyer sessionStorage
            sessionStorage.removeItem('pendingOrderData');

            // Mettre à jour le statut avec le vrai numéro de commande
            setPaymentStatus(prev => prev ? {
              ...prev,
              orderNumber: order.order_number
            } : prev);
          },
          onError: (error) => {
            console.error('❌ Erreur création commande après paiement:', error);
          }
        });

      } catch (error) {
        console.error('❌ Erreur création commande depuis paiement:', error);
      }
    };

    handlePaymentReturn();
  }, [searchParams, toast, createOrder]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case 'pending':
        return <Clock className="h-12 w-12 text-yellow-500" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="h-12 w-12 text-red-500" />;
      default:
        return <AlertCircle className="h-12 w-12 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Succès</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Échoué</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800">Annulé</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Traitement du paiement...</p>
          <p className="text-muted-foreground">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {paymentStatus && getStatusIcon(paymentStatus.status)}
          </div>
          <CardTitle className="text-2xl">
            {paymentStatus?.status === 'success' ? 'Paiement réussi !' : 'Résultat du paiement'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {paymentStatus && (
            <>
              <div className="text-center">
                <p className="text-lg mb-2">{paymentStatus.message}</p>
                {getStatusBadge(paymentStatus.status)}
              </div>

              {paymentStatus.orderNumber && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Numéro de commande</p>
                  <p className="font-mono font-semibold">{paymentStatus.orderNumber}</p>
                </div>
              )}

              {paymentStatus.amount && paymentStatus.currency && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Montant payé</p>
                  <p className="font-semibold text-lg">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: paymentStatus.currency
                    }).format(paymentStatus.amount / 100)}
                  </p>
                </div>
              )}

              {paymentStatus.status === 'success' && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">✅ Prochaines étapes :</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Vous recevrez un email de confirmation</li>
                    <li>• Le marchand sera notifié de votre commande</li>
                    <li>• Suivez votre commande dans votre espace client</li>
                  </ul>
                </div>
              )}

              {paymentStatus.status === 'failed' && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">❌ Que faire maintenant ?</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Vérifiez les informations de votre carte</li>
                    <li>• Assurez-vous d'avoir suffisamment de fonds</li>
                    <li>• Contactez le support si le problème persiste</li>
                  </ul>
                </div>
              )}
            </>
          )}

          <div className="flex flex-col space-y-2">
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
            
            {paymentStatus?.status === 'failed' && (
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="w-full"
              >
                Réessayer le paiement
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
