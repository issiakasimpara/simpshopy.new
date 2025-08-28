import React, { useState, useEffect } from 'react';
import { INTEGRATIONS, Integration } from '../data/integrations';
import IntegrationCard from '../components/integrations/IntegrationCard';
import { useAuth } from '../hooks/useAuth';
import { useStores } from '../hooks/useStores';
import DashboardLayout from '../components/DashboardLayout';
import {
  getInstalledIntegrations,
  getOAuthIntegrations,
  installIntegration,
  uninstallIntegration,
  isIntegrationInstalled
} from '../services/installedIntegrationsService';

const getCategories = (integrations: Integration[]) => [
  ...new Set(integrations.map(i => i.category))
];

const IntegrationsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { store } = useStores();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [installed, setInstalled] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'all' | 'installed'>('all');

  const categories = getCategories(INTEGRATIONS);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    
    const loadIntegrations = async () => {
      try {
        // Charger les intégrations classiques
        const classicIntegrations = await getInstalledIntegrations(user.id);
        const classicIds = classicIntegrations.map(i => i.integration_id);
        
        // Charger les intégrations OAuth
        const oauthIntegrations = await getOAuthIntegrations(user.id, store?.id);
        const oauthIds = oauthIntegrations.map(i => i.provider);
        
        // Combiner les deux listes
        const allInstalled = [...classicIds, ...oauthIds];
        setInstalled(allInstalled);
      } catch (e) {
        console.error('Erreur chargement intégrations:', e);
        setError('Erreur lors du chargement des intégrations installées');
      } finally {
        setLoading(false);
      }
    };
    
    loadIntegrations();
  }, [user, store]);

  const handleInstall = async (integrationId: string) => {
    if (!user) return;
    setLoading(true);
    try {
      await installIntegration(user.id, integrationId);
      // Pour Mailchimp, la redirection est gérée dans le service
      if (integrationId !== 'mailchimp') {
        setInstalled(prev => [...prev, integrationId]);
      }
    } catch (e) {
      console.error('Erreur installation:', e);
      setError('Erreur lors de l\'installation');
    } finally {
      setLoading(false);
    }
  };

  const handleUninstall = async (integrationId: string) => {
    if (!user) return;
    setLoading(true);
    try {
      await uninstallIntegration(user.id, integrationId);
      // Pour Mailchimp, la redirection est gérée dans le service
      if (integrationId !== 'mailchimp') {
        setInstalled(prev => prev.filter(id => id !== integrationId));
      }
    } catch (e) {
      console.error('Erreur désinstallation:', e);
      setError('Erreur lors de la désinstallation');
    } finally {
      setLoading(false);
    }
  };

  const filtered = INTEGRATIONS.filter(i =>
    (!category || i.category === category) &&
    (i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase()))
  );

  const installedIntegrations = INTEGRATIONS.filter(i => installed.includes(i.id));

  if (authLoading) return <div className="text-center py-10">Chargement...</div>;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto py-4 sm:py-6 lg:py-10 px-3 sm:px-4 lg:px-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">App Store / Intégrations</h1>
        <p className="mb-4 sm:mb-6 lg:mb-8 text-muted-foreground text-sm sm:text-base">Découvrez et ajoutez des applications pour enrichir votre boutique en ligne.</p>
        
        <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6">
          <button
            className={`px-3 sm:px-4 py-2 rounded font-medium text-xs sm:text-sm transition ${tab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            onClick={() => setTab('all')}
          >
            Toutes
          </button>
          <button
            className={`px-3 sm:px-4 py-2 rounded font-medium text-xs sm:text-sm transition ${tab === 'installed' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            onClick={() => setTab('installed')}
          >
            Installées
          </button>
        </div>
        
        {tab === 'all' && (
          <>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-6">
              <input
                type="text"
                placeholder="Rechercher une intégration..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border rounded px-3 py-2 w-full sm:w-64 text-sm sm:text-base"
              />
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs sm:text-sm text-muted-foreground">Catégorie :</span>
                <button
                  className={`px-2 py-1 rounded text-xs sm:text-sm ${!category ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                  onClick={() => setCategory(null)}
                >
                  Toutes
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`px-2 py-1 rounded text-xs sm:text-sm ${category === cat ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            {error && <div className="text-red-600 mb-4 text-sm sm:text-base">{error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map(integration => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                  installed={installed.includes(integration.id)}
                  onInstall={() => handleInstall(integration.id)}
                  onUninstall={() => handleUninstall(integration.id)}
                  loading={loading}
                />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-8 sm:py-10 text-sm sm:text-base">Aucune intégration trouvée.</div>
              )}
            </div>
          </>
        )}
        {tab === 'installed' && (
          <>
            {installedIntegrations.length === 0 && (
              <div className="text-muted-foreground py-8 sm:py-10 text-center text-sm sm:text-base">Aucune application installée pour le moment.</div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {installedIntegrations.map(integration => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                  installed={true}
                  onInstall={() => handleInstall(integration.id)}
                  onUninstall={() => handleUninstall(integration.id)}
                  loading={loading}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default IntegrationsPage; 