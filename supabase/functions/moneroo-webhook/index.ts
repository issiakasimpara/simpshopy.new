import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Gérer les requêtes CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Récupérer le corps de la requête
    const payload = await req.text()
    const signature = req.headers.get('x-moneroo-signature')
    
    console.log('🔔 Webhook Moneroo reçu:', {
      event: JSON.parse(payload).event,
      signature: signature ? 'Présent' : 'Absent',
      payloadLength: payload.length
    })

    // Vérifier la signature du webhook (à configurer dans Moneroo)
    const webhookSecret = Deno.env.get('MONEROO_WEBHOOK_SECRET')
    if (webhookSecret && signature) {
      const crypto = await import('crypto')
      const computedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex')

      if (computedSignature !== signature) {
        console.error('❌ Signature webhook invalide')
        return new Response('Forbidden', { 
          status: 403,
          headers: corsHeaders 
        })
      }
    }

    // Parser le payload
    const webhookData = JSON.parse(payload)
    const { event, data } = webhookData

    console.log('📊 Données webhook:', {
      event,
      paymentId: data?.id,
      status: data?.status,
      amount: data?.amount,
      currency: data?.currency
    })

    // Initialiser le client Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Traiter les différents types d'événements
    switch (event) {
      case 'payment.success':
        await handlePaymentSuccess(supabase, data)
        break
      
      case 'payment.failed':
        await handlePaymentFailed(supabase, data)
        break
      
      case 'payment.cancelled':
        await handlePaymentCancelled(supabase, data)
        break
      
      case 'payment.initiated':
        await handlePaymentInitiated(supabase, data)
        break
      
      default:
        console.log('⚠️ Événement non géré:', event)
    }

    // Répondre avec succès
    return new Response('OK', { 
      status: 200,
      headers: corsHeaders 
    })

  } catch (error) {
    console.error('❌ Erreur webhook:', error)
    return new Response('Internal Server Error', { 
      status: 500,
      headers: corsHeaders 
    })
  }
})

// Gérer un paiement réussi
async function handlePaymentSuccess(supabase: any, data: any) {
  try {
    console.log('✅ Paiement réussi:', data.id)

    // Mettre à jour le statut du paiement
    const { error: updateError } = await supabase
      .from('payments')
      .update({ 
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('moneroo_payment_id', data.id)

    if (updateError) {
      console.error('❌ Erreur mise à jour paiement:', updateError)
    }

    // Créer la commande si elle n'existe pas
    await createOrderFromPayment(supabase, data)

  } catch (error) {
    console.error('❌ Erreur traitement paiement réussi:', error)
  }
}

// Gérer un paiement échoué
async function handlePaymentFailed(supabase: any, data: any) {
  try {
    console.log('❌ Paiement échoué:', data.id)

    const { error: updateError } = await supabase
      .from('payments')
      .update({ 
        status: 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('moneroo_payment_id', data.id)

    if (updateError) {
      console.error('❌ Erreur mise à jour paiement échoué:', updateError)
    }

  } catch (error) {
    console.error('❌ Erreur traitement paiement échoué:', error)
  }
}

// Gérer un paiement annulé
async function handlePaymentCancelled(supabase: any, data: any) {
  try {
    console.log('🚫 Paiement annulé:', data.id)

    const { error: updateError } = await supabase
      .from('payments')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('moneroo_payment_id', data.id)

    if (updateError) {
      console.error('❌ Erreur mise à jour paiement annulé:', updateError)
    }

  } catch (error) {
    console.error('❌ Erreur traitement paiement annulé:', error)
  }
}

// Gérer un paiement initié
async function handlePaymentInitiated(supabase: any, data: any) {
  try {
    console.log('🚀 Paiement initié:', data.id)

    const { error: updateError } = await supabase
      .from('payments')
      .update({ 
        status: 'pending',
        updated_at: new Date().toISOString()
      })
      .eq('moneroo_payment_id', data.id)

    if (updateError) {
      console.error('❌ Erreur mise à jour paiement initié:', updateError)
    }

  } catch (error) {
    console.error('❌ Erreur traitement paiement initié:', error)
  }
}

// Créer une commande à partir d'un paiement réussi
async function createOrderFromPayment(supabase: any, data: any) {
  try {
    // Récupérer les données du paiement
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('moneroo_payment_id', data.id)
      .single()

    if (paymentError || !payment) {
      console.error('❌ Paiement non trouvé:', data.id)
      return
    }

    // Vérifier si la commande existe déjà
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('moneroo_payment_id', data.id)
      .single()

    if (existingOrder) {
      console.log('✅ Commande déjà créée pour ce paiement')
      return
    }

    // Récupérer les données de commande depuis sessionStorage (via metadata)
    const metadata = payment.metadata
    if (!metadata) {
      console.error('❌ Pas de metadata pour créer la commande')
      return
    }

    // Créer la commande
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        store_id: metadata.store_id,
        customer_email: payment.customer_email,
        customer_name: payment.customer_name,
        total_amount: payment.amount,
        currency: payment.currency,
        status: 'paid',
        payment_method: 'moneroo',
        moneroo_payment_id: data.id,
        shipping_address: metadata.customer_info ? JSON.parse(metadata.customer_info).address : null,
        shipping_city: metadata.customer_info ? JSON.parse(metadata.customer_info).city : null,
        shipping_country: metadata.customer_info ? JSON.parse(metadata.customer_info).country : null,
        shipping_postal_code: metadata.customer_info ? JSON.parse(metadata.customer_info).postalCode : null,
        items: metadata.items ? JSON.parse(metadata.items) : [],
        shipping_method: metadata.shipping_method ? JSON.parse(metadata.shipping_method) : null,
        shipping_cost: metadata.shipping_cost || 0,
        temp_order_number: metadata.temp_order_number
      })
      .select()
      .single()

    if (orderError) {
      console.error('❌ Erreur création commande:', orderError)
    } else {
      console.log('✅ Commande créée:', order.id)
    }

  } catch (error) {
    console.error('❌ Erreur création commande:', error)
  }
} 