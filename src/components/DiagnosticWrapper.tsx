import React, { useEffect, useState } from 'react';

interface DiagnosticInfo {
  timestamp: string;
  userAgent: string;
  windowSize: { width: number; height: number };
  environment: string;
  supabaseUrl: string | undefined;
  supabaseKey: string | undefined;
  reactVersion: string;
  errors: string[];
  warnings: string[];
}

const DiagnosticWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [diagnosticInfo, setDiagnosticInfo] = useState<DiagnosticInfo | null>(null);
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  useEffect(() => {
    // Capturer les erreurs globales
    const originalError = console.error;
    const originalWarn = console.warn;
    const errors: string[] = [];
    const warnings: string[] = [];

    console.error = (...args) => {
      errors.push(args.join(' '));
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      warnings.push(args.join(' '));
      originalWarn.apply(console, args);
    };

    // Collecter les informations de diagnostic
    const info: DiagnosticInfo = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      windowSize: { width: window.innerWidth, height: window.innerHeight },
      environment: import.meta.env.MODE,
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'PRESENT' : 'MISSING',
      reactVersion: React.version,
      errors,
      warnings
    };

    setDiagnosticInfo(info);

    // Afficher le diagnostic en production si il y a des erreurs
    if (import.meta.env.PROD && errors.length > 0) {
      setShowDiagnostic(true);
    }

    // Nettoyer
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  if (showDiagnostic && diagnosticInfo) {
    return (
      <div className="min-h-screen bg-red-50 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">🚨 Diagnostic d'Erreur</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Informations Système</h3>
              <p><strong>Timestamp:</strong> {diagnosticInfo.timestamp}</p>
              <p><strong>Environment:</strong> {diagnosticInfo.environment}</p>
              <p><strong>React Version:</strong> {diagnosticInfo.reactVersion}</p>
              <p><strong>Window Size:</strong> {diagnosticInfo.windowSize.width}x{diagnosticInfo.windowSize.height}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Configuration</h3>
              <p><strong>Supabase URL:</strong> {diagnosticInfo.supabaseUrl ? 'PRESENT' : 'MISSING'}</p>
              <p><strong>Supabase Key:</strong> {diagnosticInfo.supabaseKey}</p>
              <p><strong>User Agent:</strong> {diagnosticInfo.userAgent.substring(0, 50)}...</p>
            </div>
          </div>

          {diagnosticInfo.errors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-red-600 mb-2">Erreurs ({diagnosticInfo.errors.length})</h3>
              <div className="bg-red-50 p-4 rounded max-h-40 overflow-y-auto">
                {diagnosticInfo.errors.map((error, index) => (
                  <div key={index} className="text-sm text-red-700 mb-1">
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          {diagnosticInfo.warnings.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-yellow-600 mb-2">Avertissements ({diagnosticInfo.warnings.length})</h3>
              <div className="bg-yellow-50 p-4 rounded max-h-40 overflow-y-auto">
                {diagnosticInfo.warnings.map((warning, index) => (
                  <div key={index} className="text-sm text-yellow-700 mb-1">
                    {warning}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Recharger la page
            </button>
            <button
              onClick={() => setShowDiagnostic(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Masquer le diagnostic
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default DiagnosticWrapper;
