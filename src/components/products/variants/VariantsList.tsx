
import React from 'react';
import { Label } from '@/components/ui/label';
import VariantCard from './VariantCard';

interface VariantsListProps {
  variants: any[];
  onEdit: (variant: any) => void;
  onDelete: (variantId: string) => void;
}

const VariantsList = ({ variants, onEdit, onDelete }: VariantsListProps) => {
  if (variants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Variantes existantes</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {variants.map((variant) => (
          <VariantCard
            key={variant.id}
            variant={variant}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default VariantsList;
