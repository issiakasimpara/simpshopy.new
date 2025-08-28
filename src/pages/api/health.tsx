import React from 'react';

// Endpoint de santé pour tester les domaines
export default function HealthCheck() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center' 
    }}>
      <h1>✅ Simpshopy - Domaine actif</h1>
      <p>Ce domaine est correctement configuré et pointe vers Simpshopy.</p>
      <p><strong>Timestamp :</strong> {new Date().toISOString()}</p>
      <p><strong>Status :</strong> OK</p>
    </div>
  );
} 