// ========================================
// COMPOSANT POUR INITIALISER LA BASE DE DONNÉES MARKETS
// ========================================

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SQL_SCRIPT = `-- Script SQL simple pour créer les tables Markets & Shipping
-- À copier-coller dans l'éditeur SQL de Supabase

-- 1. TABLE MARKETS (Zones de vente)
CREATE TABLE IF NOT EXISTS public.markets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    store_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    countries TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLE SHIPPING_METHODS (Méthodes de livraison)
CREATE TABLE IF NOT EXISTS public.shipping_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    store_id UUID NOT NULL,
    market_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    estimated_min_days INTEGER DEFAULT 1,
    estimated_max_days INTEGER DEFAULT 7,
    is_active BOOLEAN DEFAULT TRUE,
    conditions JSONB DEFAULT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. INDEXES pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_markets_store_id ON public.markets(store_id);
CREATE INDEX IF NOT EXISTS idx_shipping_methods_store_id ON public.shipping_methods(store_id);
CREATE INDEX IF NOT EXISTS idx_shipping_methods_market_id ON public.shipping_methods(market_id);

-- 4. Ajouter les contraintes de clés étrangères
ALTER TABLE public.shipping_methods ADD CONSTRAINT shipping_methods_market_id_fkey FOREIGN KEY (market_id) REFERENCES public.markets(id) ON DELETE CASCADE;

-- 5. Activer RLS (Row Level Security)
ALTER TABLE public.markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_methods ENABLE ROW LEVEL SECURITY;

-- 6. Politiques RLS basiques (permettre tout pour les utilisateurs authentifiés)
CREATE POLICY "Enable all for authenticated users" ON public.markets FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for authenticated users" ON public.shipping_methods FOR ALL USING (auth.uid() IS NOT NULL);`;

const InitializeMarketsDatabase = () => {
  const { toast } = useToast();
  const [showScript, setShowScript] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(SQL_SCRIPT);
      toast({
        title: "Script copié !",
        description: "Le script SQL a été copié dans le presse-papiers.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le script. Veuillez le sélectionner manuellement.",
        variant: "destructive"
      });
    }
  };

  const openSupabase = () => {
    window.open('https://supabase.com/dashboard', '_blank');
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Configuration de la base de données
        </CardTitle>
        <CardDescription>
          Les tables pour le système de marchés et livraisons doivent être créées dans Supabase.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-3">📋 Instructions étape par étape :</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
            <li><strong>Copiez le script SQL</strong> en cliquant sur "Copier le script SQL"</li>
            <li><strong>Ouvrez Supabase</strong> en cliquant sur "Ouvrir Supabase" ou allez sur <code className="bg-blue-100 px-1 rounded">supabase.com/dashboard</code></li>
            <li><strong>Naviguez vers l'éditeur SQL</strong> : Projet → SQL Editor</li>
            <li><strong>Collez le script</strong> dans l'éditeur et cliquez sur "Run"</li>
            <li><strong>Actualisez cette page</strong> une fois l'exécution terminée</li>
          </ol>
          <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-700">
            💡 <strong>Astuce :</strong> Si vous obtenez des erreurs, assurez-vous que votre projet Supabase est bien configuré et que vous avez les permissions nécessaires.
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={copyToClipboard} variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Copier le script SQL
          </Button>
          <Button onClick={openSupabase} variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            Ouvrir Supabase
          </Button>
          <Button onClick={() => setShowScript(!showScript)} variant="ghost">
            {showScript ? 'Masquer' : 'Voir'} le script
          </Button>
        </div>

        {showScript && (
          <div className="bg-gray-50 border rounded-lg p-4">
            <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
              <code>{SQL_SCRIPT}</code>
            </pre>
          </div>
        )}

        <div className="text-center">
          <Button
            onClick={() => window.location.reload()}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            J'ai exécuté le script - Actualiser la page
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InitializeMarketsDatabase;
