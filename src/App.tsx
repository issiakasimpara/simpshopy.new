
import React from 'react';

function App() {
  console.log('🚀 [DEBUG] App.tsx - Démarrage du composant App');
  console.log('🔍 [DEBUG] React version dans App:', React.version);
  console.log('🔍 [DEBUG] Environment:', import.meta.env.MODE);
  console.log('🔍 [DEBUG] VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? 'PRESENT' : 'MISSING');
  console.log('🔍 [DEBUG] VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'PRESENT' : 'MISSING');

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-blue-600 mb-4 text-center">
          🚀 SimpShopy
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Application de test - Si vous voyez ceci, React fonctionne !
        </p>
        
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded border border-green-200">
            <h3 className="font-semibold text-green-800">✅ React fonctionne</h3>
            <p className="text-sm text-green-600">Version: {React.version}</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <h3 className="font-semibold text-blue-800">🔍 Environment</h3>
            <p className="text-sm text-blue-600">Mode: {import.meta.env.MODE}</p>
            <p className="text-sm text-blue-600">NODE_ENV: {import.meta.env.NODE_ENV}</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
            <h3 className="font-semibold text-yellow-800">🔐 Variables d'environnement</h3>
            <p className="text-sm text-yellow-600">
              VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Présent' : '❌ Manquant'}
            </p>
            <p className="text-sm text-yellow-600">
              VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Présent' : '❌ Manquant'}
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded border border-purple-200">
            <h3 className="font-semibold text-purple-800">🌐 Informations navigateur</h3>
            <p className="text-sm text-purple-600">
              User Agent: {navigator.userAgent.substring(0, 50)}...
            </p>
            <p className="text-sm text-purple-600">
              URL: {window.location.href}
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => window.location.reload()}
          className="w-full mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          🔄 Recharger la page
        </button>
      </div>
    </div>
  );
}

export default App;
