
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Template } from '@/types/template';
import { useState } from 'react';

interface SiteSettingsProps {
  template: Template;
  onUpdate: (template: Template) => void;
}

const SiteSettings = ({ template, onUpdate }: SiteSettingsProps) => {
  const [localTemplate, setLocalTemplate] = useState(template);

  const updateTemplate = (updates: Partial<Template>) => {
    const updatedTemplate = { ...localTemplate, ...updates };
    setLocalTemplate(updatedTemplate);
    onUpdate(updatedTemplate);
  };

  const updateStyles = (styleUpdates: Partial<Template['styles']>) => {
    const updatedTemplate = {
      ...localTemplate,
      styles: { ...localTemplate.styles, ...styleUpdates }
    };
    setLocalTemplate(updatedTemplate);
    onUpdate(updatedTemplate);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="p-3 sm:p-4">
          <CardTitle className="text-sm sm:text-base">Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4">
          <div>
            <Label htmlFor="siteName" className="text-xs sm:text-sm">Nom du site</Label>
            <Input
              id="siteName"
              value={localTemplate.name}
              onChange={(e) => updateTemplate({ name: e.target.value })}
              className="text-xs sm:text-sm"
            />
          </div>
          <div>
            <Label htmlFor="siteDescription" className="text-xs sm:text-sm">Description</Label>
            <Textarea
              id="siteDescription"
              value={localTemplate.description}
              onChange={(e) => updateTemplate({ description: e.target.value })}
              rows={3}
              className="text-xs sm:text-sm"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-3 sm:p-4">
          <CardTitle className="text-sm sm:text-base">Couleurs du thème</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4">
          <div>
            <Label htmlFor="primaryColor" className="text-xs sm:text-sm">Couleur principale</Label>
            <Input
              id="primaryColor"
              type="color"
              value={localTemplate.styles.primaryColor}
              onChange={(e) => updateStyles({ primaryColor: e.target.value })}
              className="text-xs sm:text-sm"
            />
          </div>
          <div>
            <Label htmlFor="secondaryColor" className="text-xs sm:text-sm">Couleur secondaire</Label>
            <Input
              id="secondaryColor"
              type="color"
              value={localTemplate.styles.secondaryColor}
              onChange={(e) => updateStyles({ secondaryColor: e.target.value })}
              className="text-xs sm:text-sm"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-3 sm:p-4">
          <CardTitle className="text-sm sm:text-base">Typographie</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <div>
            <Label htmlFor="fontFamily" className="text-xs sm:text-sm">Police de caractères</Label>
            <select
              id="fontFamily"
              className="w-full p-2 border rounded-md text-xs sm:text-sm"
              value={localTemplate.styles.fontFamily}
              onChange={(e) => updateStyles({ fontFamily: e.target.value })}
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Lato">Lato</option>
              <option value="Poppins">Poppins</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.keys(localTemplate.pages).map((page) => (
              <div key={page} className="flex items-center justify-between p-2 border rounded">
                <span className="capitalize">{page}</span>
                <span className="text-sm text-gray-500">
                  {localTemplate.pages[page].length} bloc(s)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteSettings;
