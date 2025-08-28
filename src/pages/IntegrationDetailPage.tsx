import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { INTEGRATIONS } from '../data/integrations';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';
import {
  getInstalledIntegrations,
  installIntegration,
  uninstallIntegration
} from '../services/installedIntegrationsService';
import DashboardLayout from '../components/DashboardLayout';

const IntegrationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const integration = INTEGRATIONS.find(i => i.id === id);

  const [installed, setInstalled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !integration) return;
    setLoading(true);
    getInstalledIntegrations(user.id)
      .then(data => setInstalled(data.some(i => i.integration_id === integration.id)))
      .catch(() => toast({ title: 'Erreur', description: 'Erreur lors du chargement', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, [user, integration, toast]);

  const handleInstall = async () => {
    if (!user || !integration) return;
    setLoading(true);
    try {
      await installIntegration(user.id, integration.id);
      setInstalled(true);
      toast({ title: 'Succès', description: 'Intégration installée !' });
    } catch {
      toast({ title: 'Erreur', description: 'Erreur lors de l\'installation', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleUninstall = async () => {
    if (!user || !integration) return;
    setLoading(true);
    try {
      await uninstallIntegration(user.id, integration.id);
      setInstalled(false);
      toast({ title: 'Succès', description: 'Intégration désinstallée.' });
    } catch {
      toast({ title: 'Erreur', description: 'Erreur lors de la désinstallation', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="text-center py-10">Chargement...</div>;
  if (!integration) {
    return (
      <DashboardLayout>
        <div className="max-w-xl mx-auto py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Intégration introuvable</h2>
          <button className="text-blue-600 underline" onClick={() => navigate(-1)}>Retour</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto py-12 px-4">
        <button className="mb-6 text-blue-600 underline" onClick={() => navigate(-1)}>&larr; Retour</button>
        <div className="flex items-center gap-4 mb-6">
          <img src={integration.iconUrl} alt={integration.name} className="w-16 h-16 rounded bg-gray-100 object-contain border" />
          <div>
            <h1 className="text-3xl font-bold mb-1">{integration.name}</h1>
            <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 font-medium">{integration.category}</span>
          </div>
        </div>
        <div className="text-lg mb-6 text-muted-foreground">{integration.description}</div>
        {integration.website && (
          <a href={integration.website} target="_blank" rel="noopener noreferrer" className="inline-block mb-6 text-blue-700 underline">Site officiel</a>
        )}
        <div className="flex gap-4">
          {installed ? (
            <button
              className="px-6 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-medium transition"
              onClick={handleUninstall}
              disabled={loading}
            >
              Gérée (Désinstaller)
            </button>
          ) : (
            <button
              className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
              onClick={handleInstall}
              disabled={loading}
            >
              Installer
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IntegrationDetailPage; 