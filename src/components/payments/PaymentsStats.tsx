
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Users, Package } from "lucide-react";
import { useStoreCurrency } from "@/hooks/useStoreCurrency";
import { useStores } from "@/hooks/useStores";

const PaymentsStats = () => {
  const { store } = useStores();
  const { formatConvertedPrice } = useStoreCurrency(store?.id);

  // Données fictives pour l'exemple
  const stats = {
    totalRevenue: 150000,
    totalTransactions: 45,
    averageTransaction: 3333.33,
    successRate: 98.5,
  };

  const cards = [
    {
      title: "Revenus totaux",
      value: formatConvertedPrice(stats.totalRevenue, 'XOF'),
      change: "+12.5% ce mois",
      icon: DollarSign,
      trend: "up" as const,
    },
    {
      title: "Transactions",
      value: stats.totalTransactions.toString(),
      change: "+8.2% ce mois",
      icon: CreditCard,
      trend: "up" as const,
    },
    {
      title: "Transaction moyenne",
      value: formatConvertedPrice(stats.averageTransaction, 'XOF'),
      change: "+4.1% ce mois",
      icon: Package,
      trend: "up" as const,
    },
    {
      title: "Taux de succès",
      value: `${stats.successRate}%`,
      change: "+0.5% ce mois",
      icon: Users,
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

export default PaymentsStats;
