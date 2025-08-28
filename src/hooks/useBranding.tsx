import { useState, useEffect } from 'react';
import { Template } from '@/types/template';

interface BrandingData {
  logo?: string;
  favicon?: string;
  brandName?: string;
  tagline?: string;
  description?: string;
  logoPosition?: 'left' | 'center' | 'right';
}

export const useBranding = (template: Template | null) => {
  const [brandingData, setBrandingData] = useState<BrandingData>({});

  useEffect(() => {
    if (!template) {
      console.log('🔍 useBranding: Pas de template');
      return;
    }

    console.log('🔍 useBranding: Recherche bloc branding dans template:', template.id);

    // Chercher le bloc branding dans toutes les pages du template
    let brandingBlock = null;

    // Chercher dans toutes les pages
    Object.entries(template.pages).forEach(([pageName, pageBlocks]) => {
      const foundBlock = pageBlocks.find(block => block.type === 'branding');
      if (foundBlock) {
        console.log(`✅ Bloc branding trouvé dans la page: ${pageName}`, foundBlock.content);
        brandingBlock = foundBlock;
      }
    });

    if (brandingBlock) {
      const newBrandingData = {
        logo: brandingBlock.content.logo || '',
        favicon: brandingBlock.content.favicon || '',
        brandName: brandingBlock.content.brandName || '',
        tagline: brandingBlock.content.tagline || '',
        description: brandingBlock.content.description || '',
        logoPosition: brandingBlock.content.logoPosition || 'left'
      };

      console.log('🎨 Données branding extraites:', newBrandingData);
      setBrandingData(newBrandingData);
    } else {
      console.log('⚠️ Aucun bloc branding trouvé dans le template');
      setBrandingData({});
    }
  }, [template]);

  return brandingData;
};
