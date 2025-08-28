import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import StoreUrlDisplay from '@/components/store-config/StoreUrlDisplay';
import { generateSimpshopyUrl, generateStorePath } from '@/utils/domainUtils';

const TestStoreUrls = () => {
  const [storeName, setStoreName] = useState('Ma Super Boutique');

  const testStores = [
    'Ma Super Boutique',
    'Fashion Store',
    'Tech Mali',
    'Boutique Élégante',
    'Shop & Co',
    'Marché Local'
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Test des URLs de Boutiques Simpshopy
          </h1>
          <p className="text-gray-600">
            Testez comment les noms de boutiques sont convertis en URLs
          </p>
        </div>

        {/* Test interactif */}
        <Card>
          <CardHeader>
            <CardTitle>Test Interactif</CardTitle>
            <CardDescription>
              Entrez un nom de boutique pour voir l'URL générée
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Nom de la boutique</Label>
              <Input
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Entrez le nom de votre boutique..."
              />
            </div>
            
            <StoreUrlDisplay storeName={storeName} isTemporary={true} />
          </CardContent>
        </Card>

        {/* Exemples prédéfinis */}
        <Card>
          <CardHeader>
            <CardTitle>Exemples de Boutiques</CardTitle>
            <CardDescription>
              Cliquez sur un exemple pour le tester
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {testStores.map((store) => (
                <Button
                  key={store}
                  variant="outline"
                  onClick={() => setStoreName(store)}
                  className="text-left justify-start"
                >
                  {store}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tableau de conversion */}
        <Card>
          <CardHeader>
            <CardTitle>Tableau de Conversion</CardTitle>
            <CardDescription>
              Comment les noms sont transformés en URLs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-3 text-left">Nom de la boutique</th>
                    <th className="border border-gray-300 p-3 text-left">Path généré</th>
                    <th className="border border-gray-300 p-3 text-left">URL complète</th>
                    <th className="border border-gray-300 p-3 text-left">Futur sous-domaine</th>
                  </tr>
                </thead>
                <tbody>
                  {testStores.map((store) => {
                    const path = generateStorePath(store);
                    const url = generateSimpshopyUrl(store);
                    const futureSubdomain = `${store.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.simpshopy.com`;
                    
                    return (
                      <tr key={store} className="hover:bg-gray-50">
                        <td className="border border-gray-300 p-3 font-medium">{store}</td>
                        <td className="border border-gray-300 p-3">
                          <code className="bg-blue-100 px-2 py-1 rounded text-sm">{path}</code>
                        </td>
                        <td className="border border-gray-300 p-3">
                          <a 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm break-all"
                          >
                            {url}
                          </a>
                        </td>
                        <td className="border border-gray-300 p-3">
                          <code className="bg-purple-100 px-2 py-1 rounded text-sm">{futureSubdomain}</code>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Informations système */}
        <Card>
          <CardHeader>
            <CardTitle>ℹ️ Informations Système</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Système Actuel</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Format: <code>/store/[nom-boutique]</code></li>
                  <li>• Fonctionne immédiatement</li>
                  <li>• Pas besoin d'acheter de domaine</li>
                  <li>• Routes déjà configurées dans l'app</li>
                </ul>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Système Futur</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Format: <code>[boutique].simpshopy.com</code></li>
                  <li>• Nécessite l'achat du domaine</li>
                  <li>• Configuration DNS wildcard</li>
                  <li>• URLs plus professionnelles</li>
                </ul>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">✅ Avantages du système actuel</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Fonctionne immédiatement sans configuration</li>
                <li>• Pas de coûts supplémentaires</li>
                <li>• Facile à migrer vers les sous-domaines plus tard</li>
                <li>• SEO-friendly avec des URLs propres</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestStoreUrls;
