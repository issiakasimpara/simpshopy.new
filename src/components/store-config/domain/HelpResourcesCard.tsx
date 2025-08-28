
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const HelpResourcesCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Besoin d'aide ?</CardTitle>
        <CardDescription>
          Ressources pour configurer votre nom de domaine
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3">
          <Button variant="outline" className="justify-start h-auto p-4" asChild>
            <a href="#" className="block">
              <div>
                <div className="font-medium">Guide de configuration DNS</div>
                <div className="text-sm text-gray-600">Instructions détaillées par registraire</div>
              </div>
            </a>
          </Button>
          <Button variant="outline" className="justify-start h-auto p-4" asChild>
            <a href="#" className="block">
              <div>
                <div className="font-medium">Où acheter un nom de domaine ?</div>
                <div className="text-sm text-gray-600">Liste des registraires recommandés</div>
              </div>
            </a>
          </Button>
          <Button variant="outline" className="justify-start h-auto p-4" asChild>
            <a href="#" className="block">
              <div>
                <div className="font-medium">Résolution de problèmes SSL</div>
                <div className="text-sm text-gray-600">Solutions aux problèmes SSL courants</div>
              </div>
            </a>
          </Button>
          <Button variant="outline" className="justify-start h-auto p-4" asChild>
            <a href="#" className="block">
              <div>
                <div className="font-medium">Support technique</div>
                <div className="text-sm text-gray-600">Contactez notre équipe pour assistance</div>
              </div>
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HelpResourcesCard;
