
import { TemplateBlock } from '@/types/template';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface FooterEditorProps {
  block: TemplateBlock;
  onUpdate: (key: string, value: any) => void;
}

const FooterEditor = ({ block, onUpdate }: FooterEditorProps) => {
  const handleQuickLinksUpdate = (index: number, field: string, value: string) => {
    const currentLinks = block.content.quickLinks || [
      { text: 'Accueil', url: '#' },
      { text: 'Produits', url: '#' },
      { text: 'À propos', url: '#' },
      { text: 'Contact', url: '#' }
    ];
    
    const updatedLinks = [...currentLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    onUpdate('quickLinks', updatedLinks);
  };

  const handleLegalLinksUpdate = (index: number, field: string, value: string) => {
    const currentLinks = block.content.legalLinks || [
      { text: 'CGV', url: '#' },
      { text: 'Mentions légales', url: '#' },
      { text: 'Confidentialité', url: '#' }
    ];
    
    const updatedLinks = [...currentLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    onUpdate('legalLinks', updatedLinks);
  };

  const addQuickLink = () => {
    const currentLinks = block.content.quickLinks || [];
    onUpdate('quickLinks', [...currentLinks, { text: 'Nouveau lien', url: '#' }]);
  };

  const removeQuickLink = (index: number) => {
    const currentLinks = block.content.quickLinks || [];
    const updatedLinks = currentLinks.filter((_, i) => i !== index);
    onUpdate('quickLinks', updatedLinks);
  };

  const addLegalLink = () => {
    const currentLinks = block.content.legalLinks || [];
    onUpdate('legalLinks', [...currentLinks, { text: 'Nouveau lien', url: '#' }]);
  };

  const removeLegalLink = (index: number) => {
    const currentLinks = block.content.legalLinks || [];
    const updatedLinks = currentLinks.filter((_, i) => i !== index);
    onUpdate('legalLinks', updatedLinks);
  };

  // Fonctions pour gérer les réseaux sociaux
  const handleSocialLinksUpdate = (index: number, field: string, value: string) => {
    const currentLinks = block.content.socialLinks || [
      { platform: 'facebook', url: '', label: 'Facebook' },
      { platform: 'instagram', url: '', label: 'Instagram' },
      { platform: 'twitter', url: '', label: 'Twitter' }
    ];

    const updatedLinks = [...currentLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    onUpdate('socialLinks', updatedLinks);
  };

  const addSocialLink = () => {
    const currentLinks = block.content.socialLinks || [];
    onUpdate('socialLinks', [...currentLinks, { platform: 'facebook', url: '', label: 'Facebook' }]);
  };

  const removeSocialLink = (index: number) => {
    const currentLinks = block.content.socialLinks || [];
    const updatedLinks = currentLinks.filter((_, i) => i !== index);
    onUpdate('socialLinks', updatedLinks);
  };

  return (
    <div className="space-y-6">
      {/* Informations de l'entreprise */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Informations de l'entreprise</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="companyName">Nom de l'entreprise</Label>
            <Input
              id="companyName"
              value={block.content.companyName || ''}
              onChange={(e) => onUpdate('companyName', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={block.content.description || ''}
              onChange={(e) => onUpdate('description', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Newsletter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Newsletter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="showNewsletter"
              checked={block.content.showNewsletter || false}
              onCheckedChange={(checked) => onUpdate('showNewsletter', checked)}
            />
            <Label htmlFor="showNewsletter">Afficher la newsletter</Label>
          </div>
          {block.content.showNewsletter && (
            <>
              <div>
                <Label htmlFor="newsletterTitle">Titre de la newsletter</Label>
                <Input
                  id="newsletterTitle"
                  value={block.content.newsletterTitle || ''}
                  onChange={(e) => onUpdate('newsletterTitle', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="newsletterDescription">Description de la newsletter</Label>
                <Textarea
                  id="newsletterDescription"
                  value={block.content.newsletterDescription || ''}
                  onChange={(e) => onUpdate('newsletterDescription', e.target.value)}
                  rows={2}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Liens rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Liens rapides
            <Button size="sm" variant="outline" onClick={addQuickLink}>
              <Plus className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(block.content.quickLinks || [
            { text: 'Accueil', url: '#' },
            { text: 'Produits', url: '#' },
            { text: 'À propos', url: '#' },
            { text: 'Contact', url: '#' }
          ]).map((link, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                placeholder="Texte du lien"
                value={link.text}
                onChange={(e) => handleQuickLinksUpdate(index, 'text', e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="URL"
                value={link.url}
                onChange={(e) => handleQuickLinksUpdate(index, 'url', e.target.value)}
                className="flex-1"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => removeQuickLink(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Liens légaux */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Informations légales
            <Button size="sm" variant="outline" onClick={addLegalLink}>
              <Plus className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(block.content.legalLinks || [
            { text: 'CGV', url: '#' },
            { text: 'Mentions légales', url: '#' },
            { text: 'Confidentialité', url: '#' }
          ]).map((link, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                placeholder="Texte du lien"
                value={link.text}
                onChange={(e) => handleLegalLinksUpdate(index, 'text', e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="URL"
                value={link.url}
                onChange={(e) => handleLegalLinksUpdate(index, 'url', e.target.value)}
                className="flex-1"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => removeLegalLink(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Informations de contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Informations de contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="contactAddress">Adresse</Label>
            <Textarea
              id="contactAddress"
              value={block.content.contactAddress || ''}
              onChange={(e) => onUpdate('contactAddress', e.target.value)}
              rows={2}
              placeholder="123 Rue Example, 75001 Paris"
            />
          </div>
          <div>
            <Label htmlFor="contactPhone">Téléphone</Label>
            <Input
              id="contactPhone"
              value={block.content.contactPhone || ''}
              onChange={(e) => onUpdate('contactPhone', e.target.value)}
              placeholder="+33 1 23 45 67 89"
            />
          </div>
          <div>
            <Label htmlFor="contactEmail">Email</Label>
            <Input
              id="contactEmail"
              value={block.content.contactEmail || ''}
              onChange={(e) => onUpdate('contactEmail', e.target.value)}
              placeholder="contact@example.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Options d'affichage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Options d'affichage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="showSocialMedia"
              checked={block.content.showSocialMedia || false}
              onCheckedChange={(checked) => onUpdate('showSocialMedia', checked)}
            />
            <Label htmlFor="showSocialMedia">Afficher les réseaux sociaux</Label>
          </div>

          {/* Configuration des réseaux sociaux */}
          {block.content.showSocialMedia && (
            <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Liens des réseaux sociaux</Label>
                <Button size="sm" variant="outline" onClick={addSocialLink}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {(block.content.socialLinks || [
                { platform: 'facebook', url: '', label: 'Facebook' },
                { platform: 'instagram', url: '', label: 'Instagram' },
                { platform: 'twitter', url: '', label: 'Twitter' }
              ]).map((social, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <select
                    value={social.platform}
                    onChange={(e) => handleSocialLinksUpdate(index, 'platform', e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="youtube">YouTube</option>
                    <option value="email">Email</option>
                  </select>
                  <Input
                    placeholder="URL du réseau social"
                    value={social.url}
                    onChange={(e) => handleSocialLinksUpdate(index, 'url', e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeSocialLink(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Switch
              id="showCopyright"
              checked={block.content.showCopyright || false}
              onCheckedChange={(checked) => onUpdate('showCopyright', checked)}
            />
            <Label htmlFor="showCopyright">Afficher le copyright</Label>
          </div>
          {block.content.showCopyright && (
            <div>
              <Label htmlFor="copyrightText">Texte du copyright</Label>
              <Input
                id="copyrightText"
                value={block.content.copyrightText || ''}
                onChange={(e) => onUpdate('copyrightText', e.target.value)}
                placeholder={`© ${new Date().getFullYear()} Votre Entreprise. Tous droits réservés.`}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FooterEditor;
