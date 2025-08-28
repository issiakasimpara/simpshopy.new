import { useState } from 'react';
import { Template, TemplateBlock } from '@/types/template';

export interface TemplateStateCore {
  currentPage: string;
  selectedBlock: TemplateBlock | null;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  showStylePanel: boolean;
  showPreview: boolean;
  showSettings: boolean;
  templateData: Template;
  hasUnsavedChanges: boolean;
}

export const useTemplateStateCore = (initialTemplate: Template) => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedBlock, setSelectedBlock] = useState<TemplateBlock | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [templateData, setTemplateData] = useState<Template>(initialTemplate);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  return {
    // State
    currentPage,
    selectedBlock,
    viewMode,
    showStylePanel,
    showPreview,
    showSettings,
    templateData,
    hasUnsavedChanges,
    
    // Setters
    setCurrentPage,
    setSelectedBlock,
    setViewMode,
    setShowStylePanel,
    setShowPreview,
    setShowSettings,
    setTemplateData,
    setHasUnsavedChanges,
  };
};