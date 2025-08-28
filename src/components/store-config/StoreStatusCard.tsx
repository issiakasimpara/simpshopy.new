
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store, Eye, Palette, Settings, Sparkles, Calendar, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Tables } from '@/integrations/supabase/types';

type Store = Tables<'stores'>;

interface StoreStatusCardProps {
  selectedStore: Store;
  onViewModeChange: (mode: 'template') => void;
}

const StoreStatusCard = ({ selectedStore, onViewModeChange }: StoreStatusCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200';
      case 'draft': return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200';
      case 'suspended': return 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200';
      default: return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'En ligne';
      case 'draft': return 'Brouillon';
      case 'suspended': return 'Suspendue';
      default: return status;
    }
  };

  return (
    <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background via-background to-muted/20">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      
      <CardHeader className="relative pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            <div className="relative p-2 sm:p-3 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-xl shadow-inner">
              <Store className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                {selectedStore.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-1 sm:gap-2 mt-1">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />
                <span className="text-xs sm:text-sm">Statut actuel de votre boutique</span>
              </CardDescription>
            </div>
          </div>
          <Badge className={`${getStatusColor(selectedStore.status)} border font-semibold shadow-sm px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm`}>
            {getStatusLabel(selectedStore.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-4 sm:space-y-6 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="group p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-blue-200/30 dark:border-blue-800/30 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-400">Domaine</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-300 mt-2 break-all">
              {selectedStore.domain || `${selectedStore.name.toLowerCase().replace(/\s+/g, '-')}.commerce-flow.fr`}
            </p>
          </div>
          
          <div className="group p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border border-purple-200/30 dark:border-purple-800/30 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-purple-700 dark:text-purple-400">Créée le</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-purple-800 dark:text-purple-300 mt-2">
              {new Date(selectedStore.created_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewModeChange('template')}
            className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
          >
            <Eye className="h-4 w-4" />
            Voir la boutique
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 transition-all duration-300 hover:scale-105"
          >
            <Link to="/store-config/site-builder/editor/fashion-modern">
              <Palette className="h-4 w-4" />
              Personnaliser
            </Link>
          </Button>
          {selectedStore.status === 'active' && (
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 transition-all duration-300 hover:scale-105"
            >
              <Settings className="h-4 w-4" />
              Paramètres avancés
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreStatusCard;
