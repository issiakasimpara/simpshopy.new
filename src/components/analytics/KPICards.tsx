
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useStoreCurrency } from "@/hooks/useStoreCurrency";
import { useStores } from "@/hooks/useStores";

const KPICards = () => {
  const { analytics, isLoading } = useAnalytics();
  const { store } = useStores();
  const { formatConvertedPrice } = useStoreCurrency(store?.id);

  const cards = [
    {
      title: "Chiffre d'affaires total",
      value: isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : formatConvertedPrice(analytics?.totalRevenue || 0, 'XOF'),
      description: "Revenus générés depuis le début",
    },
    {
      title: "Panier moyen",
      value: isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : formatConvertedPrice(analytics?.averageOrderValue || 0, 'XOF'),
      description: "Valeur moyenne par commande",
    },
    {
      title: "Commandes totales",
      value: isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : analytics?.totalOrders || 0,
      description: "Nombre total de commandes",
    },
    {
      title: "Clients uniques",
      value: isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : analytics?.totalCustomers || 0,
      description: "Nombre de clients uniques",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default KPICards;
