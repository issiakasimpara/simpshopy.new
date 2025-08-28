
import { Button } from '@/components/ui/button';
import { Package, ArrowLeft } from 'lucide-react';

interface ProductDetailEmptyStateProps {
  productId?: string | null;
}

const ProductDetailEmptyState = ({ productId }: ProductDetailEmptyStateProps) => {
  return (
    <section className="py-16 bg-white min-h-[60vh] flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-10 w-10 text-gray-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Produit non trouvé
          </h2>
          
          <p className="text-gray-600 mb-6">
            {productId 
              ? `Le produit avec l'ID "${productId.slice(0, 8)}..." n'existe pas ou n'est plus disponible.`
              : "Aucun produit n'est disponible pour le moment."
            }
          </p>

          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Cela peut arriver si :
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Le produit a été supprimé</li>
              <li>• L'ID du produit est incorrect</li>
              <li>• La boutique n'a pas encore de produits</li>
            </ul>
          </div>

          <div className="mt-8">
            <Button 
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux produits
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailEmptyState;
