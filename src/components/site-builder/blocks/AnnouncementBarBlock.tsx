import React from 'react';
import { TemplateBlock } from '@/types/template';

interface AnnouncementBarBlockProps {
  block: TemplateBlock;
  isEditing?: boolean;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
  onUpdate?: (block: TemplateBlock) => void;
}

interface AnnouncementItem {
  id: string;
  text: string;
  icon?: string;
  link?: string;
}

const AnnouncementBarBlock = ({ block, isEditing, viewMode, onUpdate }: AnnouncementBarBlockProps) => {

  const getResponsiveClasses = () => {
    switch (viewMode) {
      case 'mobile':
        return 'text-sm px-2 py-2';
      case 'tablet':
        return 'text-base px-4 py-3';
      default:
        return 'text-base px-6 py-3';
    }
  };

  // Configuration par défaut
  const defaultConfig = {
    announcements: [
      { id: '1', text: '🔥 SOLDES D\'ÉTÉ : -40% sur tout le site !', icon: '🔥' },
      { id: '2', text: '📦 Livraison gratuite dès 50€ d\'achat', icon: '📦' },
      { id: '3', text: '⭐ Plus de 10 000 clients satisfaits', icon: '⭐' }
    ] as AnnouncementItem[],
    backgroundColor: '#3B82F6',
    textColor: '#FFFFFF',
    speed: 30, // pixels par seconde (plus lent par défaut)
    isEnabled: true,
    isSticky: false
  };

  const config = { ...defaultConfig, ...block.content };

  if (!config.isEnabled) {
    return null;
  }

  return (
    <div className="relative w-full">
      {/* Barre d'annonces */}
      <div
        className={`
          overflow-hidden whitespace-nowrap relative w-full
          ${config.isSticky ? 'sticky top-0 z-50' : ''}
          ${getResponsiveClasses()}
        `}
        style={{
          backgroundColor: config.backgroundColor,
          color: config.textColor
        }}
      >
        {/* Animation de défilement */}
        <div
          className="inline-block animate-scroll"
          style={{
            animationDuration: `${config.announcements.length * (100 / config.speed)}s`
          }}
        >
          {config.announcements.map((announcement: AnnouncementItem, index: number) => (
            <span key={`${announcement.id}-${index}`} className="inline-block mx-8">
              {announcement.icon && (
                <span className="mr-2">{announcement.icon}</span>
              )}
              {announcement.link ? (
                <a
                  href={announcement.link}
                  className="hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {announcement.text}
                </a>
              ) : (
                <span>{announcement.text}</span>
              )}
            </span>
          ))}
          {/* Répétition pour un défilement continu */}
          {config.announcements.map((announcement: AnnouncementItem, index: number) => (
            <span key={`repeat-${announcement.id}-${index}`} className="inline-block mx-8">
              {announcement.icon && (
                <span className="mr-2">{announcement.icon}</span>
              )}
              {announcement.link ? (
                <a
                  href={announcement.link}
                  className="hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {announcement.text}
                </a>
              ) : (
                <span>{announcement.text}</span>
              )}
            </span>
          ))}
        </div>


      </div>

      {/* CSS pour l'animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scroll {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
          .animate-scroll {
            animation: scroll linear infinite;
          }
        `
      }} />
    </div>
  );
};

export default AnnouncementBarBlock;
