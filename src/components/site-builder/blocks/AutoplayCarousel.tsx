
import { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from '@/components/ui/carousel';

interface AutoplayCarouselProps {
  images: string[];
  autoplay: boolean;
  autoplayDelay: number;
  showTitles: boolean;
  className?: string;
}

const AutoplayCarousel = ({ images, autoplay, autoplayDelay, showTitles, className }: AutoplayCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api || !autoplay) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, autoplayDelay * 1000);

    return () => clearInterval(interval);
  }, [api, autoplay, autoplayDelay]);

  return (
    <Carousel 
      className={className}
      setApi={setApi}
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent>
        {images.map((imageUrl: string, index: number) => (
          <CarouselItem key={index}>
            <div className="relative overflow-hidden rounded-lg shadow-md">
              <img 
                src={imageUrl} 
                alt={`Galerie image ${index + 1}`}
                className="w-full h-96 object-cover"
              />
              {showTitles && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white font-medium">Image {index + 1}</p>
                </div>
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default AutoplayCarousel;
