import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Zap, Globe, BarChart3, CreditCard, Users, Palette, Smartphone, Store, ShoppingBag, Headphones, Lock, Rocket, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import AppLogo from "@/components/ui/AppLogo";
import PublicPageHeader from "@/components/PublicPageHeader";
import PublicPageHero from "@/components/PublicPageHero";

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Paiements sécurisés",
      description: "Transactions sécurisées avec cryptage SSL et conformité PCI DSS",
      color: "text-green-500",
      bgColor: "bg-green-100"
    },
    {
      icon: Zap,
      title: "Configuration rapide",
      description: "Boutique en ligne en moins de 5 minutes",
      color: "text-yellow-500",
      bgColor: "bg-yellow-100"
    },
    {
      icon: Smartphone,
      title: "Multi-device",
      description: "Compatible mobile, tablette et desktop",
      color: "text-blue-500",
      bgColor: "bg-blue-100"
    },
    {
      icon: BarChart3,
      title: "Gestion des stocks",
      description: "Suivi automatique de vos inventaires",
      color: "text-purple-500",
      bgColor: "bg-purple-100"
    },
    {
      icon: Globe,
      title: "Paiements internationaux",
      description: "Acceptez les paiements du monde entier",
      color: "text-indigo-500",
      bgColor: "bg-indigo-100"
    },
    {
      icon: Headphones,
      title: "Support 24/7",
      description: "Assistance technique disponible 24h/24",
      color: "text-red-500",
      bgColor: "bg-red-100"
    },
    {
      icon: Palette,
      title: "Design personnalisable",
      description: "Thèmes et templates personnalisables",
      color: "text-pink-500",
      bgColor: "bg-pink-100"
    },
    {
      icon: Smartphone,
      title: "Mobile-first",
      description: "Optimisé pour les appareils mobiles",
      color: "text-green-500",
      bgColor: "bg-green-100"
    }
  ];

  const featureCategories = [
    {
      title: "Gestion de boutique",
      features: ["Interface intuitive", "Gestion des produits", "Gestion des commandes", "Gestion des clients"]
    },
    {
      title: "Paiements & Sécurité",
      features: ["Paiements internationaux", "Cryptage SSL", "Conformité PCI DSS", "Paiements mobiles"]
    },
    {
      title: "Marketing & Analytics",
      features: ["Analytics avancées", "Marketing intégré", "SEO optimisé", "Réseaux sociaux"]
    }
  ];

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Fonctionnalités SimpShopy - Plateforme E-commerce Complète | Créez votre boutique en ligne"
        description="Découvrez toutes les fonctionnalités de SimpShopy : boutique en ligne, gestion produits, paiements internationaux, analytics, support 24/7 et plus encore."
        keywords="fonctionnalités e-commerce, boutique en ligne, gestion produits, paiements internationaux, analytics, support client, SimpShopy, plateforme e-commerce, création boutique en ligne"
        type="website"
        canonical="https://simpshopy.com/features"
        ogTitle="Fonctionnalités SimpShopy - Plateforme E-commerce Complète"
        ogDescription="Découvrez toutes les fonctionnalités de SimpShopy : boutique en ligne, gestion produits, paiements internationaux, analytics, support 24/7 et plus encore."
        ogImage="https://simpshopy.com/og-features.jpg"
        twitterCard="summary_large_image"
      />

      <PublicPageHeader activePage="features" />

      {/* Hero Section */}
      <PublicPageHero 
        title="Fonctionnalités"
        subtitle="Découvrez toutes les fonctionnalités qui font de SimpShopy la plateforme e-commerce la plus complète pour les entrepreneurs ambitieux."
        primaryButtonText="Commencer gratuitement"
        secondaryButtonText="Voir la démo"
        gradientTitle="SimpShopy"
      />

      {/* Features Grid */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Fonctionnalités clés</h2>
            <p className="text-xl text-gray-600">
              Découvrez les fonctionnalités qui vous aideront à développer votre entreprise.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Categories */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Fonctionnalités par catégorie</h2>
            <p className="text-xl text-gray-600">
              Organisez votre boutique avec nos fonctionnalités spécialisées.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {featureCategories.map((category, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Fonctionnalités avancées pour votre succès
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Des outils puissants pour faire croître votre entreprise et optimiser vos ventes.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Analytics avancées</h3>
                    <p className="text-gray-600">Suivez vos performances avec des métriques détaillées et des rapports personnalisés.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Expédition mondiale</h3>
                    <p className="text-gray-600">Livrez vos produits partout dans le monde avec nos partenaires logistiques.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Gestion des clients</h3>
                    <p className="text-gray-600">Gérez vos clients, leurs commandes et leur historique d'achat.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
                  <div className="text-gray-600">Fonctionnalités disponibles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                  <div className="text-gray-600">Support technique</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                  <div className="text-gray-600">Sécurisé</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Prêt à découvrir toutes nos fonctionnalités ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Commencez gratuitement et explorez toutes les fonctionnalités de SimpShopy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              Commencer gratuitement
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600">
              Voir la démo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 sm:py-20 lg:py-24">
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

export default Features;
