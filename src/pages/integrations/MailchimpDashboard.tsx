import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useStores } from '@/hooks/useStores'
import { useToast } from '@/hooks/use-toast'
import { mailchimpService } from '@/services/mailchimpService'
import { supabase } from '@/integrations/supabase/client'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Mail, 
  BarChart3, 
  ExternalLink, 
  RefreshCw, 
  Loader2,
  TrendingUp,
  Eye,
  MousePointer
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

const MailchimpDashboard = () => {
  const { user } = useAuth()
  const { store } = useStores()
  const { toast } = useToast()
  const [integration, setIntegration] = useState<OAuthIntegration | null>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [recentCampaigns, setRecentCampaigns] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Récupérer l'intégration Mailchimp
  useEffect(() => {
    const loadIntegration = async () => {
      if (!user || !store) {
        setIsLoading(false)
        return
      }

      try {
        console.log('🔍 Chargement intégration Mailchimp...')
        
        const { data, error } = await supabase
          .from('oauth_integrations')
          .select('*')
          .eq('user_id', user.id)
          .eq('store_id', store.id)
          .eq('provider', 'mailchimp')
          .eq('is_active', true)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('❌ Erreur chargement intégration:', error)
          toast({
            title: "Erreur",
            description: "Impossible de charger l'intégration Mailchimp",
            variant: "destructive"
          })
          return
        }

        if (data) {
          console.log('✅ Intégration Mailchimp trouvée:', data.metadata?.account_name)
          setIntegration(data)
          // Charger les analytics
          await loadAnalytics()
        } else {
          console.log('ℹ️ Aucune intégration Mailchimp trouvée')
          toast({
            title: "Aucune intégration",
            description: "Aucune intégration Mailchimp active trouvée",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error('❌ Erreur chargement intégration:', error)
        toast({
          title: "Erreur",
          description: "Impossible de charger l'intégration Mailchimp",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadIntegration()
  }, [user, store, toast])

  const loadAnalytics = async () => {
    if (!user || !store || !integration) return

    try {
      const data = await mailchimpService.getAnalytics(user.id, store.id)
      setAnalytics(data)
      
      // Si les analytics contiennent des campagnes, les utiliser
      if (data.campaigns && Array.isArray(data.campaigns)) {
        setRecentCampaigns(data.campaigns.slice(0, 5)) // Limiter à 5 campagnes récentes
      }
    } catch (error) {
      console.error('Erreur chargement analytics:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les analytics Mailchimp",
        variant: "destructive"
      })
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadAnalytics()
    setIsRefreshing(false)
    toast({
      title: "Actualisé",
      description: "Les données Mailchimp ont été actualisées"
    })
  }

  const openMailchimp = () => {
    window.open('https://mailchimp.com', '_blank')
  }

  const openMailchimpCampaigns = () => {
    // Utiliser le data center spécifique si disponible
    const dataCenter = integration?.metadata?.dc || 'us1'
    window.open(`https://${dataCenter}.admin.mailchimp.com/campaigns/`, '_blank')
  }

  const openMailchimpAudience = () => {
    const dataCenter = integration?.metadata?.dc || 'us1'
    window.open(`https://${dataCenter}.admin.mailchimp.com/lists/`, '_blank')
  }

  const openMailchimpReports = () => {
    const dataCenter = integration?.metadata?.dc || 'us1'
    window.open(`https://${dataCenter}.admin.mailchimp.com/reports/`, '_blank')
  }

  const openMailchimpAutomation = () => {
    const dataCenter = integration?.metadata?.dc || 'us1'
    window.open(`https://${dataCenter}.admin.mailchimp.com/automation/`, '_blank')
  }

  const openMailchimpTemplates = () => {
    const dataCenter = integration?.metadata?.dc || 'us1'
    window.open(`https://${dataCenter}.admin.mailchimp.com/templates/`, '_blank')
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Chargement des données Mailchimp...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!integration) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <img src="/mailchimp-logo.svg" alt="Mailchimp" className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Aucune intégration Mailchimp</h2>
            <p className="text-muted-foreground mb-4">
              Vous devez d'abord installer Mailchimp pour accéder au tableau de bord.
            </p>
            <Button onClick={() => window.location.href = '/integrations/mailchimp'}>
              Installer Mailchimp
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <img src="/mailchimp-logo.svg" alt="Mailchimp" className="h-8 w-8" />
              Tableau de bord Mailchimp
            </h1>
            <p className="text-muted-foreground mt-2">
              Gérez vos campagnes email et suivez vos performances
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Actualiser
            </Button>
            <Button onClick={openMailchimp}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Ouvrir Mailchimp
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Abonnés</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.subscribers?.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                Total des abonnés
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux d'ouverture</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.open_rate ? `${(analytics.open_rate * 100).toFixed(1)}%` : '0%'}
              </div>
              <p className="text-xs text-muted-foreground">
                Moyenne des campagnes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de clic</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.click_rate ? `${(analytics.click_rate * 100).toFixed(1)}%` : '0%'}
              </div>
              <p className="text-xs text-muted-foreground">
                Moyenne des campagnes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Campagnes</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.campaigns || '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                Total des campagnes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <img src="/mailchimp-logo.svg" alt="Mailchimp" className="h-5 w-5" />
              Informations du compte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Compte</p>
                <p className="text-lg">{integration.metadata?.account_name || 'Compte Mailchimp'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data Center</p>
                <Badge variant="secondary">{integration.metadata?.dc || 'us1'}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Statut</p>
                <Badge variant="default" className="bg-green-600">Actif</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

                 {/* Quick Actions */}
         <Card>
           <CardHeader>
             <CardTitle>Actions rapides</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               <Button variant="outline" className="h-20 flex-col" onClick={openMailchimpCampaigns}>
                 <Mail className="h-6 w-6 mb-2" />
                 <span>Créer une campagne</span>
               </Button>
               <Button variant="outline" className="h-20 flex-col" onClick={openMailchimpAudience}>
                 <Users className="h-6 w-6 mb-2" />
                 <span>Gérer les abonnés</span>
               </Button>
               <Button variant="outline" className="h-20 flex-col" onClick={openMailchimpReports}>
                 <BarChart3 className="h-6 w-6 mb-2" />
                 <span>Voir les rapports</span>
               </Button>
               <Button variant="outline" className="h-20 flex-col" onClick={openMailchimpAutomation}>
                 <TrendingUp className="h-6 w-6 mb-2" />
                 <span>Automatisation</span>
               </Button>
               <Button variant="outline" className="h-20 flex-col" onClick={openMailchimpTemplates}>
                 <Mail className="h-6 w-6 mb-2" />
                 <span>Modèles d'email</span>
               </Button>
               <Button variant="outline" className="h-20 flex-col" onClick={openMailchimp}>
                 <ExternalLink className="h-6 w-6 mb-2" />
                 <span>Dashboard Mailchimp</span>
               </Button>
             </div>
           </CardContent>
         </Card>

         {/* Campagnes récentes */}
         {recentCampaigns.length > 0 && (
           <Card>
             <CardHeader>
               <div className="flex items-center justify-between">
                 <CardTitle>Campagnes récentes</CardTitle>
                 <Button variant="outline" size="sm" onClick={openMailchimpCampaigns}>
                   Voir toutes
                 </Button>
               </div>
             </CardHeader>
             <CardContent>
               <div className="space-y-3">
                 {recentCampaigns.map((campaign, index) => (
                   <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                     <div className="flex items-center gap-3">
                       <Mail className="h-5 w-5 text-muted-foreground" />
                       <div>
                         <p className="font-medium">{campaign.title || `Campagne ${index + 1}`}</p>
                         <p className="text-sm text-muted-foreground">
                           {campaign.status || 'En cours'}
                         </p>
                       </div>
                     </div>
                     <div className="text-right">
                       <p className="text-sm font-medium">
                         {campaign.stats?.opens || 0} ouvertures
                       </p>
                       <p className="text-xs text-muted-foreground">
                         {campaign.stats?.clicks || 0} clics
                       </p>
                     </div>
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>
         )}
      </div>
    </DashboardLayout>
  )
}

export default MailchimpDashboard
