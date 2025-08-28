import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  noIndex?: boolean;
}

const SEOHead = ({
  title = 'SimpShopy - Plateforme E-commerce Internationale',
  description = 'Créez votre boutique en ligne en 2 minutes avec paiements globaux, support français/anglais et tarifs en devises locales.',
  keywords = 'e-commerce, boutique en ligne, plateforme internationale, paiements globaux, dropshpping, SimpShopy',
  image = 'https://simpshopy.com/og-image.jpg',
  url,
  type = 'website',
  noIndex = false
}: SEOHeadProps) => {
  const location = useLocation();
  const currentUrl = url || `https://simpshopy.com${location.pathname}`;

  useEffect(() => {
    // Mettre à jour le titre de la page
    document.title = title;

    // Mettre à jour les meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updatePropertyTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Meta tags de base
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    updateMetaTag('author', 'SimpShopy');
    updateMetaTag('language', 'French');

    // Open Graph
    updatePropertyTag('og:title', title);
    updatePropertyTag('og:description', description);
    updatePropertyTag('og:image', image);
    updatePropertyTag('og:url', currentUrl);
    updatePropertyTag('og:type', type);
    updatePropertyTag('og:site_name', 'SimpShopy');
    updatePropertyTag('og:locale', 'fr_FR');

    // Twitter Card
    updatePropertyTag('twitter:card', 'summary_large_image');
    updatePropertyTag('twitter:title', title);
    updatePropertyTag('twitter:description', description);
    updatePropertyTag('twitter:image', image);
    updatePropertyTag('twitter:url', currentUrl);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = currentUrl;

  }, [title, description, keywords, image, currentUrl, type, noIndex]);

  return null; // Ce composant ne rend rien visuellement
};

export default SEOHead;
