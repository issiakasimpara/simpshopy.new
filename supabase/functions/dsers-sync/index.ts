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
    const { store_id, sync_type, force_full_sync = false } = await req.json()

    if (!store_id || !sync_type) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'store_id et sync_type requis' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

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

    // Créer un log de synchronisation
    const syncStartTime = Date.now()
    const { data: syncLog, error: syncLogError } = await supabase
      .from('dsers_sync_logs')
      .insert({
        store_id: store_id,
        sync_type: sync_type,
        status: 'running',
        started_at: new Date().toISOString()
      })
      .select()
      .single()

    if (syncLogError) {
      console.error('❌ Erreur création log sync:', syncLogError)
    }

    const itemsProcessed = 0
    const itemsSucceeded = 0
    const itemsFailed = 0
    const errors = []

    try {
      console.log(`🔄 Début synchronisation ${sync_type} pour store ${store_id}`)

      switch (sync_type) {
        case 'products':
          await syncProducts(supabase, integration, store_id, force_full_sync)
          break
        case 'orders':
          await syncOrders(supabase, integration, store_id, force_full_sync)
          break
        case 'prices':
          await syncPrices(supabase, integration, store_id, force_full_sync)
          break
        case 'stocks':
          await syncStocks(supabase, integration, store_id, force_full_sync)
          break
        default:
          throw new Error(`Type de synchronisation non supporté: ${sync_type}`)
      }

      // Mettre à jour le statut de synchronisation
      await supabase
        .from('dsers_integrations')
        .update({ last_sync: new Date().toISOString() })
        .eq('id', integration.id)

      const syncEndTime = Date.now()
      const duration = syncEndTime - syncStartTime

      // Mettre à jour le log de synchronisation
      if (syncLog) {
        await supabase
          .from('dsers_sync_logs')
          .update({
            status: 'success',
            items_processed: itemsProcessed,
            items_succeeded: itemsSucceeded,
            items_failed: itemsFailed,
            completed_at: new Date().toISOString(),
            duration_ms: duration
          })
          .eq('id', syncLog.id)
      }

      console.log(`✅ Synchronisation ${sync_type} terminée avec succès`)

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: {
            sync_type,
            items_processed: itemsProcessed,
            items_succeeded: itemsSucceeded,
            items_failed: itemsFailed,
            duration_ms: duration
          },
          message: `Synchronisation ${sync_type} terminée avec succès`
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )

    } catch (error) {
      console.error(`❌ Erreur synchronisation ${sync_type}:`, error)
      
      // Mettre à jour le log de synchronisation avec l'erreur
      if (syncLog) {
        await supabase
          .from('dsers_sync_logs')
          .update({
            status: 'failed',
            items_processed: itemsProcessed,
            items_succeeded: itemsSucceeded,
            items_failed: itemsFailed,
            error_details: { message: error.message, stack: error.stack },
            completed_at: new Date().toISOString(),
            duration_ms: Date.now() - syncStartTime
          })
          .eq('id', syncLog.id)
      }

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Erreur synchronisation ${sync_type}: ${error.message}` 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

  } catch (error) {
    console.error('❌ Erreur générale synchronisation DSERS:', error)
    
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

// Fonction pour synchroniser les produits
async function syncProducts(supabase: any, integration: any, storeId: string, forceFullSync: boolean) {
  console.log('📦 Synchronisation des produits...')
  
  // Récupérer les produits DSERS du store
  const { data: products, error } = await supabase
    .from('dsers_products')
    .select('*')
    .eq('store_id', storeId)
    .eq('sync_status', 'pending')

  if (error) throw error

  for (const product of products || []) {
    try {
      // Appel API DSERS pour récupérer les données mises à jour
      const response = await fetch(`${DSERS_API_URL}/${DSERS_API_VERSION}/products/${product.dsers_product_id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${integration.api_key}`,
          'X-API-Secret': integration.api_secret
        }
      })

      if (!response.ok) {
        throw new Error(`Erreur API DSERS: ${response.status}`)
      }

      const dsersData = await response.json()

      // Mettre à jour les données du produit
      const updatedProductData = {
        ...product.product_data,
        price: dsersData.price || product.product_data.price,
        original_price: dsersData.original_price || product.product_data.original_price,
        stock_quantity: dsersData.stock_quantity || product.product_data.stock_quantity,
        ali_express_data: dsersData
      }

      // Mettre à jour le produit dans la base de données
      await supabase
        .from('dsers_products')
        .update({
          product_data: updatedProductData,
          sync_status: 'synced',
          last_full_sync: new Date().toISOString()
        })
        .eq('id', product.id)

      // Mettre à jour le produit dans Simpshopy si nécessaire
      if (product.simpshopy_product_id) {
        await supabase
          .from('products')
          .update({
            price: updatedProductData.price,
            original_price: updatedProductData.original_price,
            stock_quantity: updatedProductData.stock_quantity
          })
          .eq('id', product.simpshopy_product_id)
      }

      itemsSucceeded++
    } catch (error) {
      console.error(`❌ Erreur sync produit ${product.id}:`, error)
      itemsFailed++
      
      await supabase
        .from('dsers_products')
        .update({
          sync_status: 'failed',
          error_message: error.message
        })
        .eq('id', product.id)
    }
    
    itemsProcessed++
  }
}

// Fonction pour synchroniser les commandes
async function syncOrders(supabase: any, integration: any, storeId: string, forceFullSync: boolean) {
  console.log('📋 Synchronisation des commandes...')
  
  // Récupérer les nouvelles commandes depuis DSERS
  const response = await fetch(`${DSERS_API_URL}/${DSERS_API_VERSION}/orders`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${integration.api_key}`,
      'X-API-Secret': integration.api_secret
    }
  })

  if (!response.ok) {
    throw new Error(`Erreur API DSERS: ${response.status}`)
  }

  const dsersOrders = await response.json()

  for (const dsersOrder of dsersOrders.data || []) {
    try {
      // Vérifier si la commande existe déjà
      const { data: existingOrder } = await supabase
        .from('dsers_orders')
        .select('id')
        .eq('store_id', storeId)
        .eq('dsers_order_id', dsersOrder.id)
        .single()

      if (!existingOrder) {
        // Créer la nouvelle commande
        await supabase
          .from('dsers_orders')
          .insert({
            store_id: storeId,
            dsers_order_id: dsersOrder.id,
            order_data: dsersOrder,
            fulfillment_status: 'pending'
          })

        itemsSucceeded++
      }
    } catch (error) {
      console.error(`❌ Erreur sync commande ${dsersOrder.id}:`, error)
      itemsFailed++
    }
    
    itemsProcessed++
  }
}

