
import { useState } from 'react';
import { TemplateBlock } from '@/types/template';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface FAQEditorProps {
  block: TemplateBlock;
  onUpdate: (key: string, value: any) => void;
}

const FAQEditor = ({ block, onUpdate }: FAQEditorProps) => {
  const { title, subtitle, faqs = [] } = block.content;

  const addFAQ = () => {
    const newFAQs = [...faqs, { question: '', answer: '' }];
    onUpdate('faqs', newFAQs);
  };

  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedFAQs = [...faqs];
    updatedFAQs[index] = { ...updatedFAQs[index], [field]: value };
    onUpdate('faqs', updatedFAQs);
  };

  const removeFAQ = (index: number) => {
    const updatedFAQs = faqs.filter((_: any, i: number) => i !== index);
    onUpdate('faqs', updatedFAQs);
  };

  const moveFAQ = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= faqs.length) return;

    const updatedFAQs = [...faqs];
    [updatedFAQs[index], updatedFAQs[newIndex]] = [updatedFAQs[newIndex], updatedFAQs[index]];
    onUpdate('faqs', updatedFAQs);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="faq-title">Titre</Label>
          <Input
            id="faq-title"
            value={title || ''}
            onChange={(e) => onUpdate('title', e.target.value)}
            placeholder="Questions Fréquentes"
          />
        </div>

        <div>
          <Label htmlFor="faq-subtitle">Sous-titre</Label>
          <Input
            id="faq-subtitle"
            value={subtitle || ''}
            onChange={(e) => onUpdate('subtitle', e.target.value)}
            placeholder="Trouvez rapidement les réponses à vos questions"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Questions et Réponses</h4>
          <Button onClick={addFAQ} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une FAQ
          </Button>
        </div>

        {faqs.map((faq: any, index: number) => (
          <Card key={index} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">FAQ #{index + 1}</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveFAQ(index, 'up')}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      <GripVertical className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveFAQ(index, 'down')}
                      disabled={index === faqs.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      <GripVertical className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFAQ(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={`question-${index}`}>Question</Label>
                <Input
                  id={`question-${index}`}
                  value={faq.question}
                  onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                  placeholder="Tapez votre question ici..."
                />
              </div>

              <div>
                <Label htmlFor={`answer-${index}`}>Réponse</Label>
                <Textarea
                  id={`answer-${index}`}
                  value={faq.answer}
                  onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                  placeholder="Tapez la réponse ici..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {faqs.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 mb-4">Aucune question FAQ configurée</p>
            <Button onClick={addFAQ} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter votre première FAQ
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQEditor;
