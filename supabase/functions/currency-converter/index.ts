import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Clé API Fixer.io récupérée depuis les variables d'environnement
const FIXER_API_KEY = Deno.env.get('FIXER_API_KEY')
const FIXER_BASE_URL = 'http://data.fixer.io/api'

// Validation de la clé API
if (!FIXER_API_KEY) {
  throw new Error('FIXER_API_KEY manquante dans les variables d\'environnement')
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { action, fromCurrency, toCurrency, amount } = body

    console.log(`🔄 Action: ${action}, Conversion: ${amount} ${fromCurrency} → ${toCurrency}`)

    switch (action) {
      case 'convert':
        return await handleConvert(fromCurrency, toCurrency, amount)
      case 'getRate':
        return await handleGetRate(fromCurrency, toCurrency)
      case 'testConnection':
        return await handleTestConnection()
      default:
        throw new Error('Action non reconnue')
    }

  } catch (error) {
    console.error('❌ Erreur:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

async function handleConvert(fromCurrency: string, toCurrency: string, amount: number) {
  try {
    console.log(`🔄 Début de conversion: ${amount} ${fromCurrency} → ${toCurrency}`)

    // Si les devises sont identiques
    if (fromCurrency === toCurrency) {
      console.log('✅ Même devise, pas de conversion nécessaire')
      return new Response(
        JSON.stringify({
          success: true,
          result: {
            originalAmount: amount,
            originalCurrency: fromCurrency,
            convertedAmount: amount,
            targetCurrency: toCurrency,
            rate: 1,
            timestamp: new Date().toISOString()
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Utiliser EUR comme base et obtenir tous les taux en une seule requête
    const url = `${FIXER_BASE_URL}/latest?access_key=${FIXER_API_KEY}&base=EUR&symbols=${fromCurrency},${toCurrency}`
    console.log(`📡 Appel API Fixer.io: ${url}`)
    
    const response = await fetch(url)
    console.log(`📡 Réponse API: ${response.status}`)
    
    const data = await response.json()
    console.log(`📡 Données API:`, JSON.stringify(data, null, 2))

    if (!data.success) {
      throw new Error(`Erreur API Fixer: ${data.error?.info || 'Erreur inconnue'}`)
    }

    if (!data.rates) {
      throw new Error('Aucun taux de change disponible')
    }

    // Calculer le taux de conversion
    let rate: number;
    
    if (fromCurrency === 'EUR') {
      // Si la devise source est EUR, utiliser directement le taux
      if (!data.rates[toCurrency]) {
        throw new Error(`Taux de change non trouvé pour EUR vers ${toCurrency}`)
      }
      rate = data.rates[toCurrency]
    } else if (toCurrency === 'EUR') {
      // Si la devise cible est EUR, utiliser l'inverse du taux
      if (!data.rates[fromCurrency]) {
        throw new Error(`Taux de change non trouvé pour ${fromCurrency} vers EUR`)
      }
      rate = 1 / data.rates[fromCurrency]
    } else {
      // Pour les autres cas, calculer via EUR
      if (!data.rates[fromCurrency] || !data.rates[toCurrency]) {
        throw new Error(`Taux de change non trouvé pour ${fromCurrency} ou ${toCurrency}`)
      }
      // Taux = (1 / taux_from_eur) * taux_to_eur
      rate = (1 / data.rates[fromCurrency]) * data.rates[toCurrency]
    }

    const convertedAmount = amount * rate

    console.log(`✅ Conversion réussie: ${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency} (taux: ${rate})`)

    return new Response(
      JSON.stringify({
        success: true,
        result: {
          originalAmount: amount,
          originalCurrency: fromCurrency,
          convertedAmount: convertedAmount,
          targetCurrency: toCurrency,
          rate: rate,
          timestamp: new Date().toISOString()
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('❌ Erreur de conversion:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
}

async function handleGetRate(fromCurrency: string, toCurrency: string) {
  try {
    console.log(`📊 Récupération du taux: ${fromCurrency} → ${toCurrency}`)

    // Si les devises sont identiques
    if (fromCurrency === toCurrency) {
      return new Response(
        JSON.stringify({
          success: true,
          rate: 1
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Utiliser EUR comme base et obtenir tous les taux en une seule requête
    const url = `${FIXER_BASE_URL}/latest?access_key=${FIXER_API_KEY}&base=EUR&symbols=${fromCurrency},${toCurrency}`
    console.log(`📡 Appel API Fixer.io: ${url}`)
    
    const response = await fetch(url)
    const data = await response.json()

    if (!data.success) {
      throw new Error(`Erreur API Fixer: ${data.error?.info || 'Erreur inconnue'}`)
    }

    if (!data.rates) {
      throw new Error('Aucun taux de change disponible')
    }

    // Calculer le taux de conversion
    let rate: number;
    
    if (fromCurrency === 'EUR') {
      // Si la devise source est EUR, utiliser directement le taux
      if (!data.rates[toCurrency]) {
        throw new Error(`Taux de change non trouvé pour EUR vers ${toCurrency}`)
      }
      rate = data.rates[toCurrency]
    } else if (toCurrency === 'EUR') {
      // Si la devise cible est EUR, utiliser l'inverse du taux
      if (!data.rates[fromCurrency]) {
        throw new Error(`Taux de change non trouvé pour ${fromCurrency} vers EUR`)
      }
      rate = 1 / data.rates[fromCurrency]
    } else {
      // Pour les autres cas, calculer via EUR
      if (!data.rates[fromCurrency] || !data.rates[toCurrency]) {
        throw new Error(`Taux de change non trouvé pour ${fromCurrency} ou ${toCurrency}`)
      }
      // Taux = (1 / taux_from_eur) * taux_to_eur
      rate = (1 / data.rates[fromCurrency]) * data.rates[toCurrency]
    }

    console.log(`✅ Taux récupéré: ${rate}`)
    return new Response(
      JSON.stringify({
        success: true,
        rate: rate
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('❌ Erreur de récupération du taux:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
}

async function handleTestConnection() {
  try {
    console.log('🧪 Test de connexion à Fixer.io...')
    
    const url = `${FIXER_BASE_URL}/latest?access_key=${FIXER_API_KEY}&base=EUR&symbols=USD`
    
    console.log(`📡 Appel API Fixer.io: ${url}`)
    
    const response = await fetch(url)
    const data = await response.json()

    console.log(`📡 Réponse test:`, JSON.stringify(data, null, 2))

    if (data.success && data.rates && data.rates.USD) {
      console.log('✅ Test de connexion réussi')
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Connexion à Fixer.io réussie',
          testRate: data.rates.USD
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } else {
      throw new Error(`Erreur de connexion: ${data.error?.info || 'Erreur inconnue'}`)
    }

  } catch (error) {
    console.error('❌ Erreur de test de connexion:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
}
