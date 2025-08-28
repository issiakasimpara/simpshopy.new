
import { Button } from '@/components/ui/button';
import { Plus, Package, Store, Upload } from 'lucide-react';
import StoreSelector from '@/components/StoreSelector';

interface ProductsHeaderProps {
  selectedStoreId: string;
  onStoreSelect: (storeId: string) => void;
  onCreateStore: () => void;
  onAddProduct: () => void;
  onImportCSV: () => void;
  productCount: number;
}

const ProductsHeader = ({ 
  selectedStoreId, 
  onStoreSelect, 
  onCreateStore, 
  onAddProduct, 
  onImportCSV,
  productCount 
}: ProductsHeaderProps) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 rounded-xl shadow-md">
              <Package className="h-5 w-5 sm:h-7 sm:w-7 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Produits
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-medium">
                Gérez votre catalogue de produits
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <StoreSelector
            selectedStoreId={selectedStoreId}
            onStoreSelect={onStoreSelect}
            onCreateStore={onCreateStore}
          />
        </div>
      </div>

      {selectedStoreId && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-gradient-to-r from-purple-50/50 via-blue-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20 rounded-2xl border border-purple-200/30 dark:border-purple-800/30">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-muted-foreground">
                {productCount} produit{productCount !== 1 ? 's' : ''} trouvé{productCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={onImportCSV}
              variant="outline"
              className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-950/20"
            >
              <Upload className="h-4 w-4 mr-2" />
              Importer CSV
            </Button>
            <Button 
              onClick={onAddProduct} 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              Ajouter un produit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsHeader;
