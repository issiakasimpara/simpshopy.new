
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface TestimonialsFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filter: 'all' | 'approved' | 'pending';
  setFilter: (filter: 'all' | 'approved' | 'pending') => void;
}

const TestimonialsFilters = ({ searchTerm, setSearchTerm, filter, setFilter }: TestimonialsFiltersProps) => {
  return (
    <div className="bg-gradient-to-br from-background via-background to-muted/10 rounded-2xl border border-border/50 shadow-lg p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher un témoignage..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background/50 border-border/60 focus:border-emerald-500 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700' : 'bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 border-emerald-200/50 dark:border-emerald-800/30 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-blue-100'}
          >
            Tous
          </Button>
          <Button
            variant={filter === 'approved' ? 'default' : 'outline'}
            onClick={() => setFilter('approved')}
            className={filter === 'approved' ? 'bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700' : 'bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 border-emerald-200/50 dark:border-emerald-800/30 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-blue-100'}
          >
            Approuvés
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
            className={filter === 'pending' ? 'bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700' : 'bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 border-emerald-200/50 dark:border-emerald-800/30 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-blue-100'}
          >
            En attente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsFilters;
