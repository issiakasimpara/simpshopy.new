import { Badge } from "@/components/ui/badge";

export const getOrderStatusBadge = (status: string) => {
  const statusConfig = {
    pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Confirmée', color: 'bg-blue-100 text-blue-800' },
    processing: { label: 'En traitement', color: 'bg-purple-100 text-purple-800' },
    shipped: { label: 'Expédiée', color: 'bg-orange-100 text-orange-800' },
    delivered: { label: 'Livrée', color: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800' }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  
  return (
    <Badge className={`${config.color} border-0`}>
      {config.label}
    </Badge>
  );
};

export const getPaymentStatusBadge = (status: string) => {
  const statusConfig = {
    pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
    paid: { label: 'Payé', color: 'bg-green-100 text-green-800' },
    failed: { label: 'Échoué', color: 'bg-red-100 text-red-800' },
    refunded: { label: 'Remboursé', color: 'bg-gray-100 text-gray-800' }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  
  return (
    <Badge className={`${config.color} border-0`}>
      {config.label}
    </Badge>
  );
};

export const formatOrderDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatCurrency = (amount: number, currency: string = 'CFA') => {
  return `${amount.toLocaleString()} ${currency}`;
};
