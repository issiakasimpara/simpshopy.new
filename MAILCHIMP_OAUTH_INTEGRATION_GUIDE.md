# 🔐 GUIDE D'INTÉGRATION OAUTH MAILCHIMP DANS SIMPSHOPY

## 🎯 **POURQUOI OAUTH ET NON PAS API KEY ?**

### **❌ Problème avec l'approche API Key :**
- **Sécurité** : Les créateurs doivent partager leurs clés API
- **Complexité** : Configuration manuelle difficile
- **Erreurs** : Beaucoup d'échecs d'installation
- **Support** : Charge de support élevée

### **✅ Avantages de l'approche OAuth (comme Shopify) :**
- **Sécurité** : Pas de partage de clés sensibles
- **Simplicité** : Un clic pour installer
- **Fiabilité** : Taux de succès élevé
- **Expérience** : UX fluide et professionnelle

---

## 🏗️ **ARCHITECTURE OAUTH MAILCHIMP**

### **1. Flux d'installation OAuth**
```
Créateur → Dashboard → Intégrations → Mailchimp → "Installer" → 
Redirection Mailchimp → Autorisation → Callback → Installation réussie
```

### **2. Composants techniques**
- **Frontend** : Bouton "Installer" avec redirection OAuth
- **Backend** : Edge Functions pour gérer OAuth
- **Base de données** : Stockage des tokens OAuth
- **Mailchimp OAuth** : API d'autorisation Mailchimp

---

## 🔧 **IMPLÉMENTATION TECHNIQUE**

### **Étape 1 : Configuration Mailchimp OAuth**

#### **1. Créer une app Mailchimp**
1. Aller sur https://developer.mailchimp.com/
2. Créer un compte développeur
3. Créer une nouvelle app
4. Configurer les URLs OAuth :
   - **Redirect URI** : `https://simpshopy.com/api/oauth/mailchimp/callback`
   - **Scopes** : `read_write` (accès complet)

#### **2. Variables d'environnement**
```bash
# Dans Supabase Dashboard → Settings → Environment Variables
MAILCHIMP_CLIENT_ID=votre_client_id
MAILCHIMP_CLIENT_SECRET=votre_client_secret
MAILCHIMP_OAUTH_URL=https://login.mailchimp.com/oauth2/authorize
MAILCHIMP_TOKEN_URL=https://login.mailchimp.com/oauth2/token
MAILCHIMP_API_URL=https://us1.api.mailchimp.com/3.0
```

### **Étape 2 : Base de données**

#### **Table `oauth_integrations`**
```sql
CREATE TABLE oauth_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- 'mailchimp', 'stripe', etc.
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  provider_user_id TEXT, -- ID utilisateur chez le provider
  provider_account_id TEXT, -- ID compte chez le provider
  metadata JSONB, -- Données supplémentaires (audience_id, etc.)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_oauth_user_id ON oauth_integrations(user_id);
CREATE INDEX idx_oauth_store_id ON oauth_integrations(store_id);
CREATE INDEX idx_oauth_provider ON oauth_integrations(provider);
CREATE INDEX idx_oauth_active ON oauth_integrations(is_active);
```

