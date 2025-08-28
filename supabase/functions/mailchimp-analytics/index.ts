import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  console.log('📊 mailchimp-analytics appelé:', req.method, req.url)
  
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    })
  }

  try {
    const { userId, storeId } = await req.json()
    
    if (!userId || !storeId) {
      throw new Error('Paramètres manquants: userId, storeId')
    }

    console.log('📊 Récupération analytics pour:', { userId, storeId })

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
        message: 'Aucune intégration Mailchimp active',
        data: {
          subscribers: 0,
          open_rate: 0,
          click_rate: 0,
          campaigns: 0
        }
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 2. Vérifier si le token n'est pas expiré
    const tokenExpiresAt = new Date(integration.token_expires_at)
    if (tokenExpiresAt <= new Date()) {
      console.log('🔄 Token expiré, rafraîchissement...')
      
      if (!integration.refresh_token) {
        console.error('❌ Refresh token manquant')
        throw new Error('Refresh token manquant pour rafraîchir l\'accès')
      }
      
      console.log('🔄 Tentative de rafraîchissement avec refresh_token:', integration.refresh_token.substring(0, 10) + '...')
      
      const refreshResponse = await fetch('https://login.mailchimp.com/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: Deno.env.get('MAILCHIMP_CLIENT_ID') || '',
          client_secret: Deno.env.get('MAILCHIMP_CLIENT_SECRET') || '',
          refresh_token: integration.refresh_token
        })
      })

      if (!refreshResponse.ok) {
        const errorText = await refreshResponse.text()
        console.error('❌ Erreur rafraîchissement token:', refreshResponse.status, errorText)
        throw new Error(`Impossible de rafraîchir le token Mailchimp: ${refreshResponse.status} - ${errorText}`)
      }

      const refreshData = await refreshResponse.json()
      console.log('🔄 Données de rafraîchissement reçues:', { 
        has_access_token: !!refreshData.access_token,
        has_refresh_token: !!refreshData.refresh_token,
        expires_in: refreshData.expires_in
      })
      
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

    // 4. Récupérer les analytics de l'audience
    const analyticsResponse = await fetch(`${apiEndpoint}/lists/${audienceId}`, {
      headers: {
        'Authorization': `Bearer ${integration.access_token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!analyticsResponse.ok) {
      throw new Error(`Erreur récupération analytics audience: ${analyticsResponse.status}`)
    }

    const audienceAnalytics = await analyticsResponse.json()
    console.log('✅ Analytics audience récupérés')

    // 5. Récupérer les campagnes
    const campaignsResponse = await fetch(`${apiEndpoint}/campaigns?count=100`, {
      headers: {
        'Authorization': `Bearer ${integration.access_token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!campaignsResponse.ok) {
      throw new Error(`Erreur récupération campagnes: ${campaignsResponse.status}`)
    }

    const campaignsData = await campaignsResponse.json()
    console.log('✅ Campagnes récupérées')

    // 6. Calculer les analytics
    const analytics = {
      subscribers: audienceAnalytics.stats?.member_count || 0,
      open_rate: audienceAnalytics.stats?.avg_open_rate || 0,
      click_rate: audienceAnalytics.stats?.avg_click_rate || 0,
      campaigns: campaignsData.campaigns?.length || 0
    }

    console.log('📊 Analytics calculés:', analytics)

    // 7. Logger la récupération
    await supabaseAdmin
      .from('oauth_sync_logs')
      .insert({
        integration_id: integration.id,
        action: 'analytics_fetch',
        status: 'success',
        data: {
          audience_id: audienceId,
          analytics: analytics
        }
      })

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Analytics récupérés avec succès',
      data: analytics
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('❌ Erreur récupération analytics:', error)
    
    // Logger l'erreur
    try {
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      await supabaseAdmin
        .from('oauth_sync_logs')
        .insert({
          action: 'analytics_fetch',
          status: 'error',
          error_message: error instanceof Error ? error.message : 'Erreur inconnue',
          data: { error: true }
        })
    } catch (logError) {
      console.error('❌ Erreur lors du log d\'erreur:', logError)
    }

    // Retourner des valeurs par défaut en cas d'erreur
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      data: {
        subscribers: 0,
        open_rate: 0,
        click_rate: 0,
        campaigns: 0
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
