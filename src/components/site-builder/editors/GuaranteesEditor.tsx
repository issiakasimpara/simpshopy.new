
import { TemplateBlock } from '@/types/template';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';

interface GuaranteesEditorProps {
  block: TemplateBlock;
  onUpdate: (key: string, value: any) => void;
}

const commonEcommercEmojis = [
  { value: '🚚', label: '🚚 Livraison' },
  { value: '📦', label: '📦 Colis' },
  { value: '🔄', label: '🔄 Retour' },
  { value: '💳', label: '💳 Paiement' },
  { value: '🔒', label: '🔒 Sécurisé' },
  { value: '⚡', label: '⚡ Rapide' },
  { value: '🛡️', label: '🛡️ Garantie' },
  { value: '💎', label: '💎 Qualité' },
  { value: '🌟', label: '🌟 Premium' },
  { value: '👥', label: '👥 Support' },
  { value: '📞', label: '📞 Contact' },
  { value: '✅', label: '✅ Vérifié' },
  { value: '🎯', label: '🎯 Précision' },
  { value: '🏆', label: '🏆 Excellence' },
  { value: '💯', label: '💯 Satisfait' },
  { value: '🌍', label: '🌍 Mondial' },
  { value: '🕒', label: '🕒 24h/7j' },
  { value: '💰', label: '💰 Prix' },
  { value: '🎁', label: '🎁 Cadeau' },
  { value: '📱', label: '📱 Mobile' }
];

const GuaranteesEditor = ({ block, onUpdate }: GuaranteesEditorProps) => {
  const guarantees = block.content.guarantees || [];

  const addGuarantee = () => {
    const newGuarantees = [...guarantees, {
      title: 'Nouvelle garantie',
      description: '',
      icon: '🚚'
    }];
    onUpdate('guarantees', newGuarantees);
  };

  const updateGuarantee = (index: number, field: string, value: string) => {
    const updatedGuarantees = guarantees.map((guarantee: any, i: number) => 
      i === index ? { ...guarantee, [field]: value } : guarantee
    );
    onUpdate('guarantees', updatedGuarantees);
  };

  const removeGuarantee = (index: number) => {
    const updatedGuarantees = guarantees.filter((_: any, i: number) => i !== index);
    onUpdate('guarantees', updatedGuarantees);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title">Titre de la section</Label>
        <Input
          id="title"
          value={block.content.title || ''}
          onChange={(e) => onUpdate('title', e.target.value)}
          placeholder="Nos garanties"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <Label>Garanties</Label>
          <Button onClick={addGuarantee} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>

        <div className="space-y-4">
          {guarantees.map((guarantee: any, index: number) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Garantie {index + 1}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGuarantee(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Icône</Label>
                  <div className="flex gap-2">
                    <Select
                      value={guarantee.icon || '🚚'}
                      onValueChange={(value) => updateGuarantee(index, 'icon', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {commonEcommercEmojis.map((emoji) => (
                          <SelectItem key={emoji.value} value={emoji.value}>
                            {emoji.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      className="w-20"
                      value={guarantee.icon || ''}
                      onChange={(e) => updateGuarantee(index, 'icon', e.target.value)}
                      placeholder="🚚"
                    />
                  </div>
                </div>
                <div>
                  <Label>Titre</Label>
                  <Input
                    value={guarantee.title || ''}
                    onChange={(e) => updateGuarantee(index, 'title', e.target.value)}
                    placeholder="Livraison gratuite"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={guarantee.description || ''}
                    onChange={(e) => updateGuarantee(index, 'description', e.target.value)}
                    placeholder="Dès 50000 CFA d'achat"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {guarantees.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Aucune garantie ajoutée</p>
            <Button onClick={addGuarantee} className="mt-2">
              Ajouter la première garantie
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuaranteesEditor;