#### **Table `oauth_sync_logs`**
```sql
CREATE TABLE oauth_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID REFERENCES oauth_integrations(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'customer_synced', 'campaign_sent', 'token_refreshed'
  status TEXT NOT NULL, -- 'success', 'error', 'pending'
  data JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Étape 3 : Edge Functions OAuth**

#### **`supabase/functions/oauth/mailchimp/authorize/index.ts`**
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('user_id')
    const storeId = searchParams.get('store_id')
    const returnUrl = searchParams.get('return_url')

    if (!userId || !storeId) {
      return new Response(
        JSON.stringify({ error: 'Paramètres manquants' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Générer l'URL d'autorisation Mailchimp
    const clientId = Deno.env.get('MAILCHIMP_CLIENT_ID')
    const redirectUri = `${Deno.env.get('SITE_URL')}/api/oauth/mailchimp/callback`
    
    const authUrl = new URL('https://login.mailchimp.com/oauth2/authorize')
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('client_id', clientId!)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('scope', 'read_write')
    authUrl.searchParams.set('state', JSON.stringify({ userId, storeId, returnUrl }))

    return new Response(
      JSON.stringify({ 
        auth_url: authUrl.toString(),
        message: 'Redirection vers Mailchimp...'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('❌ Erreur autorisation:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Erreur lors de l\'autorisation',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

#### **`supabase/functions/oauth/mailchimp/callback/index.ts`**
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code || !state) {
      return new Response(
        JSON.stringify({ error: 'Code ou state manquant' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { userId, storeId, returnUrl } = JSON.parse(state)

    // Échanger le code contre un token
    const tokenResponse = await fetch('https://login.mailchimp.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: Deno.env.get('MAILCHIMP_CLIENT_ID')!,
        client_secret: Deno.env.get('MAILCHIMP_CLIENT_SECRET')!,
        code: code,
        redirect_uri: `${Deno.env.get('SITE_URL')}/api/oauth/mailchimp/callback`
      })
    })

    if (!tokenResponse.ok) {
      throw new Error(`Erreur token: ${tokenResponse.status}`)
    }

    const tokenData = await tokenResponse.json()

    // Récupérer les informations du compte Mailchimp
    const accountResponse = await fetch('https://us1.api.mailchimp.com/3.0/', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    })

    if (!accountResponse.ok) {
      throw new Error(`Erreur compte: ${accountResponse.status}`)
    }

    const accountData = await accountResponse.json()

    // Sauvegarder l'intégration dans la base de données
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: insertError } = await supabaseClient
      .from('oauth_integrations')
      .insert({
        user_id: userId,
        store_id: storeId,
        provider: 'mailchimp',
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        token_expires_at: new Date(Date.now() + tokenData.expires_in * 1000),
        provider_user_id: accountData.user_id,
        provider_account_id: accountData.account_id,
        metadata: {
          account_name: accountData.account_name,
          dc: accountData.dc, // Data center
          api_endpoint: accountData.api_endpoint
        }
      })

    if (insertError) {
      throw insertError
    }

    // Rediriger vers le dashboard avec succès
    const successUrl = returnUrl || '/dashboard/integrations?success=mailchimp'
    
    return new Response(null, {
      status: 302,
      headers: {
        'Location': successUrl,
        ...corsHeaders
      }
    })

  } catch (error) {
    console.error('❌ Erreur callback:', error)
    
    // Rediriger vers le dashboard avec erreur
    const errorUrl = '/dashboard/integrations?error=mailchimp_oauth_failed'
    
    return new Response(null, {
      status: 302,
      headers: {
        'Location': errorUrl,
        ...corsHeaders
      }
    })
  }
})
```

### **Étape 4 : Interface utilisateur**

#### **Composant d'installation Mailchimp**
```typescript
// src/components/integrations/MailchimpInstallButton.tsx
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useStores } from '@/hooks/useStores'
import { useToast } from '@/hooks/use-toast'

interface MailchimpInstallButtonProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

const MailchimpInstallButton: React.FC<MailchimpInstallButtonProps> = ({
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { store } = useStores()
  const { toast } = useToast()

  const handleInstall = async () => {
    if (!user || !store) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté et avoir une boutique",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      // Appeler l'Edge Function pour obtenir l'URL d'autorisation
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/oauth/mailchimp/authorize?` +
        `user_id=${user.id}&store_id=${store.id}&return_url=${encodeURIComponent(window.location.href)}`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error('Erreur lors de l\'autorisation')
      }

      const { auth_url } = await response.json()

      // Rediriger vers Mailchimp pour l'autorisation
      window.location.href = auth_url

    } catch (error) {
      console.error('❌ Erreur installation:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      
      toast({
        title: "Erreur d'installation",
        description: errorMessage,
        variant: "destructive"
      })
      
      onError?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleInstall}
      disabled={isLoading}
      className="bg-orange-600 hover:bg-orange-700 text-white"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Installation...
        </>
      ) : (
        <>
          <Mail className="h-4 w-4 mr-2" />
          Installer Mailchimp
        </>
      )}
    </Button>
  )
}

export default MailchimpInstallButton
```

#### **Page d'intégration Mailchimp**
```typescript
// src/pages/integrations/MailchimpIntegration.tsx
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useStores } from '@/hooks/useStores'
import { useToast } from '@/hooks/use-toast'
import DashboardLayout from '@/components/DashboardLayout'
import MailchimpInstallButton from '@/components/integrations/MailchimpInstallButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Mail, CheckCircle, AlertCircle, Settings } from 'lucide-react'

