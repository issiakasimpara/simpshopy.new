
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { isolatedStorage, isUserStorefront } from '@/utils/isolatedStorage';

export interface CartSession {
  id: string;
  session_id: string;
  store_id: string | null;
  items: CartItem[];
  customer_info: any;
  created_at: string;
  updated_at: string;
  expires_at: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant_id?: string;
  product_id: string;
  sku?: string;
}

export const useCartSessions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const { toast } = useToast();
  const [lastCallTime, setLastCallTime] = useState<number>(0);
  const [lastStoreId, setLastStoreId] = useState<string>('');

  // Fonction pour générer ou récupérer l'ID de session de manière synchrone
  const getOrCreateSessionId = (): string => {
    // Utiliser le stockage isolé pour éviter les conflits entre boutiques
    let currentSessionId = isolatedStorage.getItem('cart_session_id');
    if (!currentSessionId) {
      currentSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      isolatedStorage.setItem('cart_session_id', currentSessionId);
      // Log seulement en développement et très rarement
      if (import.meta.env.DEV && Math.random() < 0.01) {
        console.log('🆔 Nouvelle session créée:', currentSessionId);
      }
    } else {
      // Log seulement en développement et très rarement
      if (import.meta.env.DEV && Math.random() < 0.01) {
        console.log('🆔 Session existante récupérée:', currentSessionId);
      }
    }
    return currentSessionId;
  };

  useEffect(() => {
    // Initialiser la session au démarrage
    const currentSessionId = getOrCreateSessionId();
    setSessionId(currentSessionId);
  }, []);

  // Fonction pour convertir Json vers CartItem[] de manière sûre
  const safeConvertToCartItems = (items: any): CartItem[] => {
    if (!Array.isArray(items)) return [];
    return items.filter(item => 
      item && 
      typeof item === 'object' && 
      item.id && 
      item.name && 
      typeof item.price === 'number' && 
      typeof item.quantity === 'number' &&
      item.product_id
    );
  };

  // Récupérer la session de panier avec protection contre les appels répétés
  const getCartSession = async (storeId?: string): Promise<CartSession | null> => {
    // Assurer qu'on a un sessionId, même si l'état n'est pas encore mis à jour
    const currentSessionId = sessionId || getOrCreateSessionId();

    if (!currentSessionId) {
      console.warn('getCartSession: Impossible de créer sessionId');
      return null;
    }
    
    if (!storeId) {
      console.warn('getCartSession: storeId manquant');
      return null;
    }

    // Protection contre les appels répétés (debounce de 1000ms)
    const now = Date.now();
    if (lastStoreId === storeId && now - lastCallTime < 1000) {
      // Log seulement en développement et rarement
      if (import.meta.env.DEV && Math.random() < 0.1) {
        console.log('getCartSession: Appel ignoré (trop récent)');
      }
      return null;
    }

    setLastCallTime(now);
    setLastStoreId(storeId);
    
    try {
      setIsLoading(true);
      
      // Log seulement en développement et rarement
      if (import.meta.env.DEV && Math.random() < 0.1) {
        console.log('getCartSession: Recherche session', { sessionId: currentSessionId, storeId });
      }

      const { data, error } = await supabase
        .from('cart_sessions')
        .select('*')
        .eq('session_id', currentSessionId)
        .eq('store_id', storeId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('getCartSession: Erreur Supabase:', error);
        // Si c'est une erreur de table manquante, on retourne null au lieu de planter
        if (error.code === '42P01') {
          console.warn('⚠️ Table cart_sessions non trouvée, retour null');
          return null;
        }
        throw error;
      }
      
      if (data) {
        // Log seulement en développement et rarement
        if (import.meta.env.DEV && Math.random() < 0.1) {
          console.log('getCartSession: Session trouvée avec', data.items?.length || 0, 'articles');
        }
        const cartItems = safeConvertToCartItems(data.items);
        // Log seulement en développement et rarement
        if (import.meta.env.DEV && Math.random() < 0.1) {
          console.log('getCartSession: Articles convertis:', cartItems.length);
        }
        return {
          ...data,
          items: cartItems
        };
      }
      
      // Log seulement en développement et rarement
      if (import.meta.env.DEV && Math.random() < 0.1) {
        console.log('getCartSession: Aucune session trouvée');
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération de la session:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Créer ou mettre à jour la session de panier
  const saveCartSession = async (
    storeId: string,
    items: CartItem[],
    customerInfo?: any
  ): Promise<CartSession | null> => {
    // Éviter les appels multiples
    if (isLoading) {
      console.log('⏳ Sauvegarde déjà en cours, ignoré');
      return null;
    }

    try {
      setIsLoading(true);
      const currentSessionId = getOrCreateSessionId();
      console.log('💾 Sauvegarde session de panier:', {
        sessionId: currentSessionId,
        storeId,
        itemsCount: items.length,
        customerInfo
      });

      // First, try to fetch an existing session
      const existingSession = await getCartSession(storeId);

      let data;
      let error;

      if (existingSession) {
        // If session exists, update it
        console.log('🔄 Mise à jour de la session existante:', existingSession.id);
        ({ data, error } = await supabase
          .from('cart_sessions')
          .update({
            items: items as any,
            customer_info: customerInfo || {},
            updated_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Extend expiration
          })
          .eq('id', existingSession.id)
          .select()); // Add .select() to get the updated data
      } else {
        // If no session exists, insert a new one
        console.log('➕ Insertion d\'une nouvelle session.');
        ({ data, error } = await supabase
          .from('cart_sessions')
          .insert({
            session_id: currentSessionId,
            store_id: storeId,
            items: items as any,
            customer_info: customerInfo || {},
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
          .select()); // Add .select() to get the inserted data
      }

      if (error) {
        console.error('❌ Erreur sauvegarde session:', error);
        toast({
          title: 'Erreur lors de la sauvegarde de la session',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      console.log('✅ Session sauvegardée avec succès:', data);
      return data && data[0] ? data[0] : null;

    } catch (error: any) {
      console.error('❌ Erreur lors de la sauvegarde de la session:', error);
      toast({
        title: 'Erreur inattendue',
        description: error.message || 'Impossible de sauvegarder la session de panier.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Ajouter un article au panier
  const addToCart = async (
    storeId: string,
    item: CartItem
  ): Promise<boolean> => {
    const currentSessionId = sessionId || getOrCreateSessionId();
    console.log('addToCart: Début', { storeId, item, sessionId: currentSessionId });

    if (!storeId) {
      console.error('addToCart: storeId manquant');
      toast({
        title: "Erreur",
        description: "ID de boutique manquant.",
        variant: "destructive"
      });
      return false;
    }

    if (!currentSessionId) {
      console.error('addToCart: Impossible de créer sessionId');
      toast({
        title: "Erreur",
        description: "Session non initialisée.",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      const session = await getCartSession(storeId);
      const currentItems = session?.items || [];
      console.log('addToCart: Articles actuels:', currentItems);
      
      // Vérifier si l'article existe déjà
      const existingItemIndex = currentItems.findIndex(
        (existingItem: CartItem) => 
          existingItem.product_id === item.product_id &&
          existingItem.variant_id === item.variant_id
      );
      
      let updatedItems;
      if (existingItemIndex >= 0) {
        // Mettre à jour la quantité
        updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        console.log('addToCart: Article existant, mise à jour quantité');
      } else {
        // Ajouter le nouvel article
        updatedItems = [...currentItems, item];
        console.log('addToCart: Nouvel article ajouté');
      }
      
      const result = await saveCartSession(storeId, updatedItems, session?.customer_info);
      console.log('addToCart: Résultat sauvegarde:', result);
      
      if (result) {
        toast({
          title: "Succès",
          description: "Article ajouté au panier.",
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'article au panier.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Supprimer un article du panier
  const removeFromCart = async (
    storeId: string,
    productId: string,
    variantId?: string
  ): Promise<boolean> => {
    try {
      const session = await getCartSession(storeId);
      if (!session) return false;
      
      const updatedItems = session.items.filter(
        (item: CartItem) => 
          !(item.product_id === productId && item.variant_id === variantId)
      );
      
      const result = await saveCartSession(storeId, updatedItems, session.customer_info);
      
      if (result) {
        toast({
          title: "Succès",
          description: "Article retiré du panier.",
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer l'article du panier.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Vider le panier
  const clearCart = async (storeId: string): Promise<boolean> => {
    try {
      const session = await getCartSession(storeId);
      if (!session) return true;
      
      const { error } = await supabase
        .from('cart_sessions')
        .delete()
        .eq('id', session.id);
      
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Panier vidé.",
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors du vidage du panier:', error);
      toast({
        title: "Erreur",
        description: "Impossible de vider le panier.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    isLoading,
    sessionId,
    getCartSession,
    saveCartSession,
    addToCart,
    removeFromCart,
    clearCart
  };
};
