
import { Badge } from '@/components/ui/badge';

interface StockStatusProps {
  isInStock: boolean;
  stockQuantity: number;
}

const StockStatus = ({ isInStock, stockQuantity }: StockStatusProps) => {
  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant="outline" 
        className={isInStock ? "text-green-600 border-green-200" : "text-red-600 border-red-200"}
      >
        {isInStock ? '✓ En stock' : '✗ Rupture de stock'}
      </Badge>
      {isInStock && stockQuantity <= 5 && (
        <span className="text-sm text-gray-600">
          Plus que {stockQuantity} exemplaire{stockQuantity > 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
};

export default StockStatus;
