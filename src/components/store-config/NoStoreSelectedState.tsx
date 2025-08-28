
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store, Sparkles } from 'lucide-react';

interface NoStoreSelectedStateProps {
  onCreateStore: () => void;
}

const NoStoreSelectedState = ({ onCreateStore }: NoStoreSelectedStateProps) => {
  return (
    <Card className="border-2 border-dashed border-muted-foreground/25 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-950/20 dark:to-purple-950/20">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="relative mb-6">
          <div className="p-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-2xl">
            <Store className="h-16 w-16 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="absolute -top-2 -right-2 p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-bounce">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          Créez votre première boutique
        </h3>
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          Commencez votre aventure e-commerce en créant votre boutique en ligne. 
          Choisissez un template et personnalisez-le selon vos besoins.
        </p>
        <Button onClick={onCreateStore} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <Store className="h-5 w-5 mr-2" />
          Créer ma boutique
        </Button>
      </CardContent>
    </Card>
  );
};

export default NoStoreSelectedState;
