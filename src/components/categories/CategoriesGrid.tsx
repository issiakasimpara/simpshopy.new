
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CategoryCard from "./CategoryCard";
import CategoriesEmptyState from "./CategoriesEmptyState";
import type { Category } from "@/hooks/useCategories";

interface CategoriesGridProps {
  categories: Category[];
  searchTerm: string;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  onAddCategory: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
  isLoading: boolean;
}

const CategoriesGrid = ({ 
  categories, 
  searchTerm, 
  onEditCategory, 
  onDeleteCategory, 
  onAddCategory,
  isUpdating,
  isDeleting,
  isLoading 
}: CategoriesGridProps) => {
  // Organiser les catégories par hiérarchie
  const parentCategories = categories.filter(cat => !cat.parent_id);
  const getSubCategories = (parentId: string) => 
    categories.filter(cat => cat.parent_id === parentId);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-background via-background to-muted/10 rounded-2xl border border-border/50 shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse border-0 shadow-lg bg-gradient-to-br from-background via-background to-muted/10">
              <CardHeader className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg w-3/4"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-full"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-background via-background to-muted/10 rounded-2xl border border-border/50 shadow-lg p-6">
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parentCategories.map((category) => {
            const subCategories = getSubCategories(category.id);
            return (
              <CategoryCard
                key={category.id}
                category={category}
                subCategories={subCategories}
                onEdit={onEditCategory}
                onDelete={onDeleteCategory}
                isUpdating={isUpdating}
                isDeleting={isDeleting}
              />
            );
          })}
        </div>
      ) : (
        <CategoriesEmptyState 
          searchTerm={searchTerm}
          onAddCategory={onAddCategory}
        />
      )}
    </div>
  );
};

export default CategoriesGrid;
