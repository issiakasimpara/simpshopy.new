import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar,
  Mail,
  Phone,
  MapPin,
  Package,
  CreditCard,
  User,
  Hash,
  Truck
} from 'lucide-react';
import { Order } from '@/services/orderService';
import { getOrderStatusBadge, formatCurrency } from '@/utils/orderUtils';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateSubtotal = () => {
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const taxes = 0; // À implémenter si nécessaire
  const shipping = order.shipping_cost || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Package className="h-6 w-6" />
            Détails de la commande #{order.order_number}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Date de commande</span>
                  </div>
                  <p className="font-medium">{formatDate(order.created_at)}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Statut</span>
                  </div>
                  {getOrderStatusBadge(order.status)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations client */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Nom</span>
                  </div>
                  <p className="font-medium">{order.customer_name || 'Non renseigné'}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Email</span>
                  </div>
                  <p className="font-medium">{order.customer_email}</p>
                </div>
                {order.customer_phone && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Téléphone</span>
                    </div>
                    <p className="font-medium">{order.customer_phone}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Adresses */}
          {(order.shipping_address || order.billing_address) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Adresses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {order.shipping_address && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Adresse de livraison</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{order.shipping_address.street}</p>
                        <p>{order.shipping_address.postal_code} {order.shipping_address.city}</p>
                        <p>{order.shipping_address.country}</p>
                      </div>
                    </div>
                  )}
                  {order.billing_address && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Adresse de facturation</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{order.billing_address.street}</p>
                        <p>{order.billing_address.postal_code} {order.billing_address.city}</p>
                        <p>{order.billing_address.country}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informations de livraison */}
          {(order.shipping_method || order.shipping_country) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Informations de livraison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {order.shipping_method && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Méthode de livraison</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium">{order.shipping_method.name}</p>
                        <p>Délai: {order.shipping_method.delivery_time}</p>
                        <p>Prix: {order.shipping_method.price === 0 ? 'Gratuit' : `${order.shipping_method.price} CFA`}</p>
                      </div>
                    </div>
                  )}
                  {order.shipping_country && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Pays de livraison</h4>
                      <div className="text-sm text-gray-600">
                        <p>{order.shipping_country}</p>
                        {order.shipping_cost !== undefined && (
                          <p className="font-medium">Coût total: {order.shipping_cost === 0 ? 'Gratuit' : `${order.shipping_cost} CFA`}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Articles commandés */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Articles commandés ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        Quantité: {item.quantity} × {formatCurrency(item.price, order.currency)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(item.price * item.quantity, order.currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Récapitulatif financier */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Récapitulatif financier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{formatCurrency(subtotal, order.currency)}</span>
                </div>
                {taxes > 0 && (
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span>{formatCurrency(taxes, order.currency)}</span>
                  </div>
                )}
                {shipping > 0 && (
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span>{formatCurrency(shipping, order.currency)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(order.total_amount, order.currency)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
