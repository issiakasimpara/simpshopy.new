import { supabase } from '../integrations/supabase/client';

export interface InstalledIntegration {
  id: string;
  user_id: string;
  integration_id: string;
  installed_at: string;
}

export interface OAuthIntegration {
  id: string;
  user_id: string;
  store_id: string;
  provider: string;
  access_token: string;
  refresh_token?: string;
  token_expires_at: string;
  provider_user_id?: string;
  provider_account_id?: string;
  metadata?: {
    account_name?: string;
    dc?: string;
    api_endpoint?: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getInstalledIntegrations(userId: string): Promise<InstalledIntegration[]> {
  const { data, error } = await supabase
    .from('installed_integrations')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data || [];
}

export async function getOAuthIntegrations(userId: string, storeId?: string): Promise<OAuthIntegration[]> {
  let query = supabase
    .from('oauth_integrations')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true);
  
  if (storeId) {
    query = query.eq('store_id', storeId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function installIntegration(userId: string, integrationId: string) {
  // Gestion spéciale pour Mailchimp OAuth
  if (integrationId === 'mailchimp') {
    // Rediriger vers la page Mailchimp OAuth
    window.location.href = '/integrations/mailchimp';
    return;
  }
  
  // Installation classique pour les autres intégrations
  const { data, error } = await supabase
    .from('installed_integrations')
    .insert([{ user_id: userId, integration_id: integrationId }]);
  if (error) throw error;
  return data;
}

export async function uninstallIntegration(userId: string, integrationId: string) {
  // Gestion spéciale pour Mailchimp OAuth
  if (integrationId === 'mailchimp') {
    // Rediriger vers la page Mailchimp OAuth pour désinstallation
    window.location.href = '/integrations/mailchimp';
    return;
  }
  
  // Désinstallation classique pour les autres intégrations
  const { error } = await supabase
    .from('installed_integrations')
    .delete()
    .eq('user_id', userId)
    .eq('integration_id', integrationId);
  if (error) throw error;
  return true;
}

export async function isIntegrationInstalled(userId: string, integrationId: string, storeId?: string): Promise<boolean> {
  // Gestion spéciale pour Mailchimp OAuth
  if (integrationId === 'mailchimp') {
    if (!storeId) return false;
    
    const { data, error } = await supabase
      .from('oauth_integrations')
      .select('id')
      .eq('user_id', userId)
      .eq('store_id', storeId)
      .eq('provider', 'mailchimp')
      .eq('is_active', true)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  }
  
  // Vérification classique pour les autres intégrations
  const { data, error } = await supabase
    .from('installed_integrations')
    .select('id')
    .eq('user_id', userId)
    .eq('integration_id', integrationId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
} 