
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, User, ThumbsUp } from 'lucide-react';

interface ProductInfoTabsProps {
  description?: string;
  specifications?: Record<string, string>;
  viewMode: 'desktop' | 'tablet' | 'mobile';
}

const ProductInfoTabs = ({ description, specifications, viewMode }: ProductInfoTabsProps) => {
  // Données d'exemple pour les avis
  const mockReviews = [
    {
      id: '1',
      author: 'Marie L.',
      rating: 5,
      date: '2024-01-15',
      title: 'Excellent produit !',
      content: 'Très satisfaite de cet achat. La qualité est au rendez-vous et la coupe parfaite.',
      verified: true,
      helpful: 12
    },
    {
      id: '2',
      author: 'Thomas R.',
      rating: 4,
      date: '2024-01-10',
      title: 'Très bien',
      content: 'Bon rapport qualité-prix. Livraison rapide et produit conforme.',
      verified: true,
      helpful: 8
    },
    {
      id: '3',
      author: 'Sophie M.',
      rating: 5,
      date: '2024-01-05',
      title: 'Je recommande',
      content: 'Parfait ! Exactement ce que je cherchais. Taille bien et matière agréable.',
      verified: false,
      helpful: 5
    }
  ];

  const avgRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length;

  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className={`grid w-full ${viewMode === 'mobile' ? 'grid-cols-2' : 'grid-cols-4'}`}>
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="composition">Composition</TabsTrigger>
        {viewMode !== 'mobile' && <TabsTrigger value="size-guide">Guide tailles</TabsTrigger>}
        <TabsTrigger value="reviews">Avis ({mockReviews.length})</TabsTrigger>
      </TabsList>
      
      <TabsContent value="description" className="mt-6">
        <Card>
          <CardContent className="p-6">
            {description ? (
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">{description}</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-2">Aucune description disponible</p>
                <p className="text-sm text-gray-400">
                  Cette information sera ajoutée depuis le tableau de bord
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="composition" className="mt-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <h4 className="font-medium">Matières</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 95% Coton biologique</li>
                <li>• 5% Élasthanne</li>
              </ul>
              
              <h4 className="font-medium mt-6">Entretien</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Lavage en machine à 30°C</li>
                <li>• Ne pas utiliser d'adoucissant</li>
                <li>• Séchage à l'air libre recommandé</li>
                <li>• Repassage à fer doux</li>
              </ul>

              <h4 className="font-medium mt-6">Origine</h4>
              <p className="text-sm text-gray-600">Fabriqué en France avec des matières certifiées OEKO-TEX</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {viewMode !== 'mobile' && (
        <TabsContent value="size-guide" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h4 className="font-medium mb-4">Guide des tailles</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Taille</th>
                      <th className="text-left py-2">Tour de poitrine (cm)</th>
                      <th className="text-left py-2">Tour de taille (cm)</th>
                      <th className="text-left py-2">Tour de hanches (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-b">
                      <td className="py-2 font-medium">XS</td>
                      <td className="py-2">82-86</td>
                      <td className="py-2">62-66</td>
                      <td className="py-2">88-92</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">S</td>
                      <td className="py-2">86-90</td>
                      <td className="py-2">66-70</td>
                      <td className="py-2">92-96</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">M</td>
                      <td className="py-2">90-94</td>
                      <td className="py-2">70-74</td>
                      <td className="py-2">96-100</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">L</td>
                      <td className="py-2">94-98</td>
                      <td className="py-2">74-78</td>
                      <td className="py-2">100-104</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium">XL</td>
                      <td className="py-2">98-102</td>
                      <td className="py-2">78-82</td>
                      <td className="py-2">104-108</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      )}
      
      <TabsContent value="reviews" className="mt-6">
        <div className="space-y-6">
          {/* Résumé des avis */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{avgRating.toFixed(1)}</div>
                  <div className="flex items-center justify-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{mockReviews.length} avis</div>
                </div>
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = mockReviews.filter(r => r.rating === rating).length;
                    const percentage = (count / mockReviews.length) * 100;
                    return (
                      <div key={rating} className="flex items-center gap-2 text-sm">
                        <span className="w-3">{rating}</span>
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-8 text-gray-600">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des avis */}
          <div className="space-y-4">
            {mockReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <h5 className="font-medium flex items-center gap-2">
                          {review.author}
                          {review.verified && (
                            <Badge variant="outline" className="text-xs">
                              Achat vérifié
                            </Badge>
                          )}
                        </h5>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h6 className="font-medium mb-2">{review.title}</h6>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">{review.content}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <button className="flex items-center gap-1 hover:text-gray-700">
                      <ThumbsUp className="h-3 w-3" />
                      Utile ({review.helpful})
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProductInfoTabs;
