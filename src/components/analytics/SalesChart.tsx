
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip as ChartTooltip } from "recharts";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useStoreCurrency } from "@/hooks/useStoreCurrency";
import { useStores } from "@/hooks/useStores";

const SalesChart = () => {
  const { salesData, isLoading } = useAnalytics();
  const { store } = useStores();
  const { formatConvertedPrice } = useStoreCurrency(store?.id);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Évolution des ventes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">Chargement...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!salesData || salesData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Évolution des ventes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">Aucune donnée disponible</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution des ventes</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatConvertedPrice(value, 'XOF')}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
                              formatter={(value) => [formatConvertedPrice(value as number, 'XOF'), "Ventes"]}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="currentColor"
              strokeWidth={2}
              className="stroke-primary"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const ChartTooltipContent = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {label}
            </span>
            <span className="font-bold text-muted-foreground">
              {payload[0].value}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default SalesChart;
