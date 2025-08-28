import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔄 Test de connexion à la base de données...')

    // Créer le client Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Test 1: Vérifier la connexion
    console.log('📡 Test 1: Connexion à Supabase...')
    
    // Test 2: Compter les taux existants
    console.log('📊 Test 2: Compter les taux existants...')
    const { count, error: countError } = await supabaseClient
      .from('currency_rates')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('❌ Erreur lors du comptage:', countError)
      throw countError
    }

    console.log(`✅ Nombre de taux trouvés: ${count}`)

    // Test 3: Insérer un taux de test
    console.log('📝 Test 3: Insérer un taux de test...')
    const { data: insertData, error: insertError } = await supabaseClient
      .from('currency_rates')
      .upsert({
        base_currency: 'TEST',
        target_currency: 'TEST',
        rate: 1.0,
        source: 'test-function'
      }, {
        onConflict: 'base_currency,target_currency'
      })

    if (insertError) {
      console.error('❌ Erreur lors de l\'insertion:', insertError)
      throw insertError
    }

    console.log('✅ Test d\'insertion réussi')

    // Test 4: Supprimer le taux de test
    console.log('🗑️ Test 4: Supprimer le taux de test...')
    const { error: deleteError } = await supabaseClient
      .from('currency_rates')
      .delete()
      .eq('base_currency', 'TEST')
      .eq('target_currency', 'TEST')

    if (deleteError) {
      console.error('❌ Erreur lors de la suppression:', deleteError)
      throw deleteError
    }

    console.log('✅ Test de suppression réussi')

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Tous les tests de base de données ont réussi',
        taux_existants: count,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
