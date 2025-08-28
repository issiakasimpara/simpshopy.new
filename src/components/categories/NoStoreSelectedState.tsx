
import { Grid3X3 } from "lucide-react";

const NoStoreSelectedState = () => {
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-indigo-600/5 rounded-3xl" />
        <div className="relative p-8 bg-gradient-to-br from-background via-background to-muted/20 rounded-3xl border border-border/50 shadow-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 rounded-xl shadow-md">
                <Grid3X3 className="h-7 w-7 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
              Catégories
            </h1>
            <p className="text-lg text-muted-foreground font-medium mb-6">
              Aucune boutique sélectionnée
            </p>
            <p className="text-gray-600">
              Vous devez d'abord créer une boutique pour gérer les catégories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoStoreSelectedState;
