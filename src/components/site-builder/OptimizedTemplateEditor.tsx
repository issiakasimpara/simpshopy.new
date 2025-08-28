
import { useParams, useNavigate } from 'react-router-dom';
import { useOptimizedTemplateLoader } from '@/hooks/useOptimizedTemplateLoader';
import { useToast } from '@/hooks/use-toast';
import EditorLoadingState from './EditorLoadingState';
import TemplateEditor from './TemplateEditor';


const OptimizedTemplateEditor = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    template,
    loadingState,
    selectedStore,
    isReady
  } = useOptimizedTemplateLoader(templateId || '');

  const handleBack = () => {
    // Retourner vers l'onglet Ma boutique (configuration) au lieu du site-builder
    navigate('/store-config');
  };

  // Show loading state
  if (loadingState.isLoading) {
    return (
      <EditorLoadingState 
        currentStep={loadingState.currentStep}
        progress={loadingState.progress}
      />
    );
  }

  // Handle errors
  if (loadingState.error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌</div>
          <h2 className="text-xl font-semibold mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{loadingState.error}</p>
          <button 
            onClick={handleBack}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retour aux templates
          </button>
        </div>
      </div>
    );
  }

  // Ready to render editor
  if (isReady && template) {
    return (
      <TemplateEditor 
        template={template}
        onBack={handleBack}
      />
    );
  }

  return null;
};

export default OptimizedTemplateEditor;
