
import { Button } from "@/components/ui/button";
import { Store, Plus, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardHeader = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 rounded-3xl blur-3xl" />
      <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-background via-background to-muted/20 rounded-3xl border border-border/50 shadow-xl backdrop-blur-sm">
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-gray-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
            Tableau de bord
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-medium flex items-center gap-2">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 animate-pulse" />
            Bienvenue sur votre espace de gestion
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3 lg:gap-4">
          <Button variant="outline" size="lg" asChild className="group border-2 hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-300 hover:scale-105">
            <Link to="/store-config">
              <Store className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:text-blue-600 transition-colors" />
              <span className="text-sm sm:text-base">Configurer ma boutique</span>
            </Link>
          </Button>
          <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105">
            <Link to="/products">
              <Plus className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm sm:text-base">Ajouter un produit</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
