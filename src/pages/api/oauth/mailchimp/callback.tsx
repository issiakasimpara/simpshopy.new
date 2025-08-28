import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

const MailchimpCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🔄 Traitement du callback Mailchimp...')
        
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')
        
        console.log('📋 Paramètres callback:', { code: !!code, state: !!state, error })
        
        if (error) {
          console.error('❌ Erreur OAuth:', error)
          navigate('/integrations/mailchimp?error=oauth_denied')
          return
        }
        
        if (!code || !state) {
          console.error('❌ Code ou state manquant')
          navigate('/integrations/mailchimp?error=oauth_invalid')
          return
        }
        
        // Appeler l'Edge Function via le frontend (proxy)
        console.log('🔄 Appel de l\'Edge Function via proxy...')
        
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mailchimp-callback`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            code,
            state,
            method: 'GET' // Simuler un appel GET
          })
        })
        
        if (response.ok) {
          const result = await response.json()
          console.log('✅ Callback traité avec succès:', result)
          
          // Rediriger vers la page d'intégration avec succès
          navigate('/integrations/mailchimp?success=true')
        } else {
          const errorData = await response.json()
          console.error('❌ Erreur callback:', errorData)
          navigate('/integrations/mailchimp?error=callback_failed')
        }
        
      } catch (error) {
        console.error('❌ Erreur traitement callback:', error)
        navigate('/integrations/mailchimp?error=callback_failed')
      }
    }
    
    handleCallback()
  }, [searchParams, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Connexion à Mailchimp...</h2>
        <p className="text-muted-foreground">Veuillez patienter pendant que nous finalisons votre installation.</p>
      </div>
    </div>
  )
}

export default MailchimpCallback
