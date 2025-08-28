import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Headphones, MessageCircle, BookOpen, Users, Clock, Globe, Mail, Phone, MessageSquare, Video, FileText, Search, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import AppLogo from "@/components/ui/AppLogo";
import PublicPageHeader from "@/components/PublicPageHeader";

const Support = () => {
  const supportChannels = [
    {
      icon: MessageCircle,
      title: "Chat en direct",
      description: "Parlez avec nos experts en temps réel",
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      available: "24/7"
    },
    {
      icon: Mail,
      title: "Email",
      description: "Envoyez-nous un message détaillé",
      color: "text-green-500",
      bgColor: "bg-green-100",
      available: "Réponse sous 2h"
    },
    {
      icon: Phone,
      title: "Téléphone",
      description: "Appelez-nous directement",
      color: "text-purple-500",
      bgColor: "bg-purple-100",
      available: "9h-18h"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp",
      description: "Support via WhatsApp Business",
      color: "text-green-500",
      bgColor: "bg-green-100",
      available: "24/7"
    }
  ];

  const helpCategories = [
    {
      icon: BookOpen,
      title: "Documentation",
      description: "Guides détaillés et tutoriels",
      color: "text-blue-500",
      bgColor: "bg-blue-100"
    },
    {
      icon: Video,
      title: "Vidéos",
      description: "Tutoriels vidéo pas à pas",
      color: "text-red-500",
      bgColor: "bg-red-100"
    },
    {
      icon: Users,
      title: "Communauté",
      description: "Forum et groupe d'entraide",
      color: "text-purple-500",
      bgColor: "bg-purple-100"
    },
    {
      icon: FileText,
      title: "FAQ",
      description: "Questions fréquemment posées",
      color: "text-orange-500",
      bgColor: "bg-orange-100"
    }
  ];

  const faqItems = [
    {
      question: "Comment créer ma première boutique en ligne ?",
      answer: "Créez votre boutique en 5 minutes : inscrivez-vous, choisissez un template, ajoutez vos produits et lancez votre boutique !"
    },
    {
      question: "Quels moyens de paiement sont acceptés ?",
      answer: "Nous acceptons les cartes Visa/Mastercard, PayPal, Stripe, et les paiements mobiles africains (Orange Money, MTN Mobile Money, etc.)."
    },
    {
      question: "Le support est-il disponible en français ?",
      answer: "Oui ! Notre équipe de support est disponible 24/7 en français et en anglais pour vous accompagner."
    },
    {
      question: "Puis-je personnaliser le design de ma boutique ?",
      answer: "Absolument ! Utilisez notre éditeur drag & drop pour personnaliser complètement le design de votre boutique."
    },
    {
      question: "Comment gérer les expéditions internationales ?",
      answer: "SimpShopy s'occupe de toute la logistique internationale. Nous avons des partenaires dans plus de 50 pays."
    },
    {
      question: "Y a-t-il des frais cachés ?",
      answer: "Non, nos tarifs sont transparents. Vous payez uniquement votre abonnement mensuel, sans frais cachés."
    }
  ];

  const languages = [
    { name: "Français", flag: "🇫🇷", level: "Complet" },
    { name: "English", flag: "🇺🇸", level: "Complet" },
    { name: "Español", flag: "🇪🇸", level: "Partiel" },
    { name: "Português", flag: "🇵🇹", level: "Partiel" },
    { name: "العربية", flag: "🇸🇦", level: "Partiel" }
  ];

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Support Client SimpShopy - Aide et Assistance 24/7 | Plateforme E-commerce"
        description="Support client SimpShopy disponible 24/7 en français et anglais. Chat en direct, email, téléphone et WhatsApp. Documentation complète et communauté active."
        keywords="support client, aide SimpShopy, assistance e-commerce, chat en direct, documentation, communauté, support français"
        type="website"
      />

      <PublicPageHeader activePage="support" />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Support{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                client 24/7
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Notre équipe d'experts est disponible 24h/24 et 7j/7 pour vous aider 
              à réussir avec SimpShopy. Trouvez rapidement l'aide dont vous avez besoin.
            </p>
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Rechercher dans l'aide..."
                  className="pl-10 pr-4 py-3 text-lg"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Chat avec un expert
                <MessageCircle className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Voir la documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Comment nous contacter</h2>
            <p className="text-xl text-gray-600">
              Choisissez le canal qui vous convient le mieux pour obtenir de l'aide.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportChannels.map((channel, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 ${channel.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <channel.icon className={`h-6 w-6 ${channel.color}`} />
                  </div>
                  <CardTitle className="text-lg">{channel.title}</CardTitle>
                  <CardDescription>{channel.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="text-sm">
                    <Clock className="h-3 w-3 mr-1" />
                    {channel.available}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ressources d'aide</h2>
            <p className="text-xl text-gray-600">
              Trouvez rapidement les informations dont vous avez besoin.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {helpCategories.map((category, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardHeader>
                  <div className={`w-12 h-12 ${category.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <category.icon className={`h-6 w-6 ${category.color}`} />
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full">
                    Accéder
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Questions fréquentes</h2>
            <p className="text-xl text-gray-600">
              Trouvez rapidement les réponses aux questions les plus courantes.
            </p>
          </div>
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">{item.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nous contacter</h2>
            <p className="text-xl text-gray-600">
              Envoyez-nous un message et nous vous répondrons dans les plus brefs délais.
            </p>
          </div>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    <Input placeholder="Votre prénom" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom
                    </label>
                    <Input placeholder="Votre nom" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input type="email" placeholder="votre@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet
                  </label>
                  <Input placeholder="Comment pouvons-nous vous aider ?" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <Textarea 
                    placeholder="Décrivez votre problème ou votre question..."
                    rows={5}
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
                  Envoyer le message
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Languages Support */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Support multilingue</h2>
            <p className="text-xl text-gray-600">
              Notre équipe de support est disponible dans plusieurs langues.
            </p>
          </div>
          <div className="grid md:grid-cols-5 gap-6">
            {languages.map((language, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{language.flag}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{language.name}</h3>
                  <Badge variant="secondary">{language.level}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Besoin d'aide supplémentaire ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Notre équipe d'experts est là pour vous accompagner dans votre succès.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              Chat en direct
              <MessageCircle className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600">
              Voir la documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div>
              <AppLogo />
              <p className="text-gray-400 mt-4">
                La plateforme e-commerce complète pour entrepreneurs ambitieux.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/features" className="hover:text-white transition-colors">Fonctionnalités</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Tarifs</Link></li>
                <li><Link to="/integrations" className="hover:text-white transition-colors">Intégrations</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/support" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/community" className="hover:text-white transition-colors">Communauté</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">À propos</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/careers" className="hover:text-white transition-colors">Carrières</Link></li>
                               </ul>
               </div>
               <div>
                 <h3 className="font-semibold mb-4">Légal</h3>
                 <ul className="space-y-2 text-gray-400">
                   <li><Link to="/legal" className="hover:text-white transition-colors">Mentions légales</Link></li>
                   <li><Link to="/privacy" className="hover:text-white transition-colors">Confidentialité</Link></li>
                   <li><Link to="/terms" className="hover:text-white transition-colors">CGU</Link></li>
                 </ul>
               </div>
             </div>
             <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SimpShopy. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Support;
