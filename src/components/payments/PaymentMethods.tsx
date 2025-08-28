
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Wallet } from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  status: string;
  fees: string;
  enabled: boolean;
  logo: string;
}

interface PaymentMethodsProps {
  paymentMethods: PaymentMethod[];
}

const PaymentMethods = ({ paymentMethods }: PaymentMethodsProps) => {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background via-background to-muted/5">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 rounded-lg shadow-md">
            <Wallet className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">Méthodes de paiement</CardTitle>
            <CardDescription className="font-medium">Configurez vos passerelles de paiement</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.map((method) => (
          <div key={method.id} className="group flex items-center justify-between p-4 bg-gradient-to-r from-muted/20 to-muted/10 border border-border/30 rounded-xl hover:border-border/60 hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/20 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center space-x-3">
              <div className="text-2xl bg-gradient-to-br from-background to-muted/50 rounded-lg p-2 shadow-sm group-hover:shadow-md transition-shadow duration-300">{method.logo}</div>
              <div>
                <div className="font-semibold text-sm">{method.name}</div>
                <div className="text-xs text-muted-foreground">{method.type}</div>
                <div className="text-xs text-muted-foreground font-medium">{method.fees}</div>
              </div>
            </div>
            <div className="text-right space-y-1">
              <Badge 
                className={`font-medium ${method.enabled ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"}`}
                variant="secondary"
              >
                {method.status}
              </Badge>
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full bg-gradient-to-r from-muted/30 to-muted/10 border-border/50 hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/30 transition-all duration-300">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une méthode
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentMethods;
