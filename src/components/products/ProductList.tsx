
import ProductCard from './ProductCard';
import EmptyProductsState from './EmptyProductsState';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { Tables } from '@/integrations/supabase/types';

interface ProductListProps {
  products: Tables<'products'>[];
  isLoading: boolean;
  onEditProduct: (product: Tables<'products'>) => void;
  onDeleteProduct: (productId: string) => void;
  onAddProduct: () => void;
}

const ProductList = ({ 
  products, 
  isLoading, 
  onEditProduct, 
  onDeleteProduct, 
  onAddProduct 
}: ProductListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse border-0 shadow-lg bg-gradient-to-br from-background via-background to-muted/10">
            <CardHeader className="space-y-4">
              <div className="aspect-square w-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl"></div>
              <div className="space-y-2">
                <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg w-3/4"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-1/2"></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-full"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-2/3"></div>
              <div className="flex gap-2 pt-2">
                <div className="flex-1 h-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"></div>
                <div className="w-10 h-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <EmptyProductsState onAddProduct={onAddProduct} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEditProduct}
          onDelete={onDeleteProduct}
        />
      ))}
    </div>
  );
};

export default ProductList;
