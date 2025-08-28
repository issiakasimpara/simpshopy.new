import { supabase } from '@/integrations/supabase/client';

/**
 * SOLUTION ULTRA-SIMPLE : MÉTHODES PAR PAYS DIRECTEMENT
 * Pas de zones, pas de complications !
 */

// Liste des pays supportés
const COUNTRIES = [
  { code: 'ML', name: 'Mali' },
  { code: 'SN', name: 'Sénégal' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'CI', name: 'Côte d\'Ivoire' },
  { code: 'NE', name: 'Niger' },
  { code: 'TG', name: 'Togo' },
  { code: 'BJ', name: 'Bénin' },
  { code: 'GN', name: 'Guinée' },
  { code: 'CM', name: 'Cameroun' },
  { code: 'TD', name: 'Tchad' },
  { code: 'CF', name: 'République Centrafricaine' },
  { code: 'GA', name: 'Gabon' },
  { code: 'CG', name: 'Congo' },
  { code: 'CD', name: 'République Démocratique du Congo' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'DZ', name: 'Algérie' },
  { code: 'MA', name: 'Maroc' },
  { code: 'TN', name: 'Tunisie' }
];

/**
 * Créer les méthodes de livraison DIRECTEMENT pour chaque pays
 */
export const createSimpleShippingMethods = async (storeId: string) => {
  console.log('🚀 CRÉATION SIMPLE DES MÉTHODES DE LIVRAISON');
  console.log('🏪 Store ID:', storeId);

  try {
    // 1. Supprimer les anciennes méthodes
    console.log('🗑️ Suppression des anciennes méthodes...');
    const { error: deleteError } = await supabase
      .from('shipping_methods')
      .delete()
      .eq('store_id', storeId);

    if (deleteError) {
      console.warn('⚠️ Erreur suppression (normal si première fois):', deleteError);
    }

    // 2. Créer les méthodes simples
    console.log('📦 Création des méthodes simples...');

    const simpleMethods = [
      {
        store_id: storeId,
        name: 'Livraison Standard',
        description: 'Livraison standard dans toute l\'Afrique',
        price: 2500,
        estimated_days: '5-7 jours',
        icon: '🚚',
        is_active: true,
        sort_order: 1,
        available_countries: COUNTRIES.map(c => c.code) // TOUS LES PAYS
      },
      {
        store_id: storeId,
        name: 'Livraison Express',
        description: 'Livraison rapide dans toute l\'Afrique',
        price: 5000,
        estimated_days: '2-3 jours',
        icon: '⚡',
        is_active: true,
        sort_order: 2,
        available_countries: COUNTRIES.map(c => c.code) // TOUS LES PAYS
      },
      {
        store_id: storeId,
        name: 'Livraison Économique',
        description: 'Livraison économique (délai plus long)',
        price: 1500,
        estimated_days: '7-10 jours',
        icon: '💰',
        is_active: true,
        sort_order: 3,
        available_countries: COUNTRIES.map(c => c.code) // TOUS LES PAYS
      },
      {
        store_id: storeId,
        name: 'Livraison Gratuite',
        description: 'Livraison gratuite (commandes > 50 000 CFA)',
        price: 0,
        estimated_days: '10-14 jours',
        icon: '🎁',
        is_active: true,
        sort_order: 4,
        available_countries: COUNTRIES.map(c => c.code) // TOUS LES PAYS
      }
    ];

    console.log('📋 Insertion des méthodes...');
    const { data: insertedMethods, error: insertError } = await supabase
      .from('shipping_methods')
      .insert(simpleMethods)
      .select();

    if (insertError) {
      console.error('❌ Erreur insertion:', insertError);
      throw insertError;
    }

    console.log('✅ Méthodes créées:', insertedMethods?.length || 0);
    console.log('🎉 SUCCÈS TOTAL !');

    return {
      success: true,
      methods: insertedMethods?.length || 0,
      data: insertedMethods
    };

  } catch (error) {
    console.error('💥 ERREUR:', error);
    return {
      success: false,
      error: error
    };
  }
};

/**
 * Récupérer les méthodes pour un pays spécifique
 */
export const getShippingMethodsForCountry = async (storeId: string, countryCode: string) => {
  console.log(`🔍 Récupération méthodes pour ${countryCode} dans store ${storeId}`);

  try {
    const { data: methods, error } = await supabase
      .from('shipping_methods')
      .select('*')
      .eq('store_id', storeId)
      .eq('is_active', true)
      .order('sort_order');

    if (error) {
      console.error('❌ Erreur récupération:', error);
      return { success: false, error };
    }

    // Filtrer les méthodes disponibles pour ce pays
    const availableMethods = methods?.filter(method => {
      // Si pas de available_countries, disponible partout
      if (!method.available_countries || method.available_countries.length === 0) {
        return true;
      }
      // Sinon vérifier si le pays est dans la liste
      return method.available_countries.includes(countryCode);
    }) || [];

    console.log(`✅ ${availableMethods.length} méthodes disponibles pour ${countryCode}`);

    return {
      success: true,
      methods: availableMethods,
      total: methods?.length || 0
    };

  } catch (error) {
    console.error('💥 Erreur:', error);
    return { success: false, error };
  }
};

/**
 * Vérifier si les méthodes existent pour une boutique
 */
export const checkShippingMethodsExist = async (storeId: string) => {
  try {
    const { data, error } = await supabase
      .from('shipping_methods')
      .select('id')
      .eq('store_id', storeId)
      .limit(1);

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Erreur vérification:', error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error('💥 Erreur vérification:', error);
    return false;
  }
};

/**
 * Hook simple pour les méthodes de livraison
 */
export const useSimpleShipping = (storeId?: string, countryCode?: string) => {
  const [methods, setMethods] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isInitialized, setIsInitialized] = React.useState(false);

  const loadMethods = async () => {
    if (!storeId) return;

    try {
      setIsLoading(true);

      // 1. Vérifier si des méthodes existent
      const exist = await checkShippingMethodsExist(storeId);

      // 2. Si aucune méthode, créer automatiquement
      if (!exist) {
        console.log('🚀 Aucune méthode trouvée, création automatique...');
        const created = await createSimpleShippingMethods(storeId);
        if (!created.success) {
          console.error('❌ Échec création automatique');
          return;
        }
      }

      // 3. Récupérer les méthodes pour le pays
      const result = await getShippingMethodsForCountry(storeId, countryCode || 'ML');
      
      if (result.success) {
        setMethods(result.methods);
        setIsInitialized(true);
      }

    } catch (error) {
      console.error('💥 Erreur chargement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadMethods();
  }, [storeId, countryCode]);

  return {
    methods,
    isLoading,
    isInitialized,
    reload: loadMethods
  };
};

// Exposer globalement pour tests
if (typeof window !== 'undefined') {
  (window as any).createSimpleShippingMethods = createSimpleShippingMethods;
  (window as any).getShippingMethodsForCountry = getShippingMethodsForCountry;
  (window as any).checkShippingMethodsExist = checkShippingMethodsExist;
}
