
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface StoreDomain {
  id: string;
  store_id: string;
  domain_type: 'subdomain' | 'custom';
  domain_name: string;
  is_primary: boolean;
  is_active: boolean;
  verification_status: 'pending' | 'verified' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface AddDomainData {
  storeId: string;
  domainName: string;
  domainType: 'subdomain' | 'custom';
}

class DomainService {
  // Récupérer les domaines d'une boutique
  async getStoreDomains(storeId: string): Promise<StoreDomain[]> {
    const { data, error } = await supabase
      .from('store_domains')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erreur récupération domaines:', error);
      throw error;
    }

    return data || [];
  }

  // Ajouter un domaine personnalisé
  async addCustomDomain(storeId: string, domainName: string): Promise<StoreDomain> {
    // Nettoyer le nom de domaine
    const cleanDomain = domainName.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');

    const { data, error } = await supabase
      .from('store_domains')
      .insert({
        store_id: storeId,
        domain_type: 'custom',
        domain_name: cleanDomain,
        is_primary: false,
        is_active: false,
        verification_status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur ajout domaine:', error);
      throw error;
    }

    return data;
  }

  // Supprimer un domaine
  async deleteDomain(domainId: string): Promise<void> {
    const { error } = await supabase
      .from('store_domains')
      .delete()
      .eq('id', domainId);

    if (error) {
      console.error('❌ Erreur suppression domaine:', error);
      throw error;
    }
  }

  // Définir un domaine comme principal
  async setPrimaryDomain(storeId: string, domainId: string): Promise<void> {
    // D'abord, retirer le statut principal de tous les domaines de cette boutique
    await supabase
      .from('store_domains')
      .update({ is_primary: false })
      .eq('store_id', storeId);

    // Ensuite, définir le nouveau domaine principal
    const { error } = await supabase
      .from('store_domains')
      .update({ is_primary: true })
      .eq('id', domainId);

    if (error) {
      console.error('❌ Erreur définition domaine principal:', error);
      throw error;
    }
  }

  // Vérifier un domaine personnalisé
  async verifyDomain(domainId: string): Promise<boolean> {
    try {
      // Récupérer le domaine
      const { data: domain, error: fetchError } = await supabase
        .from('store_domains')
        .select('domain_name')
        .eq('id', domainId)
        .single();

      if (fetchError || !domain) {
        throw new Error('Domaine non trouvé');
      }

      // Vérifier si le domaine pointe vers notre serveur
      const response = await fetch(`https://${domain.domain_name}/api/health`, {
        method: 'GET',
        headers: {
          'User-Agent': 'SimpShopy-Domain-Verifier/1.0'
        }
      });

      const isValid = response.ok;

      // Mettre à jour le statut
      await supabase
        .from('store_domains')
        .update({
          verification_status: isValid ? 'verified' : 'failed',
          is_active: isValid,
          updated_at: new Date().toISOString()
        })
        .eq('id', domainId);

      return isValid;
    } catch (error) {
      console.error('❌ Erreur vérification domaine:', error);
      
      // Marquer comme échoué
      await supabase
        .from('store_domains')
        .update({
          verification_status: 'failed',
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', domainId);

      return false;
    }
  }

  // Obtenir la boutique par domaine (pour le routing)
  async getStoreByDomain(domain: string): Promise<string | null> {
    const { data, error } = await supabase
      .rpc('get_store_by_domain', { p_domain: domain });

    if (error) {
      console.error('❌ Erreur récupération boutique par domaine:', error);
      return null;
    }

    return data;
  }
}

const domainService = new DomainService();

export const useStoreDomains = (storeId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Récupérer les domaines d'une boutique
  const {
    data: domains = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['store-domains', storeId],
    queryFn: () => domainService.getStoreDomains(storeId!),
    enabled: !!storeId
  });

  // Ajouter un domaine personnalisé
  const addCustomDomainMutation = useMutation({
    mutationFn: ({ storeId, domainName }: { storeId: string; domainName: string }) =>
      domainService.addCustomDomain(storeId, domainName),
    onSuccess: (newDomain) => {
      // Mettre à jour le cache
      queryClient.setQueryData(['store-domains', storeId], (old: StoreDomain[] = []) => {
        return [newDomain, ...old];
      });

      toast({
        title: "Domaine ajouté !",
        description: `${newDomain.domain_name} a été ajouté et est en cours de vérification.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le domaine. " + error.message,
        variant: "destructive",
      });
    },
  });

  // Supprimer un domaine
  const deleteDomainMutation = useMutation({
    mutationFn: (domainId: string) => domainService.deleteDomain(domainId),
    onSuccess: (_, domainId) => {
      // Mettre à jour le cache
      queryClient.setQueryData(['store-domains', storeId], (old: StoreDomain[] = []) => {
        return old.filter(domain => domain.id !== domainId);
      });

      toast({
        title: "Domaine supprimé",
        description: "Le domaine a été supprimé avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le domaine. " + error.message,
        variant: "destructive",
      });
    },
  });

  // Définir un domaine comme principal
  const setPrimaryDomainMutation = useMutation({
    mutationFn: ({ storeId, domainId }: { storeId: string; domainId: string }) =>
      domainService.setPrimaryDomain(storeId, domainId),
    onSuccess: () => {
      // Invalider le cache pour recharger
      queryClient.invalidateQueries({ queryKey: ['store-domains', storeId] });

      toast({
        title: "Domaine principal défini",
        description: "Le domaine principal a été mis à jour.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Impossible de définir le domaine principal. " + error.message,
        variant: "destructive",
      });
    },
  });

  // Vérifier un domaine
  const verifyDomainMutation = useMutation({
    mutationFn: (domainId: string) => domainService.verifyDomain(domainId),
    onSuccess: (isValid) => {
      // Invalider le cache pour recharger
      queryClient.invalidateQueries({ queryKey: ['store-domains', storeId] });

      if (isValid) {
        toast({
          title: "Domaine vérifié !",
          description: "Le domaine est maintenant actif et fonctionnel.",
        });
      } else {
        toast({
          title: "Vérification échouée",
          description: "Le domaine ne pointe pas vers SimpShopy. Vérifiez votre configuration DNS.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Erreur de vérification",
        description: "Impossible de vérifier le domaine. " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    domains,
    isLoading,
    error,
    addCustomDomain: addCustomDomainMutation.mutate,
    deleteDomain: deleteDomainMutation.mutate,
    setPrimaryDomain: setPrimaryDomainMutation.mutate,
    verifyDomain: verifyDomainMutation.mutate,
    isAddingDomain: addCustomDomainMutation.isPending,
    isDeletingDomain: deleteDomainMutation.isPending,
    isVerifyingDomain: verifyDomainMutation.isPending
  };
};

// Hook pour le routing (récupérer la boutique par domaine)
export const useStoreByDomain = (domain?: string) => {
  return useQuery({
    queryKey: ['store-by-domain', domain],
    queryFn: () => domainService.getStoreByDomain(domain!),
    enabled: !!domain,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
