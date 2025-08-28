import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useStores } from '@/hooks/useStores'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { useSearchParams } from 'react-router-dom'
import DashboardLayout from '@/components/DashboardLayout'
import MailchimpInstallButton from '@/components/integrations/MailchimpInstallButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mailchimpService, MailchimpAnalytics } from '@/services/mailchimpService'
import { 
  CheckCircle, 
  AlertCircle, 
  Settings, 
  Loader2,
  Users,
  BarChart3,
  RefreshCw
} from 'lucide-react'

interface OAuthIntegration {
  id: string
  user_id: string
  store_id: string
  provider: string
  access_token: string
  refresh_token?: string
  token_expires_at: string
  provider_user_id?: string
  provider_account_id?: string
  metadata?: {
    account_name?: string
    dc?: string
    api_endpoint?: string
  }
  is_active: boolean
  created_at: string
  updated_at: string
}

const MailchimpIntegration = () => {
  const { user } = useAuth()
  const { store } = useStores()
  const { toast } = useToast()
  const [integration, setIntegration] = useState<OAuthIntegration | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [analytics, setAnalytics] = useState<MailchimpAnalytics>({
    subscribers: 0,
    open_rate: 0,
    click_rate: 0,
    campaigns: 0
  })
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false)
  const [searchParams] = useSearchParams()

  // Vérifier si l'intégration est installée
  useEffect(() => {
    const checkIntegration = async () => {
      if (!user || !store) {
        setIsLoading(false)
        return
      }

      try {
        console.log('🔍 Vérification intégration Mailchimp...')
        
        const { data, error } = await supabase
          .from('oauth_integrations')
          .select('*')
          .eq('user_id', user.id)
          .eq('store_id', store.id)
          .eq('provider', 'mailchimp')
          .eq('is_active', true)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('❌ Erreur vérification intégration:', error)
        }

        if (data) {
          console.log('✅ Intégration Mailchimp trouvée:', data.metadata?.account_name)
          setIntegration(data)
          
          // Charger les analytics si l'intégration est active
          if (user && store) {
            loadAnalytics()
          }
        } else {
          console.log('ℹ️ Aucune intégration Mailchimp trouvée')
        }
      } catch (error) {
        console.error('❌ Erreur vérification intégration:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkIntegration()
  }, [user, store])

  // Fonction pour charger les analytics
  const loadAnalytics = async () => {
    if (!user || !store) return

    try {
      setIsLoadingAnalytics(true)
      const analyticsData = await mailchimpService.getAnalytics(user.id, store.id)
      setAnalytics(analyticsData)
    } catch (error) {
      console.error('❌ Erreur chargement analytics:', error)
    } finally {
      setIsLoadingAnalytics(false)
    }
  }

  // Gérer les paramètres de succès/erreur
  useEffect(() => {
    const success = searchParams.get('success')
    const error = searchParams.get('error')
    const account = searchParams.get('account')

    if (success === 'true') {
      toast({
        title: "Installation réussie !",
        description: account ? `Mailchimp connecté avec le compte ${account}` : "Mailchimp a été installé avec succès",
      })
      // Recharger la page pour afficher l'état installé
      window.location.reload()
    }

    if (error) {
      toast({
        title: "Erreur d'installation",
        description: "Impossible d'installer Mailchimp. Veuillez réessayer.",
        variant: "destructive"
      })
    }
  }, [searchParams, toast])

  const handleUninstall = async () => {
    if (!integration) return

    try {
      const { error } = await supabase
        .from('oauth_integrations')
        .update({ is_active: false })
        .eq('id', integration.id)

      if (error) throw error

      setIntegration(null)
      toast({
        title: "Désinstallation réussie",
        description: "Mailchimp a été désinstallé de votre boutique"
      })
    } catch (error) {
      console.error('❌ Erreur désinstallation:', error)
      toast({
        title: "Erreur",
        description: "Impossible de désinstaller Mailchimp",
        variant: "destructive"
      })
    }
  }



  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <img src="/mailchimp-logo.svg" alt="Mailchimp" className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <img src="/mailchimp-logo.svg" alt="Mailchimp" className="h-8 w-8" />
              Intégration Mailchimp
            </h1>
            <p className="text-muted-foreground">
              Connectez votre boutique à Mailchimp pour l'email marketing
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Vérification de l'installation...</p>
          </div>
        ) : integration ? (
          // Intégration installée
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <img src="/mailchimp-logo.svg" alt="Mailchimp" className="h-5 w-5" />
                    Mailchimp installé
                  </CardTitle>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Actif
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Compte Mailchimp</p>
                    <p className="text-sm font-semibold">
                      {integration.metadata?.account_name || 'Compte inconnu'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Installé le</p>
                    <p className="text-sm font-semibold">
                      {new Date(integration.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data Center</p>
                    <p className="text-sm font-semibold">
                      {integration.metadata?.dc || 'Non spécifié'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Dernière mise à jour</p>
                    <p className="text-sm font-semibold">
                      {new Date(integration.updated_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                                        <Button 
                        onClick={() => window.open('https://mailchimp.com', '_blank')}
                        className="bg-orange-600 hover:bg-orange-700 text-white flex-1"
                      >
                        <img src="/mailchimp-logo.svg" alt="Mailchimp" className="h-4 w-4 mr-2" />
                        Ouvrir Mailchimp
                      </Button>
                      <Button 
                        onClick={() => window.open('/integrations/mailchimp/dashboard', '_blank')}
                        variant="outline"
                        className="flex-1"
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Tableau de bord
                      </Button>

                  <Button variant="outline" onClick={handleUninstall}>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Désinstaller
                  </Button>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Section Analytics */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <img src="/mailchimp-logo.svg" alt="Mailchimp" className="h-5 w-5" />
                    Analytics Mailchimp
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={loadAnalytics}
                    disabled={isLoadingAnalytics}
                  >
                    {isLoadingAnalytics ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Actualiser
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {isLoadingAnalytics ? (
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      ) : (
                        analytics.subscribers.toLocaleString()
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Abonnés</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {isLoadingAnalytics ? (
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      ) : (
                        `${(analytics.open_rate * 100).toFixed(1)}%`
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Taux d'ouverture</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {isLoadingAnalytics ? (
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      ) : (
                        `${(analytics.click_rate * 100).toFixed(1)}%`
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Taux de clic</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {isLoadingAnalytics ? (
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      ) : (
                        analytics.campaigns
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Campagnes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Intégration non installée
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Installer Mailchimp</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <img src="/mailchimp-logo.svg" alt="Mailchimp" className="h-5 w-5 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Email marketing professionnel</h3>
                      <p className="text-sm text-muted-foreground">
                        Créez des campagnes d'email automatisées pour vos clients
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Synchronisation automatique</h3>
                      <p className="text-sm text-muted-foreground">
                        Vos clients sont automatiquement ajoutés à vos listes Mailchimp
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Sécurisé avec OAuth</h3>
                      <p className="text-sm text-muted-foreground">
                        Connexion sécurisée sans partage de clés API
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Analytics avancés</h3>
                      <p className="text-sm text-muted-foreground">
                        Suivez les performances de vos campagnes email
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <MailchimpInstallButton />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default MailchimpIntegration