// Fonction pour synchroniser les prix
async function syncPrices(supabase: any, integration: any, storeId: string, forceFullSync: boolean) {
  console.log('💰 Synchronisation des prix...')
  
  // Récupérer les produits avec sync de prix activé
  const { data: products, error } = await supabase
    .from('dsers_products')
    .select('*')
    .eq('store_id', storeId)
    .eq('price_sync', true)

  if (error) throw error

  for (const product of products || []) {
    try {
      // Appel API DSERS pour récupérer le prix mis à jour
      const response = await fetch(`${DSERS_API_URL}/${DSERS_API_VERSION}/products/${product.dsers_product_id}/price`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${integration.api_key}`,
          'X-API-Secret': integration.api_secret
        }
      })

      if (!response.ok) {
        throw new Error(`Erreur API DSERS: ${response.status}`)
      }

      const priceData = await response.json()

      // Calculer le nouveau prix avec le markup
      const markupPercentage = integration.settings.price_markup_percentage || 30
      const newPrice = priceData.price * (1 + markupPercentage / 100)

      // Mettre à jour le prix du produit
      await supabase
        .from('dsers_products')
        .update({
          'product_data->price': newPrice,
          last_price_sync: new Date().toISOString()
        })
        .eq('id', product.id)

      // Mettre à jour le prix dans Simpshopy si nécessaire
      if (product.simpshopy_product_id) {
        await supabase
          .from('products')
          .update({ price: newPrice })
          .eq('id', product.simpshopy_product_id)
      }

      itemsSucceeded++
    } catch (error) {
      console.error(`❌ Erreur sync prix produit ${product.id}:`, error)
      itemsFailed++
    }
    
    itemsProcessed++
  }
}

// Fonction pour synchroniser les stocks
async function syncStocks(supabase: any, integration: any, storeId: string, forceFullSync: boolean) {
  console.log('📦 Synchronisation des stocks...')
  
  // Récupérer les produits avec sync de stock activé
  const { data: products, error } = await supabase
    .from('dsers_products')
    .select('*')
    .eq('store_id', storeId)
    .eq('stock_sync', true)

  if (error) throw error

  for (const product of products || []) {
    try {
      // Appel API DSERS pour récupérer le stock mis à jour
      const response = await fetch(`${DSERS_API_URL}/${DSERS_API_VERSION}/products/${product.dsers_product_id}/stock`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${integration.api_key}`,
          'X-API-Secret': integration.api_secret
        }
      })

      if (!response.ok) {
        throw new Error(`Erreur API DSERS: ${response.status}`)
      }

      const stockData = await response.json()

      // Mettre à jour le stock du produit
      await supabase
        .from('dsers_products')
        .update({
          'product_data->stock_quantity': stockData.stock_quantity,
          last_stock_sync: new Date().toISOString()
        })
        .eq('id', product.id)

      // Mettre à jour le stock dans Simpshopy si nécessaire
      if (product.simpshopy_product_id) {
        await supabase
          .from('products')
          .update({ stock_quantity: stockData.stock_quantity })
          .eq('id', product.simpshopy_product_id)
      }

      itemsSucceeded++
    } catch (error) {
      console.error(`❌ Erreur sync stock produit ${product.id}:`, error)
      itemsFailed++
    }
    
    itemsProcessed++
  }
}
