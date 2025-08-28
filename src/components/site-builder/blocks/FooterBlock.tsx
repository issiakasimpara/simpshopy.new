
import React from 'react';
import { TemplateBlock } from '@/types/template';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Mail } from 'lucide-react';

interface FooterBlockProps {
  block: TemplateBlock;
  isEditing: boolean;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  onUpdate?: (block: TemplateBlock) => void;
}

const FooterBlock = ({ block, isEditing, viewMode, onUpdate }: FooterBlockProps) => {
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

  // Fonction pour obtenir l'icône de réseau social
  const getSocialIcon = (platform: string) => {
    const iconProps = { className: "h-5 w-5" };
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook {...iconProps} />;
      case 'instagram':
        return <Instagram {...iconProps} />;
      case 'twitter':
        return <Twitter {...iconProps} />;
      case 'linkedin':
        return <Linkedin {...iconProps} />;
      case 'youtube':
        return <Youtube {...iconProps} />;
      case 'email':
        return <Mail {...iconProps} />;
      default:
        return <Facebook {...iconProps} />;
    }
  };

  const handleContentUpdate = (field: string, value: string) => {
    if (onUpdate) {
      onUpdate({
        ...block,
        content: { ...block.content, [field]: value }
      });
    }
  };

  const gridCols = viewMode === 'mobile' ? 'grid-cols-1' : viewMode === 'tablet' ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-4';
  
  // Données par défaut
  const defaultQuickLinks = [
    { text: 'Accueil', url: '#' },
    { text: 'Produits', url: '#' },
    { text: 'À propos', url: '#' },
    { text: 'Contact', url: '#' }
  ];

  const defaultLegalLinks = [
    { text: 'CGV', url: '#' },
    { text: 'Mentions légales', url: '#' },
    { text: 'Confidentialité', url: '#' }
  ];

  const quickLinks = block.content.quickLinks || defaultQuickLinks;
  const legalLinks = block.content.legalLinks || defaultLegalLinks;
  
  return (
    <footer 
      className={`py-12 ${getResponsiveClasses()}`}
      style={{ 
        backgroundColor: block.styles?.backgroundColor || '#1F2937',
        color: block.styles?.textColor || '#FFFFFF',
        padding: block.styles?.padding
      }}
    >
      <div className="container mx-auto">
        {/* Newsletter Section */}
        {block.content.showNewsletter && (
          <div className="mb-12 text-center">
            {isEditing ? (
              <>
                <h3 
                  className={`font-bold mb-4 ${viewMode === 'mobile' ? 'text-lg' : 'text-2xl'}`}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentUpdate('newsletterTitle', (e.target as HTMLElement).textContent || '')}
                  onInput={(e) => handleContentUpdate('newsletterTitle', (e.target as HTMLElement).textContent || '')}
                >
                  {block.content.newsletterTitle || 'Restez informé'}
                </h3>
                <p 
                  className="mb-6 text-gray-300 max-w-2xl mx-auto cursor-text"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentUpdate('newsletterDescription', (e.target as HTMLElement).textContent || '')}
                  onInput={(e) => handleContentUpdate('newsletterDescription', (e.target as HTMLElement).textContent || '')}
                >
                  {block.content.newsletterDescription || 'Inscrivez-vous à notre newsletter pour recevoir nos dernières actualités'}
                </p>
              </>
            ) : (
              <>
                <h3 className={`font-bold mb-4 ${viewMode === 'mobile' ? 'text-lg' : 'text-2xl'}`}>
                  {block.content.newsletterTitle || 'Restez informé'}
                </h3>
                <p className="mb-6 text-gray-300 max-w-2xl mx-auto">
                  {block.content.newsletterDescription || 'Inscrivez-vous à notre newsletter pour recevoir nos dernières actualités'}
                </p>
              </>
            )}
            <div className={`flex gap-2 max-w-md mx-auto ${viewMode === 'mobile' ? 'flex-col' : 'flex-row'}`}>
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-2 rounded-lg text-gray-900"
              />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                S'inscrire
              </button>
            </div>
          </div>
        )}

        {/* Main Footer Content */}
        <div className={`grid ${gridCols} gap-8 mb-8`}>
          {/* Company Info */}
          <div>
            {isEditing ? (
              <>
                <h4 
                  className="font-bold mb-4 text-lg cursor-text"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentUpdate('companyName', (e.target as HTMLElement).textContent || '')}
                  onInput={(e) => handleContentUpdate('companyName', (e.target as HTMLElement).textContent || '')}
                >
                  {block.content.companyName || 'Votre Entreprise'}
                </h4>
                <p 
                  className="text-gray-300 mb-4 text-sm leading-relaxed cursor-text"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentUpdate('description', (e.target as HTMLElement).textContent || '')}
                  onInput={(e) => handleContentUpdate('description', (e.target as HTMLElement).textContent || '')}
                >
                  {block.content.description || 'Description de votre entreprise et de vos valeurs.'}
                </p>
              </>
            ) : (
              <>
                <h4 className="font-bold mb-4 text-lg">{block.content.companyName || 'Votre Entreprise'}</h4>
                <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                  {block.content.description || 'Description de votre entreprise et de vos valeurs.'}
                </p>
              </>
            )}
            {block.content.showSocialMedia && (
              <div className="flex gap-3">
                {(block.content.socialLinks || [
                  { platform: 'facebook', url: '#', label: 'Facebook' },
                  { platform: 'instagram', url: '#', label: 'Instagram' },
                  { platform: 'twitter', url: '#', label: 'Twitter' }
                ]).map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    title={social.label || social.platform}
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.url} className="text-gray-300 hover:text-white transition-colors text-sm">
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-bold mb-4">Informations légales</h4>
            <ul className="space-y-2">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.url} className="text-gray-300 hover:text-white transition-colors text-sm">
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <div className="space-y-2 text-sm">
              {block.content.contactAddress && (
                <p className="text-gray-300">
                  <strong>Adresse:</strong><br />
                  {block.content.contactAddress}
                </p>
              )}
              {block.content.contactPhone && (
                <p className="text-gray-300">
                  <strong>Téléphone:</strong><br />
                  {block.content.contactPhone}
                </p>
              )}
              {block.content.contactEmail && (
                <p className="text-gray-300">
                  <strong>Email:</strong><br />
                  {block.content.contactEmail}
                </p>
              )}
              
              {/* Valeurs par défaut si aucune information de contact n'est définie */}
              {!block.content.contactAddress && !block.content.contactPhone && !block.content.contactEmail && (
                <>
                  <p className="text-gray-300">
                    <strong>Adresse:</strong><br />
                    123 Rue Example, 75001 Paris
                  </p>
                  <p className="text-gray-300">
                    <strong>Téléphone:</strong><br />
                    +33 1 23 45 67 89
                  </p>
                  <p className="text-gray-300">
                    <strong>Email:</strong><br />
                    contact@example.com
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        {block.content.showCopyright && (
          <div className="pt-8 border-t border-gray-600 text-center">
            {isEditing ? (
              <p 
                className="text-gray-400 text-sm cursor-text"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleContentUpdate('copyrightText', (e.target as HTMLElement).textContent || '')}
                onInput={(e) => handleContentUpdate('copyrightText', (e.target as HTMLElement).textContent || '')}
              >
                {block.content.copyrightText || `© ${new Date().getFullYear()} Votre Entreprise. Tous droits réservés.`}
              </p>
            ) : (
              <p className="text-gray-400 text-sm">
                {block.content.copyrightText || `© ${new Date().getFullYear()} Votre Entreprise. Tous droits réservés.`}
              </p>
            )}
          </div>
        )}
      </div>
    </footer>
  );
};

export default FooterBlock;
