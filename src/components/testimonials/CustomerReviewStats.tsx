import React, { useState } from 'react';
import { Star, Edit3, X, Send } from 'lucide-react';
import { useTestimonials, CreateTestimonialData } from '@/hooks/useTestimonials';
import ImageUpload from './ImageUpload'; // 📸 NOUVEAU: Import du composant d'upload

interface CustomerReviewStatsProps {
  testimonials: Array<{
    rating: number;
    id: string;
  }>;
  storeId?: string;
  onReviewSubmitted?: () => void;
  className?: string;
}

export const CustomerReviewStats: React.FC<CustomerReviewStatsProps> = ({
  testimonials,
  storeId,
  onReviewSubmitted,
  className = ''
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    title: '',
    content: '',
    rating: 0
  });
  const [images, setImages] = useState<string[]>([]); // 📸 NOUVEAU: État pour les images
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createTestimonial } = useTestimonials();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeId || !formData.customer_name || !formData.customer_email || !formData.content || formData.rating === 0) {
      return;
    }

    setIsSubmitting(true);

    const testimonialData: CreateTestimonialData = {
      store_id: storeId,
      customer_name: formData.customer_name,
      customer_email: formData.customer_email,
      rating: formData.rating,
      title: formData.title || undefined,
      content: formData.content,
      images: images.length > 0 ? images : undefined // 📸 NOUVEAU: Inclure les images
    };

    const result = await createTestimonial(testimonialData);

    if (result) {
      // Réinitialiser le formulaire
      setFormData({
        customer_name: '',
        customer_email: '',
        title: '',
        content: '',
        rating: 0
      });
      setImages([]); // 📸 NOUVEAU: Réinitialiser les images

      // Fermer le formulaire
      setIsFormOpen(false);

      // Notifier le parent
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    }

    setIsSubmitting(false);
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };
  // Calculer les statistiques
  const totalReviews = testimonials.length;
  
  if (totalReviews === 0) {
    return (
      <div className={`bg-white rounded-lg p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-4xl font-bold text-gray-300 mb-2">0.0</div>
          <div className="flex justify-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-6 h-6 text-gray-300" />
            ))}
          </div>
          <div className="text-sm">Aucun avis pour le moment</div>
        </div>
      </div>
    );
  }

  // Calculer la moyenne
  const averageRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / totalReviews;
  
  // Compter les avis par note
  const ratingCounts = {
    5: testimonials.filter(t => t.rating === 5).length,
    4: testimonials.filter(t => t.rating === 4).length,
    3: testimonials.filter(t => t.rating === 3).length,
    2: testimonials.filter(t => t.rating === 2).length,
    1: testimonials.filter(t => t.rating === 1).length,
  };

  // Calculer les pourcentages
  const ratingPercentages = {
    5: (ratingCounts[5] / totalReviews) * 100,
    4: (ratingCounts[4] / totalReviews) * 100,
    3: (ratingCounts[3] / totalReviews) * 100,
    2: (ratingCounts[2] / totalReviews) * 100,
    1: (ratingCounts[1] / totalReviews) * 100,
  };

  const renderStars = (rating: number, size: string = 'w-6 h-6') => {
    return [1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`${size} ${
          star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border ${className}`}>
      {/* En-tête avec note moyenne */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-center flex-1">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex justify-center mb-2">
            {renderStars(Math.round(averageRating))}
          </div>
          <div className="text-lg text-gray-600">
            Basé sur {totalReviews} avis client{totalReviews > 1 ? 's' : ''}
          </div>
        </div>

        {/* Bouton Écrire un avis */}
        {storeId && (
          <div className="ml-6">
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Edit3 className="w-5 h-5" />
              Écrire un avis
            </button>
          </div>
        )}
      </div>

      {/* Distribution des notes */}
      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center gap-3">
            <div className="flex items-center gap-1 w-16">
              <span className="text-sm text-gray-600 font-medium">{rating}</span>
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${ratingPercentages[rating as keyof typeof ratingPercentages]}%` }}
              />
            </div>
            <div className="text-sm text-gray-600 w-12 text-right font-medium">
              {ratingCounts[rating as keyof typeof ratingCounts]}
            </div>
          </div>
        ))}
      </div>

      {/* Formulaire d'avis */}
      {isFormOpen && (
        <div className="mt-8 border-t pt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Écrire un avis</h3>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, customer_email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre (optionnel)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Résumez votre expérience..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 transition-colors ${
                        star <= formData.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 hover:text-yellow-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre avis *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Partagez votre expérience avec ce produit ou service..."
                required
              />
            </div>

            {/* 📸 NOUVEAU: Upload d'images */}
            <ImageUpload
              images={images}
              onImagesChange={setImages}
              maxImages={3}
              maxSizeInMB={5}
              className="mt-4"
            />

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Publier l'avis
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
