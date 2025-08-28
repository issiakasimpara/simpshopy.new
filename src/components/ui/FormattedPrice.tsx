import { useStoreCurrency } from '@/hooks/useStoreCurrency';
import { formatCurrency, type Currency } from '@/utils/formatCurrency';

interface FormattedPriceProps {
  amount: number;
  storeId?: string;
  currency?: Currency; // Pour forcer une devise spécifique
  showSymbol?: boolean;
  compact?: boolean;
  className?: string;
  children?: (formattedPrice: string) => React.ReactNode;
}

export const FormattedPrice = ({ 
  amount, 
  storeId, 
  currency: forcedCurrency,
  showSymbol = true, 
  compact = false,
  className = "",
  children 
}: FormattedPriceProps) => {
  const { currency: storeCurrency, formatConvertedPrice, isLoading } = useStoreCurrency(storeId);
  
  // Utiliser la devise forcée ou celle de la boutique
  const currency = forcedCurrency || storeCurrency || 'XOF';
  
  // Formater le prix avec conversion automatique
  const formattedPrice = formatConvertedPrice(amount, currency, { 
    showSymbol, 
    compact 
  });

  if (isLoading) {
    return (
      <span className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}>
        ---
      </span>
    );
  }

  // Si on a une fonction children, l'utiliser
  if (children) {
    return <>{children(formattedPrice)}</>;
  }

  // Sinon, retourner le prix formaté
  return (
    <span className={className}>
      {formattedPrice}
    </span>
  );
};

// Composant pour les prix avec devise spécifique (pour les cas où on n'a pas de storeId)
export const StaticFormattedPrice = ({ 
  amount, 
  currency = 'XOF',
  showSymbol = true, 
  compact = false,
  className = "",
  children 
}: Omit<FormattedPriceProps, 'storeId'>) => {
  const formattedPrice = formatCurrency(amount, currency, { 
    showSymbol, 
    compact 
  });

  if (children) {
    return <>{children(formattedPrice)}</>;
  }

  return (
    <span className={className}>
      {formattedPrice}
    </span>
  );
};
