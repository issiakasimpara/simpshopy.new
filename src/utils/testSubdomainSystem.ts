import { supabase } from '@/integrations/supabase/client';

/**
 * Test du système de sous-domaines
 * Utilisez cette fonction pour vérifier que tout fonctionne
 */
export async function testSubdomainSystem() {
  console.log('🧪 Test du système de sous-domaines...');

  try {
    // 1. Récupérer toutes les boutiques actives
    const { data: stores, error: storesError } = await supabase
      .from('stores')
      .select('id, name, slug, status')
      .eq('status', 'active');

    if (storesError) {
      console.error('❌ Erreur récupération boutiques:', storesError);
      return false;
    }

    console.log(`✅ ${stores?.length || 0} boutiques actives trouvées`);

    // 2. Vérifier les sous-domaines pour chaque boutique
    for (const store of stores || []) {
      console.log(`\n🔍 Test de la boutique: ${store.name} (${store.slug})`);

      // Vérifier si le sous-domaine existe
      const { data: domain, error: domainError } = await supabase
        .from('store_domains')
        .select('*')
        .eq('store_id', store.id)
        .eq('domain_type', 'subdomain')
        .single();

      if (domainError || !domain) {
        console.log(`❌ Sous-domaine manquant pour ${store.name}`);
        
        // Créer le sous-domaine manquant
        const { error: createError } = await supabase
          .from('store_domains')
          .insert({
            store_id: store.id,
            domain_type: 'subdomain',
            domain_name: `${store.slug}.simpshopy.com`,
            is_primary: true,
            is_active: true,
            verification_status: 'verified'
          });

        if (createError) {
          console.error(`❌ Erreur création sous-domaine:`, createError);
        } else {
          console.log(`✅ Sous-domaine créé: ${store.slug}.simpshopy.com`);
        }
      } else {
        console.log(`✅ Sous-domaine existant: ${domain.domain_name}`);
      }

      // 3. Tester l'Edge Function
      const testHostname = `${store.slug}.simpshopy.com`;
      console.log(`🌐 Test Edge Function pour: ${testHostname}`);

      const { data: routerData, error: routerError } = await supabase.functions.invoke('domain-router', {
        body: { hostname: testHostname },
      });

      if (routerError) {
        console.error(`❌ Erreur Edge Function:`, routerError);
      } else if (routerData?.success && routerData?.store) {
        console.log(`✅ Edge Function OK - Boutique: ${routerData.store.name}`);
      } else {
        console.log(`❌ Edge Function échoué pour ${testHostname}`);
      }
    }

    // 4. Test de la fonction get_store_by_domain
    console.log('\n🔧 Test de la fonction get_store_by_domain...');
    
    if (stores && stores.length > 0) {
      const testStore = stores[0];
      const testDomain = `${testStore.slug}.simpshopy.com`;
      
      const { data: storeId, error: functionError } = await supabase.rpc('get_store_by_domain', {
        p_domain: testDomain
      });

      if (functionError) {
        console.error('❌ Erreur fonction get_store_by_domain:', functionError);
      } else if (storeId === testStore.id) {
        console.log(`✅ Fonction get_store_by_domain OK - ID: ${storeId}`);
      } else {
        console.log(`❌ Fonction get_store_by_domain échoué - Attendu: ${testStore.id}, Reçu: ${storeId}`);
      }
    }

    console.log('\n🎉 Test du système de sous-domaines terminé !');
    return true;

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    return false;
  }
}

/**
 * Générer un rapport des sous-domaines
 */
export async function generateSubdomainReport() {
  console.log('📊 Rapport des sous-domaines...');

  try {
    const { data: domains, error } = await supabase
      .from('store_domains')
      .select(`
        id,
        domain_name,
        domain_type,
        is_active,
        verification_status,
        stores (
          id,
          name,
          slug,
          status
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erreur récupération domaines:', error);
      return;
    }

    console.log(`\n📈 Total domaines: ${domains?.length || 0}`);
    
    const subdomains = domains?.filter(d => d.domain_type === 'subdomain') || [];
    const customDomains = domains?.filter(d => d.domain_type === 'custom') || [];
    
    console.log(`🔗 Sous-domaines: ${subdomains.length}`);
    console.log(`🌐 Domaines personnalisés: ${customDomains.length}`);

    console.log('\n📋 Liste des sous-domaines:');
    subdomains.forEach(domain => {
      const status = domain.is_active && domain.verification_status === 'verified' ? '✅' : '❌';
      console.log(`${status} ${domain.domain_name} - ${domain.stores?.name || 'Boutique inconnue'}`);
    });

    if (customDomains.length > 0) {
      console.log('\n🌐 Liste des domaines personnalisés:');
      customDomains.forEach(domain => {
        const status = domain.is_active && domain.verification_status === 'verified' ? '✅' : '❌';
        console.log(`${status} ${domain.domain_name} - ${domain.stores?.name || 'Boutique inconnue'}`);
      });
    }

  } catch (error) {
    console.error('❌ Erreur génération rapport:', error);
  }
}

/**
 * Nettoyer les domaines orphelins
 */
export async function cleanupOrphanedDomains() {
  console.log('🧹 Nettoyage des domaines orphelins...');

  try {
    const { data, error } = await supabase.rpc('cleanup_orphaned_domains');
    
    if (error) {
      console.error('❌ Erreur nettoyage:', error);
      return false;
    }

    console.log(`✅ ${data || 0} domaines orphelins supprimés`);
    return true;

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    return false;
  }
}
