import React from 'react';
import { TemplateBlock } from '@/types/template';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface AnnouncementBarEditorProps {
  block: TemplateBlock;
  onUpdate: (key: string, value: any) => void;
}

interface AnnouncementItem {
  id: string;
  text: string;
  icon?: string;
  link?: string;
}

const AnnouncementBarEditor = ({ block, onUpdate }: AnnouncementBarEditorProps) => {
  // Configuration par défaut
  const defaultConfig = {
    announcements: [
      { id: '1', text: '🔥 SOLDES D\'ÉTÉ : -40% sur tout le site !', icon: '🔥' },
      { id: '2', text: '📦 Livraison gratuite dès 50€ d\'achat', icon: '📦' },
      { id: '3', text: '⭐ Plus de 10 000 clients satisfaits', icon: '⭐' }
    ] as AnnouncementItem[],
    backgroundColor: '#3B82F6',
    textColor: '#FFFFFF',
    speed: 30,
    isEnabled: true,
    isSticky: false
  };

  const config = { ...defaultConfig, ...block.content };

  const handleConfigUpdate = (newConfig: any) => {
    const updatedContent = { ...config, ...newConfig };
    // Mettre à jour chaque propriété individuellement
    Object.keys(newConfig).forEach(key => {
      onUpdate(key, newConfig[key]);
    });
  };

  const addAnnouncement = () => {
    const newAnnouncement: AnnouncementItem = {
      id: Date.now().toString(),
      text: 'Nouvelle annonce',
      icon: '📢'
    };

    const updatedAnnouncements = [...config.announcements, newAnnouncement];
    onUpdate('announcements', updatedAnnouncements);
  };

  const updateAnnouncement = (id: string, updates: Partial<AnnouncementItem>) => {
    const updatedAnnouncements = config.announcements.map((item: AnnouncementItem) =>
      item.id === id ? { ...item, ...updates } : item
    );
    onUpdate('announcements', updatedAnnouncements);
  };

  const removeAnnouncement = (id: string) => {
    const filteredAnnouncements = config.announcements.filter((item: AnnouncementItem) => item.id !== id);
    onUpdate('announcements', filteredAnnouncements);
  };

  return (
    <div className="space-y-6 p-4">
      {/* Activation */}
      <div className="flex items-center space-x-2">
        <Switch
          id="isEnabled"
          checked={config.isEnabled}
          onCheckedChange={(checked) => onUpdate('isEnabled', checked)}
        />
        <Label htmlFor="isEnabled">Activer la barre d'annonces</Label>
      </div>

      {/* Couleurs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="backgroundColor">Couleur de fond</Label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="color"
              id="backgroundColor"
              value={config.backgroundColor}
              onChange={(e) => onUpdate('backgroundColor', e.target.value)}
              className="w-12 h-10 rounded border cursor-pointer"
            />
            <Input
              value={config.backgroundColor}
              onChange={(e) => onUpdate('backgroundColor', e.target.value)}
              placeholder="#3B82F6"
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="textColor">Couleur du texte</Label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="color"
              id="textColor"
              value={config.textColor}
              onChange={(e) => onUpdate('textColor', e.target.value)}
              className="w-12 h-10 rounded border cursor-pointer"
            />
            <Input
              value={config.textColor}
              onChange={(e) => onUpdate('textColor', e.target.value)}
              placeholder="#FFFFFF"
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {/* Vitesse */}
      <div>
        <Label htmlFor="speed">
          Vitesse de défilement: {config.speed}px/s
        </Label>
        <input
          type="range"
          id="speed"
          min="5"
          max="100"
          value={config.speed}
          onChange={(e) => onUpdate('speed', parseInt(e.target.value))}
          className="w-full mt-2"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Lent</span>
          <span>Rapide</span>
        </div>
      </div>

      {/* Position sticky */}
      <div className="flex items-center space-x-2">
        <Switch
          id="isSticky"
          checked={config.isSticky}
          onCheckedChange={(checked) => onUpdate('isSticky', checked)}
        />
        <Label htmlFor="isSticky">Fixer en haut de la page (sticky)</Label>
      </div>

      {/* Annonces */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-base font-medium">Annonces</Label>
          <Button
            onClick={addAnnouncement}
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </Button>
        </div>

        <div className="space-y-3">
          {config.announcements.map((announcement: AnnouncementItem) => (
            <div key={announcement.id} className="border rounded-lg p-3 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-16">
                  <Label className="text-xs">Icône</Label>
                  <Input
                    value={announcement.icon || ''}
                    onChange={(e) => updateAnnouncement(announcement.id, { icon: e.target.value })}
                    placeholder="🔥"
                    className="text-center text-sm"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs">Texte de l'annonce</Label>
                  <Input
                    value={announcement.text}
                    onChange={(e) => updateAnnouncement(announcement.id, { text: e.target.value })}
                    placeholder="Votre annonce..."
                    className="text-sm"
                  />
                </div>
                <Button
                  onClick={() => removeAnnouncement(announcement.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 mt-4"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div>
                <Label className="text-xs">Lien (optionnel)</Label>
                <Input
                  value={announcement.link || ''}
                  onChange={(e) => updateAnnouncement(announcement.id, { link: e.target.value })}
                  placeholder="https://..."
                  className="text-sm"
                />
              </div>
            </div>
          ))}
        </div>

        {config.announcements.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Aucune annonce configurée</p>
            <p className="text-xs">Cliquez sur "Ajouter" pour créer votre première annonce</p>
          </div>
        )}
      </div>

      {/* Aperçu */}
      <div className="border-t pt-4">
        <Label className="text-base font-medium">Aperçu</Label>
        <div 
          className="mt-2 p-3 rounded overflow-hidden whitespace-nowrap text-sm"
          style={{
            backgroundColor: config.backgroundColor,
            color: config.textColor
          }}
        >
          {config.announcements.length > 0 ? (
            config.announcements.map((announcement: AnnouncementItem, index: number) => (
              <span key={announcement.id} className="inline-block mx-4">
                {announcement.icon && <span className="mr-1">{announcement.icon}</span>}
                {announcement.text}
              </span>
            ))
          ) : (
            <span className="opacity-50">Aucune annonce à afficher</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBarEditor;
