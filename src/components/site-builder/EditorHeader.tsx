
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Save, 
  Eye, 
  Upload,
  Undo2,
  Redo2
} from 'lucide-react';

interface EditorHeaderProps {
  templateName: string;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  onViewModeChange: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  onBack: () => void;
  onSave: () => void;
  onPreview: () => void;
  onPublish: () => void;
  hasUnsavedChanges: boolean;
  isSaving?: boolean;
  // Nouvelles props pour l'historique
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  // Nouvelle prop pour le store
  hasStore?: boolean;
}

const EditorHeader = ({
  templateName,
  viewMode,
  onViewModeChange,
  onBack,
  onSave,
  onPreview,
  onPublish,
  hasUnsavedChanges,
  isSaving = false,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  hasStore = true
}: EditorHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16 sm:h-20">
      <div className="flex items-center justify-between h-full px-3 sm:px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Retour</span>
          </Button>
          
          <Separator orientation="vertical" className="h-4 sm:h-6" />
          
          <div className="flex items-center gap-1 sm:gap-2">
            <h1 className="font-semibold text-sm sm:text-lg truncate max-w-32 sm:max-w-none">{templateName}</h1>
            {hasUnsavedChanges && (
              <Badge variant="secondary" className="text-xs">
                Non sauvegardé
              </Badge>
            )}
            {!hasStore && (
              <Badge variant="destructive" className="text-xs">
                Aucune boutique
              </Badge>
            )}
          </div>
        </div>

        {/* Center Section - History Controls */}
        <div className="hidden sm:flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="flex items-center gap-1 sm:gap-2 h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-2"
            title="Annuler (Ctrl+Z)"
          >
            <Undo2 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden lg:inline text-xs sm:text-sm">Annuler</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="flex items-center gap-1 sm:gap-2 h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-2"
            title="Refaire (Ctrl+Y)"
          >
            <Redo2 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden lg:inline text-xs sm:text-sm">Refaire</span>
          </Button>
          
          <Separator orientation="vertical" className="h-4 sm:h-6" />
          
          {/* View Mode Controls */}
          <div className="flex items-center bg-gray-100 rounded-md p-1">
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('desktop')}
              className="h-6 w-6 sm:h-8 sm:w-8 p-0"
            >
              <Monitor className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant={viewMode === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('tablet')}
              className="h-6 w-6 sm:h-8 sm:w-8 p-0"
            >
              <Tablet className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('mobile')}
              className="h-6 w-6 sm:h-8 sm:w-8 p-0"
            >
              <Smartphone className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            disabled={isSaving || !hasStore}
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
            title={!hasStore ? "Aucune boutique disponible" : ""}
          >
            <Save className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{isSaving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onPreview}
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Aperçu</span>
          </Button>

          <Button
            size="sm"
            onClick={onPublish}
            disabled={!hasStore}
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
            title={!hasStore ? "Aucune boutique disponible" : ""}
          >
            <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Publier</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default EditorHeader;