const MailchimpIntegration = () => {
  const { user } = useAuth()
  const { store } = useStores()
  const { toast } = useToast()
  const [integration, setIntegration] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Vérifier si l'intégration est installée
  useEffect(() => {
    const checkIntegration = async () => {
      if (!user || !store) return

      try {
        const { data, error } = await supabase
          .from('oauth_integrations')
          .select('*')
          .eq('user_id', user.id)
          .eq('store_id', store.id)
          .eq('provider', 'mailchimp')
          .eq('is_active', true)
          .single()

        if (!error && data) {
          setIntegration(data)
        }
      } catch (error) {
        console.error('Erreur vérification intégration:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkIntegration()
  }, [user, store])

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
      toast({
        title: "Erreur",
        description: "Impossible de désinstaller Mailchimp",
        variant: "destructive"
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex items-center gap-4 mb-8">
          <img src="/mailchimp.png" alt="Mailchimp" className="w-12 h-12" />
          <div>
            <h1 className="text-3xl font-bold">Intégration Mailchimp</h1>
            <p className="text-muted-foreground">
              Connectez votre boutique à Mailchimp pour l'email marketing
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Vérification de l'installation...</p>
          </div>
        ) : integration ? (
          // Intégration installée
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Mailchimp installé
                  </CardTitle>
                  <Badge variant="secondary">Actif</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Compte Mailchimp</p>
                    <p className="text-sm text-muted-foreground">
                      {integration.metadata?.account_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Installé le</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(integration.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <Button variant="outline" onClick={handleUninstall}>
                    Désinstaller
                  </Button>
                  <Button>
                    <Settings className="h-4 w-4 mr-2" />
                    Configurer
                  </Button>
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
                    <Mail className="h-5 w-5 text-orange-600 mt-0.5" />
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
```

---

## 🚀 **FONCTIONNALITÉS AVANCÉES**

### **1. 🔄 Refresh automatique des tokens**
```typescript
// Fonction pour rafraîchir les tokens expirés
async function refreshMailchimpToken(integrationId: string) {
  const { data: integration } = await supabase
    .from('oauth_integrations')
    .select('*')
    .eq('id', integrationId)
    .single()

  if (!integration || !integration.refresh_token) {
    throw new Error('Token de rafraîchissement manquant')
  }

  const response = await fetch('https://login.mailchimp.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: Deno.env.get('MAILCHIMP_CLIENT_ID')!,
      client_secret: Deno.env.get('MAILCHIMP_CLIENT_SECRET')!,
      refresh_token: integration.refresh_token
    })
  })

  if (!response.ok) {
    throw new Error('Erreur rafraîchissement token')
  }

  const tokenData = await response.json()

  // Mettre à jour le token dans la base de données
  await supabase
    .from('oauth_integrations')
    .update({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      token_expires_at: new Date(Date.now() + tokenData.expires_in * 1000)
    })
    .eq('id', integrationId)

  return tokenData.access_token
}
```

### **2. 📊 Analytics d'intégration**
```typescript
// Dashboard avec métriques Mailchimp
const MailchimpAnalytics = () => {
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    openRate: 0,
    clickRate: 0,
    revenueGenerated: 0
  })

  useEffect(() => {
    const fetchMailchimpStats = async () => {
      // Appeler l'API Mailchimp pour récupérer les statistiques
      const response = await fetch('/api/mailchimp/stats')
      const data = await response.json()
      setStats(data)
    }

    fetchMailchimpStats()
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSubscribers}</div>
          <p className="text-sm text-muted-foreground">Abonnés</p>
        </CardContent>
      </Card>
      {/* Autres métriques... */}
    </div>
  )
}
```

---

## 💰 **MODÈLE ÉCONOMIQUE**

### **Options de monétisation :**

#### **1. Commission Mailchimp**
- **SimpShopy** : 10-15% de commission sur les abonnements
- **Mailchimp** : Programme de partenariat
- **Créateur** : Prix normal Mailchimp

#### **2. Plan premium SimpShopy**
- **Gratuit** : Intégration basique
- **Premium** : Automatisations avancées (10€/mois)
- **Pro** : Analytics détaillés (25€/mois)

---

## 🧪 **PLAN DE DÉPLOIEMENT**

### **Phase 1 : MVP OAuth (2 semaines)**
- ✅ Configuration OAuth Mailchimp
- ✅ Edge Functions d'autorisation
- ✅ Interface d'installation
- ✅ Gestion des tokens

### **Phase 2 : Synchronisation (2 semaines)**
- ✅ Sync automatique clients
- ✅ Gestion des audiences
- ✅ Logs de synchronisation

### **Phase 3 : Automatisations (2 semaines)**
- ✅ Emails de bienvenue
- ✅ Relances paniers abandonnés
- ✅ Campagnes de fidélisation

---

## 🎯 **AVANTAGES CONCURRENTIELS**

### **SimpShopy OAuth vs Concurrents :**
- ✅ **Installation en 1 clic** vs Configuration manuelle
- ✅ **Sécurité OAuth** vs Partage de clés API
- ✅ **Expérience fluide** vs Processus complexe
- ✅ **Support réduit** vs Charge de support élevée

**💡 Cette approche OAuth transforme SimpShopy en plateforme d'intégrations professionnelle !**
