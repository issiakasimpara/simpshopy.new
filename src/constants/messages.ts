// Messages d'erreur et de succès standardisés

export const ERROR_MESSAGES = {
  // Général
  GENERIC: 'Une erreur inattendue s\'est produite',
  NETWORK: 'Erreur de connexion. Vérifiez votre connexion internet',
  UNAUTHORIZED: 'Vous n\'êtes pas autorisé à effectuer cette action',
  FORBIDDEN: 'Accès refusé',
  NOT_FOUND: 'Ressource non trouvée',
  
  // Authentification
  AUTH_FAILED: 'Échec de l\'authentification',
  SESSION_EXPIRED: 'Session expirée, veuillez vous reconnecter',
  
  // Validation
  REQUIRED_FIELD: 'Ce champ est requis',
  INVALID_EMAIL: 'Adresse email invalide',
  INVALID_PRICE: 'Prix invalide',
  
  // Store
  NO_STORE_SELECTED: 'Aucun magasin sélectionné',
  STORE_NOT_FOUND: 'Magasin non trouvé',
  
  // Template
  TEMPLATE_SAVE_FAILED: 'Impossible de sauvegarder le template',
  TEMPLATE_LOAD_FAILED: 'Impossible de charger le template',
  TEMPLATE_PUBLISH_FAILED: 'Impossible de publier le template',
  
  // Products
  PRODUCT_SAVE_FAILED: 'Impossible de sauvegarder le produit',
  PRODUCT_DELETE_FAILED: 'Impossible de supprimer le produit',
  
  // Cart
  CART_ADD_FAILED: 'Impossible d\'ajouter au panier',
  CART_UPDATE_FAILED: 'Impossible de mettre à jour le panier',
  CART_CLEAR_FAILED: 'Impossible de vider le panier',
  
  // Orders
  ORDER_SEARCH_FAILED: 'Impossible de rechercher les commandes',
  ORDER_CREATE_FAILED: 'Impossible de créer la commande',
} as const;

export const SUCCESS_MESSAGES = {
  // Template
  TEMPLATE_SAVED: 'Template sauvegardé avec succès',
  TEMPLATE_PUBLISHED: 'Site publié avec succès',
  
  // Products
  PRODUCT_SAVED: 'Produit sauvegardé avec succès',
  PRODUCT_DELETED: 'Produit supprimé avec succès',
  
  // Store
  STORE_CREATED: 'Magasin créé avec succès',
  STORE_UPDATED: 'Magasin mis à jour avec succès',
  
  // Cart
  CART_UPDATED: 'Panier mis à jour',
  
  // Orders
  ORDER_CREATED: 'Commande créée avec succès',
} as const;

export const INFO_MESSAGES = {
  // Preview
  PREVIEW_OPENED: 'Aperçu ouvert - les modifications sont visibles en temps réel',
  
  // Auto-save
  AUTO_SAVE_ENABLED: 'Sauvegarde automatique activée',
  
  // Loading
  LOADING_TEMPLATE: 'Chargement du template...',
  LOADING_PRODUCTS: 'Chargement des produits...',
  LOADING_ORDERS: 'Chargement des commandes...',
} as const;