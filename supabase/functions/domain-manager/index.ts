import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// API Tokens
const VERCEL_API_TOKEN = Deno.env.get('VERCEL_API_TOKEN')
const VERCEL_PROJECT_ID = Deno.env.get('VERCEL_PROJECT_ID')
const CLOUDFLARE_API_TOKEN = Deno.env.get('CLOUDFLARE_API_TOKEN')
const CLOUDFLARE_ZONE_ID = Deno.env.get('CLOUDFLARE_ZONE_ID')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    console.log('🔍 Edge Function - Received request:', body)

    const { action, customDomain, storeId, domainId } = body

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    switch (action) {
      case 'add_domain':
        return await handleAddDomain(supabaseClient, customDomain, storeId)
      
      case 'verify_domain':
        return await handleVerifyDomain(supabaseClient, domainId)
      
      case 'delete_domain':
        return await handleDeleteDomain(supabaseClient, domainId)
      
      default:
        return new Response(
          JSON.stringify({ error: 'Action non reconnue: ' + action }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    console.error('❌ Edge Function - Error:', error)
    return new Response(
      JSON.stringify({ error: 'Erreur interne: ' + error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handleAddDomain(supabase: any, customDomain: string, storeId: string) {
  try {
    console.log('🚀 Adding domain:', customDomain, 'for store:', storeId)

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Utilisateur non authentifié' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get store info for multi-tenancy
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('name, slug')
      .eq('id', storeId)
      .single()

    if (storeError || !store) {
      return new Response(
        JSON.stringify({ error: 'Boutique non trouvée' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('🏪 Store found:', store)

    // Check if domain already exists
    const { data: existingDomain } = await supabase
      .from('custom_domains')
      .select('id')
      .eq('custom_domain', customDomain.toLowerCase().trim())
      .single()

    if (existingDomain) {
      return new Response(
        JSON.stringify({ error: `Le domaine ${customDomain} est déjà utilisé` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Add domain to Vercel automatically
    let vercelResult = null
    if (VERCEL_API_TOKEN && VERCEL_PROJECT_ID) {
      try {
        vercelResult = await addDomainToVercel(customDomain)
        console.log('✅ Vercel domain added:', vercelResult)
      } catch (vercelError) {
        console.error('❌ Vercel error:', vercelError)
      }
    }

    // Add CNAME to Cloudflare automatically
    let cloudflareResult = null
    if (CLOUDFLARE_API_TOKEN && CLOUDFLARE_ZONE_ID) {
      try {
        cloudflareResult = await addCnameToCloudflare(customDomain)
        console.log('✅ Cloudflare CNAME added:', cloudflareResult)
      } catch (cfError) {
        console.error('❌ Cloudflare error:', cfError)
      }
    }

    // Add to database with store info (without store_slug for now)
    const { data, error } = await supabase
      .from('custom_domains')
      .insert({
        custom_domain: customDomain.toLowerCase().trim(),
        store_id: storeId,
        user_id: user.id,
        verification_token: `simpshopy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        verified: false,
        ssl_enabled: false,
        vercel_domain_id: vercelResult?.id,
        cloudflare_record_id: cloudflareResult?.result?.id
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Erreur lors de l\'ajout du domaine: ' + error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Domain added successfully:', data)

    return new Response(
      JSON.stringify({ 
        success: true, 
        domain: data,
        vercel: vercelResult,
        cloudflare: cloudflareResult,
        message: 'Domaine ajouté avec succès. Configuration automatique en cours...'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Add domain error:', error)
    return new Response(
      JSON.stringify({ error: 'Erreur lors de l\'ajout du domaine: ' + error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function addDomainToVercel(domain: string) {
  if (!VERCEL_API_TOKEN || !VERCEL_PROJECT_ID) {
    throw new Error('Vercel configuration manquante')
  }

  const response = await fetch(`https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${VERCEL_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: domain
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Vercel API error: ${error}`)
  }

  return await response.json()
}

async function addCnameToCloudflare(domain: string) {
  if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ZONE_ID) {
    throw new Error('Cloudflare configuration manquante')
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'CNAME',
        name: domain,
        content: 'simpshopy.com',
        ttl: 1,
        proxied: true
      })
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Cloudflare API error: ${error}`)
  }

  return await response.json()
}

async function verifyDomainInVercel(domain: string) {
  if (!VERCEL_API_TOKEN || !VERCEL_PROJECT_ID) {
    throw new Error('Vercel configuration manquante')
  }

  try {
    // 1. Check if domain exists in Vercel
    const vercelResponse = await fetch(`https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains/${domain}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${VERCEL_API_TOKEN}`,
      }
    })

    if (!vercelResponse.ok) {
      console.log(`❌ Domain ${domain} not found in Vercel`)
      return false
    }

    const domainInfo = await vercelResponse.json()
    
    // 2. Check if domain points to our server
    const healthCheckResponse = await fetch(`https://${domain}/api/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(10000)
    })

    if (healthCheckResponse.ok) {
      console.log(`✅ Domain ${domain} is accessible and points to our server`)
      return true
    }

    // 3. Check DNS resolution
    try {
      const dnsResponse = await fetch(`https://dns.google/resolve?name=${domain}`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      })
      
      if (dnsResponse.ok) {
        const dnsData = await dnsResponse.json()
        if (dnsData.Answer && dnsData.Answer.length > 0) {
          console.log(`✅ DNS resolved for ${domain}`)
          // Check if it points to simpshopy.com
          const answers = dnsData.Answer
          for (const answer of answers) {
            if (answer.data && answer.data.includes('simpshopy.com')) {
              console.log(`✅ Domain ${domain} points to correct server`)
              return true
            }
          }
        }
      }
    } catch (dnsError) {
      console.log(`❌ DNS check failed for ${domain}:`, dnsError)
    }

    console.log(`❌ Domain ${domain} is not properly configured`)
    return false
  } catch (error) {
    console.error(`❌ Error verifying domain ${domain}:`, error)
    return false
  }
}

async function handleVerifyDomain(supabase: any, domainId: string) {
  try {
    console.log('🔍 Verifying domain:', domainId)

    // Get domain info
    const { data: domain, error: fetchError } = await supabase
      .from('custom_domains')
      .select('*')
      .eq('id', domainId)
      .single()

    if (fetchError || !domain) {
      return new Response(
        JSON.stringify({ error: 'Domaine non trouvé' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('🔍 Domain data:', domain)

    // Real verification
    let isVerified = false
    if (VERCEL_API_TOKEN && VERCEL_PROJECT_ID) {
      try {
        isVerified = await verifyDomainInVercel(domain.custom_domain)
        console.log('✅ Vercel verification result:', isVerified)
      } catch (vercelError) {
        console.error('❌ Vercel verification error:', vercelError)
        isVerified = false
      }
    } else {
      // Fallback DNS check
      try {
        const dnsResponse = await fetch(`https://dns.google/resolve?name=${domain.custom_domain}`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        })
        
        if (dnsResponse.ok) {
          const dnsData = await dnsResponse.json()
          if (dnsData.Answer && dnsData.Answer.length > 0) {
            const answers = dnsData.Answer
            for (const answer of answers) {
              if (answer.data && answer.data.includes('simpshopy.com')) {
                isVerified = true
                break
              }
            }
          }
        }
      } catch (dnsError) {
        console.error('❌ DNS verification error:', dnsError)
        isVerified = false
      }
    }

    // Update domain status
    const { error: updateError } = await supabase
      .from('custom_domains')
      .update({
        verified: isVerified,
        ssl_enabled: isVerified,
        updated_at: new Date().toISOString()
      })
      .eq('id', domainId)

    if (updateError) {
      console.error('❌ Update error:', updateError)
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la vérification: ' + updateError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Domain verification completed')

    return new Response(
      JSON.stringify({ 
        success: true,
        verified: isVerified,
        message: isVerified ? 'Domaine vérifié avec succès ! SSL activé automatiquement.' : 'Vérification échouée - Configurez vos DNS'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Verify domain error:', error)
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la vérification: ' + error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleDeleteDomain(supabase: any, domainId: string) {
  try {
    console.log('🗑️ Deleting domain:', domainId)

    // Get domain info
    const { data: domain, error: fetchError } = await supabase
      .from('custom_domains')
      .select('custom_domain, vercel_domain_id, cloudflare_record_id')
      .eq('id', domainId)
      .single()

    if (fetchError || !domain) {
      return new Response(
        JSON.stringify({ error: 'Domaine non trouvé' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Delete from Vercel
    if (VERCEL_API_TOKEN && VERCEL_PROJECT_ID && domain.vercel_domain_id) {
      try {
        const vercelDeleteResponse = await fetch(`https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain.custom_domain}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${VERCEL_API_TOKEN}`,
          },
        })
        
        if (vercelDeleteResponse.ok) {
          console.log('✅ Domain deleted from Vercel')
        } else {
          console.error('❌ Vercel delete error:', vercelDeleteResponse.statusText)
        }
      } catch (vercelError) {
        console.error('❌ Vercel API error:', vercelError)
      }
    }

    // Delete from Cloudflare
    if (CLOUDFLARE_API_TOKEN && CLOUDFLARE_ZONE_ID && domain.cloudflare_record_id) {
      try {
        const cfDeleteResponse = await fetch(
          `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records/${domain.cloudflare_record_id}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            },
          }
        )
        
        if (cfDeleteResponse.ok) {
          console.log('✅ Domain deleted from Cloudflare')
        } else {
          console.error('❌ Cloudflare delete error:', cfDeleteResponse.statusText)
        }
      } catch (cfError) {
        console.error('❌ Cloudflare API error:', cfError)
      }
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('custom_domains')
      .delete()
      .eq('id', domainId)

    if (deleteError) {
      console.error('❌ Database delete error:', deleteError)
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la suppression: ' + deleteError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Domain deleted successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Domaine supprimé avec succès'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Delete domain error:', error)
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la suppression: ' + error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
} 