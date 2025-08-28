
import React from 'react';
import { Store, Plus, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import type { Tables } from '@/integrations/supabase/types';

type StoreType = Tables<'stores'>;

interface StoreHeaderProps {
  isInSiteBuilder: boolean;
  store: StoreType | null;
  hasStore: boolean;
  onCreateStore: () => void;
}

const StoreHeader = ({ isInSiteBuilder, store, hasStore, onCreateStore }: StoreHeaderProps) => {
  if (isInSiteBuilder) {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-blue-600/5 rounded-3xl" />
        <div className="relative p-4 sm:p-6 bg-gradient-to-br from-background via-background to-muted/20 rounded-3xl border border-border/50 shadow-lg">
          <div className="flex items-center justify-between">
            <Link to="/store-config" className="flex items-center gap-2 sm:gap-3 text-blue-600 hover:text-blue-800 transition-colors duration-200 group">
              <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-xl group-hover:shadow-md transition-shadow duration-200">
                <Store className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span className="font-semibold text-sm sm:text-base">← Retour à la configuration</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 rounded-3xl" />
      <div className="relative p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-background via-background to-muted/20 rounded-3xl border border-border/50 shadow-lg">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
            <div className="relative p-3 sm:p-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-2xl shadow-inner">
              <Store className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
              <div className="absolute -top-1 -right-1 p-1 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-pulse">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                {store ? store.name : 'Ma Boutique'}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-medium mt-2 flex items-center gap-2">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
                {hasStore ? 'Gérez et personnalisez votre boutique en ligne' : 'Créez votre première boutique en ligne'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
            {!hasStore && (
              <Button onClick={onCreateStore} size="lg" className="flex items-center gap-2 sm:gap-3 h-10 sm:h-12 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Créer ma boutique</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreHeader;
