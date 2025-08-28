import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Star,
  Check,
  X,
  Trash2,
  Search,
  Filter,
  MessageCircle,
  TrendingUp,
  Users,
  Award,
  Image as ImageIcon,
  Download
} from 'lucide-react';
import { useTestimonials } from '@/hooks/useTestimonials';
import { useStores } from '@/hooks/useStores';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';

const TestimonialsPage = () => {
  const { stores } = useStores();
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const { toast } = useToast();

  // Sélectionner automatiquement la première boutique
  const currentStore = selectedStoreId 
    ? stores.find(s => s.id === selectedStoreId) 
    : stores[0];

  const { 
    testimonials, 
    isLoading, 
    approveTestimonial, 
    rejectTestimonial, 
    deleteTestimonial,
    toggleFeatured,
    refetch 
  } = useTestimonials(currentStore?.id, false);

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

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (activeTab) {
      case 'pending':
        return !testimonial.is_approved && matchesSearch;
      case 'approved':
        return testimonial.is_approved && matchesSearch;
      case 'featured':
        return testimonial.is_featured && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  const handleApprove = async (id: string) => {
    const result = await approveTestimonial(id);
    if (result) {
      refetch();
    }
  };

  const handleReject = async (id: string) => {
    const result = await rejectTestimonial(id);
    if (result) {
      refetch();
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) {
      const result = await deleteTestimonial(id);
      if (result) {
        refetch();
      }
    }
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    const result = await toggleFeatured(id, featured);
    if (result) {
      refetch();
    }
  };

  // Statistiques
  const stats = {
    total: testimonials.length,
    pending: testimonials.filter(t => !t.is_approved).length,
    approved: testimonials.filter(t => t.is_approved).length,
    featured: testimonials.filter(t => t.is_featured).length,
    averageRating: testimonials.length > 0 
      ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
      : '0'
  };

  if (!currentStore) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Aucune boutique trouvée</h2>
          <p className="text-gray-500">Créez d'abord une boutique pour gérer les témoignages.</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Témoignages Clients</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gérez les avis et témoignages de vos clients
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un témoignage..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm sm:text-base"
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Filtres
            </Button>
          </div>
        </div>

        {/* Onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-10 sm:h-12">
            <TabsTrigger value="pending" className="text-xs sm:text-sm">En attente</TabsTrigger>
            <TabsTrigger value="approved" className="text-xs sm:text-sm">Approuvés</TabsTrigger>
            <TabsTrigger value="featured" className="text-xs sm:text-sm">Mis en avant</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 sm:space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredTestimonials.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredTestimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm sm:text-base truncate">
                            {testimonial.customer_name}
                          </CardTitle>
                          <div className="flex items-center gap-1 mt-1">
                            {renderStars(testimonial.rating)}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {testimonial.is_featured && (
                            <Badge variant="secondary" className="text-xs">
                              <Award className="h-3 w-3 mr-1" />
                              Mis en avant
                            </Badge>
                          )}
                          {testimonial.is_approved && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              <Check className="h-3 w-3 mr-1" />
                              Approuvé
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-sm sm:text-base text-muted-foreground line-clamp-3 mb-4">
                        {testimonial.content}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {!testimonial.is_approved && (
                          <Button
                            size="sm"
                            onClick={() => handleApprove(testimonial.id)}
                            className="text-xs"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Approuver
                          </Button>
                        )}
                        
                        {!testimonial.is_approved && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(testimonial.id)}
                            className="text-xs"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Rejeter
                          </Button>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleFeatured(testimonial.id, !testimonial.is_featured)}
                          className="text-xs"
                        >
                          {testimonial.is_featured ? (
                            <>
                              <Award className="h-3 w-3 mr-1" />
                              Retirer
                            </>
                          ) : (
                            <>
                              <Award className="h-3 w-3 mr-1" />
                              Mettre en avant
                            </>
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(testimonial.id)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun témoignage trouvé</h3>
                <p className="text-muted-foreground">
                  {activeTab === 'pending' && 'Aucun témoignage en attente d\'approbation.'}
                  {activeTab === 'approved' && 'Aucun témoignage approuvé.'}
                  {activeTab === 'featured' && 'Aucun témoignage mis en avant.'}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TestimonialsPage;
