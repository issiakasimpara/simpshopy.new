import { useRef } from 'react';
import { Template } from '@/types/template';

interface UseTemplateHistoryHandlersProps {
  templateData: Template;
  setTemplateData: (template: Template) => void;
  setHasUnsavedChanges: (value: boolean) => void;
  addToHistory: (template: Template) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const useTemplateHistoryHandlers = ({
  templateData,
  setTemplateData,
  setHasUnsavedChanges,
  addToHistory,
  undo,
  redo,
  canUndo,
  canRedo,
}: UseTemplateHistoryHandlersProps) => {
  // Référence pour éviter les boucles infinies
  const isHistoryChangeRef = useRef(false);

  const handleTemplateChangeFromHistory = (template: Template) => {
    isHistoryChangeRef.current = true;
    setTemplateData(template);
    setHasUnsavedChanges(true);
  };

  const handleTemplateUpdate = (updatedTemplate: Template) => {
    setTemplateData(updatedTemplate);
    setHasUnsavedChanges(true);
    
    // Ajouter à l'historique seulement si ce n'est pas un changement depuis l'historique
    if (!isHistoryChangeRef.current) {
      addToHistory(updatedTemplate);
    } else {
      isHistoryChangeRef.current = false;
    }
  };

  // Wrapper pour les fonctions undo/redo
  const handleUndo = () => {
    if (canUndo) {
      undo();
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      redo();
    }
  };

  return {
    handleTemplateChangeFromHistory,
    handleTemplateUpdate,
    handleUndo,
    handleRedo,
  };
};