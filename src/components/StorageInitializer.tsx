import React, { useEffect } from 'react';
import { migrateExistingData } from '@/utils/isolatedStorage';

interface StorageInitializerProps {
  children?: React.ReactNode;
}

const StorageInitializer: React.FC<StorageInitializerProps> = ({ children }) => {
  useEffect(() => {
    // Migrer les données existantes vers le stockage isolé
    try {
      migrateExistingData();
      console.log('✅ Stockage isolé initialisé');
    } catch (error) {
      console.warn('⚠️ Erreur lors de l\'initialisation du stockage isolé:', error);
    }
  }, []);

  return <>{children}</>;
};

export default StorageInitializer;
