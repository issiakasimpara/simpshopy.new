import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell, BellOff, Settings, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { usePushNotifications } from '@/utils/pushNotifications'
import { useToast } from '@/hooks/use-toast'

interface NotificationManagerProps {
  className?: string
}

const NotificationManager: React.FC<NotificationManagerProps> = ({ className }) => {
  const {
    isSupported,
    permission,
    isInitialized,
    requestPermission,
    sendTestNotification
  } = usePushNotifications()

  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)

  const handleRequestPermission = async () => {
    setIsLoading(true)
    try {
      const granted = await requestPermission()
      if (granted) {
        toast({
          title: "✅ Notifications activées",
          description: "Vous recevrez maintenant des notifications pour les nouvelles commandes.",
        })
      } else {
        toast({
          title: "❌ Permission refusée",
          description: "Les notifications ne peuvent pas être activées sans votre permission.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Impossible d'activer les notifications.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestNotification = async () => {
    setIsLoading(true)
    setTestResult(null)
    
    try {
      const success = await sendTestNotification()
      if (success) {
        setTestResult('success')
        toast({
          title: "🧪 Test réussi",
          description: "La notification de test a été envoyée avec succès.",
        })
      } else {
        setTestResult('error')
        toast({
          title: "❌ Test échoué",
          description: "Impossible d'envoyer la notification de test.",
          variant: "destructive"
        })
      }
    } catch (error) {
      setTestResult('error')
      toast({
        title: "❌ Erreur",
        description: "Erreur lors du test de notification.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getPermissionStatus = () => {
    switch (permission) {
      case 'granted':
        return {
          status: 'success',
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          text: 'Activées',
          color: 'bg-green-100 text-green-800'
        }
      case 'denied':
        return {
          status: 'error',
          icon: <XCircle className="h-4 w-4 text-red-500" />,
          text: 'Refusées',
          color: 'bg-red-100 text-red-800'
        }
      default:
        return {
          status: 'warning',
          icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
          text: 'En attente',
          color: 'bg-yellow-100 text-yellow-800'
        }
    }
  }

  const permissionInfo = getPermissionStatus()

  if (!isInitialized) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-muted-foreground">Chargement...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Notifications Push</CardTitle>
          </div>
          <Badge className={permissionInfo.color}>
            <div className="flex items-center space-x-1">
              {permissionInfo.icon}
              <span>{permissionInfo.text}</span>
            </div>
          </Badge>
        </div>
        <CardDescription>
          Recevez des notifications instantanées pour les nouvelles commandes
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isSupported ? (
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <BellOff className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Les notifications push ne sont pas supportées par votre navigateur
            </span>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Statut des notifications</span>
                </div>
                <span className="text-sm text-blue-600">
                  {permission === 'granted' ? 'Activées' : 
                   permission === 'denied' ? 'Refusées' : 'En attente'}
                </span>
              </div>

              {permission === 'default' && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800">
                        Autorisation requise
                      </p>
                      <p className="text-yellow-700 mt-1">
                        Cliquez sur "Activer les notifications" pour recevoir des alertes en temps réel.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {permission === 'denied' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-red-800">
                        Notifications bloquées
                      </p>
                      <p className="text-red-700 mt-1">
                        Vous devez autoriser les notifications dans les paramètres de votre navigateur.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {permission === 'granted' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-green-800">
                        Notifications activées
                      </p>
                      <p className="text-green-700 mt-1">
                        Vous recevrez des notifications pour toutes les nouvelles commandes.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              {permission === 'default' && (
                <Button 
                  onClick={handleRequestPermission}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Activation...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4" />
                      <span>Activer les notifications</span>
                    </div>
                  )}
                </Button>
              )}

              {permission === 'granted' && (
                <Button 
                  onClick={handleTestNotification}
                  disabled={isLoading}
                  variant="outline"
                  className="flex-1"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span>Test...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4" />
                      <span>Test de notification</span>
                    </div>
                  )}
                </Button>
              )}

              {permission === 'denied' && (
                <Button 
                  onClick={() => {
                    toast({
                      title: "🔧 Instructions",
                      description: "Ouvrez les paramètres de votre navigateur et autorisez les notifications pour ce site.",
                    })
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  <div className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Comment activer</span>
                  </div>
                </Button>
              )}
            </div>

            {testResult && (
              <div className={`p-3 rounded-lg ${
                testResult === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center space-x-2">
                  {testResult === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    testResult === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {testResult === 'success' 
                      ? 'Test réussi ! Vérifiez votre notification.' 
                      : 'Test échoué. Vérifiez les permissions.'
                    }
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Types de notifications</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Nouvelles commandes (admin)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Confirmation de commande (client)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Mises à jour de statut</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default NotificationManager 