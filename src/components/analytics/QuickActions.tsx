
import { Button } from "@/components/ui/button";
import { Package, Store, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const QuickActions = () => {
  return (
    <div className="bg-gradient-to-br from-background via-background to-muted/10 rounded-2xl border border-border/50 shadow-lg p-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900/40 dark:to-blue-900/40 rounded-xl shadow-md">
            <TrendingUp className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 dark:from-emerald-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Optimisez vos performances
            </h3>
            <p className="text-muted-foreground font-medium">Améliorez vos résultats avec ces actions recommandées</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300">
            <Link to="/products">
              <Package className="mr-2 h-4 w-4" />
              Ajouter des produits
            </Link>
          </Button>
          <Button variant="outline" asChild className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 border-emerald-200/50 dark:border-emerald-800/30 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-blue-100 transition-all duration-300">
            <Link to="/store-config">
              <Store className="mr-2 h-4 w-4" />
              Configurer ma boutique
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
