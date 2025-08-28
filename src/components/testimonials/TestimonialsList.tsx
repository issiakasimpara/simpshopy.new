
import { Star } from 'lucide-react';
import TestimonialCard from './TestimonialCard';

interface Testimonial {
  id: string;
  customer_name: string;
  customer_email: string;
  content: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
  images?: string[]; // 📸 NOUVEAU: Images du témoignage
}

interface TestimonialsListProps {
  testimonials: Testimonial[];
  onApprove: (id: string, approved: boolean) => void;
  onDelete: (id: string) => void;
}

const TestimonialsList = ({ testimonials, onApprove, onDelete }: TestimonialsListProps) => {
  if (testimonials.length === 0) {
    return (
      <div className="bg-gradient-to-br from-background via-background to-muted/10 rounded-2xl border border-border/50 shadow-lg p-6">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="p-4 bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900/40 dark:to-blue-900/40 rounded-2xl shadow-lg mb-6">
            <Star className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Aucun témoignage</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Vos premiers témoignages clients apparaîtront ici.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-background via-background to-muted/10 rounded-2xl border border-border/50 shadow-lg p-6">
      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            onApprove={onApprove}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialsList;
