
import { Grid3X3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoriesEmptyStateProps {
  searchTerm: string;
  onAddCategory: () => void;
}

const CategoriesEmptyState = ({ searchTerm, onAddCategory }: CategoriesEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="p-4 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 rounded-2xl shadow-lg mb-6">
        <Grid3X3 className="h-12 w-12 text-purple-600 dark:text-purple-400" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">
        Aucune catégorie trouvée
      </h3>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        {searchTerm 
          ? `Aucune catégorie ne correspond à "${searchTerm}"`
          : "Commencez par créer votre première catégorie pour organiser vos produits"
        }
      </p>
      {!searchTerm && (
        <Button 
          onClick={onAddCategory} 
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <Plus className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
          Créer une catégorie
        </Button>
      )}
    </div>
  );
};

export default CategoriesEmptyState;
