import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DomainConfig from '@/components/store-config/DomainConfig';
import { useStores } from '@/hooks/useStores';
import { useAuth } from '@/hooks/useAuth';

const Domains = () => {
  const { store, isLoading } = useStores();
  const { loading: authLoading } = useAuth();

  if (authLoading || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Chargement des domaines...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!store) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Aucune boutique trouvée</h2>
          <p className="text-gray-600">Vous devez d'abord créer une boutique pour configurer vos domaines.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Configuration des domaines</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Gérez les domaines de votre boutique</p>
        </div>
        
        <DomainConfig selectedStore={store} />
      </div>
    </DashboardLayout>
  );
};

export default Domains;