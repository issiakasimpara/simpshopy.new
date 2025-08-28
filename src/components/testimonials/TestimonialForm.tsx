import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Send } from 'lucide-react';
import { useTestimonials, CreateTestimonialData } from '@/hooks/useTestimonials';
import ImageUpload from './ImageUpload'; // 📸 NOUVEAU: Import du composant d'upload

interface TestimonialFormProps {
  storeId: string;
  productId?: string;
  orderId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

const TestimonialForm = ({
  storeId,
  productId,
  orderId,
  onSuccess,
  onCancel,
  className = ""
}: TestimonialFormProps) => {
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

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer_name || !formData.customer_email || !formData.content || formData.rating === 0) {
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
      product_id: productId,
      order_id: orderId,
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
      
      if (onSuccess) {
        onSuccess();
      }

      // Fermer le formulaire après succès
      if (onCancel) {
        onCancel();
      }
    }

    setIsSubmitting(false);
  };

  const renderStars = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingClick(star)}
            className={`p-1 transition-colors ${
              star <= formData.rating 
                ? 'text-yellow-400 hover:text-yellow-500' 
                : 'text-gray-300 hover:text-yellow-300'
            }`}
          >
            <Star 
              className="w-6 h-6" 
              fill={star <= formData.rating ? 'currentColor' : 'none'}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <Star className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold">Laissez votre avis</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Ligne 1: Nom et Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customer_name" className="text-sm font-medium text-gray-700">Votre nom *</Label>
            <Input
              id="customer_name"
              value={formData.customer_name}
              onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
              placeholder="Votre nom complet"
              className="mt-1 h-10"
              required
            />
          </div>
          <div>
            <Label htmlFor="customer_email" className="text-sm font-medium text-gray-700">Votre email *</Label>
            <Input
              id="customer_email"
              type="email"
              value={formData.customer_email}
              onChange={(e) => setFormData(prev => ({ ...prev, customer_email: e.target.value }))}
              placeholder="votre@email.com"
              className="mt-1 h-10"
              required
            />
          </div>
        </div>

        {/* Ligne 2: Note et Titre */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">Votre note *</Label>
            <div className="mt-1 flex items-center gap-1">
              {renderStars()}
              {formData.rating > 0 && (
                <span className="text-sm text-gray-600 ml-2">
                  {formData.rating}/5
                </span>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">Titre de votre avis</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Résumez votre expérience..."
              className="mt-1 h-10"
            />
          </div>
        </div>

        {/* Commentaire */}
        <div>
          <Label htmlFor="content" className="text-sm font-medium text-gray-700">Votre commentaire *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Partagez votre expérience avec ce produit ou cette boutique..."
            rows={3}
            className="mt-1 resize-none"
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

        {/* Bouton et info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-xs text-gray-500 order-2 sm:order-1">
            Votre avis sera examiné avant publication
          </p>
          <Button
            type="submit"
            disabled={isSubmitting || formData.rating === 0}
            className="order-1 sm:order-2 px-6 py-2 h-10"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Envoi...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Publier mon avis
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TestimonialForm;
