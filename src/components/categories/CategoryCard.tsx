
import { Edit, Trash2, Package, Folder, FolderOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/hooks/useCategories";

interface CategoryCardProps {
  category: Category;
  subCategories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

const CategoryCard = ({ 
  category, 
  subCategories, 
  onEdit, 
  onDelete, 
  isUpdating, 
  isDeleting 
}: CategoryCardProps) => {
  return (
    <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 bg-gradient-to-br from-background via-background to-muted/10">
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 opacity-60" />
      
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 shadow-md group-hover:shadow-lg transition-shadow duration-300">
            {subCategories.length > 0 ? (
              <FolderOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            ) : (
              <Folder className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            )}
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-foreground group-hover:text-purple-600 transition-colors">
              {category.name}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {category.description || 'Pas de description'}
            </CardDescription>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(category)}
            disabled={isUpdating}
            className="group/btn hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-300"
          >
            <Edit className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(category)}
            disabled={isDeleting}
            className="group/btn hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-300"
          >
            <Trash2 className="h-4 w-4 text-red-500 group-hover/btn:scale-110 transition-transform" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="flex items-center justify-between mb-3 p-3 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg border border-purple-200/30 dark:border-purple-800/30">
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              0 produit{/* TODO: Compter les produits par catégorie */}
            </span>
          </div>
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg" variant="secondary">
            Actif
          </Badge>
        </div>
        
        {/* Sous-catégories */}
        {subCategories.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2 font-medium">
              {subCategories.length} sous-catégorie{subCategories.length !== 1 ? 's' : ''}:
            </p>
            <div className="flex flex-wrap gap-1">
              {subCategories.slice(0, 3).map((subCat) => (
                <Badge key={subCat.id} variant="outline" className="text-xs border-purple-200/50 text-purple-600 dark:text-purple-400">
                  {subCat.name}
                </Badge>
              ))}
              {subCategories.length > 3 && (
                <Badge variant="outline" className="text-xs border-purple-200/50 text-purple-600 dark:text-purple-400">
                  +{subCategories.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
