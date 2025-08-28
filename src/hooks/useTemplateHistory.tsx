
import { useState, useCallback } from 'react';
import { Template } from '@/types/template';

interface UseTemplateHistoryProps {
  initialTemplate: Template;
  onTemplateChange: (template: Template) => void;
}

export const useTemplateHistory = ({ initialTemplate, onTemplateChange }: UseTemplateHistoryProps) => {
  const [history, setHistory] = useState<Template[]>([initialTemplate]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const addToHistory = useCallback((template: Template) => {
    console.log('addToHistory appelé, currentIndex:', currentIndex);
    setHistory(prev => {
      // Si on n'est pas à la fin de l'historique, on supprime tout ce qui suit
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(template);
      
      // Limiter l'historique à 50 entrées pour éviter les problèmes de mémoire
      if (newHistory.length > 50) {
        newHistory.shift();
        return newHistory;
      }
      
      console.log('Nouvel historique créé, longueur:', newHistory.length);
      return newHistory;
    });
    
    setCurrentIndex(prev => {
      const newIndex = Math.min(prev + 1, 49);
      console.log('Nouvel index:', newIndex);
      return newIndex;
    });
  }, [currentIndex]);

  const undo = useCallback(() => {
    console.log('undo appelé, canUndo:', canUndo, 'currentIndex:', currentIndex);
    if (canUndo) {
      const newIndex = currentIndex - 1;
      console.log('Annulation vers index:', newIndex);
      setCurrentIndex(newIndex);
      onTemplateChange(history[newIndex]);
    }
  }, [canUndo, currentIndex, history, onTemplateChange]);

  const redo = useCallback(() => {
    console.log('redo appelé, canRedo:', canRedo, 'currentIndex:', currentIndex);
    if (canRedo) {
      const newIndex = currentIndex + 1;
      console.log('Rétablissement vers index:', newIndex);
      setCurrentIndex(newIndex);
      onTemplateChange(history[newIndex]);
    }
  }, [canRedo, currentIndex, history, onTemplateChange]);

  console.log('État de l\'historique - Index:', currentIndex, 'Longueur:', history.length, 'canUndo:', canUndo, 'canRedo:', canRedo);

  return {
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};
