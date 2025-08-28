
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, Moon, Sun, Monitor, Check, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeSection = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const getThemeStatus = () => {
    if (theme === "system") {
      return `Suit le système (${systemTheme === "dark" ? "Sombre" : "Clair"})`;
    }
    return theme === "dark" ? "Sombre" : "Clair";
  };

  return (
    <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background via-background to-muted/20">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-indigo-500/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500" />
      
      <CardHeader className="relative pb-4">
        <CardTitle className="flex items-center gap-4">
          <div className="relative p-3 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 rounded-xl shadow-inner">
            <Palette className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
          </div>
          <div className="flex-1">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              Thème
            </span>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              Personnalisez l'apparence de votre interface avec style
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative space-y-8 pt-2">
        <div className="grid grid-cols-3 gap-6">
          <Button 
            variant={theme === "light" ? "default" : "outline"} 
            className={`
              h-28 flex-col justify-center gap-4 relative transition-all duration-500 group border-2
              ${theme === "light" 
                ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg scale-105" 
                : "hover:border-yellow-200 hover:bg-yellow-50/50 dark:hover:bg-yellow-950/20 hover:scale-105"
              }
              hover:shadow-xl hover:-translate-y-1
            `}
            onClick={() => setTheme("light")}
          >
            <div className={`
              p-3 rounded-full transition-all duration-300
              ${theme === "light" 
                ? "bg-gradient-to-br from-yellow-200 to-orange-200 shadow-md" 
                : "bg-yellow-100 dark:bg-yellow-900/30 group-hover:bg-yellow-200"
              }
            `}>
              <Sun className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className="text-sm font-semibold">Clair</span>
            {theme === "light" && (
              <div className="absolute -top-2 -right-2 p-1.5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg animate-pulse">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </Button>
          
          <Button 
            variant={theme === "dark" ? "default" : "outline"} 
            className={`
              h-28 flex-col justify-center gap-4 relative transition-all duration-500 group border-2
              ${theme === "dark" 
                ? "bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600 shadow-lg scale-105" 
                : "hover:border-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 hover:scale-105"
              }
              hover:shadow-xl hover:-translate-y-1
            `}
            onClick={() => setTheme("dark")}
          >
            <div className={`
              p-3 rounded-full transition-all duration-300
              ${theme === "dark" 
                ? "bg-gradient-to-br from-slate-600 to-slate-700 shadow-md" 
                : "bg-slate-100 dark:bg-slate-900/30 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
              }
            `}>
              <Moon className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </div>
            <span className="text-sm font-semibold">Sombre</span>
            {theme === "dark" && (
              <div className="absolute -top-2 -right-2 p-1.5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg animate-pulse">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </Button>
          
          <Button 
            variant={theme === "system" ? "default" : "outline"} 
            className={`
              h-28 flex-col justify-center gap-4 relative transition-all duration-500 group border-2
              ${theme === "system" 
                ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg scale-105" 
                : "hover:border-blue-200 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 hover:scale-105"
              }
              hover:shadow-xl hover:-translate-y-1
            `}
            onClick={() => setTheme("system")}
          >
            <div className={`
              p-3 rounded-full transition-all duration-300
              ${theme === "system" 
                ? "bg-gradient-to-br from-blue-200 to-indigo-200 shadow-md" 
                : "bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200"
              }
            `}>
              <Monitor className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-semibold">Système</span>
            {theme === "system" && (
              <div className="absolute -top-2 -right-2 p-1.5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg animate-pulse">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </Button>
        </div>
        
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 rounded-xl border border-border/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg">
              <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-sm font-semibold">Configuration actuelle</span>
          </div>
          <Badge variant="secondary" className="text-sm font-medium px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
            {getThemeStatus()}
          </Badge>
        </div>
        
        {theme === "system" && (
          <div className="p-6 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/80 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-purple-950/30 rounded-xl border border-blue-200/50 dark:border-blue-800/30 animate-fade-in backdrop-blur-sm">
            <div className="flex items-center gap-3 text-sm text-blue-800 dark:text-blue-200 mb-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse shadow-lg" />
              <span className="font-semibold">Mode adaptatif activé</span>
            </div>
            <p className="text-xs text-blue-700/80 dark:text-blue-300/80 leading-relaxed">
              Le thème s'adapte automatiquement aux préférences système de votre appareil pour une expérience optimale
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
