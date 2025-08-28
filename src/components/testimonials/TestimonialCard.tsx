
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Check, X, Eye, Image as ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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

interface TestimonialCardProps {
  testimonial: Testimonial;
  onApprove: (id: string, approved: boolean) => void;
  onDelete: (id: string) => void;
}

const TestimonialCard = ({ testimonial, onApprove, onDelete }: TestimonialCardProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.01] bg-gradient-to-br from-background via-background to-muted/5">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
      
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-lg font-bold">{testimonial.customer_name}</CardTitle>
              <Badge 
                variant={testimonial.is_approved ? 'default' : 'secondary'}
                className={testimonial.is_approved 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
                }
              >
                {testimonial.is_approved ? 'Approuvé' : 'En attente'}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mb-2">
              {renderStars(testimonial.rating)}
              <span className="text-sm text-muted-foreground font-medium">
                {testimonial.rating}/5
              </span>
              {/* 📸 NOUVEAU: Indicateur d'images */}
              {testimonial.images && testimonial.images.length > 0 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
                  <ImageIcon className="h-3 w-3 mr-1" />
                  {testimonial.images.length}
                </Badge>
              )}
            </div>
            <CardDescription className="font-medium">{testimonial.customer_email}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 border-emerald-200/50 dark:border-emerald-800/30 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-blue-100 transition-all duration-300">
                  <Eye className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl">Témoignage de {testimonial.customer_name}</DialogTitle>
                  <DialogDescription className="text-base">
                    Publié le {new Date(testimonial.created_at).toLocaleDateString('fr-FR')}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    {renderStars(testimonial.rating)}
                    <span className="text-sm text-muted-foreground font-medium">
                      {testimonial.rating}/5
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Contenu :</h4>
                    <p className="text-muted-foreground text-base leading-relaxed">"{testimonial.content}"</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email :</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.customer_email}</p>
                  </div>

                  {/* 📸 NOUVEAU: Affichage des images */}
                  {testimonial.images && testimonial.images.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Images ({testimonial.images.length})
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {testimonial.images.map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={imageUrl}
                                alt={`Image ${index + 1} du témoignage`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiAxNkM5Ljc5IDEzLjc5IDkuNzkgMTAuMjEgMTIgOEMxNC4yMSAxMC4yMSAxNC4yMSAxMy43OSAxMiAxNloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant={testimonial.is_approved ? 'outline' : 'default'}
              size="sm"
              onClick={() => onApprove(testimonial.id, !testimonial.is_approved)}
              className={testimonial.is_approved 
                ? 'bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200/50 dark:border-orange-800/30 hover:bg-gradient-to-r hover:from-orange-100 hover:to-red-100' 
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl'
              }
            >
              {testimonial.is_approved ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(testimonial.id)}
              className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <p className="text-muted-foreground leading-relaxed">"{testimonial.content}"</p>
        <p className="text-xs text-muted-foreground mt-3 font-medium">
          Publié le {new Date(testimonial.created_at).toLocaleDateString('fr-FR')} à {new Date(testimonial.created_at).toLocaleTimeString('fr-FR')}
        </p>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
