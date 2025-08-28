/**
 * Utilitaires de sécurité pour Simpshopy
 * Protection contre XSS, injection, et validation des entrées
 */

// Sanitisation des entrées utilisateur
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Supprime les balises HTML
    .replace(/javascript:/gi, '') // Supprime les protocoles dangereux
    .replace(/on\w+=/gi, '') // Supprime les event handlers
    .trim();
};

// Validation des emails
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Validation des URLs
export const validateUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Validation des prix
export const validatePrice = (price: number | string): boolean => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return !isNaN(numPrice) && numPrice >= 0 && numPrice <= 999999.99;
};

// Validation des SKU
export const validateSku = (sku: string): boolean => {
  return /^[A-Za-z0-9-_]{3,50}$/.test(sku);
};

// Validation des noms de produits
export const validateProductName = (name: string): boolean => {
  const sanitized = sanitizeInput(name);
  return sanitized.length >= 2 && sanitized.length <= 200;
};

// Validation des descriptions
export const validateDescription = (description: string): boolean => {
  const sanitized = sanitizeInput(description);
  return sanitized.length <= 2000;
};

// Protection CSRF
export const generateCSRFToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Validation des tokens CSRF
export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  return token === storedToken && token.length >= 20;
};

// Validation des IDs UUID
export const validateUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Validation des images
export const validateImageFile = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  return allowedTypes.includes(file.type) && file.size <= maxSize;
};

// Validation des données de formulaire produit
export const validateProductData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!validateProductName(data.name)) {
    errors.push('Nom de produit invalide (2-200 caractères)');
  }
  
  if (!validateDescription(data.description)) {
    errors.push('Description trop longue (max 2000 caractères)');
  }
  
  if (!validatePrice(data.price)) {
    errors.push('Prix invalide (0-999999.99)');
  }
  
  if (data.sku && !validateSku(data.sku)) {
    errors.push('SKU invalide (3-50 caractères, alphanumérique)');
  }
  
  if (data.inventory_quantity && (data.inventory_quantity < 0 || data.inventory_quantity > 999999)) {
    errors.push('Quantité invalide (0-999999)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validation des données de boutique
export const validateStoreData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!validateProductName(data.name)) {
    errors.push('Nom de boutique invalide (2-200 caractères)');
  }
  
  if (data.domain && !validateUrl(`https://${data.domain}`)) {
    errors.push('Domaine invalide');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Protection contre les attaques par timing
export const constantTimeCompare = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
};

// Validation des mots de passe
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Log sécurisé (ne pas logger d'informations sensibles)
export const secureLog = (message: string, data?: any): void => {
  const sanitizedData = data ? JSON.stringify(data, (key, value) => {
    // Masquer les informations sensibles
    const sensitiveKeys = ['password', 'token', 'key', 'secret', 'api_key'];
    if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
      return '[MASKED]';
    }
    return value;
  }) : undefined;
  
  console.log(`🔐 [SECURITY] ${message}`, sanitizedData);
}; 