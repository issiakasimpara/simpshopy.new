import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Vérifier s'il y a une erreur d'autorisation
    if (error) {
      console.error('❌ Erreur autorisation Mailchimp:', error)
      const errorUrl = '/dashboard/integrations?error=mailchimp_oauth_denied'
      return new Response(null, {
        status: 302,
        headers: {
          'Location': errorUrl,
          ...corsHeaders
        }
      })
    }

    if (!code || !state) {
      console.error('❌ Code ou state manquant:', { code: !!code, state: !!state })
      const errorUrl = '/dashboard/integrations?error=mailchimp_oauth_invalid'
      return new Response(null, {
        status: 302,
        headers: {
          'Location': errorUrl,
          ...corsHeaders
        }
      })
    }

    let stateData
    try {
      stateData = JSON.parse(state)
    } catch (e) {
      console.error('❌ Erreur parsing state:', e)
      const errorUrl = '/dashboard/integrations?error=mailchimp_oauth_invalid_state'
      return new Response(null, {
        status: 302,
        headers: {
          'Location': errorUrl,
          ...corsHeaders
        }
      })
    }

    const { userId, storeId, returnUrl } = stateData

    if (!userId || !storeId) {
      console.error('❌ userId ou storeId manquant dans le state')
      const errorUrl = '/dashboard/integrations?error=mailchimp_oauth_invalid_data'
      return new Response(null, {
        status: 302,
        headers: {
          'Location': errorUrl,
          ...corsHeaders
        }
      })
    }

    console.log('🔄 Échange du code contre un token...')

    // Échanger le code contre un token
    const clientId = Deno.env.get('MAILCHIMP_CLIENT_ID')
    const clientSecret = Deno.env.get('MAILCHIMP_CLIENT_SECRET')
    const siteUrl = Deno.env.get('SITE_URL') || 'https://simpshopy.com'
    const redirectUri = `${siteUrl}/api/oauth/mailchimp/callback`

    if (!clientId || !clientSecret) {
      throw new Error('MAILCHIMP_CLIENT_ID ou MAILCHIMP_CLIENT_SECRET non configuré')
    }

    const tokenResponse = await fetch('https://login.mailchimp.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri
      })
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('❌ Erreur échange token:', tokenResponse.status, errorText)
      throw new Error(`Erreur échange token: ${tokenResponse.status} - ${errorText}`)
    }

    const tokenData = await tokenResponse.json()
    console.log('✅ Token obtenu avec succès')

    // Récupérer les informations du compte Mailchimp
    console.log('🔄 Récupération des informations du compte...')
    const accountResponse = await fetch('https://us1.api.mailchimp.com/3.0/', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    })

    if (!accountResponse.ok) {
      const errorText = await accountResponse.text()
      console.error('❌ Erreur récupération compte:', accountResponse.status, errorText)
      throw new Error(`Erreur récupération compte: ${accountResponse.status}`)
    }

    const accountData = await accountResponse.json()
    console.log('✅ Informations du compte récupérées:', accountData.account_name)

    // Sauvegarder l'intégration dans la base de données
    console.log('💾 Sauvegarde de l\'intégration...')
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Vérifier si une intégration existe déjà
    const { data: existingIntegration } = await supabaseClient
      .from('oauth_integrations')
      .select('id')
      .eq('user_id', userId)
      .eq('store_id', storeId)
      .eq('provider', 'mailchimp')
      .eq('is_active', true)
      .single()

    let integrationId
    if (existingIntegration) {
      // Mettre à jour l'intégration existante
      const { error: updateError } = await supabaseClient
        .from('oauth_integrations')
        .update({
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          token_expires_at: new Date(Date.now() + tokenData.expires_in * 1000),
          provider_user_id: accountData.user_id,
          provider_account_id: accountData.account_id,
          metadata: {
            account_name: accountData.account_name,
            dc: accountData.dc, // Data center
            api_endpoint: accountData.api_endpoint
          },
          updated_at: new Date()
        })
        .eq('id', existingIntegration.id)

      if (updateError) throw updateError
      integrationId = existingIntegration.id
      console.log('✅ Intégration mise à jour')
    } else {
      // Créer une nouvelle intégration
      const { data: newIntegration, error: insertError } = await supabaseClient
        .from('oauth_integrations')
        .insert({
          user_id: userId,
          store_id: storeId,
          provider: 'mailchimp',
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          token_expires_at: new Date(Date.now() + tokenData.expires_in * 1000),
          provider_user_id: accountData.user_id,
          provider_account_id: accountData.account_id,
          metadata: {
            account_name: accountData.account_name,
            dc: accountData.dc, // Data center
            api_endpoint: accountData.api_endpoint
          }
        })
        .select('id')
        .single()

      if (insertError) throw insertError
      integrationId = newIntegration.id
      console.log('✅ Nouvelle intégration créée')
    }

    // Log de succès
    await supabaseClient
      .from('oauth_sync_logs')
      .insert({
        integration_id: integrationId,
        action: 'oauth_installation',
        status: 'success',
        data: {
          account_name: accountData.account_name,
          dc: accountData.dc
        }
      })

    // Rediriger vers le dashboard avec succès
    const successUrl = `${returnUrl}?success=mailchimp&account=${encodeURIComponent(accountData.account_name)}`
    
    console.log('🎉 Installation Mailchimp réussie, redirection vers:', successUrl)
    
    return new Response(null, {
      status: 302,
      headers: {
        'Location': successUrl,
        ...corsHeaders
      }
    })

  } catch (error) {
    console.error('❌ Erreur callback Mailchimp:', error)
    
    // Log d'erreur
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      await supabaseClient
        .from('oauth_sync_logs')
        .insert({
          action: 'oauth_installation',
          status: 'error',
          error_message: error instanceof Error ? error.message : 'Erreur inconnue',
          data: { error: true }
        })
    } catch (logError) {
      console.error('❌ Erreur lors du log d\'erreur:', logError)
    }
    
    // Rediriger vers le dashboard avec erreur
    const errorUrl = '/dashboard/integrations?error=mailchimp_oauth_failed'
    
    return new Response(null, {
      status: 302,
      headers: {
        'Location': errorUrl,
        ...corsHeaders
      }
    })
  }
})
