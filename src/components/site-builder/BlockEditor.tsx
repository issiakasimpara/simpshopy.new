
import { useState, useEffect, useRef } from 'react';
import { TemplateBlock } from '@/types/template';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import HeroEditor from './editors/HeroEditor';
import ProductsEditor from './editors/ProductsEditor';
import TextImageEditor from './editors/TextImageEditor';
import TextVideoEditor from './editors/TextVideoEditor';
import ContactEditor from './editors/ContactEditor';
import FooterEditor from './editors/FooterEditor';
import GalleryEditor from './editors/GalleryEditor';
import VideoEditor from './editors/VideoEditor';
import FeaturesEditor from './editors/FeaturesEditor';
import TestimonialsEditor from './editors/TestimonialsEditor';
import FAQEditor from './editors/FAQEditor';
import BeforeAfterEditor from './editors/BeforeAfterEditor';
import ComparisonEditor from './editors/ComparisonEditor';
import GuaranteesEditor from './editors/GuaranteesEditor';
import type { Tables } from '@/integrations/supabase/types';

type Store = Tables<'stores'>;

interface BlockEditorProps {
  block: TemplateBlock;
  selectedStore?: Store | null;
  onUpdate: (block: TemplateBlock) => void;
}

const BlockEditor = ({ block, selectedStore, onUpdate }: BlockEditorProps) => {
  const [localBlock, setLocalBlock] = useState(block);
  const lastUpdateRef = useRef<string>('');

  // Synchroniser le bloc local seulement si le changement vient de l'extérieur
  useEffect(() => {
    const blockString = JSON.stringify(block);
    if (blockString !== lastUpdateRef.current) {
      setLocalBlock(block);
    }
  }, [block]);

  const updateContent = (key: string, value: any) => {
    const updatedBlock = {
      ...localBlock,
      content: {
        ...localBlock.content,
        [key]: value
      }
    };
    
    // Mémoriser cette mise à jour pour éviter les cycles
    lastUpdateRef.current = JSON.stringify(updatedBlock);
    
    setLocalBlock(updatedBlock);
    onUpdate(updatedBlock);
  };

  const handleMediaSelect = (url: string, type: 'image' | 'video' | 'file', fieldKey: string) => {
    updateContent(fieldKey, url);
  };

  const renderEditor = () => {
    const editorProps = {
      block: localBlock,
      onUpdate: updateContent,
      onMediaSelect: handleMediaSelect
    };

    switch (localBlock.type) {
      case 'hero':
        return <HeroEditor {...editorProps} />;
      case 'products':
        return <ProductsEditor block={localBlock} onUpdate={updateContent} selectedStore={selectedStore} />;
      case 'text-image':
        return <TextImageEditor {...editorProps} />;
      case 'text-video':
        return <TextVideoEditor {...editorProps} />;
      case 'contact':
        return <ContactEditor block={localBlock} onUpdate={updateContent} />;
      case 'footer':
        return <FooterEditor block={localBlock} onUpdate={updateContent} />;
      case 'gallery':
        return <GalleryEditor {...editorProps} />;
      case 'video':
        return <VideoEditor {...editorProps} />;
      case 'features':
        return <FeaturesEditor block={localBlock} onUpdate={updateContent} />;
      case 'testimonials':
        return <TestimonialsEditor block={localBlock} onUpdate={updateContent} />;
      case 'faq':
        return <FAQEditor block={localBlock} onUpdate={updateContent} />;
      case 'before-after':
        return <BeforeAfterEditor {...editorProps} />;
      case 'comparison':
        return <ComparisonEditor block={localBlock} onUpdate={updateContent} />;
      case 'guarantees':
        return <GuaranteesEditor block={localBlock} onUpdate={updateContent} />;
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Éditeur non disponible pour ce type de bloc</p>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          Bloc {localBlock.type.charAt(0).toUpperCase() + localBlock.type.slice(1)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderEditor()}
      </CardContent>
    </Card>
  );
};

export default BlockEditor;
