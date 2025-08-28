import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    // Configuration Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Configuration DSERS API
    const DSERS_API_URL = Deno.env.get('DSERS_API_URL') || 'https://api.dsers.com'
    const DSERS_API_VERSION = Deno.env.get('DSERS_API_VERSION') || 'v1'

    // Récupérer les données de la requête
    const { ali_express_url, store_id, category_id, price_markup_percentage = 30, auto_sync = true } = await req.json()

    if (!ali_express_url || !store_id) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'URL AliExpress et store_id requis' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Valider l'URL AliExpress
    const aliExpressPattern = /^https?:\/\/(www\.)?aliexpress\.com\/item\/[^/]+\.html/
    if (!aliExpressPattern.test(ali_express_url)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'URL AliExpress invalide' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Extraire l'ID produit de l'URL
    const productIdMatch = ali_express_url.match(/\/item\/([^/]+)\.html/)
    if (!productIdMatch) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Impossible d\'extraire l\'ID produit de l\'URL' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const aliExpressProductId = productIdMatch[1]

    // Récupérer l'intégration DSERS du store
    const { data: integration, error: integrationError } = await supabase
      .from('dsers_integrations')
      .select('*')
      .eq('store_id', store_id)
      .eq('is_active', true)
      .single()

    if (integrationError || !integration) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Intégration DSERS non trouvée ou inactive' 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Vérifier si le produit existe déjà
    const { data: existingProduct } = await supabase
      .from('dsers_products')
      .select('id')
      .eq('store_id', store_id)
      .eq('dsers_product_id', aliExpressProductId)
      .single()

    if (existingProduct) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Ce produit est déjà importé' 
        }),
        { 
          status: 409, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Appel API DSERS pour récupérer les données du produit
    console.log('🔄 Récupération des données produit depuis DSERS...')
    
    const dsersResponse = await fetch(`${DSERS_API_URL}/${DSERS_API_VERSION}/products/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${integration.api_key}`,
        'X-API-Secret': integration.api_secret
      },
      body: JSON.stringify({
        ali_express_url: ali_express_url,
        store_id: store_id,
        auto_sync: auto_sync,
        settings: {
          price_markup_percentage: price_markup_percentage,
          category_id: category_id
        }
      })
    })

    if (!dsersResponse.ok) {
      const errorData = await dsersResponse.json()
      console.error('❌ Erreur API DSERS:', errorData)
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Erreur DSERS: ${errorData.message || 'Erreur inconnue'}` 
        }),
        { 
          status: dsersResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const dsersData = await dsersResponse.json()
    console.log('✅ Données produit récupérées depuis DSERS')

    // Préparer les données du produit pour Simpshopy
    const productData = {
      title: dsersData.title || 'Produit AliExpress',
      description: dsersData.description || '',
      images: dsersData.images || [],
      price: dsersData.price || 0,
      original_price: dsersData.original_price || dsersData.price || 0,
      currency: dsersData.currency || 'USD',
      stock_quantity: dsersData.stock_quantity || 0,
      variants: dsersData.variants || [],
      categories: dsersData.categories || [],
      tags: dsersData.tags || [],
      shipping_info: {
        free_shipping: dsersData.free_shipping || false,
        shipping_cost: dsersData.shipping_cost || 0,
        shipping_time_min: dsersData.shipping_time_min || 7,
        shipping_time_max: dsersData.shipping_time_max || 30,
        shipping_methods: dsersData.shipping_methods || []
      },
      supplier_info: {
        name: dsersData.supplier_name || 'AliExpress',
        rating: dsersData.supplier_rating || 0,
        feedback_score: dsersData.feedback_score || 0,
        response_rate: dsersData.response_rate || 0,
        response_time: dsersData.response_time || 0
      },
      ali_express_data: dsersData
    }

    // Créer le produit dans la base de données Simpshopy
    const { data: newProduct, error: insertError } = await supabase
      .from('dsers_products')
      .insert({
        store_id: store_id,
        dsers_product_id: aliExpressProductId,
        ali_express_url: ali_express_url,
        product_data: productData,
        import_status: 'imported',
        sync_status: auto_sync ? 'pending' : 'synced',
        price_sync: integration.settings.auto_sync_prices,
        stock_sync: integration.settings.auto_sync_stocks
      })
      .select()
      .single()

    if (insertError) {
      console.error('❌ Erreur insertion produit:', insertError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Erreur base de données: ${insertError.message}` 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Créer le produit dans la table products de Simpshopy
    try {
      const simpshopyProduct = {
        store_id: store_id,
        name: productData.title,
        description: productData.description,
        price: productData.price,
        original_price: productData.original_price,
        images: productData.images,
        category_id: category_id,
        stock_quantity: productData.stock_quantity,
        is_active: true,
        metadata: {
          dsers_product_id: aliExpressProductId,
          ali_express_url: ali_express_url,
          imported_via: 'dsers',
          import_date: new Date().toISOString()
        }
      }

      const { data: simpshopyProductData, error: simpshopyError } = await supabase
        .from('products')
        .insert(simpshopyProduct)
        .select()
        .single()

      if (simpshopyError) {
        console.warn('⚠️ Erreur création produit Simpshopy:', simpshopyError)
        // On continue même si ça échoue, le produit DSERS est créé
      } else {
        console.log('✅ Produit créé dans Simpshopy')
      }
    } catch (error) {
      console.warn('⚠️ Erreur création produit Simpshopy:', error)
    }

    // Mettre à jour le statut de synchronisation
    await supabase
      .from('dsers_integrations')
      .update({ last_sync: new Date().toISOString() })
      .eq('id', integration.id)

    console.log('✅ Produit importé avec succès')

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: newProduct,
        message: 'Produit importé avec succès'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Erreur import produit DSERS:', error)
    
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
