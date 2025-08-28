
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Eye, Settings, Sparkles, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BlockRenderer from '@/components/site-builder/BlockRenderer';
import { preBuiltTemplates } from '@/data/preBuiltTemplates';
import type { Tables } from '@/integrations/supabase/types';

type Store = Tables<'stores'>;

interface StorePreviewProps {
  selectedStore: Store;
  onViewModeChange: (mode: 'config') => void;
}

const StorePreview = ({ selectedStore, onViewModeChange }: StorePreviewProps) => {
  const navigate = useNavigate();
  
  // Get template for the selected store (for demo, we'll use the first template)
  const storeTemplate = preBuiltTemplates[0];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl" />
        <div className="relative text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl border border-blue-200/30 dark:border-blue-800/30">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-xl">
              <Monitor className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Aperçu de votre boutique
            </h3>
          </div>
          <p className="text-sm text-muted-foreground font-medium flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Voici comment votre boutique apparaîtra à vos clients
          </p>
        </div>
      </div>
      
      {/* Template Preview */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-white dark:bg-gray-950 shadow-xl">
        <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-950/20">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-400 to-red-500 shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-green-500 shadow-sm"></div>
            </div>
            <div className="flex-1 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-lg px-4 py-2 text-sm text-muted-foreground border border-border/30">
              {selectedStore.domain || `${selectedStore.name.toLowerCase().replace(/\s+/g, '-')}.commerce-flow.fr`}
            </div>
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto bg-gradient-to-b from-white via-white to-gray-50/30 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900/30">
          {storeTemplate.pages.home?.map((block) => (
            <div key={block.id} className="pointer-events-none transform scale-90 origin-top">
              <BlockRenderer 
                block={block} 
                isEditing={false}
                viewMode="desktop"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-background via-background to-blue-50/20 dark:to-blue-950/20" onClick={() => navigate('/store-config/site-builder/editor/fashion-modern')}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-transparent pointer-events-none" />
          <CardContent className="relative flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="relative p-3 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-xl shadow-inner group-hover:shadow-lg transition-shadow duration-300">
                <Palette className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
              </div>
              <div>
                <h3 className="font-bold text-blue-700 dark:text-blue-300">Créateur de Site</h3>
                <p className="text-sm text-muted-foreground font-medium">Personnaliser l'apparence</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-background via-background to-green-50/20 dark:to-green-950/20">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-transparent pointer-events-none" />
          <CardContent className="relative flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="relative p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-xl shadow-inner group-hover:shadow-lg transition-shadow duration-300">
                <Eye className="h-6 w-6 text-green-600 dark:text-green-400" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
              </div>
              <div>
                <h3 className="font-bold text-green-700 dark:text-green-300">Aperçu de la boutique</h3>
                <p className="text-sm text-muted-foreground font-medium">Voir votre site</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-background via-background to-purple-50/20 dark:to-purple-950/20" onClick={() => onViewModeChange('config')}>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-transparent pointer-events-none" />
          <CardContent className="relative flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="relative p-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-xl shadow-inner group-hover:shadow-lg transition-shadow duration-300">
                <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
              </div>
              <div>
                <h3 className="font-bold text-purple-700 dark:text-purple-300">Paramètres avancés</h3>
                <p className="text-sm text-muted-foreground font-medium">Configuration détaillée</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StorePreview;
