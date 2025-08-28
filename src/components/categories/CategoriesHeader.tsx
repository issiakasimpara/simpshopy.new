
import { Plus, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoriesHeaderProps {
  categoriesCount: number;
  onAddCategory: () => void;
}

const CategoriesHeader = ({ categoriesCount, onAddCategory }: CategoriesHeaderProps) => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-indigo-600/5 rounded-3xl" />
      <div className="relative p-8 bg-gradient-to-br from-background via-background to-muted/20 rounded-3xl border border-border/50 shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 rounded-xl shadow-md">
                <Grid3X3 className="h-7 w-7 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Catégories
                </h1>
                <p className="text-lg text-muted-foreground font-medium">
                  Organisez vos produits par catégories - {categoriesCount} catégorie{categoriesCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={onAddCategory} 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <Plus className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            Ajouter une catégorie
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoriesHeader;
