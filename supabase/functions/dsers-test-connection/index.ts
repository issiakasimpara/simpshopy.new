import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Configuration DSERS API
    const DSERS_API_URL = Deno.env.get('DSERS_API_URL') || 'https://api.dsers.com'
    const DSERS_API_VERSION = Deno.env.get('DSERS_API_VERSION') || 'v1'

    // Récupérer les données de la requête
    const { api_key, api_secret } = await req.json()

    if (!api_key || !api_secret) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'api_key et api_secret requis' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('🔍 Test de connexion DSERS...')

    // Test de connexion via l'API DSERS
    const response = await fetch(`${DSERS_API_URL}/${DSERS_API_VERSION}/auth/test`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${api_key}`,
        'X-API-Secret': api_secret
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ Échec test connexion DSERS:', errorData)
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Connexion DSERS échouée: ${errorData.message || 'Erreur d\'authentification'}` 
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const testData = await response.json()
    console.log('✅ Test connexion DSERS réussi')

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: {
          connected: true,
          account_info: testData.account_info || {},
          api_status: 'active'
        },
        message: 'Connexion DSERS réussie'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Erreur test connexion DSERS:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Erreur serveur: ${error.message}` 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
