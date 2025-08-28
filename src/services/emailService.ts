import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

/**
 * Service d'emails pour Simpshopy
 * Gestion des emails automatiques et des notifications
 */

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  html: string
  variables: string[]
}

export interface EmailLog {
  id: string
  order_id: string
  store_id: string
  email_type: 'admin' | 'customer'
  recipient_email: string
  subject: string
  status: 'sent' | 'failed' | 'pending'
  error_message?: string
  sent_at: string
}

export interface EmailStats {
  store_name: string
  total_emails: number
  sent_emails: number
  failed_emails: number
  success_rate: number
  last_email_sent: string
}

class EmailService {
  /**
   * Envoyer un email de commande via l'Edge Function
   */
  async sendOrderEmail(orderId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('send-order-emails', {
        body: { orderId }
      })

      if (error) {
        console.error('📧 Erreur lors de l\'envoi d\'email:', error)
        return { success: false, error: error.message }
      }

      console.log('📧 Email envoyé avec succès:', data)
      return { success: true }
    } catch (error) {
      console.error('📧 Erreur lors de l\'envoi d\'email:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' }
    }
  }

  /**
   * Obtenir les logs d'emails pour une boutique
   */
  async getEmailLogs(storeId?: string, limit: number = 50): Promise<EmailLog[]> {
    try {
      let query = supabase
        .from('email_logs')
        .select(`
          *,
          orders (
            customer_name,
            total_amount
          ),
          stores (
            name
          )
        `)
        .order('sent_at', { ascending: false })
        .limit(limit)

      if (storeId) {
        query = query.eq('store_id', storeId)
      }

      const { data, error } = await query

      if (error) {
        console.error('📧 Erreur lors de la récupération des logs:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('📧 Erreur lors de la récupération des logs:', error)
      return []
    }
  }

  /**
   * Obtenir les statistiques d'emails
   */
  async getEmailStats(storeId?: string): Promise<EmailStats[]> {
    try {
      const { data, error } = await supabase.rpc('get_email_stats', {
        p_store_id: storeId || null
      })

      if (error) {
        console.error('📧 Erreur lors de la récupération des stats:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('📧 Erreur lors de la récupération des stats:', error)
      return []
    }
  }

  /**
   * Obtenir les logs d'emails récents (vue)
   */
  async getRecentEmailLogs(limit: number = 20): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('recent_email_logs')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('📧 Erreur lors de la récupération des logs récents:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('📧 Erreur lors de la récupération des logs récents:', error)
      return []
    }
  }

  /**
   * Tester l'envoi d'email
   */
  async testEmailService(): Promise<{ success: boolean; error?: string }> {
    try {
      // Créer une commande de test
      const testOrder = {
        store_id: 'test-store-id',
        customer_email: 'test@example.com',
        customer_name: 'Utilisateur Test',
        total_amount: 1000,
        status: 'pending',
        payment_method: 'Test',
        shipping_address: {
          address: 'Adresse de test',
          city: 'Ville de test',
          country: 'Pays de test'
        }
      }

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert(testOrder)
        .select()
        .single()

      if (orderError) {
        console.error('📧 Erreur lors de la création de la commande de test:', orderError)
        return { success: false, error: orderError.message }
      }

      // Envoyer l'email de test
      const emailResult = await this.sendOrderEmail(orderData.id)

      // Supprimer la commande de test
      await supabase
        .from('orders')
        .delete()
        .eq('id', orderData.id)

      return emailResult
    } catch (error) {
      console.error('📧 Erreur lors du test d\'email:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' }
    }
  }

  /**
   * Nettoyer les anciens logs d'emails
   */
  async cleanupOldEmailLogs(): Promise<{ deleted_count: number; error?: string }> {
    try {
      const { data, error } = await supabase.rpc('cleanup_old_email_logs')

      if (error) {
        console.error('📧 Erreur lors du nettoyage des logs:', error)
        return { deleted_count: 0, error: error.message }
      }

      return { deleted_count: data || 0 }
    } catch (error) {
      console.error('📧 Erreur lors du nettoyage des logs:', error)
      return { deleted_count: 0, error: error instanceof Error ? error.message : 'Erreur inconnue' }
    }
  }

  /**
   * Obtenir les templates d'emails disponibles
   */
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    // Templates prédéfinis
    const templates: EmailTemplate[] = [
      {
        id: 'order-confirmation',
        name: 'Confirmation de commande',
        subject: '✅ Confirmation de commande #{orderNumber} - {storeName}',
        html: `
          <h1>Confirmation de votre commande</h1>
          <p>Merci pour votre commande #{orderNumber}</p>
          <p>Montant total: {totalAmount} CFA</p>
        `,
        variables: ['orderNumber', 'storeName', 'totalAmount', 'customerName', 'orderDate']
      },
      {
        id: 'new-order-admin',
        name: 'Nouvelle commande (Admin)',
        subject: '🎉 Nouvelle commande #{orderNumber} - {storeName}',
        html: `
          <h1>Nouvelle commande reçue !</h1>
          <p>Commande #{orderNumber} de {customerName}</p>
          <p>Montant: {totalAmount} CFA</p>
        `,
        variables: ['orderNumber', 'storeName', 'totalAmount', 'customerName', 'orderDate']
      }
    ]

    return templates
  }

  /**
   * Vérifier le statut du service d'emails
   */
  async checkEmailServiceStatus(): Promise<{
    resend_configured: boolean
    edge_function_deployed: boolean
    database_configured: boolean
    overall_status: 'healthy' | 'warning' | 'error'
  }> {
    const status = {
      resend_configured: false,
      edge_function_deployed: false,
      database_configured: false,
      overall_status: 'error' as const
    }

    try {
      // Vérifier si l'Edge Function est déployée
      const { data: functionData, error: functionError } = await supabase.functions.invoke('send-order-emails', {
        body: { test: true }
      })

      if (!functionError) {
        status.edge_function_deployed = true
      }

      // Vérifier si la base de données est configurée
      const { data: dbData, error: dbError } = await supabase
        .from('email_logs')
        .select('count')
        .limit(1)

      if (!dbError) {
        status.database_configured = true
      }

      // Vérifier Resend (via un test d'email)
      const testResult = await this.testEmailService()
      status.resend_configured = testResult.success

      // Déterminer le statut global
      const healthyCount = Object.values(status).filter(Boolean).length
      if (healthyCount === 3) {
        status.overall_status = 'healthy'
      } else if (healthyCount >= 1) {
        status.overall_status = 'warning'
      } else {
        status.overall_status = 'error'
      }

      return status
    } catch (error) {
      console.error('📧 Erreur lors de la vérification du statut:', error)
      return status
    }
  }
}

export const emailService = new EmailService()

// Hook React pour le service d'emails
export const useEmailService = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendOrderEmail = async (orderId: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await emailService.sendOrderEmail(orderId)
      if (!result.success) {
        setError(result.error || 'Erreur inconnue')
      }
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const getEmailLogs = async (storeId?: string, limit?: number) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const logs = await emailService.getEmailLogs(storeId, limit)
      return logs
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
      setError(errorMessage)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const getEmailStats = async (storeId?: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const stats = await emailService.getEmailStats(storeId)
      return stats
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
      setError(errorMessage)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const testEmailService = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await emailService.testEmailService()
      if (!result.success) {
        setError(result.error || 'Erreur inconnue')
      }
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const checkEmailServiceStatus = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const status = await emailService.checkEmailServiceStatus()
      return status
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
      setError(errorMessage)
      return {
        resend_configured: false,
        edge_function_deployed: false,
        database_configured: false,
        overall_status: 'error' as const
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    sendOrderEmail,
    getEmailLogs,
    getEmailStats,
    testEmailService,
    checkEmailServiceStatus,
    clearError: () => setError(null)
  }
}
