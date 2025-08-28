
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const StoreStatus = () => {
  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500" />
      
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="flex items-center text-lg sm:text-xl font-bold">
          <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/40 dark:to-emerald-900/40 rounded-xl mr-2 sm:mr-3 shadow-md">
            <Store className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
            Ma boutique
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-xl border border-yellow-200/50 dark:border-yellow-800/50">
          <span className="text-xs sm:text-sm font-bold text-yellow-800 dark:text-yellow-200">Statut</span>
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold px-2 sm:px-3 py-1 shadow-md text-xs sm:text-sm" variant="secondary">
            En configuration
          </Badge>
        </div>
        <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30 rounded-xl border border-gray-200/50 dark:border-gray-800/50">
          <span className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300">Domaine</span>
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 sm:px-3 py-1 rounded-full">
            Non configuré
          </span>
        </div>
        <div className="space-y-2 sm:space-y-3 pt-2">
          <Button variant="outline" size="default" className="w-full opacity-50 cursor-not-allowed text-sm sm:text-base" disabled>
            Voir ma boutique
          </Button>
          <Button variant="outline" size="default" className="w-full group hover:bg-blue-50 dark:hover:bg-blue-950/30 border-2 hover:border-blue-500/50 transition-all duration-300 text-sm sm:text-base" asChild>
            <Link to="/store-config">
              Configurer
              <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreStatus;
