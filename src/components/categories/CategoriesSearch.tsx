
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CategoriesSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const CategoriesSearch = ({ searchTerm, onSearchChange }: CategoriesSearchProps) => {
  return (
    <div className="bg-gradient-to-br from-background via-background to-muted/10 rounded-2xl border border-border/50 shadow-lg p-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Rechercher une catégorie..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-background/50 border-border/60 focus:border-purple-500 transition-colors"
        />
      </div>
    </div>
  );
};

export default CategoriesSearch;
