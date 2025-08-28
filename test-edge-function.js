// Script de test pour l'Edge Function domain-router
// Remplacez YOUR_API_KEY par votre clé API Supabase

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydXRsZGFjdW93cGxvc2FydWNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwOTAxNjEsImV4cCI6MjA2NDY2NjE2MX0.cqKxbFdqF589dQBSH3IKNL6kXdRNtS9dpkrYNOHk0Ac';
const PROJECT_REF = 'grutldacuowplosarucp';

async function testEdgeFunction() {
  const url = `https://${PROJECT_REF}.supabase.co/functions/v1/domain-router`;
  
  const testCases = [
    'bestboutique.simpshopy.com',
    'test-boutique.simpshopy.com',
    'maboutique.simpshopy.com',
    'simpshopy.com'
  ];

  for (const hostname of testCases) {
    console.log(`\n🧪 Test avec hostname: ${hostname}`);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'apikey': API_KEY
        },
        body: JSON.stringify({ hostname })
      });

      const data = await response.text();
      console.log(`Status: ${response.status}`);
      console.log(`Response: ${data}`);
      
    } catch (error) {
      console.error(`❌ Erreur: ${error.message}`);
    }
  }
}

// Instructions d'utilisation
console.log('📋 Instructions:');
console.log('1. Remplacez YOUR_API_KEY par votre clé API Supabase');
console.log('2. Exécutez: node test-edge-function.js');
console.log('3. Ou testez directement dans votre navigateur avec le SubdomainRouter');

// Test automatique
console.log('\n🚀 Lancement du test automatique...');
testEdgeFunction();
