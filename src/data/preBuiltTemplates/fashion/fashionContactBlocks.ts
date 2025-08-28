
import { TemplateBlock } from '@/types/template';

export const fashionContactBlocks: TemplateBlock[] = [
  {
    id: 'hero-contact-fashion',
    type: 'hero',
    content: {
      title: 'Contactez-nous',
      subtitle: 'Nous sommes là pour vous aider',
      showBreadcrumb: true
    },
    styles: {
      backgroundColor: '#f8f9fa',
      textColor: '#000000',
      padding: '60px 0',
    },
    order: 1
  },
  {
    id: 'contact-main-fashion',
    type: 'contact',
    content: {
      title: 'Envoyez-nous un message',
      showForm: true,
      showMap: true,
      showInfo: true,
      phone: '+33 1 23 45 67 89',
      email: 'contact@fashion-moderne.fr',
      address: '123 Rue de la Mode, 75001 Paris',
      hours: 'Lun-Ven: 9h-18h, Sam: 10h-17h'
    },
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 2
  },
  {
    id: 'faq-fashion',
    type: 'faq',
    content: {
      title: 'Questions Fréquentes',
      faqs: [
        {
          question: 'Quels sont les délais de livraison ?',
          answer: 'La livraison standard prend 2-3 jours ouvrés en France métropolitaine.'
        },
        {
          question: 'Comment puis-je retourner un article ?',
          answer: 'Vous avez 30 jours pour retourner vos articles. Consultez notre page retours pour plus d\'informations.'
        },
        {
          question: 'Proposez-vous la livraison internationale ?',
          answer: 'Oui, nous livrons dans toute l\'Europe. Les frais varient selon la destination.'
        }
      ]
    },
    styles: {
      backgroundColor: '#f8f9fa',
      textColor: '#000000',
      padding: '80px 0',
    },
    order: 3
  }
];
