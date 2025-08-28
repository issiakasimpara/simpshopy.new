import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  console.log('🔄 mailchimp-sync-customers appelé:', req.method, req.url)
  
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    })
  }

  try {
    const { userId, storeId, customerData } = await req.json()
    
    if (!userId || !storeId || !customerData) {
      throw new Error('Paramètres manquants: userId, storeId, customerData')
    }

    console.log('📋 Synchronisation client:', { userId, storeId, customerEmail: customerData.email })

    // 1. Récupérer l'intégration Mailchimp active
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: integration, error: integrationError } = await supabaseAdmin
      .from('oauth_integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('store_id', storeId)
      .eq('provider', 'mailchimp')
      .eq('is_active', true)
      .single()

    if (integrationError || !integration) {
      console.log('ℹ️ Aucune intégration Mailchimp active trouvée')
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Aucune intégration Mailchimp active' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 2. Vérifier si le token n'est pas expiré
    const tokenExpiresAt = new Date(integration.token_expires_at)
    if (tokenExpiresAt <= new Date()) {
      console.log('🔄 Token expiré, rafraîchissement...')
      
      // Rafraîchir le token
      const refreshResponse = await fetch('https://login.mailchimp.com/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: Deno.env.get('MAILCHIMP_CLIENT_ID') || '',
          client_secret: Deno.env.get('MAILCHIMP_CLIENT_SECRET') || '',
          refresh_token: integration.refresh_token || ''
        })
      })

      if (!refreshResponse.ok) {
        throw new Error('Impossible de rafraîchir le token Mailchimp')
      }

      const refreshData = await refreshResponse.json()
      
      // Mettre à jour le token dans la base de données
      await supabaseAdmin
        .from('oauth_integrations')
        .update({
          access_token: refreshData.access_token,
          refresh_token: refreshData.refresh_token,
          token_expires_at: new Date(Date.now() + refreshData.expires_in * 1000)
        })
        .eq('id', integration.id)

      integration.access_token = refreshData.access_token
      console.log('✅ Token rafraîchi avec succès')
    }

    // 3. Récupérer les informations de l'audience Mailchimp
    const dataCenter = integration.metadata?.dc || 'us1'
    const apiEndpoint = `https://${dataCenter}.api.mailchimp.com/3.0`

    // Récupérer la liste d'audience principale
    const audienceResponse = await fetch(`${apiEndpoint}/lists`, {
      headers: {
        'Authorization': `Bearer ${integration.access_token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!audienceResponse.ok) {
      throw new Error(`Erreur récupération audiences: ${audienceResponse.status}`)
    }

    const audienceData = await audienceResponse.json()
    const audienceId = audienceData.lists?.[0]?.id

    if (!audienceId) {
      throw new Error('Aucune audience Mailchimp trouvée')
    }

    console.log('✅ Audience trouvée:', audienceId)

    // 4. Ajouter le client à l'audience Mailchimp
    const memberData = {
      email_address: customerData.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: customerData.first_name || '',
        LNAME: customerData.last_name || '',
        PHONE: customerData.phone || '',
        STORE: customerData.store_name || ''
      },
      tags: ['simpshopy-customer', 'auto-sync']
    }

    const addMemberResponse = await fetch(`${apiEndpoint}/lists/${audienceId}/members`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${integration.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(memberData)
    })

    if (!addMemberResponse.ok) {
      const errorData = await addMemberResponse.json()
      console.error('❌ Erreur ajout membre:', errorData)
      
      // Si le membre existe déjà, on le met à jour
      if (addMemberResponse.status === 400 && errorData.title === 'Member Exists') {
        console.log('ℹ️ Membre existant, mise à jour...')
        
        const updateResponse = await fetch(`${apiEndpoint}/lists/${audienceId}/members/${customerData.email}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${integration.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(memberData)
        })

        if (!updateResponse.ok) {
          throw new Error('Impossible de mettre à jour le membre existant')
        }

        console.log('✅ Membre mis à jour avec succès')
      } else {
        throw new Error(`Erreur ajout membre: ${errorData.detail || errorData.title}`)
      }
    } else {
      console.log('✅ Membre ajouté avec succès')
    }

    // 5. Logger la synchronisation
    await supabaseAdmin
      .from('oauth_sync_logs')
      .insert({
        integration_id: integration.id,
        action: 'customer_sync',
        status: 'success',
        data: {
          customer_email: customerData.email,
          audience_id: audienceId,
          action: 'added'
        }
      })

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Client synchronisé avec succès vers Mailchimp',
      audience_id: audienceId
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('❌ Erreur synchronisation client:', error)
    
    // Logger l'erreur
    try {
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      await supabaseAdmin
        .from('oauth_sync_logs')
        .insert({
          action: 'customer_sync',
          status: 'error',
          error_message: error instanceof Error ? error.message : 'Erreur inconnue',
          data: { error: true }
        })
    } catch (logError) {
      console.error('❌ Erreur lors du log d\'erreur:', logError)
    }

    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
