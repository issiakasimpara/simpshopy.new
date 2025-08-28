
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, UserCheck, Clock } from 'lucide-react';

interface TestimonialsStatsProps {
  total: number;
  approved: number;
  pending: number;
}

const TestimonialsStats = ({ total, approved, pending }: TestimonialsStatsProps) => {
  return (
    <div className="bg-gradient-to-br from-background via-background to-muted/10 rounded-2xl border border-border/50 shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 bg-gradient-to-br from-background via-background to-muted/10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-emerald-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500 opacity-60" />
          
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-blue-600 transition-colors">
              Total
            </CardTitle>
            <div className="p-2 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/40 dark:to-emerald-900/40 rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300">
              <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-foreground group-hover:text-blue-600 transition-colors">{total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {total === 0 ? 'Aucun témoignage' : `${total} témoignage${total > 1 ? 's' : ''}`}
            </p>
          </CardContent>
        </Card>
        
        <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 bg-gradient-to-br from-background via-background to-muted/10">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 opacity-60" />
          
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-green-600 transition-colors">
              Approuvés
            </CardTitle>
            <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300">
              <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-foreground group-hover:text-green-600 transition-colors">{approved}</div>
            <p className="text-xs text-muted-foreground mt-1">Visibles sur le site</p>
          </CardContent>
        </Card>
        
        <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 bg-gradient-to-br from-background via-background to-muted/10">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 opacity-60" />
          
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-orange-600 transition-colors">
              En attente
            </CardTitle>
            <div className="p-2 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300">
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-foreground group-hover:text-orange-600 transition-colors">{pending}</div>
            <p className="text-xs text-muted-foreground mt-1">Nécessitent une validation</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestimonialsStats;
