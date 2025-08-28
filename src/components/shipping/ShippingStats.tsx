import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Truck, Package, DollarSign, Clock } from "lucide-react";
import { useStoreCurrency } from "@/hooks/useStoreCurrency";
import { useStores } from "@/hooks/useStores";

const ShippingStats = () => {
  const { store } = useStores();
  const { formatPrice } = useStoreCurrency(store?.id);

  // Données fictives pour l'exemple
  const stats = {
    totalShipments: 125,
    averageDeliveryTime: 3.2,
    shippingRevenue: 45000,
    successRate: 99.2,
  };

  const cards = [
    {
      title: "Expéditions totales",
      value: stats.totalShipments.toString(),
      change: "+15.3% ce mois",
      icon: Truck,
      trend: "up" as const,
    },
    {
      title: "Délai moyen",
      value: `${stats.averageDeliveryTime} jours`,
      change: "-0.8 jour ce mois",
      icon: Clock,
      trend: "up" as const,
    },
    {
      title: "Revenus livraison",
      value: formatPrice(stats.shippingRevenue),
      change: "+22.1% ce mois",
      icon: DollarSign,
      trend: "up" as const,
    },
    {
      title: "Taux de succès",
      value: `${stats.successRate}%`,
      change: "+0.3% ce mois",
      icon: Package,
      trend: "up" as const,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {card.trend === "up" && <TrendingUp className="h-3 w-3 mr-1 text-green-500" />}
              {card.trend === "down" && <TrendingDown className="h-3 w-3 mr-1 text-red-500" />}
              {card.change}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ShippingStats;
