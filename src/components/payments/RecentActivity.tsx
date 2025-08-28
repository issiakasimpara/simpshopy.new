
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStoreCurrency } from "@/hooks/useStoreCurrency";
import { useStores } from "@/hooks/useStores";
import { TrendingUp, RefreshCw, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";

interface Transaction {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
  status: string;
}

interface RecentActivityProps {
  transactions: Transaction[];
}

const RecentActivity = ({ transactions }: RecentActivityProps) => {
  const { store } = useStores();
  const { formatConvertedPrice } = useStoreCurrency(store?.id);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Réussi": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "En cours": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Échoué": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "Remboursé": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Réussi": return <CheckCircle className="h-4 w-4" />;
      case "En cours": return <Clock className="h-4 w-4" />;
      case "Échoué": return <XCircle className="h-4 w-4" />;
      case "Remboursé": return <RefreshCw className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background via-background to-muted/5">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-lg shadow-md">
            <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">Activité récente</CardTitle>
            <CardDescription className="font-medium">Dernières transactions importantes</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.slice(0, 3).map((transaction) => (
            <div key={transaction.id} className="group flex items-center justify-between p-3 bg-gradient-to-r from-muted/20 to-muted/10 border border-border/30 rounded-xl hover:border-border/60 hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/20 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-background to-muted/50 rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  {getStatusIcon(transaction.status)}
                </div>
                <div>
                  <div className="font-semibold text-sm">{transaction.customer}</div>
                  <div className="text-xs text-muted-foreground">{transaction.orderId}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-sm">{formatConvertedPrice(transaction.amount, 'XOF')}</div>
                <Badge className={`${getStatusColor(transaction.status)} font-medium text-xs`} variant="secondary">
                  {transaction.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="w-full mt-4 bg-gradient-to-r from-muted/30 to-muted/10 border-border/50 hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/30 transition-all duration-300">
          Voir tout l'historique
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
