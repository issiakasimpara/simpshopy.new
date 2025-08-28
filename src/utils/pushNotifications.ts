import { useState, useEffect } from 'react'

/**
 * Système de notifications push pour Simpshopy
 * Notifications en temps réel pour les commandes
 */

interface PushNotificationData {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  data?: any
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
}

class PushNotificationManager {
  private static instance: PushNotificationManager
  private isSupported: boolean
  private permission: NotificationPermission = 'default'
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null

  private constructor() {
    this.isSupported = 'Notification' in window && 'serviceWorker' in navigator
    this.initialize()
  }

  static getInstance(): PushNotificationManager {
    if (!PushNotificationManager.instance) {
      PushNotificationManager.instance = new PushNotificationManager()
    }
    return PushNotificationManager.instance
  }

  private async initialize(): Promise<void> {
    if (!this.isSupported) {
      console.warn('🔔 Notifications push non supportées par ce navigateur')
      return
    }

    try {
      // Enregistrer le service worker
      this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js')
      console.log('🔔 Service Worker enregistré:', this.serviceWorkerRegistration)

      // Demander la permission
      this.permission = await this.requestPermission()

      // Écouter les changements de permission
      if ('permission' in Notification) {
        Notification.requestPermission().then(permission => {
          this.permission = permission
        })
      }
    } catch (error) {
      console.error('🔔 Erreur lors de l\'initialisation des notifications:', error)
    }
  }

  private async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) return 'denied'

    if (this.permission === 'default') {
      const permission = await Notification.requestPermission()
      console.log('🔔 Permission notifications:', permission)
      return permission
    }

    return this.permission
  }

  async sendNotification(data: PushNotificationData): Promise<boolean> {
    if (!this.isSupported || this.permission !== 'granted') {
      console.warn('🔔 Notifications non autorisées ou non supportées')
      return false
    }

    try {
      // Notification native
      const notification = new Notification(data.title, {
        body: data.body,
        icon: data.icon || '/logo-simpshopy.png',
        badge: data.badge || '/logo-simpshopy.png',
        tag: data.tag,
        data: data.data,
        actions: data.actions,
        requireInteraction: false,
        silent: false
      })

      // Gérer les clics sur la notification
      notification.onclick = (event) => {
        event.preventDefault()
        this.handleNotificationClick(data)
        notification.close()
      }

      // Gérer les actions
      if (data.actions) {
        notification.onactionclick = (event) => {
          this.handleNotificationAction(event.action, data)
        }
      }

      console.log('🔔 Notification envoyée:', data.title)
      return true
    } catch (error) {
      console.error('🔔 Erreur lors de l\'envoi de la notification:', error)
      return false
    }
  }

  async sendOrderNotification(orderData: any, storeData: any): Promise<boolean> {
    const isAdmin = this.isAdminUser(storeData.id)
    
    if (isAdmin) {
      // Notification pour l'admin
      return this.sendNotification({
        title: `🎉 Nouvelle commande - ${storeData.name}`,
        body: `Commande #${orderData.id.slice(-6)} - ${orderData.total_amount} CFA`,
        icon: storeData.logo_url || '/logo-simpshopy.png',
        tag: `order-${orderData.id}`,
        data: {
          type: 'new_order',
          orderId: orderData.id,
          storeId: storeData.id,
          isAdmin: true
        },
        actions: [
          {
            action: 'view_order',
            title: 'Voir la commande',
            icon: '/icons/view.png'
          },
          {
            action: 'dismiss',
            title: 'Ignorer'
          }
        ]
      })
    } else {
      // Notification pour le client
      return this.sendNotification({
        title: `✅ Commande confirmée - ${storeData.name}`,
        body: `Votre commande #${orderData.id.slice(-6)} a été reçue`,
        icon: storeData.logo_url || '/logo-simpshopy.png',
        tag: `order-${orderData.id}`,
        data: {
          type: 'order_confirmation',
          orderId: orderData.id,
          storeId: storeData.id,
          isAdmin: false
        },
        actions: [
          {
            action: 'view_order',
            title: 'Voir ma commande',
            icon: '/icons/view.png'
          },
          {
            action: 'dismiss',
            title: 'Ignorer'
          }
        ]
      })
    }
  }

  private isAdminUser(storeId: string): boolean {
    // Vérifier si l'utilisateur actuel est admin de cette boutique
    // Cette logique devra être adaptée selon votre système d'auth
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    const userStores = JSON.parse(localStorage.getItem('userStores') || '[]')
    
    return userStores.some((store: any) => store.id === storeId)
  }

  private handleNotificationClick(data: PushNotificationData): void {
    if (data.data?.type === 'new_order') {
      // Rediriger vers la page des commandes pour l'admin
      window.location.href = `/orders?orderId=${data.data.orderId}`
    } else if (data.data?.type === 'order_confirmation') {
      // Rediriger vers la page de suivi pour le client
      window.location.href = `/orders?orderId=${data.data.orderId}`
    }
  }

  private handleNotificationAction(action: string, data: PushNotificationData): void {
    switch (action) {
      case 'view_order':
        this.handleNotificationClick(data)
        break
      case 'dismiss':
        // Fermer la notification
        break
      default:
        console.log('🔔 Action non reconnue:', action)
    }
  }

  async requestPermission(): Promise<boolean> {
    const permission = await this.requestPermission()
    return permission === 'granted'
  }

  isPermissionGranted(): boolean {
    return this.permission === 'granted'
  }

  isSupported(): boolean {
    return this.isSupported
  }

  // Méthode pour envoyer une notification de test
  async sendTestNotification(): Promise<boolean> {
    return this.sendNotification({
      title: '🧪 Test de notification',
      body: 'Cette notification confirme que le système fonctionne correctement',
      icon: '/logo-simpshopy.png',
      tag: 'test-notification',
      data: { type: 'test' }
    })
  }
}

export const pushNotificationManager = PushNotificationManager.getInstance()

// Hook React pour les notifications
export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const manager = pushNotificationManager
    
    setIsSupported(manager.isSupported())
    setPermission(manager.isPermissionGranted() ? 'granted' : 'default')
    setIsInitialized(true)
  }, [])

  const requestPermission = async (): Promise<boolean> => {
    const granted = await pushNotificationManager.requestPermission()
    setPermission(granted ? 'granted' : 'denied')
    return granted
  }

  const sendNotification = async (data: PushNotificationData): Promise<boolean> => {
    return pushNotificationManager.sendNotification(data)
  }

  const sendOrderNotification = async (orderData: any, storeData: any): Promise<boolean> => {
    return pushNotificationManager.sendOrderNotification(orderData, storeData)
  }

  const sendTestNotification = async (): Promise<boolean> => {
    return pushNotificationManager.sendTestNotification()
  }

  return {
    isSupported,
    permission,
    isInitialized,
    requestPermission,
    sendNotification,
    sendOrderNotification,
    sendTestNotification
  }
} 