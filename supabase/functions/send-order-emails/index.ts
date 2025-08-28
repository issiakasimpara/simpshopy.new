import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OrderData {
  id: string
  store_id: string
  customer_email: string
  customer_name: string
  total_amount: number
  status: string
  created_at: string
  shipping_address: any
  payment_method: string
  items: any[]
}

interface StoreData {
  id: string
  name: string
  logo_url: string
  primary_color: string
  contact_email: string
  domain: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderId } = await req.json()
    
    if (!orderId) {
      throw new Error('Order ID is required')
    }

    // Initialiser Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Récupérer les données de la commande
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            name,
            price,
            images
          )
        )
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !orderData) {
      throw new Error(`Order not found: ${orderError?.message}`)
    }

    // Récupérer les données de la boutique
    const { data: storeData, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .eq('id', orderData.store_id)
      .single()

    if (storeError || !storeData) {
      throw new Error(`Store not found: ${storeError?.message}`)
    }

    // Récupérer l'email de l'admin de la boutique
    const { data: adminData, error: adminError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', storeData.merchant_id)
      .single()

    if (adminError || !adminData) {
      throw new Error(`Admin not found: ${adminError?.message}`)
    }

    // 1. Synchroniser le client vers Mailchimp
    try {
      console.log('🔄 Synchronisation client vers Mailchimp...')
      
      const customerData = {
        email: orderData.customer_email,
        first_name: orderData.customer_name?.split(' ')[0] || '',
        last_name: orderData.customer_name?.split(' ').slice(1).join(' ') || '',
        phone: orderData.shipping_address?.phone || '',
        store_name: storeData.name || 'Simpshopy Store'
      }

      const mailchimpResponse = await fetch(`${supabaseUrl}/functions/v1/mailchimp-sync-customers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: storeData.merchant_id,
          storeId: storeData.id,
          customerData
        })
      })

      if (mailchimpResponse.ok) {
        const mailchimpResult = await mailchimpResponse.json()
        console.log('✅ Client synchronisé vers Mailchimp:', mailchimpResult)
      } else {
        console.log('ℹ️ Synchronisation Mailchimp ignorée (pas d\'intégration active)')
      }
    } catch (mailchimpError) {
      console.error('❌ Erreur synchronisation Mailchimp:', mailchimpError)
      // Ne pas faire échouer l'envoi d'emails si la synchronisation échoue
    }

    // 2. Envoyer les emails
    const results = await Promise.allSettled([
      sendAdminEmail(orderData, storeData, adminData.email),
      sendCustomerEmail(orderData, storeData)
    ])

    // 3. Envoyer notification push
    await sendPushNotification(orderData, storeData)



    return new Response(
      JSON.stringify({
        success: true,
        message: 'Emails sent successfully',
        results: results.map((result, index) => ({
          type: index === 0 ? 'admin' : 'customer',
          status: result.status,
          value: result.status === 'fulfilled' ? result.value : result.reason
        }))
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error sending order emails:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

async function sendAdminEmail(orderData: OrderData, storeData: StoreData, adminEmail: string) {
  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY not configured')
  }

  const adminTemplate = generateAdminEmailTemplate(orderData, storeData)
  
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Simpshopy <noreply@simpshopy.com>',
      to: adminEmail,
      subject: `🎉 Nouvelle commande #${orderData.id.slice(-6)} - ${storeData.name}`,
      html: adminTemplate,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to send admin email: ${error}`)
  }

  return await response.json()
}

async function sendCustomerEmail(orderData: OrderData, storeData: StoreData) {
  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY not configured')
  }

  const customerTemplate = generateCustomerEmailTemplate(orderData, storeData)
  
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `${storeData.name} <noreply@simpshopy.com>`,
      to: orderData.customer_email,
      subject: `✅ Confirmation de commande #${orderData.id.slice(-6)} - ${storeData.name}`,
      html: customerTemplate,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to send customer email: ${error}`)
  }

  return await response.json()
}

async function sendPushNotification(orderData: OrderData, storeData: StoreData) {
  // TODO: Implémenter les notifications push
  // Pour l'instant, on log juste
  console.log(`🔔 Push notification sent for order ${orderData.id} in store ${storeData.name}`)
}

// 📱 Envoyer les notifications WhatsApp pour une commande


function generateAdminEmailTemplate(orderData: OrderData, storeData: StoreData): string {
  const orderNumber = orderData.id.slice(-6)
  const formattedDate = new Date(orderData.created_at).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  
  const totalAmount = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(orderData.total_amount)

  const itemsList = orderData.order_items?.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <div style="display: flex; align-items: center; gap: 12px;">
          ${item.products?.images?.[0] ? 
            `<img src="${item.products.images[0]}" alt="${item.products.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">` : 
            '<div style="width: 50px; height: 50px; background: #f5f5f5; border-radius: 8px; display: flex; align-items: center; justify-content: center;">📦</div>'
          }
          <div>
            <div style="font-weight: 600; color: #333;">${item.products?.name || 'Produit'}</div>
            <div style="color: #666; font-size: 14px;">Quantité: ${item.quantity}</div>
          </div>
        </div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">
        ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(item.price)}
      </td>
    </tr>
  `).join('') || ''

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nouvelle commande</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: ${storeData.primary_color || '#6366f1'}; padding: 30px; text-align: center; }
        .logo { max-width: 120px; height: auto; }
        .content { padding: 40px 30px; }
        .order-number { background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
        .order-number h2 { margin: 0; color: #0c4a6e; font-size: 24px; }
        .customer-info { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .total { background: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
        .total h3 { margin: 0; color: #166534; font-size: 20px; }
        .button { display: inline-block; background: ${storeData.primary_color || '#6366f1'}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          ${storeData.logo_url ? 
            `<img src="${storeData.logo_url}" alt="${storeData.name}" class="logo">` :
            `<h1 style="color: white; margin: 0; font-size: 28px;">${storeData.name}</h1>`
          }
        </div>
        
        <div class="content">
          <h1 style="color: #1f2937; margin-bottom: 30px;">🎉 Nouvelle commande reçue !</h1>
          
          <div class="order-number">
            <h2>Commande #${orderNumber}</h2>
            <p style="margin: 10px 0 0 0; color: #6b7280;">${formattedDate}</p>
          </div>
          
          <div class="customer-info">
            <h3 style="margin-top: 0; color: #374151;">👤 Informations client</h3>
            <p><strong>Nom :</strong> ${orderData.customer_name}</p>
            <p><strong>Email :</strong> ${orderData.customer_email}</p>
            ${orderData.shipping_address ? `
              <p><strong>Adresse :</strong> ${orderData.shipping_address.address || 'Non spécifiée'}</p>
            ` : ''}
            <p><strong>Méthode de paiement :</strong> ${orderData.payment_method || 'Non spécifiée'}</p>
          </div>
          
          <h3 style="color: #374151;">🛒 Produits commandés</h3>
          <table class="items-table">
            <thead>
              <tr style="background: #f8fafc;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Produit</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Prix</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>
          
          <div class="total">
            <h3>💰 Montant total : ${totalAmount}</h3>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${storeData.domain || '#'}" class="button">Voir la commande</a>
          </div>
        </div>
        
        <div class="footer">
          <p>Cet email a été envoyé automatiquement par Simpshopy</p>
          <p>${storeData.name} - ${storeData.contact_email || 'contact@simpshopy.com'}</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateCustomerEmailTemplate(orderData: OrderData, storeData: StoreData): string {
  const orderNumber = orderData.id.slice(-6)
  const formattedDate = new Date(orderData.created_at).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  
  const totalAmount = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(orderData.total_amount)

  const itemsList = orderData.order_items?.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <div style="display: flex; align-items: center; gap: 12px;">
          ${item.products?.images?.[0] ? 
            `<img src="${item.products.images[0]}" alt="${item.products.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">` : 
            '<div style="width: 50px; height: 50px; background: #f5f5f5; border-radius: 8px; display: flex; align-items: center; justify-content: center;">📦</div>'
          }
          <div>
            <div style="font-weight: 600; color: #333;">${item.products?.name || 'Produit'}</div>
            <div style="color: #666; font-size: 14px;">Quantité: ${item.quantity}</div>
          </div>
        </div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">
        ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(item.price)}
      </td>
    </tr>
  `).join('') || ''

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation de commande</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: ${storeData.primary_color || '#6366f1'}; padding: 30px; text-align: center; }
        .logo { max-width: 120px; height: auto; }
        .content { padding: 40px 30px; }
        .order-number { background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
        .order-number h2 { margin: 0; color: #0c4a6e; font-size: 24px; }
        .status { background: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
        .status h3 { margin: 0; color: #166534; font-size: 18px; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .total { background: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
        .total h3 { margin: 0; color: #166534; font-size: 20px; }
        .button { display: inline-block; background: ${storeData.primary_color || '#6366f1'}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
        .info-box { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          ${storeData.logo_url ? 
            `<img src="${storeData.logo_url}" alt="${storeData.name}" class="logo">` :
            `<h1 style="color: white; margin: 0; font-size: 28px;">${storeData.name}</h1>`
          }
        </div>
        
        <div class="content">
          <h1 style="color: #1f2937; margin-bottom: 30px;">✅ Confirmation de votre commande</h1>
          
          <div class="status">
            <h3>🎉 Commande confirmée !</h3>
            <p style="margin: 10px 0 0 0; color: #166534;">Votre commande a été reçue et est en cours de traitement</p>
          </div>
          
          <div class="order-number">
            <h2>Commande #${orderNumber}</h2>
            <p style="margin: 10px 0 0 0; color: #6b7280;">${formattedDate}</p>
          </div>
          
          <h3 style="color: #374151;">🛒 Résumé de votre commande</h3>
          <table class="items-table">
            <thead>
              <tr style="background: #f8fafc;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Produit</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Prix</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>
          
          <div class="total">
            <h3>💰 Montant total : ${totalAmount}</h3>
          </div>
          
          <div class="info-box">
            <h4 style="margin-top: 0; color: #92400e;">📦 Informations de livraison</h4>
            <p style="margin: 5px 0; color: #92400e;"><strong>Statut :</strong> En préparation</p>
            <p style="margin: 5px 0; color: #92400e;"><strong>Délai estimé :</strong> 3-5 jours ouvrables</p>
            <p style="margin: 5px 0; color: #92400e;"><strong>Méthode de paiement :</strong> ${orderData.payment_method || 'Non spécifiée'}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${storeData.domain || '#'}" class="button">Voir ma commande</a>
          </div>
          
          <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #374151;">💡 Besoin d'aide ?</h4>
            <p style="margin: 5px 0; color: #6b7280;">Si vous avez des questions concernant votre commande, n'hésitez pas à nous contacter :</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Email :</strong> ${storeData.contact_email || 'contact@simpshopy.com'}</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Numéro de commande :</strong> #${orderNumber}</p>
          </div>
        </div>
        
        <div class="footer">
          <p>Merci de votre confiance !</p>
          <p>${storeData.name} - ${storeData.contact_email || 'contact@simpshopy.com'}</p>
          <p>Cet email a été envoyé automatiquement par Simpshopy</p>
        </div>
      </div>
    </body>
    </html>
  `
}
