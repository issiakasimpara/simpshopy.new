
import { Settings, Sparkles, Zap } from "lucide-react";

export const SettingsHeader = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 rounded-3xl" />
      <div className="relative p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-background via-background to-muted/20 rounded-3xl border border-border/50 shadow-lg">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative p-3 sm:p-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-2xl shadow-inner">
            <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
            <div className="absolute -top-1 -right-1 p-1 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-pulse">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Paramètres
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-medium mt-2 flex items-center gap-2">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
              Gérez vos préférences et paramètres de compte avec style
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
