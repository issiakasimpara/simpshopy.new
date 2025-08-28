
import { useState, useEffect } from 'react';

interface DisplaySettings {
  language: string;
  dateFormat: string;
  fontSize: string;
  compactMode: boolean;
  animations: boolean;
}

export const useDisplaySettings = () => {
  const [settings, setSettings] = useState<DisplaySettings>({
    language: 'fr',
    dateFormat: 'fr',
    fontSize: 'medium',
    compactMode: false,
    animations: true
  });

  // Charger les paramètres depuis le localStorage au démarrage
  useEffect(() => {
    const savedSettings = localStorage.getItem('display-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Sauvegarder automatiquement les changements
  useEffect(() => {
    localStorage.setItem('display-settings', JSON.stringify(settings));
    
    // Appliquer les changements en temps réel
    applySettings(settings);
  }, [settings]);

  const applySettings = (newSettings: DisplaySettings) => {
    const root = document.documentElement;
    
    // Appliquer la taille de police
    switch (newSettings.fontSize) {
      case 'small':
        root.style.fontSize = '14px';
        break;
      case 'large':
        root.style.fontSize = '18px';
        break;
      default:
        root.style.fontSize = '16px';
    }
    
    // Appliquer le mode compact
    if (newSettings.compactMode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
    
    // Appliquer les animations
    if (newSettings.animations) {
      root.classList.remove('no-animations');
    } else {
      root.classList.add('no-animations');
    }
  };

  const updateSetting = (key: keyof DisplaySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return {
    settings,
    updateSetting
  };
};
