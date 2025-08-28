/**
 * Service Worker pour Simpshopy
 * Gestion des notifications push et cache
 */

const CACHE_NAME = 'simpshopy-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/logo-simpshopy.png'
]

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('🔔 Service Worker: Installation...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('🔔 Service Worker: Cache ouvert')
        return cache.addAll(urlsToCache)
      })
      .then(() => {
        console.log('🔔 Service Worker: Installation terminée')
        return self.skipWaiting()
      })
  )
})

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('🔔 Service Worker: Activation...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🔔 Service Worker: Suppression de l\'ancien cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('🔔 Service Worker: Activation terminée')
      return self.clients.claim()
    })
  )
})

// Interception des requêtes réseau
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourner la réponse du cache si elle existe
        if (response) {
          return response
        }
        
        // Sinon, faire la requête réseau
        return fetch(event.request)
          .then((response) => {
            // Ne pas mettre en cache les requêtes non-GET
            if (event.request.method !== 'GET') {
              return response
            }
            
            // Vérifier si la réponse est valide
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }
            
            // Cloner la réponse pour la mettre en cache
            const responseToCache = response.clone()
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache)
              })
            
            return response
          })
      })
  )
})

// Gestion des notifications push
self.addEventListener('push', (event) => {
  console.log('🔔 Service Worker: Notification push reçue')
  
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body || 'Nouvelle notification',
      icon: data.icon || '/logo-simpshopy.png',
      badge: data.badge || '/logo-simpshopy.png',
      tag: data.tag || 'default',
      data: data.data || {},
      actions: data.actions || [],
      requireInteraction: false,
      silent: false,
      vibrate: [200, 100, 200]
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Simpshopy', options)
    )
  }
})

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Service Worker: Clic sur notification:', event.notification.tag)
  
  event.notification.close()
  
  if (event.action === 'view_order') {
    // Ouvrir la page de la commande
    const orderId = event.notification.data?.orderId
    if (orderId) {
      event.waitUntil(
        clients.openWindow(`/orders?orderId=${orderId}`)
      )
    }
  } else if (event.action === 'dismiss') {
    // Fermer la notification
    event.notification.close()
  } else {
    // Clic sur la notification principale
    const data = event.notification.data
    if (data?.type === 'new_order' && data?.orderId) {
      // Rediriger vers la page des commandes pour l'admin
      event.waitUntil(
        clients.openWindow(`/orders?orderId=${data.orderId}`)
      )
    } else if (data?.type === 'order_confirmation' && data?.orderId) {
      // Rediriger vers la page de suivi pour le client
      event.waitUntil(
        clients.openWindow(`/orders?orderId=${data.orderId}`)
      )
    } else {
      // Rediriger vers la page d'accueil
      event.waitUntil(
        clients.openWindow('/')
      )
    }
  }
})

// Gestion des actions sur les notifications
self.addEventListener('notificationclose', (event) => {
  console.log('🔔 Service Worker: Notification fermée:', event.notification.tag)
})

// Gestion des messages du client
self.addEventListener('message', (event) => {
  console.log('🔔 Service Worker: Message reçu:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Gestion des erreurs
self.addEventListener('error', (event) => {
  console.error('🔔 Service Worker: Erreur:', event.error)
})

// Gestion des rejets de promesses non gérés
self.addEventListener('unhandledrejection', (event) => {
  console.error('🔔 Service Worker: Promesse rejetée:', event.reason)
}) 