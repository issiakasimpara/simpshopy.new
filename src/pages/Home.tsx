import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Globe, CreditCard, Package, Palette, Shield, BarChart3, ArrowRight, Users, Quote, Play, Zap, Target, TrendingUp, ShoppingBag, DollarSign, Smartphone, Monitor, Zap as Lightning, Plus, FileText, Settings, Headphones } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import AppLogo from "@/components/ui/AppLogo";
import { useAuth } from "@/hooks/useAuth";
import { useOnboarding } from "@/hooks/useOnboarding";
import SmartNavigationButton from "@/components/SmartNavigationButton";
import PublicPageHeader from "@/components/PublicPageHeader";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { shouldShowOnboarding } = useOnboarding();





  const features = [
    {
      title: "Votre boutique personnalisée en ligne en 2 minutes.",
      description: "Simpshopy vous permet de configurer plusieurs boutiques adaptées à vos différents produits ou services. Choisissez un design, ajoutez vos articles, et vous êtes prêt à vendre.",
      illustration: "boutique",
      icon: ShoppingBag
    },
    {
      title: "Vendez partout, dans plusieurs devises.",
      description: "Avec Simpshopy, vous n'avez pas à vous soucier des transactions. Nous acceptons toutes les principales méthodes de paiement, locales et internationales. Vous recevrez vos gains dans les 72 heures.",
      illustration: "paiements",
      icon: Globe
    },
    {
      title: "Connectez vos outils préférés",
      description: "Synchronisez facilement votre boutique avec vos outils de marketing préférés. Mailchimp, Google Analytics, Facebook Pixel. Connectez-les tous pour optimiser vos campagnes et doubler vos conversions.",
      illustration: "integrations",
      icon: Zap
    },
    {
      title: "Suivez vos ventes et ajustez votre stratégie.",
      description: "Accédez à des statistiques détaillées pour comprendre vos performances, identifier les produits qui fonctionnent le mieux et optimiser vos actions marketing.",
      illustration: "analytics",
      icon: BarChart3
    },
    {
      title: "Une équipe à vos côtés 24h/24 et 7j/7.",
      description: "Nos experts sont à votre disposition pour vous accompagner, que vous ayez besoin d'aide pour configurer votre boutique ou de conseils pour augmenter vos ventes.",
      illustration: "support",
      icon: Headphones
    }
  ];

  const keyFeatures = [
    {
      icon: Shield,
      title: "Protection des paiements",
      description: "Sécurisez vos transactions avec un niveau de protection enterprise."
    },
    {
      icon: Zap,
      title: "Workflows automatisés",
      description: "Soyez plus efficaces grâce aux workflows. Idéal pour les ventes incitatives et bien plus encore !"
    },
    {
      icon: DollarSign,
      title: "Codes de réduction",
      description: "Offrez à vos clients des réductions sur vos produits avec une flexibilité totale."
    },
    {
      icon: Lightning,
      title: "Pulse",
      description: "Communiquez vos ventes à vos outils préférés en temps réel et conservez votre flux de travail intact."
    },
    {
      icon: TrendingUp,
      title: "Campagnes",
      description: "Mesurez l'impact réel de chaque action marketing et optimisez votre ROI grâce à une meilleure traçabilité."
    }
  ];

  const comparisonData = [
    {
      feature: "Paiements locaux (Mobile Money, Wave, etc.)",
      simpshopy: "✅ Inclus",
      wordpress: "❌ Plugins complexes",
      shopify: "❌ Non natif"
    },
    {
      feature: "Multi-devises & multi-langues",
      simpshopy: "✅ Automatique",
      wordpress: "❌ Manuel",
      shopify: "✅ Payant"
    },
    {
      feature: "Simplicité d'installation",
      simpshopy: "✅ 2 minutes",
      wordpress: "❌ Complexe",
      shopify: "✅ Rapide"
    },
    {
      feature: "Tarifs transparents",
      simpshopy: "✅ $29/mois",
      wordpress: "❌ Plugins cachés",
      shopify: "❌ Frais cachés"
    },
    {
      feature: "Support dédié 24/7",
      simpshopy: "✅ WhatsApp + email",
      wordpress: "❌ Communauté",
      shopify: "✅ Premium uniquement"
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Créez",
      description: "Uploadez vos produits numériques et configurez votre boutique."
    },
    {
      number: "2",
      title: "Partagez",
      description: "Diffusez votre lien de vente unique sur vos réseaux."
    },
    {
      number: "3",
      title: "Gagnez",
      description: "Recevez vos paiements instantanément après chaque vente."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="SimpShopy - La plateforme tout en un pour vendre vos produits digitaux"
        description="Créez et vendez vos produits digitaux partout dans le monde sans stress. De la mise en ligne au reversement de vos gains, nous gérons tout."
        keywords="boutique en ligne, e-commerce, plateforme vente, produits digitaux, paiements internationaux"
        type="website"
      />

      <PublicPageHeader activePage="home" />

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-4 sm:left-10 w-48 sm:w-96 h-48 sm:h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-4 sm:right-10 w-48 sm:w-96 h-48 sm:h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 mb-8 sm:mb-12 shadow-lg">
              <span className="text-xs sm:text-sm font-medium text-gray-700">🚀 Nouveau : Paiements Mobile Money intégrés</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-gray-900 mb-6 sm:mb-8 leading-tight px-4">
              La plateforme tout en un pour{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600">
                vendre vos produits digitaux
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed font-light px-4">
              Créez et vendez vos produits digitaux partout dans le monde sans stress. 
              De la mise en ligne au reversement de vos gains, nous gérons tout.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-12 px-4">
              <SmartNavigationButton 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg sm:text-xl px-6 sm:px-10 py-4 sm:py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 font-medium"
              >
                {user ? 'Mon Dashboard' : 'Créez ma boutique'}
              </SmartNavigationButton>
              <Button size="lg" variant="outline" className="text-lg sm:text-xl px-6 sm:px-10 py-4 sm:py-6 rounded-2xl border-2 border-gray-300 hover:bg-gray-50 hover:border-blue-300 transition-all duration-300 font-medium">
                <Play className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                Visitez la démo
              </Button>
            </div>
            
            <p className="text-sm sm:text-lg text-gray-500 mb-8 sm:mb-12 px-4">✨ Aucune carte bancaire requise • Configuration en 2 minutes</p>
            
                         {/* Social proof avec graphiques animés */}
             <div className="border-t border-gray-200/50 pt-8 sm:pt-12 px-4">
               <p className="text-sm sm:text-lg text-gray-600 mb-6 sm:mb-8">Faites confiance à la plateforme qui fait grandir les entrepreneurs</p>
               
               {/* Graphiques de croissance animés */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                 {/* Graphique 1: Boutiques créées */}
                 <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-200 shadow-lg">
                   <div className="text-center">
                     <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                       <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                     </div>
                                           <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">+52,847</div>
                      <div className="text-xs sm:text-sm text-gray-600">Boutiques créées</div>
                     
                     {/* Graphique animé */}
                     <div className="mt-3 sm:mt-4 flex items-end justify-center space-x-1 h-8 sm:h-12">
                       <div className="w-2 sm:w-3 bg-blue-500 rounded-t animate-pulse" style={{height: '60%', animationDelay: '0s'}}></div>
                       <div className="w-2 sm:w-3 bg-blue-500 rounded-t animate-pulse" style={{height: '80%', animationDelay: '0.2s'}}></div>
                       <div className="w-2 sm:w-3 bg-blue-500 rounded-t animate-pulse" style={{height: '45%', animationDelay: '0.4s'}}></div>
                       <div className="w-2 sm:w-3 bg-blue-500 rounded-t animate-pulse" style={{height: '90%', animationDelay: '0.6s'}}></div>
                       <div className="w-2 sm:w-3 bg-purple-500 rounded-t animate-pulse" style={{height: '100%', animationDelay: '0.8s'}}></div>
                     </div>
                   </div>
                 </div>

                 {/* Graphique 2: Pays couverts */}
                 <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-200 shadow-lg">
                   <div className="text-center">
                     <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                       <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                     </div>
                                           <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">+157</div>
                      <div className="text-xs sm:text-sm text-gray-600">Pays couverts</div>
                     
                     {/* Indicateur de croissance */}
                     <div className="mt-3 sm:mt-4 flex items-center justify-center">
                       <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-1" />
                       <span className="text-xs sm:text-sm text-green-600 font-medium">+15% ce mois</span>
                     </div>
                   </div>
                 </div>

                 {/* Graphique 3: Chiffre d'affaires */}
                 <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-200 shadow-lg">
                   <div className="text-center">
                     <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                       <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                     </div>
                                           <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">€24.7M</div>
                      <div className="text-xs sm:text-sm text-gray-600">CA généré</div>
                     
                     {/* Graphique circulaire animé */}
                     <div className="mt-3 sm:mt-4 relative w-8 h-8 sm:w-12 sm:h-12 mx-auto">
                       <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
                       <div className="absolute inset-0 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" style={{animationDuration: '2s'}}></div>
                     </div>
                   </div>
                 </div>

                 {/* Graphique 4: Satisfaction client */}
                 <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-200 shadow-lg">
                   <div className="text-center">
                     <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                       <Star className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-current" />
                     </div>
                     <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">4.9/5</div>
                     <div className="text-xs sm:text-sm text-gray-600">Satisfaction</div>
                     
                     {/* Étoiles animées */}
                     <div className="mt-3 sm:mt-4 flex justify-center space-x-1">
                       {[1, 2, 3, 4, 5].map((star) => (
                         <Star 
                           key={star} 
                           className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current animate-pulse" 
                           style={{animationDelay: `${star * 0.1}s`}}
                         />
                       ))}
                     </div>
                   </div>
                 </div>
               </div>

               {/* Indicateurs de succès animés */}
               <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-sm sm:text-base">
                 <div className="flex items-center bg-green-100 text-green-700 px-3 py-2 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}>
                   <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                   <span className="font-medium">+300% croissance moyenne</span>
                 </div>
                 <div className="flex items-center bg-blue-100 text-blue-700 px-3 py-2 rounded-full animate-bounce" style={{animationDelay: '1s'}}>
                   <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                   <span className="font-medium">Support 24/7 disponible</span>
                 </div>
                 <div className="flex items-center bg-purple-100 text-purple-700 px-3 py-2 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}>
                   <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
                   <span className="font-medium">Configuration en 2 minutes</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Ils ont transformé leur business avec SimpShopy
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez comment nos entrepreneurs ont multiplié leurs ventes et simplifié leur gestion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Témoignage 1 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?w=150&h=150&fit=crop&crop=face" 
                        alt="Aminata Koné"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <span className="text-white font-bold text-lg sm:text-xl" style={{display: 'none'}}>AK</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="font-semibold text-gray-900">Aminata Koné</h4>
                  <p className="text-sm text-gray-600">Fondatrice, Mode Africaine Plus</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic mb-6">
                "SimpShopy a révolutionné ma boutique de vêtements. En 3 mois, mes ventes ont augmenté de 300% grâce aux outils de marketing intégrés et à la facilité de gestion des stocks."
              </blockquote>
              <div className="flex items-center text-sm text-gray-500">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-2">5.0</span>
              </div>
            </div>

            {/* Témoignage 2 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" 
                        alt="Boubacar Diallo"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <span className="text-white font-bold text-lg sm:text-xl" style={{display: 'none'}}>BD</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded-full border-2 border-white"></div>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="font-semibold text-gray-900">Boubacar Diallo</h4>
                  <p className="text-sm text-gray-600">Directeur, Tech Solutions Pro</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic mb-6">
                "L'interface intuitive et les fonctionnalités avancées m'ont permis de gérer 5 boutiques simultanément. Les rapports d'analytics m'aident à prendre les bonnes décisions commerciales."
              </blockquote>
              <div className="flex items-center text-sm text-gray-500">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-2">5.0</span>
              </div>
            </div>

            {/* Témoignage 3 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face" 
                        alt="Fatou Traoré"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <span className="text-white font-bold text-lg sm:text-xl" style={{display: 'none'}}>FT</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 rounded-full border-2 border-white"></div>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="font-semibold text-gray-900">Fatou Traoré</h4>
                  <p className="text-sm text-gray-600">Propriétaire, Beauté Naturelle</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic mb-6">
                "Grâce à SimpShopy, j'ai pu lancer ma boutique de cosmétiques naturels en une journée. Le système de paiement multi-devises m'a ouvert de nouveaux marchés internationaux."
              </blockquote>
              <div className="flex items-center text-sm text-gray-500">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-2">5.0</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 sm:mt-16">
            <SmartNavigationButton 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Rejoignez nos entrepreneurs réussis
            </SmartNavigationButton>
          </div>
        </div>
      </section>

      {/* Features Sections */}
      {features.map((feature, index) => (
        <section key={index} className={`py-16 sm:py-24 lg:py-32 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center">
              <div className={`${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'} order-2 lg:order-1`}>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6 sm:mb-8 leading-tight px-4 lg:px-0">
                  {feature.title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 leading-relaxed font-light px-4 lg:px-0">
                  {feature.description}
                </p>
                                 <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 px-4 lg:px-0">
                   <SmartNavigationButton 
                     size="lg" 
                     className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg sm:text-xl px-6 sm:px-8 py-4 sm:py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 font-medium"
                   >
                     {user ? 'Mon Dashboard' : 'Créez une boutique gratuite'}
                   </SmartNavigationButton>
                  {index === 1 || index === 2 ? (
                    <Button size="lg" variant="ghost" className="text-lg sm:text-xl px-6 sm:px-8 py-4 sm:py-6 text-blue-600 font-medium hover:bg-blue-50 rounded-2xl">
                      En savoir plus
                    </Button>
                  ) : null}
                </div>
              </div>
              <div className={`${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'} order-1 lg:order-2 mb-8 lg:mb-0`}>
                {/* Sophisticated SVG Illustrations */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-4 sm:p-6 lg:p-8 h-[400px] sm:h-[450px] lg:h-[500px] flex items-center justify-center shadow-2xl border border-blue-100">
                    {feature.illustration === 'boutique' && <BoutiqueIllustration />}
                    {feature.illustration === 'paiements' && <PaiementsIllustration />}
                    {feature.illustration === 'integrations' && <IntegrationsIllustration />}
                    {feature.illustration === 'analytics' && <AnalyticsIllustration />}
                    {feature.illustration === 'support' && <SupportIllustration />}
                  </div>
                  {/* Floating elements */}
                  <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-12 h-12 sm:w-20 sm:h-20 bg-yellow-400 rounded-2xl opacity-80 animate-bounce"></div>
                  <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 w-10 h-10 sm:w-16 sm:h-16 bg-pink-400 rounded-2xl opacity-80 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Key Features Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4 sm:mb-6 px-4">Fonctionnalités clés</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">Tout ce dont vous avez besoin pour réussir en ligne</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {keyFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-2xl bg-white hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 rounded-3xl overflow-hidden group">
                <CardHeader className="pb-6 p-6 sm:p-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-serif text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 pt-0">
                  <p className="text-gray-600 leading-relaxed text-base sm:text-lg font-light">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
            <Card className="border-0 shadow-2xl bg-white hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 rounded-3xl overflow-hidden group">
              <CardHeader className="pb-6 p-6 sm:p-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <PlusIcon className="h-8 w-8 sm:h-10 sm:w-10 text-gray-600" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-serif text-gray-900">Et plus encore</CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0">
                <p className="text-gray-600 leading-relaxed text-base sm:text-lg font-light">
                  Explorez nos fonctionnalités avancées comme les noms de domaines personnalisés, 
                  le multi-devises et bien d'autres pour développer votre business.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4 sm:mb-6 px-4">Simpshopy vs les autres</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">Découvrez pourquoi Simpshopy est le choix numéro 1</p>
          </div>
          <div className="overflow-x-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden min-w-[800px]">
              <div className="grid grid-cols-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="p-4 sm:p-6 lg:p-8 font-semibold text-sm sm:text-lg lg:text-xl">Fonctionnalités</div>
                <div className="p-4 sm:p-6 lg:p-8 font-semibold text-sm sm:text-lg lg:text-xl text-center">Simpshopy</div>
                <div className="p-4 sm:p-6 lg:p-8 font-semibold text-sm sm:text-lg lg:text-xl text-center opacity-90">WordPress + WooCommerce</div>
                <div className="p-4 sm:p-6 lg:p-8 font-semibold text-sm sm:text-lg lg:text-xl text-center opacity-90">Shopify</div>
              </div>
              {comparisonData.map((row, index) => (
                <div key={index} className={`grid grid-cols-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${index === comparisonData.length - 1 ? 'border-b-0' : ''}`}>
                  <div className="p-4 sm:p-6 lg:p-8 text-gray-700 font-medium text-sm sm:text-lg">{row.feature}</div>
                  <div className="p-4 sm:p-6 lg:p-8 text-center">
                    <span className="text-green-600 font-semibold text-sm sm:text-lg">{row.simpshopy}</span>
                  </div>
                  <div className="p-4 sm:p-6 lg:p-8 text-center">
                    <span className="text-red-500 font-semibold text-sm sm:text-lg">{row.wordpress}</span>
                  </div>
                  <div className="p-4 sm:p-6 lg:p-8 text-center">
                    <span className={`font-semibold text-sm sm:text-lg ${row.shopify.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>
                      {row.shopify}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
                     <div className="text-center mt-8 sm:mt-12">
             <SmartNavigationButton 
               size="lg" 
               className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg sm:text-xl px-6 sm:px-10 py-4 sm:py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 font-medium"
             >
               {user ? 'Mon Dashboard' : 'Choisir Simpshopy'}
             </SmartNavigationButton>
           </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4 sm:mb-6 px-4">Comment ça marche ?</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">En seulement 3 étapes simples</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8 sm:mb-10">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <span className="text-2xl sm:text-3xl font-bold text-white">{step.number}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 sm:top-12 left-full w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 transform translate-x-4 sm:translate-x-8"></div>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mb-3 sm:mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed text-base sm:text-lg font-light">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-4 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-10 right-4 sm:right-10 w-16 h-16 sm:w-24 sm:h-24 bg-white/10 rounded-full"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-6 sm:mb-8 px-4">
            Commencez à vendre des produits digitaux dès aujourd'hui !
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-8 sm:mb-12 leading-relaxed px-4">
            Rejoignez des milliers d'entrepreneurs qui font confiance à Simpshopy
          </p>
                     <SmartNavigationButton 
             size="lg" 
             className="bg-white text-blue-600 hover:bg-gray-100 text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 font-bold"
           >
             {user ? 'Mon Dashboard' : 'Créez votre boutique'}
           </SmartNavigationButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
            <div>
              <AppLogo />
              <p className="text-gray-400 mt-4 sm:mt-6 leading-relaxed text-sm sm:text-lg">
                La plateforme tout en un pour vendre vos produits digitaux.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 sm:mb-6 text-base sm:text-lg">Ressources</h3>
              <ul className="space-y-3 sm:space-y-4 text-gray-400">
                <li><Link to="/support" className="hover:text-white transition-colors text-sm sm:text-lg">Support</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors text-sm sm:text-lg">Tarifs</Link></li>
                <li><Link to="/features" className="hover:text-white transition-colors text-sm sm:text-lg">Fonctionnalités</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 sm:mb-6 text-base sm:text-lg">Legal</h3>
              <ul className="space-y-3 sm:space-y-4 text-gray-400">
                <li><Link to="/privacy" className="hover:text-white transition-colors text-sm sm:text-lg">Politique de confidentialité</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors text-sm sm:text-lg">Termes et conditions</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 sm:mb-6 text-base sm:text-lg">Entreprise</h3>
              <ul className="space-y-3 sm:space-y-4 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors text-sm sm:text-lg">À propos</Link></li>
                <li><Link to="/why-choose-us" className="hover:text-white transition-colors text-sm sm:text-lg">Pourquoi nous choisir</Link></li>
                <li><Link to="/testimonials" className="hover:text-white transition-colors text-sm sm:text-lg">Témoignages</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 sm:pt-12 text-center text-gray-400">
            <p className="text-sm sm:text-lg">Simpshopy est un service de SimpShopy SAS, une société française enregistrée.</p>
            <p className="mt-2 sm:mt-4 text-sm sm:text-lg">&copy; 2024 SimpShopy. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

// Composant PlusIcon pour l'icône
const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

// Illustrations SVG sophistiquées
const BoutiqueIllustration = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="relative w-full h-full max-w-sm max-h-sm">
      {/* Dashboard principal */}
      <div className="absolute inset-0 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
            <div className="text-xs sm:text-sm font-semibold text-gray-800">Ma Boutique</div>
          </div>
          <div className="w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full"></div>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
          <div className="bg-blue-50 rounded-lg p-2 sm:p-3">
            <div className="text-xs text-blue-600 font-medium">Ventes</div>
            <div className="text-sm sm:text-lg font-bold text-gray-800">€2,450</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-2 sm:p-3">
            <div className="text-xs text-purple-600 font-medium">Commandes</div>
            <div className="text-sm sm:text-lg font-bold text-gray-800">24</div>
          </div>
        </div>
        
        {/* Product list */}
        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-center space-x-2 sm:space-x-3 p-1 sm:p-2 bg-gray-50 rounded-lg">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded"></div>
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-800">Produit Digital #1</div>
              <div className="text-xs text-gray-500">€29.99</div>
            </div>
            <div className="text-xs text-green-600 font-medium">+12</div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 p-1 sm:p-2 bg-gray-50 rounded-lg">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded"></div>
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-800">Formation Premium</div>
              <div className="text-xs text-gray-500">€99.99</div>
            </div>
            <div className="text-xs text-green-600 font-medium">+8</div>
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full animate-pulse"></div>
      <div className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-2 h-2 sm:w-3 sm:h-3 bg-pink-400 rounded-full animate-bounce"></div>
    </div>
  </div>
);

const PaiementsIllustration = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="relative w-full h-full max-w-sm max-h-sm">
      {/* Payment interface */}
      <div className="absolute inset-0 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="text-center mb-3 sm:mb-4 lg:mb-6">
          <div className="text-xs sm:text-sm font-semibold text-gray-800 mb-1 sm:mb-2">Paiement Sécurisé</div>
          <div className="text-sm sm:text-lg font-bold text-gray-900">€29.99</div>
        </div>
        
        {/* Payment methods */}
        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 lg:mb-6">
          <div className="flex items-center justify-between p-2 sm:p-3 bg-blue-50 rounded-lg border-2 border-blue-500">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-4 h-4 sm:w-6 sm:h-6 bg-blue-500 rounded"></div>
              <div className="text-xs sm:text-sm font-medium text-gray-800">Visa/Mastercard</div>
            </div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded"></div>
              <div className="text-xs sm:text-sm font-medium text-gray-800">Mobile Money</div>
            </div>
          </div>
          <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-4 h-4 sm:w-6 sm:h-6 bg-orange-500 rounded"></div>
              <div className="text-xs sm:text-sm font-medium text-gray-800">PayPal</div>
            </div>
          </div>
        </div>
        
        {/* Security badge */}
        <div className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs text-gray-600">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full"></div>
          <span>Paiement sécurisé SSL</span>
        </div>
      </div>
      
      {/* Floating cards */}
      <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-12 h-8 sm:w-16 sm:h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg shadow-lg transform rotate-12"></div>
      <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 w-12 h-8 sm:w-16 sm:h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-lg transform -rotate-12"></div>
    </div>
  </div>
);

const IntegrationsIllustration = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="relative w-full h-full max-w-sm max-h-sm">
      {/* Integration dashboard */}
      <div className="absolute inset-0 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="text-center mb-3 sm:mb-4 lg:mb-6">
          <div className="text-xs sm:text-sm font-semibold text-gray-800">Intégrations</div>
        </div>
        
        {/* Connected services */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
          <div className="bg-red-50 rounded-lg p-2 sm:p-3 border-2 border-red-200">
            <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded"></div>
              <div className="text-xs font-medium text-gray-800">Mailchimp</div>
            </div>
            <div className="text-xs text-green-600">✓ Connecté</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-2 sm:p-3 border-2 border-blue-200">
            <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded"></div>
              <div className="text-xs font-medium text-gray-800">Google Analytics</div>
            </div>
            <div className="text-xs text-green-600">✓ Connecté</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-2 sm:p-3 border-2 border-purple-200">
            <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded"></div>
              <div className="text-xs font-medium text-gray-800">Facebook Pixel</div>
            </div>
            <div className="text-xs text-green-600">✓ Connecté</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border-2 border-gray-200">
            <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-400 rounded"></div>
              <div className="text-xs font-medium text-gray-800">Zapier</div>
            </div>
            <div className="text-xs text-gray-500">+ Connecter</div>
          </div>
        </div>
        
        {/* Connection lines */}
        <div className="relative h-6 sm:h-8">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500"></div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full animate-pulse"></div>
      <div className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-2 h-2 sm:w-3 sm:h-3 bg-purple-400 rounded-full animate-bounce"></div>
    </div>
  </div>
);

const AnalyticsIllustration = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="relative w-full h-full max-w-sm max-h-sm">
      {/* Analytics dashboard */}
      <div className="absolute inset-0 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
          <div className="text-xs sm:text-sm font-semibold text-gray-800">Analytics</div>
          <div className="text-xs text-green-600 font-medium">+23%</div>
        </div>
        
        {/* Chart */}
        <div className="mb-3 sm:mb-4 lg:mb-6">
          <div className="flex items-end justify-between h-12 sm:h-16 lg:h-20 space-x-1">
            <div className="w-3 sm:w-4 bg-blue-500 rounded-t" style={{height: '60%'}}></div>
            <div className="w-3 sm:w-4 bg-blue-500 rounded-t" style={{height: '80%'}}></div>
            <div className="w-3 sm:w-4 bg-blue-500 rounded-t" style={{height: '45%'}}></div>
            <div className="w-3 sm:w-4 bg-blue-500 rounded-t" style={{height: '90%'}}></div>
            <div className="w-3 sm:w-4 bg-blue-500 rounded-t" style={{height: '70%'}}></div>
            <div className="w-3 sm:w-4 bg-blue-500 rounded-t" style={{height: '85%'}}></div>
            <div className="w-3 sm:w-4 bg-blue-500 rounded-t" style={{height: '95%'}}></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1 sm:mt-2">
            <span>Lun</span>
            <span>Mar</span>
            <span>Mer</span>
            <span>Jeu</span>
            <span>Ven</span>
            <span>Sam</span>
            <span>Dim</span>
          </div>
        </div>
        
        {/* Metrics */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="bg-blue-50 rounded-lg p-2 sm:p-3">
            <div className="text-xs text-blue-600 font-medium">Visiteurs</div>
            <div className="text-sm sm:text-lg font-bold text-gray-800">1,234</div>
          </div>
          <div className="bg-green-50 rounded-lg p-2 sm:p-3">
            <div className="text-xs text-green-600 font-medium">Conversions</div>
            <div className="text-sm sm:text-lg font-bold text-gray-800">12.5%</div>
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
      <div className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full animate-bounce"></div>
    </div>
  </div>
);

const SupportIllustration = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="relative w-full h-full max-w-sm max-h-sm">
      {/* Support interface */}
      <div className="absolute inset-0 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="text-center mb-3 sm:mb-4 lg:mb-6">
          <div className="text-xs sm:text-sm font-semibold text-gray-800">Support 24/7</div>
        </div>
        
        {/* Chat interface */}
        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 lg:mb-6">
          <div className="flex justify-end">
            <div className="bg-blue-500 text-white text-xs p-1 sm:p-2 rounded-lg max-w-24 sm:max-w-32">
              Bonjour, j'ai besoin d'aide
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 text-xs p-1 sm:p-2 rounded-lg max-w-24 sm:max-w-32">
              Bonjour ! Comment puis-je vous aider ?
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-blue-500 text-white text-xs p-1 sm:p-2 rounded-lg max-w-24 sm:max-w-32">
              Problème de paiement
            </div>
          </div>
        </div>
        
        {/* Support channels */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="bg-green-50 rounded-lg p-2 sm:p-3 border-2 border-green-200">
            <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full"></div>
              <div className="text-xs font-medium text-gray-800">WhatsApp</div>
            </div>
            <div className="text-xs text-green-600">En ligne</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-2 sm:p-3 border-2 border-blue-200">
            <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded"></div>
              <div className="text-xs font-medium text-gray-800">Email</div>
            </div>
            <div className="text-xs text-blue-600">Réponse &lt; 2h</div>
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
      <div className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full animate-bounce"></div>
    </div>
  </div>
);

export default Home;
