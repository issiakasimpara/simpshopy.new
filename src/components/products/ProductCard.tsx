
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Image as ImageIcon, Eye } from 'lucide-react';
import { FormattedPrice } from '@/components/ui/FormattedPrice';
import type { Tables } from '@/integrations/supabase/types';

interface ProductCardProps {
  product: Tables<'products'>;
  onEdit: (product: Tables<'products'>) => void;
  onDelete: (productId: string) => void;
}

const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg';
      case 'draft': return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg';
      case 'inactive': return 'bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'draft': return 'Brouillon';
      case 'inactive': return 'Inactif';
      default: return status;
    }
  };

  // Supprimer cette fonction car on utilise maintenant FormattedPrice

  return (
    <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 bg-gradient-to-br from-background via-background to-muted/10">
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 opacity-60" />
      
      <CardHeader className="relative pb-2">
        {product.images && product.images.length > 0 ? (
          <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100 mb-4 relative group/image">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover/image:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
            {product.images.length > 1 && (
              <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                +{product.images.length - 1}
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-square w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-bold text-foreground mb-1 line-clamp-2 group-hover:text-purple-600 transition-colors">
              {product.name}
            </CardTitle>
            <CardDescription className="text-sm">
              SKU: {product.sku || 'N/A'}
            </CardDescription>
          </div>
          <Badge className={`${getStatusColor(product.status)} font-bold px-3 py-1 text-xs uppercase tracking-wider`}>
            {getStatusText(product.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
        
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg border border-purple-200/30 dark:border-purple-800/30">
            <span className="text-sm font-medium text-muted-foreground">Prix:</span>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              <FormattedPrice amount={Number(product.price)} storeId={product.store_id} />
            </span>
          </div>
          
          {product.inventory_quantity !== null && (
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50/50 to-green-50/50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-lg border border-emerald-200/30 dark:border-emerald-800/30">
              <span className="text-sm font-medium text-muted-foreground">Stock:</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${product.inventory_quantity < 10 ? 'bg-red-500' : 'bg-green-500'}`} />
                <span className={`font-bold ${product.inventory_quantity < 10 ? 'text-red-600' : 'text-green-600'}`}>
                  {product.inventory_quantity}
                </span>
              </div>
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(product)}
              className="flex-1 group/btn hover:bg-blue-50 dark:hover:bg-blue-950/30 border-2 hover:border-blue-500/50 transition-all duration-300"
            >
              <Edit className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
              Modifier
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDelete(product.id)}
              className="group/btn hover:bg-red-50 dark:hover:bg-red-950/30 border-2 hover:border-red-500/50 transition-all duration-300"
            >
              <Trash2 className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
