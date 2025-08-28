
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Store,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  Users,
  Menu,
  X,
  Home,
  CreditCard,
  Bell,
  LogOut,
  MessageSquare,
  Grid3X3,
  Globe,
  Truck,
  ExternalLink,
  Palette
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useStores } from "@/hooks/useStores";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AppLogo from "@/components/ui/AppLogo";
import OptimizedViewStoreButton from "@/components/ui/OptimizedViewStoreButton";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { store, hasStore } = useStores();

  // Fonction supprimée - remplacée par OptimizedViewStoreButton

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
             // Rediriger vers la page d'accueil principale après la déconnexion
       window.location.href = 'https://simpshopy.com';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la déconnexion.",
        variant: "destructive"
      });
    }
  };

  const navigation = [
    { name: "Tableau de bord", href: "/dashboard", icon: Home },
    { name: "Produits", href: "/products", icon: Package },
    { name: "Catégories", href: "/categories", icon: Grid3X3 },
    { name: "Commandes", href: "/orders", icon: ShoppingCart },
    { name: "Clients", href: "/customers", icon: Users },
    { name: "Livraisons", href: "/shipping", icon: Truck },
    { name: "Témoignages", href: "/testimonials-admin", icon: MessageSquare },
    { name: "Analyses", href: "/analytics", icon: BarChart3 },
    { name: "Paiements", href: "/payments", icon: CreditCard },
    { name: "Ma boutique", href: "/store-config", icon: Store },
    { name: "Thèmes", href: "/themes", icon: Palette },
    { name: "Domaines", href: "/domains", icon: Globe },
    { name: "Intégrations", href: "/integrations", icon: ExternalLink },
    { name: "Paramètres", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex transition-colors duration-300">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setSidebarOpen(false)} 
          />
        </div>
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-80 sm:w-72 bg-gradient-to-b from-card via-card to-card/95 backdrop-blur-xl border-r border-border/50 transform transition-all duration-300 ease-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col shadow-2xl",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo avec effet de gradient */}
        <div className="relative flex items-center h-20 px-6 border-b border-border/30 flex-shrink-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5" />
          <Link to="/dashboard" className="relative group transition-transform duration-200 hover:scale-105">
            <AppLogo size="md" useRealLogo={true} />
          </Link>
        </div>

        {/* Navigation avec animations améliorées */}
        <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-1 sm:space-y-2 overflow-y-auto">
          {navigation.map((item, index) => {
            const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                to={item.href}
                tabIndex={0}
                className={cn(
                  "group flex items-center px-3 sm:px-4 py-3 sm:py-4 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  isActive
                    ? "bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 shadow-lg border border-blue-200/30 dark:border-blue-800/30"
                    : "text-muted-foreground hover:bg-gradient-to-r hover:from-accent/80 hover:to-accent/60 hover:text-accent-foreground hover:shadow-md hover:scale-[1.02]"
                )}
                onClick={() => setSidebarOpen(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSidebarOpen(false);
                  }
                }}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Effet de brillance pour l'élément actif */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 opacity-50 animate-pulse" />
                )}
                
                <div className={cn(
                  "relative p-1.5 sm:p-2 rounded-lg mr-3 sm:mr-4 transition-all duration-300",
                  isActive 
                    ? "bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 shadow-md" 
                    : "bg-muted/50 group-hover:bg-gradient-to-br group-hover:from-accent group-hover:to-accent/80"
                )}>
                  <item.icon className={cn(
                    "h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300", 
                    isActive 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-muted-foreground group-hover:text-accent-foreground group-hover:scale-110"
                  )} />
                </div>
                
                <span className="relative z-10 flex-1">{item.name}</span>
                
                {/* Indicateur visuel pour l'élément actif */}
                {isActive && (
                  <div className="w-2 h-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full shadow-lg animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Section utilisateur modernisée */}
        <div className="border-t border-border/30 p-4 sm:p-6 flex-shrink-0 bg-gradient-to-r from-muted/20 via-muted/10 to-muted/20">
                      <div className="group p-3 sm:p-4 bg-gradient-to-br from-card via-card to-muted/20 rounded-xl border border-border/50 hover:border-border/80 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] mb-3 sm:mb-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <span className="text-white text-sm sm:text-lg font-bold">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                    {user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Issiaka'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5 transition-all duration-300 group" 
            onClick={handleSignOut}
          >
            <LogOut className="mr-3 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar améliorée */}
        <div className="bg-card/80 backdrop-blur-xl border-b border-border/50 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden hover:bg-accent/80 transition-colors duration-200"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2 sm:space-x-4 ml-auto">
            <Button variant="ghost" size="sm" className="relative group hover:bg-accent/80 transition-all duration-200">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-br from-red-400 to-red-500 rounded-full shadow-lg animate-pulse"></span>
            </Button>
            <OptimizedViewStoreButton />
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
