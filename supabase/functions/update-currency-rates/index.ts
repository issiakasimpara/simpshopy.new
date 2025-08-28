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
    // Créer le client Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('🔄 Début de la mise à jour des taux de change...')

    // Liste de toutes les devises du monde supportées par fixer.io
    const currencies = [
      'XOF', 'XAF', 'XCD', 'XDR', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMW', 'ZWL',
      'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN',
      'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL',
      'BSD', 'BTC', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF', 'CHF', 'CLF',
      'CLP', 'CNH', 'CNY', 'COP', 'CRC', 'CUC', 'CUP', 'CVE', 'CZK', 'DJF',
      'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP',
      'GEL', 'GGP', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL',
      'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'IMP', 'INR', 'IQD', 'IRR', 'ISK',
      'JEP', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW',
      'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD',
      'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 'MVR', 'MWK',
      'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR',
      'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD',
      'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLL',
      'SOS', 'SRD', 'SSP', 'STD', 'STN', 'SVC', 'SYP', 'SZL', 'THB', 'TJS',
      'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD',
      'UYU', 'UZS', 'VEF', 'VES', 'VND', 'VUV', 'WST', 'XAG', 'XAU', 'XBA',
      'XBB', 'XBC', 'XBD', 'XBT', 'XTS', 'XXX', 'YER', 'ZAR', 'ZMW', 'ZWL'
    ]

    // API fixer.io avec votre clé API
    const apiKey = 'aeea9d39ca828842e353d966234c7b7'
    const apiUrl = `http://data.fixer.io/api/latest?access_key=${apiKey}&base=EUR&symbols=${currencies.join(',')}`
    
    console.log('📡 Récupération des taux depuis l\'API...')
    
    const response = await fetch(apiUrl)
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    // Vérifier si l'API a retourné une erreur
    if (!data.success) {
      throw new Error(`Erreur API fixer.io: ${data.error?.info || 'Erreur inconnue'}`)
    }
    
    const rates = data.rates
    const baseCurrency = data.base // EUR

    console.log(`✅ Taux récupérés pour ${Object.keys(rates).length} devises`)

    // Préparer les données pour l'insertion
    const currencyRates = []
    
    // Ajouter les taux EUR vers autres devises
    for (const [targetCurrency, rate] of Object.entries(rates)) {
      if (currencies.includes(targetCurrency)) {
        currencyRates.push({
          base_currency: baseCurrency,
          target_currency: targetCurrency,
          rate: parseFloat(rate as string)
        })
      }
    }

    // Ajouter les taux inverses (autres devises vers EUR)
    for (const [targetCurrency, rate] of Object.entries(rates)) {
      if (currencies.includes(targetCurrency)) {
        currencyRates.push({
          base_currency: targetCurrency,
          target_currency: baseCurrency,
          rate: 1 / parseFloat(rate as string)
        })
      }
    }

    // Ajouter les taux croisés (entre devises non-EUR)
    for (const currency1 of currencies) {
      if (currency1 === baseCurrency) continue
      
      for (const currency2 of currencies) {
        if (currency2 === baseCurrency || currency1 === currency2) continue
        
        const rate1 = rates[currency1] // EUR vers currency1
        const rate2 = rates[currency2] // EUR vers currency2
        
        if (rate1 && rate2) {
          currencyRates.push({
            base_currency: currency1,
            target_currency: currency2,
            rate: parseFloat(rate2 as string) / parseFloat(rate1 as string)
          })
        }
      }
    }

    console.log(`📊 ${currencyRates.length} taux de change à insérer/mettre à jour`)

    // Insérer/mettre à jour les taux dans la base de données
    const { data: insertData, error: insertError } = await supabaseClient
      .from('currency_rates')
      .upsert(currencyRates, {
        onConflict: 'base_currency,target_currency',
        ignoreDuplicates: false
      })

    if (insertError) {
      console.error('❌ Erreur lors de l\'insertion des taux:', insertError)
      throw insertError
    }

    console.log('✅ Taux de change mis à jour avec succès')

    // Récupérer le nombre de taux mis à jour
    const { count, error: countError } = await supabaseClient
      .from('currency_rates')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('❌ Erreur lors du comptage:', countError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Taux de change mis à jour avec succès',
        updated_rates: currencyRates.length,
        total_rates: count,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour des taux:', error)
    
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
