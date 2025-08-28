
import { MessageCircle } from 'lucide-react';

interface TestimonialsHeaderProps {
  totalCount: number;
}

const TestimonialsHeader = ({ totalCount }: TestimonialsHeaderProps) => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 via-blue-600/5 to-purple-600/5 rounded-3xl" />
      <div className="relative p-8 bg-gradient-to-br from-background via-background to-muted/20 rounded-3xl border border-border/50 shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900/40 dark:to-blue-900/40 rounded-xl shadow-md">
                <MessageCircle className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 dark:from-emerald-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Témoignages clients
                </h1>
                <p className="text-lg text-muted-foreground font-medium">
                  Gérez les avis et témoignages de vos clients - {totalCount} témoignage{totalCount > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsHeader;
