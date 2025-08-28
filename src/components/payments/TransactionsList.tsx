
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useStoreCurrency } from "@/hooks/useStoreCurrency";
import { useStores } from "@/hooks/useStores";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  CreditCard, 
  Search, 
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

interface Transaction {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
  fee: number;
  net: number;
  status: string;
  method: string;
  type: string;
  date: string;
  time: string;
  gateway: string;
  reference: string;
}

interface TransactionsListProps {
  transactions: Transaction[];
  onTransactionSelect: (transactionId: string) => void;
}

const TransactionsList = ({ transactions, onTransactionSelect }: TransactionsListProps) => {
  const { store } = useStores();
  const { formatConvertedPrice } = useStoreCurrency(store?.id);
  const [searchTerm, setSearchTerm] = useState("");

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Paiement": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Remboursement": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background via-background to-muted/5">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900/40 dark:to-blue-900/40 rounded-lg shadow-md">
              <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Transactions récentes</CardTitle>
              <CardDescription className="font-medium">Historique complet des paiements</CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 bg-gradient-to-r from-muted/30 to-muted/10 border-border/50"
              />
            </div>
            <Button variant="outline" size="sm" className="bg-gradient-to-r from-muted/30 to-muted/10 border-border/50 hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/30">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-muted/20 to-muted/10 hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/20">
                <TableHead className="font-semibold">Transaction</TableHead>
                <TableHead className="font-semibold">Client</TableHead>
                <TableHead className="font-semibold">Montant</TableHead>
                <TableHead className="font-semibold">Statut</TableHead>
                <TableHead className="font-semibold">Méthode</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow 
                  key={transaction.id}
                  className="cursor-pointer hover:bg-gradient-to-r hover:from-muted/20 hover:to-muted/10 transition-all duration-200 border-border/30"
                  onClick={() => onTransactionSelect(transaction.id)}
                >
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{transaction.id}</div>
                      <div className="text-xs text-muted-foreground">
                        Commande {transaction.orderId}
                      </div>
                      <Badge className={`${getTypeColor(transaction.type)} font-medium`} variant="secondary">
                        {transaction.type}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{transaction.customer}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-semibold">{formatConvertedPrice(transaction.amount, 'XOF')}</div>
                      <div className="text-xs text-muted-foreground">
                                                  Frais: {formatConvertedPrice(transaction.fee, 'XOF')}
                      </div>
                      <div className="text-xs font-semibold text-green-600 dark:text-green-400">
                                                  Net: {formatConvertedPrice(transaction.net, 'XOF')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(transaction.status)}
                      <Badge className={`${getStatusColor(transaction.status)} font-medium`} variant="secondary">
                        {transaction.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{transaction.method}</div>
                      <div className="text-xs text-muted-foreground">{transaction.gateway}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{transaction.date}</div>
                      <div className="text-xs text-muted-foreground">{transaction.time}</div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsList;
