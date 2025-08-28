import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useStores } from '@/hooks/useStores'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface MailchimpInstallButtonProps {
  onSuccess?: () => void
  onError?: (error: string) => void
  className?: string
}

const MailchimpInstallButton: React.FC<MailchimpInstallButtonProps> = ({
  onSuccess,
  onError,
  className = ""
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
      console.log('🚀 Démarrage installation Mailchimp...')
      
      // Appeler l'Edge Function pour obtenir l'URL d'autorisation
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mailchimp-authorize?` +
        `user_id=${user.id}&store_id=${store.id}&return_url=${encodeURIComponent(window.location.href)}`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de l\'autorisation')
      }

      const { auth_url } = await response.json()

      console.log('🔐 Redirection vers Mailchimp:', auth_url)

      // Rediriger vers Mailchimp pour l'autorisation
      window.location.href = auth_url

    } catch (error) {
      console.error('❌ Erreur installation Mailchimp:', error)
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
      className={`bg-orange-600 hover:bg-orange-700 text-white ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Installation...
        </>
             ) : (
         <>
           <img src="/mailchimp-logo.svg" alt="Mailchimp" className="h-4 w-4 mr-2" />
           Installer Mailchimp
         </>
       )}
    </Button>
  )
}

export default MailchimpInstallButton
