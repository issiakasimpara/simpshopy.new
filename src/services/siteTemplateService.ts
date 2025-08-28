
import { supabase } from '@/integrations/supabase/client';
import { Template } from '@/types/template';

export interface SiteTemplate {
  id: string;
  store_id: string;
  template_id: string;
  template_data: Template;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const siteTemplateService = {
  async loadSiteTemplates(storeId: string): Promise<SiteTemplate[]> {
    if (!storeId) return [];
    
    const { data, error } = await supabase
      .from('site_templates')
      .select('*')
      .eq('store_id', storeId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(item => ({
      ...item,
      template_data: item.template_data as unknown as Template
    }));
  },

  async loadTemplate(storeId: string, templateId: string): Promise<Template | null> {
    if (!storeId || !templateId) return null;

    const { data, error } = await supabase
      .from('site_templates')
      .select('template_data')
      .eq('store_id', storeId)
      .eq('template_id', templateId)
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    if (!data) return null;
    return data.template_data as unknown as Template;
  },

  async saveTemplate(
    storeId: string,
    templateId: string,
    templateData: Template,
    isPublished = false
  ): Promise<string> {
    if (!storeId || !templateId) {
      throw new Error('Store ID ou Template ID manquant');
    }

    // Vérifier si un template existe déjà
    const { data: existing, error: checkError } = await supabase
      .from('site_templates')
      .select('id')
      .eq('store_id', storeId)
      .eq('template_id', templateId)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    let result;
    if (existing) {
      // Mettre à jour
      result = await supabase
        .from('site_templates')
        .update({
          template_data: templateData as any,
          is_published: isPublished,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      // Créer
      result = await supabase
        .from('site_templates')
        .insert({
          store_id: storeId,
          template_id: templateId,
          template_data: templateData as any,
          is_published: isPublished
        })
        .select()
        .single();
    }

    if (result.error) throw result.error;
    return result.data.id;
  }
};
