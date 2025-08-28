import React, { useState } from 'react';
import { TemplateBlock } from '@/types/template';
import { Star, MessageCircle, Image as ImageIcon } from 'lucide-react';
import { useTestimonials } from '@/hooks/useTestimonials';
import { CustomerReviewStats } from '@/components/testimonials/CustomerReviewStats';
import type { Tables } from '@/integrations/supabase/types';

type Store = Tables<'stores'>;

interface TestimonialsBlockProps {
  block: TemplateBlock;
  isEditing: boolean;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  onUpdate?: (block: TemplateBlock) => void;
  selectedStore?: Store | null;
}

const TestimonialsBlock = ({ block, isEditing, viewMode, selectedStore }: TestimonialsBlockProps) => {
  const { testimonials, isLoading, refetch } = useTestimonials(selectedStore?.id, true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const getResponsiveClasses = () => {
    switch (viewMode) {
      case 'mobile':
        return 'text-sm px-2';
      case 'tablet':
        return 'text-base px-4';
      default:
        return 'text-base px-6';
    }
  };

  // Données de démonstration pour l'éditeur
  const demoTestimonials = [
    {
      id: '1',
      customer_name: 'Marie Dupont',
      content: 'Excellent service et produits de qualité ! Je recommande vivement.',
      rating: 5
    },
    {
      id: '2',
      customer_name: 'Jean Martin',
      content: 'Livraison rapide et produit conforme à la description.',
      rating: 4
    },
    {
      id: '3',
      customer_name: 'Sophie Bernard',
      content: 'Très satisfaite de mon achat, je reviendrai !',
      rating: 5
    }
  ];

  // Utiliser les vrais témoignages si disponibles, sinon les données de démo
  const displayTestimonials = isEditing ? demoTestimonials : (testimonials.length > 0 ? testimonials : demoTestimonials);

  // Limiter à 6 témoignages maximum pour l'affichage
  const limitedTestimonials = displayTestimonials.slice(0, 6);

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

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="container mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-48"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-16">
      <div className="w-full">
        <div className="text-center mb-8 lg:mb-12 px-4">
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {block.content.title || 'Ce que disent nos clients'}
          </h2>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            Découvrez les avis authentiques de nos clients satisfaits
          </p>
        </div>

        {/* STATS SECTION */}
        <div className="px-4 lg:px-8">
          <CustomerReviewStats
            testimonials={limitedTestimonials}
            storeId={selectedStore?.id}
            onReviewSubmitted={() => {
              refetch();
            }}
          />
        </div>

        {/* TESTIMONIALS LIST */}
        {limitedTestimonials.length > 0 ? (
          <div className="mt-12 px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h3 className="text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-8">
                Avis de nos clients
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {limitedTestimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className="relative group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="bg-gray-50 border-b border-gray-100 p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold text-xl">
                          {testimonial.customer_name.charAt(0).toUpperCase()}
                        </div>

                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-gray-900">{testimonial.customer_name}</h4>
                          <div className="flex items-center gap-1 mt-1">
                            {renderStars(testimonial.rating)}
                            <span className="ml-2 text-gray-600 text-sm font-medium">
                              {testimonial.rating}/5
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <p className="text-gray-600 leading-relaxed mb-4 italic">
                        "{testimonial.content}"
                      </p>

                      {/* 📸 NOUVEAU: Affichage des images */}
                      {testimonial.images && testimonial.images.length > 0 && (
                        <div className="mt-4">
                          <div className="flex items-center gap-2 mb-3">
                            <ImageIcon className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500 font-medium">
                              {testimonial.images.length} image{testimonial.images.length > 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {testimonial.images.slice(0, 4).map((imageUrl, imgIndex) => (
                              <div key={imgIndex} className="relative group">
                                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                  <img
                                    src={imageUrl}
                                    alt={`Image ${imgIndex + 1} du témoignage`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiAxNkM5Ljc5IDEzLjc5IDkuNzkgMTAuMjEgMTIgOEMxNC4yMSAxMC4yMSAxNC4yMSAxMy43OSAxMiAxNloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                                    }}
                                  />
                                </div>
                                {/* Overlay pour plus d'images */}
                                {imgIndex === 3 && testimonial.images && testimonial.images.length > 4 && (
                                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">
                                      +{testimonial.images.length - 4}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Badge vérifié */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Vérifié
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-12 text-center py-16 px-4">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucun avis pour le moment</h3>
              <p className="text-gray-600 text-lg">Soyez le premier à partager votre expérience !</p>
            </div>
          </div>
        )}

        {isEditing && (
          <div className="text-center mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-600 text-sm">
              📝 Mode éditeur : Les vrais témoignages apparaîtront sur votre site publié.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsBlock;
