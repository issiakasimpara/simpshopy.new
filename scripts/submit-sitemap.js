#!/usr/bin/env node

/**
 * Script pour soumettre automatiquement le sitemap aux moteurs de recherche
 * Usage: node scripts/submit-sitemap.js
 */

const https = require('https');
const http = require('http');

let SITEMAP_URL = 'https://simpshopy.com/sitemap.xml';

// Configuration des moteurs de recherche
const searchEngines = [
  {
    name: 'Google',
    url: `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
    method: 'GET'
  },
  {
    name: 'Bing',
    url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
    method: 'GET'
  },
  {
    name: 'Yandex',
    url: `https://blogs.yandex.com/pings/?status=success&url=${encodeURIComponent(SITEMAP_URL)}`,
    method: 'GET'
  }
];

// Fonction pour faire une requête HTTP
function makeRequest(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.request(url, { method }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

// Fonction principale
async function submitSitemap() {
  console.log('🚀 Début de la soumission du sitemap...\n');
  
  for (const engine of searchEngines) {
    try {
      console.log(`📡 Soumission à ${engine.name}...`);
      
      const response = await makeRequest(engine.url, engine.method);
      
      if (response.status === 200) {
        console.log(`✅ ${engine.name} : Sitemap soumis avec succès`);
      } else {
        console.log(`⚠️  ${engine.name} : Statut ${response.status}`);
      }
      
    } catch (error) {
      console.log(`❌ ${engine.name} : Erreur - ${error.message}`);
    }
    
    // Pause entre les requêtes
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🎉 Soumission terminée !');
  console.log('\n📋 Prochaines étapes :');
  console.log('1. Vérifier Google Search Console');
  console.log('2. Vérifier Bing Webmaster Tools');
  console.log('3. Surveiller l\'indexation dans les jours à venir');
}

// Vérification des arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node scripts/submit-sitemap.js [options]

Options:
  --help, -h     Afficher cette aide
  --url <url>    URL personnalisée du sitemap (défaut: ${SITEMAP_URL})

Exemples:
  node scripts/submit-sitemap.js
  node scripts/submit-sitemap.js --url https://mon-site.com/sitemap.xml
  `);
  process.exit(0);
}

// URL personnalisée si fournie
const customUrl = process.argv.indexOf('--url');
if (customUrl !== -1 && process.argv[customUrl + 1]) {
  SITEMAP_URL = process.argv[customUrl + 1];
  console.log(`🔧 Utilisation de l'URL personnalisée : ${SITEMAP_URL}\n`);
}

// Exécution
submitSitemap().catch(console.error);
