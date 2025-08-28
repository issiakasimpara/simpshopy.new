// Script pour configurer les tables Markets & Shipping
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupMarketsShipping() {
  try {
    console.log('🚀 Configuration des tables Markets & Shipping...')
    
    // Lire le fichier de migration
    const migrationPath = path.join(process.cwd(), 'supabase/migrations/20240716000001_create_markets_shipping_tables.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    // Exécuter la migration
    const { error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    })
    
    if (error) {
      console.error('❌ Erreur lors de l\'exécution de la migration:', error)
      return false
    }
    
    console.log('✅ Tables créées avec succès')
    
    // Vérifier que les tables existent
    const { data: marketSettings, error: marketError } = await supabase
      .from('market_settings')
      .select('count')
      .limit(1)
    
    const { data: shippingMethods, error: shippingError } = await supabase
      .from('shipping_methods')
      .select('count')
      .limit(1)
    
    if (!marketError && !shippingError) {
      console.log('✅ Vérification réussie - Tables accessibles')
      return true
    } else {
      console.error('❌ Erreur de vérification:', { marketError, shippingError })
      return false
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error)
    return false
  }
}

// Exécuter le script
setupMarketsShipping()
  .then(success => {
    if (success) {
      console.log('🎉 Configuration terminée avec succès!')
      process.exit(0)
    } else {
      console.log('💥 Échec de la configuration')
      process.exit(1)
    }
  })
  .catch(error => {
    console.error('💥 Erreur fatale:', error)
    process.exit(1)
  })
