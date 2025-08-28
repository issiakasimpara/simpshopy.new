
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, Palette, Ruler, Plus } from 'lucide-react';
import { useProductAttributes } from '@/hooks/useProductAttributes';
import ColorAttributeManager from './ColorAttributeManager';
import SizeAttributeManager from './SizeAttributeManager';

interface AttributeManagementPanelProps {
  onAttributesUpdated?: () => void;
}

const AttributeManagementPanel = ({ onAttributesUpdated }: AttributeManagementPanelProps) => {
  const { attributes, isLoading } = useProductAttributes();
  const [activeTab, setActiveTab] = useState('overview');

  const colorAttribute = attributes.find(attr => attr.type === 'color');
  const sizeAttribute = attributes.find(attr => attr.type === 'size');

  const handleAttributeCreated = () => {
    onAttributesUpdated?.();
    setActiveTab('overview');
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Settings className="h-8 w-8 mx-auto text-muted-foreground animate-spin mb-2" />
            <p className="text-sm text-muted-foreground">Chargement des attributs...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Couleurs
          </TabsTrigger>
          <TabsTrigger value="sizes" className="flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            Tailles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Attributs configurés
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Aperçu des couleurs */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">Couleurs</h4>
                    <p className="text-sm text-muted-foreground">
                      {colorAttribute 
                        ? `${colorAttribute.attribute_values?.length || 0} couleurs configurées`
                        : 'Aucune couleur configurée'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {colorAttribute?.attribute_values?.slice(0, 5).map((value: any) => (
                    <div
                      key={value.id}
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: value.hex_color }}
                      title={value.value}
                    />
                  ))}
                  {(colorAttribute?.attribute_values?.length || 0) > 5 && (
                    <Badge variant="secondary" className="text-xs">
                      +{(colorAttribute.attribute_values?.length || 0) - 5}
                    </Badge>
                  )}
                  {!colorAttribute && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setActiveTab('colors')}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter
                    </Button>
                  )}
                </div>
              </div>

              {/* Aperçu des tailles */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Ruler className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">Tailles</h4>
                    <p className="text-sm text-muted-foreground">
                      {sizeAttribute 
                        ? `${sizeAttribute.attribute_values?.length || 0} tailles configurées`
                        : 'Aucune taille configurée'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {sizeAttribute?.attribute_values?.slice(0, 6).map((value: any) => (
                    <Badge key={value.id} variant="outline" className="text-xs">
                      {value.value}
                    </Badge>
                  ))}
                  {(sizeAttribute?.attribute_values?.length || 0) > 6 && (
                    <Badge variant="secondary" className="text-xs">
                      +{(sizeAttribute.attribute_values?.length || 0) - 6}
                    </Badge>
                  )}
                  {!sizeAttribute && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setActiveTab('sizes')}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter
                    </Button>
                  )}
                </div>
              </div>

              {!colorAttribute && !sizeAttribute && (
                <div className="text-center py-8 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium">Aucun attribut configuré</p>
                  <p className="text-sm">
                    Commencez par configurer vos couleurs et tailles pour créer des variantes
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors">
          {colorAttribute ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Palette className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-lg font-medium">Couleurs déjà configurées</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {colorAttribute.attribute_values?.length || 0} couleurs disponibles
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {colorAttribute.attribute_values?.map((value: any) => (
                    <div key={value.id} className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: value.hex_color }}
                      />
                      <span className="text-sm">{value.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <ColorAttributeManager onColorAttributeCreated={handleAttributeCreated} />
          )}
        </TabsContent>

        <TabsContent value="sizes">
          {sizeAttribute ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Ruler className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-lg font-medium">Tailles déjà configurées</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {sizeAttribute.attribute_values?.length || 0} tailles disponibles
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {sizeAttribute.attribute_values
                    ?.sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
                    .map((value: any) => (
                      <Badge key={value.id} variant="outline">
                        {value.value}
                      </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <SizeAttributeManager onSizeAttributeCreated={handleAttributeCreated} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttributeManagementPanel;
