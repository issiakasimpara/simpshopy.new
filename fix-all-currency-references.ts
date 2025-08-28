import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Script pour corriger toutes les références hardcodées à CFA
 * et les remplacer par le système de devise dynamique
 */

const filesToFix = [
  'src/components/shipping/CreateShippingMethodModal.tsx',
  'src/components/markets/CreateShippingMethodDialog.tsx',
  'src/components/products/variants/SimpleVariantSection.tsx',
  'src/components/OrderDetailsModal.tsx',
  'src/components/payments/PaymentsStats.tsx',
  'src/components/payments/TransactionsList.tsx',
  'src/components/payments/RecentActivity.tsx',
  'src/components/products/ProductCard.tsx',
  'src/components/checkout/PaymentMethodSelector.tsx',
  'src/components/demo/PaymentLogosDemo.tsx',
  'src/components/test/LogoTest.tsx',
  'src/components/showcase/PaymentLogosShowcase.tsx'
];

const replacements = [
  // Labels de prix
  { from: 'Prix (CFA)', to: 'Prix ({formatPrice(0, { showSymbol: true, showCode: true })})' },
  { from: 'Prix de vente (CFA)', to: 'Prix de vente ({formatPrice(0, { showSymbol: true, showCode: true })})' },
  { from: 'Prix comparé (CFA)', to: 'Prix comparé ({formatPrice(0, { showSymbol: true, showCode: true })})' },
  { from: 'Prix de revient (CFA)', to: 'Prix de revient ({formatPrice(0, { showSymbol: true, showCode: true })})' },
  { from: 'Prix de comparaison (CFA)', to: 'Prix de comparaison ({formatPrice(0, { showSymbol: true, showCode: true })})' },
  
  // Affichage de prix
  { from: 'CFA', to: 'formatPrice(amount)' },
  { from: 'cfa', to: 'formatPrice(amount)' },
  
  // Headers de tableaux
  { from: '<th className="text-left p-2">Prix (CFA)</th>', to: '<th className="text-left p-2">Prix ({formatPrice(0, { showSymbol: true, showCode: true })})</th>' },
  
  // Textes d'affichage
  { from: 'Gratuit', to: 'Gratuit' }, // Garder gratuit
  { from: '${order.shipping_method.price} CFA', to: 'formatPrice(order.shipping_method.price)' }
];

const importsToAdd = [
  'import { useStoreCurrency } from "@/hooks/useStoreCurrency";'
];

const hooksToAdd = [
  'const { formatPrice } = useStoreCurrency();'
];

function fixFile(filePath: string) {
  if (!existsSync(filePath)) {
    console.log(`⚠️ Fichier non trouvé: ${filePath}`);
    return;
  }

  let content = readFileSync(filePath, 'utf8');
  let modified = false;

  // Ajouter l'import si nécessaire
  if (content.includes('CFA') && !content.includes('useStoreCurrency')) {
    // Trouver la dernière ligne d'import
    const importLines = content.split('\n').filter(line => line.trim().startsWith('import'));
    if (importLines.length > 0) {
      const lastImportIndex = content.lastIndexOf(importLines[importLines.length - 1]);
      const insertIndex = content.indexOf('\n', lastImportIndex) + 1;
      content = content.slice(0, insertIndex) + importsToAdd[0] + '\n' + content.slice(insertIndex);
      modified = true;
    }
  }

  // Ajouter le hook si nécessaire
  if (content.includes('formatPrice') && !content.includes('const { formatPrice } = useStoreCurrency()')) {
    // Trouver la première fonction ou composant
    const functionMatch = content.match(/(const|function)\s+\w+\s*=\s*\(/);
    if (functionMatch) {
      const insertIndex = content.indexOf(functionMatch[0]) + functionMatch[0].length;
      const nextBraceIndex = content.indexOf('{', insertIndex);
      if (nextBraceIndex !== -1) {
        const afterBraceIndex = content.indexOf('\n', nextBraceIndex) + 1;
        content = content.slice(0, afterBraceIndex) + '  ' + hooksToAdd[0] + '\n' + content.slice(afterBraceIndex);
        modified = true;
      }
    }
  }

  // Remplacer les références CFA
  replacements.forEach(({ from, to }) => {
    if (content.includes(from)) {
      content = content.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
      modified = true;
    }
  });

  if (modified) {
    writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Corrigé: ${filePath}`);
  } else {
    console.log(`ℹ️ Aucune modification nécessaire: ${filePath}`);
  }
}

console.log('🔧 Correction des références monétaires...\n');

filesToFix.forEach(fixFile);

console.log('\n🎉 Correction terminée !');
console.log('\n📋 Prochaines étapes:');
console.log('1. Vérifiez que tous les composants utilisent maintenant le système de devise dynamique');
console.log('2. Testez le changement de devise dans Paramètres → Devise');
console.log('3. Vérifiez que tous les prix se mettent à jour automatiquement');
