
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useStores } from '@/hooks/useStores';
import { useToast } from '@/hooks/use-toast';
import { preBuiltTemplates } from '@/data/preBuiltTemplates';
import { templateCategories } from '@/data/templateCategories';
import { siteTemplateService } from '@/services/siteTemplateService';
import { useNavigate } from 'react-router-dom';

interface CreateStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStoreCreated?: (storeId: string) => void;
  hasExistingStore?: boolean;
}

const CreateStoreDialog = ({ open, onOpenChange, onStoreCreated, hasExistingStore }: CreateStoreDialogProps) => {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    domain: '',
  });

  const { createStore, isCreating } = useStores();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Don't allow creation if user already has a store
  if (hasExistingStore && open) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Limite atteinte</DialogTitle>
          </DialogHeader>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Vous ne pouvez créer qu'une seule boutique par compte. 
              Vous avez déjà une boutique active.
            </AlertDescription>
          </Alert>
          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTemplate) return;

    try {
      console.log('🏪 Création de la boutique avec template:', selectedTemplate);

      // 1. Créer la boutique
      const newStore = await createStore({
        name: formData.name,
        description: formData.description || null,
        domain: formData.domain || null,
        status: 'active', // Mettre directement en actif
      });

      console.log('✅ Boutique créée:', newStore);

      // 2. Récupérer le template sélectionné
      const templateData = preBuiltTemplates.find(t => t.id === selectedTemplate);
      if (!templateData) {
        throw new Error('Template non trouvé');
      }

      console.log('📋 Sauvegarde du template:', templateData.name);

      // 3. Sauvegarder le template pour cette boutique et le publier directement
      await siteTemplateService.saveTemplate(
        newStore.id,
        selectedTemplate,
        templateData,
        true // Publier directement
      );

      console.log('✅ Template sauvegardé et publié');

      // Reset form and close dialog
      setFormData({ name: '', description: '', domain: '' });
      setSelectedTemplate('');
      setStep(1);
      onOpenChange(false);

      // Attendre la validation du store
      console.log('⏳ Attente de la validation du store...');

      // Vérifier que le store est validé
      let validatedStore = null;
      let attempts = 0;
      const maxAttempts = 10;

      while (!validatedStore && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500));
        validatedStore = (window as any).validatedStore;
        attempts++;
        console.log(`🔍 Tentative ${attempts}/${maxAttempts} - Store validé:`, !!validatedStore);
      }

      if (!validatedStore) {
        console.error('❌ Store non validé après création');
        toast({
          title: "Erreur de validation",
          description: "La boutique a été créée mais n'est pas encore accessible. Redirection vers le tableau de bord.",
          variant: "destructive"
        });
        navigate('/dashboard');
        return;
      }

      console.log('✅ Store validé avec succès:', validatedStore.id);

      // Notify parent component about the new store
      if (onStoreCreated && newStore) {
        onStoreCreated(newStore.id);
      }

      // Nettoyer les variables globales
      (window as any).validatedStore = null;

      // Rediriger vers l'éditeur de template directement
      console.log('🔄 Redirection vers l\'éditeur...');
      navigate(`/store-config/site-builder/editor/${selectedTemplate}`);
    } catch (error) {
      console.error('Erreur lors de la création de la boutique:', error);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setStep(2);
  };

  const resetDialog = () => {
    setStep(1);
    setSelectedTemplate('');
    setFormData({ name: '', description: '', domain: '' });
  };

  const selectedTemplateData = preBuiltTemplates.find(t => t.id === selectedTemplate);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetDialog();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {step === 1 ? 'Choisir un template' : 'Créer votre boutique'}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 sm:space-y-6">
            <p className="text-sm sm:text-base text-muted-foreground">
              Sélectionnez un template pour votre boutique. Vous pourrez le personnaliser après.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {preBuiltTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-24 sm:h-32 object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm sm:text-base">{template.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {templateCategories.find(cat => cat.id === template.category)?.icon}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 2 && selectedTemplateData && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={selectedTemplateData.thumbnail}
                alt={selectedTemplateData.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{selectedTemplateData.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedTemplateData.description}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                Changer
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de la boutique *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ma Boutique"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description de votre boutique..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="domain">Domaine personnalisé</Label>
                <Input
                  id="domain"
                  value={formData.domain}
                  onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
                  placeholder="mondomaine.com"
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Retour
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Création..." : "Créer la boutique"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateStoreDialog;
