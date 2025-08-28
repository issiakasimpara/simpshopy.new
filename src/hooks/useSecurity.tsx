import { useState, useCallback } from 'react';
import { 
  sanitizeInput, 
  validateEmail, 
  validateUrl, 
  validatePrice, 
  validateSku,
  validateProductName,
  validateDescription,
  validateUUID,
  validateImageFile,
  validateProductData,
  validateStoreData,
  validatePassword,
  generateCSRFToken,
  validateCSRFToken
} from '../utils/securityUtils';

interface SecurityState {
  csrfToken: string;
  isSecure: boolean;
  lastValidation: Date | null;
}

export const useSecurity = () => {
  const [securityState, setSecurityState] = useState<SecurityState>({
    csrfToken: generateCSRFToken(),
    isSecure: true,
    lastValidation: null
  });

  // Validation en temps réel des champs (simplifiée)
  const validateField = useCallback((field: string, value: any): { isValid: boolean; error?: string } => {
    try {
      switch (field) {
        case 'email':
          return {
            isValid: validateEmail(value),
            error: validateEmail(value) ? undefined : 'Email invalide'
          };
        
        case 'url':
        case 'domain':
          return {
            isValid: validateUrl(value),
            error: validateUrl(value) ? undefined : 'URL invalide'
          };
        
        case 'price':
          return {
            isValid: validatePrice(value),
            error: validatePrice(value) ? undefined : 'Prix invalide (0-999999.99)'
          };
        
        case 'sku':
          return {
            isValid: validateSku(value),
            error: validateSku(value) ? undefined : 'SKU invalide (3-50 caractères)'
          };
        
        case 'productName': {
          // Validation sans sanitisation pour permettre les espaces pendant la saisie
          const nameLength = value.length;
          const isValidName = nameLength >= 2 && nameLength <= 200;
          return {
            isValid: isValidName,
            error: isValidName ? undefined : 'Nom invalide (2-200 caractères)'
          };
        }
        
        case 'description': {
          // Validation sans sanitisation pour permettre les espaces pendant la saisie
          const descLength = value.length;
          const isValidDesc = descLength <= 2000;
          return {
            isValid: isValidDesc,
            error: isValidDesc ? undefined : 'Description trop longue (max 2000 caractères)'
          };
        }
        
        case 'uuid': {
          return {
            isValid: validateUUID(value),
            error: validateUUID(value) ? undefined : 'ID invalide'
          };
        }
        
        case 'password': {
          const passwordValidation = validatePassword(value);
          return {
            isValid: passwordValidation.isValid,
            error: passwordValidation.isValid ? undefined : passwordValidation.errors[0]
          };
        }
        
        default:
          return { isValid: true };
      }
    } catch (error) {
      // Log simplifié pour éviter les conflits
      console.warn(`Erreur de validation pour le champ ${field}:`, error);
      return { isValid: false, error: 'Erreur de validation' };
    }
  }, []);

  // Sanitisation automatique des entrées (simplifiée)
  const sanitizeField = useCallback((field: string, value: string): string => {
    try {
      return sanitizeInput(value);
    } catch (error) {
      console.warn(`Erreur de sanitisation pour le champ ${field}:`, error);
      return value; // Retourner la valeur originale en cas d'erreur
    }
  }, []);

  // Validation complète d'un formulaire produit (simplifiée)
  const validateProductForm = useCallback((data: any): { isValid: boolean; errors: string[] } => {
    try {
      const validation = validateProductData(data);
      return validation;
    } catch (error) {
      console.warn('Erreur validation formulaire produit:', error);
      return { isValid: false, errors: ['Erreur de validation'] };
    }
  }, []);

  // Validation complète d'un formulaire boutique (simplifiée)
  const validateStoreForm = useCallback((data: any): { isValid: boolean; errors: string[] } => {
    try {
      const validation = validateStoreData(data);
      return validation;
    } catch (error) {
      console.warn('Erreur validation formulaire boutique:', error);
      return { isValid: false, errors: ['Erreur de validation'] };
    }
  }, []);

  // Validation d'un fichier image (simplifiée)
  const validateImage = useCallback((file: File): { isValid: boolean; error?: string } => {
    try {
      const isValid = validateImageFile(file);
      return {
        isValid,
        error: isValid ? undefined : 'Fichier invalide (max 5MB, formats: JPG, PNG, WebP, GIF)'
      };
    } catch (error) {
      console.warn('Erreur validation fichier image:', error);
      return { isValid: false, error: 'Erreur de validation' };
    }
  }, []);

  // Vérification du token CSRF (simplifiée)
  const verifyCSRFToken = useCallback((token: string): boolean => {
    try {
      const isValid = validateCSRFToken(token, securityState.csrfToken);
      return isValid;
    } catch (error) {
      console.warn('Erreur vérification token CSRF:', error);
      return false;
    }
  }, [securityState.csrfToken]);

  // Génération d'un nouveau token CSRF
  const refreshCSRFToken = useCallback(() => {
    const newToken = generateCSRFToken();
    setSecurityState(prev => ({
      ...prev,
      csrfToken: newToken,
      lastValidation: new Date()
    }));
  }, []);

  // Vérification de la sécurité globale (simplifiée)
  const checkSecurityStatus = useCallback(() => {
    const isSecure = securityState.csrfToken.length >= 20;
    setSecurityState(prev => ({
      ...prev,
      isSecure,
      lastValidation: new Date()
    }));
    return isSecure;
  }, [securityState.csrfToken]);

  return {
    // État
    csrfToken: securityState.csrfToken,
    isSecure: securityState.isSecure,
    lastValidation: securityState.lastValidation,
    
    // Fonctions de validation
    validateField,
    sanitizeField,
    validateProductForm,
    validateStoreForm,
    validateImage,
    
    // Fonctions CSRF
    verifyCSRFToken,
    refreshCSRFToken,
    
    // Fonctions de sécurité
    checkSecurityStatus
  };
}; 