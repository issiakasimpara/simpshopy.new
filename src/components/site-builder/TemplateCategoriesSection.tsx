
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { templateCategories } from '@/data/templateCategories';
import { cn } from '@/lib/utils';

interface TemplateCategoriesSectionProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const TemplateCategoriesSection = ({ selectedCategory, onCategorySelect }: TemplateCategoriesSectionProps) => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl" />
      <div className="relative p-4 sm:p-6 bg-gradient-to-br from-background via-background to-muted/20 rounded-2xl border border-border/50 shadow-lg">
        <div className="mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Catégories
          </h3>
        </div>
        
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {/* Bouton "Tous" */}
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategorySelect('all')}
            className={cn(
              "group relative overflow-hidden transition-all duration-300 hover:scale-105",
              selectedCategory === 'all'
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-white border-0"
                : "bg-gradient-to-r from-white to-blue-50/30 dark:from-gray-950 dark:to-blue-950/20 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30 border-border/60 hover:border-blue-300 dark:hover:border-blue-600"
            )}
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <div className={cn(
                "text-base sm:text-lg transition-transform duration-200 group-hover:scale-110",
                selectedCategory === 'all' ? "grayscale-0" : "grayscale hover:grayscale-0"
              )}>
                📋
              </div>
              <span className="font-medium text-xs sm:text-sm">Tous</span>
              {selectedCategory === 'all' && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                  7
                </Badge>
              )}
            </div>
            {selectedCategory === 'all' && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 animate-pulse" />
            )}
          </Button>

          {/* Catégories de templates */}
          {templateCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategorySelect(category.id)}
              className={cn(
                "group relative overflow-hidden transition-all duration-300 hover:scale-105",
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-white border-0"
                  : "bg-gradient-to-r from-white to-blue-50/30 dark:from-gray-950 dark:to-blue-950/20 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30 border-border/60 hover:border-blue-300 dark:hover:border-blue-600"
              )}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <div className={cn(
                  "text-base sm:text-lg transition-transform duration-200 group-hover:scale-110",
                  selectedCategory === category.id ? "grayscale-0" : "grayscale hover:grayscale-0"
                )}>
                  {category.icon}
                </div>
                <span className="font-medium text-xs sm:text-sm">{category.name}</span>
                {selectedCategory === category.id && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                    1
                  </Badge>
                )}
              </div>
              {selectedCategory === category.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 animate-pulse" />
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateCategoriesSection;
