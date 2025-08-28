import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200, 
      headers: corsHeaders 
    })
  }

  try {
    console.log('🔗 Début de la fonction authorize')
    
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('user_id')
    const storeId = searchParams.get('store_id')
    const returnUrl = searchParams.get('return_url')

    console.log('📋 Paramètres reçus:', { userId, storeId, returnUrl })

    if (!userId || !storeId) {
      console.log('❌ Paramètres manquants')
      return new Response(
        JSON.stringify({ 
          error: 'user_id et store_id sont requis',
          received: { userId, storeId }
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const clientId = Deno.env.get('MAILCHIMP_CLIENT_ID')
    console.log('🔑 Client ID:', clientId ? 'PRÉSENT' : 'MANQUANT')
    
    if (!clientId) {
      console.log('❌ MAILCHIMP_CLIENT_ID manquant')
      return new Response(
        JSON.stringify({ error: 'MAILCHIMP_CLIENT_ID non configuré' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // URL de callback correcte
    const redirectUri = `https://grutldacuowplosarucp.supabase.co/functions/v1/oauth/mailchimp/callback`
    console.log('🔄 Redirect URI:', redirectUri)

    const authUrl = new URL('https://login.mailchimp.com/oauth2/authorize')
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('client_id', clientId)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('scope', 'read_write')
    
    // State avec données sécurisées
    const state = JSON.stringify({ 
      userId, 
      storeId, 
      returnUrl: returnUrl || '/dashboard/integrations',
      timestamp: Date.now()
    })
    authUrl.searchParams.set('state', state)

    console.log('🔗 URL d\'autorisation générée:', authUrl.toString())

    return new Response(
      JSON.stringify({ 
        success: true, 
        auth_url: authUrl.toString(),
        message: 'Redirection vers Mailchimp...',
        debug: { 
          redirectUri, 
          clientId: clientId ? '***' : 'MANQUANT',
          userId,
          storeId
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Erreur dans authorize:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Erreur interne du serveur',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
