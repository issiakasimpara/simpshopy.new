// Utilitaires de validation pour améliorer la robustesse

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value: any, fieldName?: string): string | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName || 'Ce champ'} est requis`;
  }
  return null;
};

export const validateMinLength = (value: string, minLength: number, fieldName?: string): string | null => {
  if (value && value.length < minLength) {
    return `${fieldName || 'Ce champ'} doit contenir au moins ${minLength} caractères`;
  }
  return null;
};

export const validatePrice = (price: number | string): string | null => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice) || numPrice < 0) {
    return 'Le prix doit être un nombre positif';
  }
  return null;
};

export const validatePositiveInteger = (value: number | string, fieldName?: string): string | null => {
  const numValue = typeof value === 'string' ? parseInt(value) : value;
  if (isNaN(numValue) || numValue < 0 || !Number.isInteger(numValue)) {
    return `${fieldName || 'Ce champ'} doit être un nombre entier positif`;
  }
  return null;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateStoreId = (storeId?: string | null): boolean => {
  return Boolean(storeId && storeId.trim() !== '');
};

export const validateStoreAccess = async (storeId: string): Promise<boolean> => {
  if (!validateStoreId(storeId)) return false;

  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data, error } = await supabase
      .from('stores')
      .select('id, status')
      .eq('id', storeId)
      .eq('status', 'active')
      .single();

    return !error && !!data;
  } catch (error) {
    console.error('Erreur validation store:', error);
    return false;
  }
};

export const validateTemplateData = (template: any): string[] => {
  const errors: string[] = [];
  
  if (!template?.id) {
    errors.push('ID du template manquant');
  }
  
  if (!template?.name || template.name.trim() === '') {
    errors.push('Nom du template manquant');
  }
  
  if (!Array.isArray(template?.pages)) {
    errors.push('Pages du template invalides');
  }
  
  return errors;
};