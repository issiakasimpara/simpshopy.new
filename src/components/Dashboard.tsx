import { useState, useEffect } from 'react';
import { useOptimizedRealtime } from '../hooks/useOptimizedRealtime';
import { useOptimizedCartSessions } from '../hooks/useOptimizedCartSessions';
import { useSessionOptimizer } from '../hooks/useSessionOptimizer';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activeCustomers: number;
  cartSessions: number;
}

export default function Dashboard() {
  
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    activeCustomers: 0,
    cartSessions: 0
  });

  // 🔥 OPTIMISATION 1: Realtime optimisé pour les commandes
  const { data: realtimeOrders } = useOptimizedRealtime(
    {
      table: 'orders',
      event: 'INSERT',
      debounceMs: 2000, // Debounce de 2 secondes
      enabled: true
    },
    (payload) => {
      console.log('🆕 Nouvelle commande reçue:', payload);
      // Mettre à jour les stats en temps réel
      setStats(prev => ({
        ...prev,
        totalOrders: prev.totalOrders + 1
      }));
    }
  );

  // 🔥 OPTIMISATION 2: Sessions de panier optimisées
  const { 
    cartSession, 
    loading: cartLoading,
    getCartSession,
    saveCartSession 
  } = useOptimizedCartSessions({
    sessionId: 'current-session',
    storeId: 'current-store',
    cacheDuration: 5 * 60 * 1000, // 5 minutes
    debounceMs: 1000 // 1 seconde
  });

  // 🔥 OPTIMISATION 3: Session optimisée
  const { configureSession, getCacheSize } = useSessionOptimizer();

  // Configuration de session optimisée
  useEffect(() => {
    configureSession({
      searchPath: 'public',
      role: 'authenticated',
      method: 'GET',
      path: '/dashboard'
    });
  }, [configureSession]);

  // Charger les données initiales
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Simuler le chargement des données
        setStats({
          totalOrders: 1250,
          totalRevenue: 45000,
          activeCustomers: 320,
          cartSessions: 45
        });

        // Charger la session de panier actuelle
        await getCartSession('current-session', 'current-store');
      } catch (error) {
        console.error('Erreur chargement dashboard:', error);
      }
    };

    loadDashboardData();
  }, [getCartSession]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">
          Optimisations actives - Cache session: {getCacheSize()} configurations
        </p>
      </div>

      {/* Stats en temps réel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Commandes</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
          <p className="text-sm text-gray-500">Total des commandes</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Revenus</h3>
          <p className="text-3xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Revenus totaux</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Clients</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.activeCustomers}</p>
          <p className="text-sm text-gray-500">Clients actifs</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Produits</h3>
          <p className="text-3xl font-bold text-indigo-600">{stats.cartSessions}</p>
          <p className="text-sm text-gray-500">Produits actifs</p>
        </div>
      </div>

      {/* Section des optimisations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Section des optimisations */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">État des Optimisations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800">✅ Realtime Optimisé</h3>
              <p className="text-sm text-green-600">
                {realtimeOrders.length} événements en cache
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">
                {cartLoading ? '⏳' : '✅'} Sessions Panier
              </h3>
              <p className="text-sm text-blue-600">
                {cartSession ? 'Session active' : 'Aucune session'}
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-800">✅ Sessions Configurées</h3>
              <p className="text-sm text-purple-600">
                {getCacheSize()} configurations en cache
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions de test */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Actions de Test</h3>
        <div className="flex gap-2">
          <button
            onClick={() => saveCartSession({
              session_id: 'test-session',
              store_id: 'test-store',
              items: [{ id: '1', name: 'Test Product', price: 10 }]
            })}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Tester Sauvegarde Panier
          </button>
          
          <button
            onClick={() => configureSession({
              searchPath: 'public',
              role: 'authenticated',
              method: 'POST',
              path: '/test'
            })}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Tester Configuration Session
          </button>
        </div>
      </div>
    </div>
  );
}
