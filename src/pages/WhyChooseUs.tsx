import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Zap, Shield, Globe, Headphones, Award, TrendingUp, Users, Clock, DollarSign, Target } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import AppLogo from "@/components/ui/AppLogo";

const WhyChooseUs = () => {
  const advantages = [
    {
      icon: Globe,
      title: "Portée internationale",
      description: "Vendez dans plus de 50 pays avec nos solutions de paiement locales",
      color: "text-blue-500",
      bgColor: "bg-blue-100"
    },
    {
      icon: Zap,
      title: "Site builder en drag & drop",
      description: "Créez votre site sans connaissances techniques",
      color: "text-purple-500",
      bgColor: "bg-purple-100"
    },
    {
      icon: Headphones,
      title: "Support technique 24/7",
      description: "Notre équipe d'experts est disponible à tout moment",
      color: "text-green-500",
      bgColor: "bg-green-100"
    },
    {
      icon: Clock,
      title: "Configuration en 2 minutes",
      description: "Lancez votre boutique en ligne en un temps record",
      color: "text-yellow-500",
      bgColor: "bg-yellow-100"
    },
    {
      icon: Shield,
      title: "Sécurité internationale garantie",
      description: "Protection SSL et conformité PCI DSS",
      color: "text-red-500",
      bgColor: "bg-red-100"
    },
    {
      icon: Users,
      title: "Relations internationales",
      description: "Partenariats avec les meilleurs fournisseurs mondiaux",
      color: "text-indigo-500",
      bgColor: "bg-indigo-100"
    },
    {
      icon: Users,
      title: "Communauté internationale",
      description: "Rejoignez des milliers d'entrepreneurs",
      color: "text-pink-500",
      bgColor: "bg-pink-100"
    },
    {
      icon: Award,
      title: "Formation gratuite",
      description: "Accédez à nos ressources et tutoriels",
      color: "text-green-500",
      bgColor: "bg-green-100"
    },
    {
      icon: Target,
      title: "Mise en ligne rapide",
      description: "Votre boutique en ligne en quelques clics",
      color: "text-orange-500",
      bgColor: "bg-orange-100"
    }
  ];

  const stats = [
    { number: "1,500+", label: "Stores créées" },
    { number: "25K+", label: "Produits vendus" },
    { number: "50+", label: "Pays couverts" },
    { number: "4.8/5", label: "Note moyenne" }
  ];

  const comparison = [
    {
      feature: "Configuration rapide",
      simpshopy: true,
      shopify: false,
      wix: false
    },
    {
      feature: "Paiements africains",
      simpshopy: true,
      shopify: false,
      wix: false
    },
    {
      feature: "Support 24/7",
      simpshopy: true,
      shopify: false,
      wix: false
    },
    {
      feature: "Prix abordable",
      simpshopy: true,
      shopify: false,
      wix: true
    },
    {
      feature: "Interface intuitive",
      simpshopy: true,
      shopify: true,
      wix: true
    },
    {
      feature: "Expédition mondiale",
      simpshopy: true,
      shopify: true,
      wix: false
    }
  ];

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Pourquoi Choisir SimpShopy - Avantages et Comparaison | Plateforme E-commerce"
        description="Découvrez pourquoi SimpShopy est la meilleure plateforme e-commerce pour l'Afrique. Comparaison avec Shopify, avantages uniques et témoignages clients."
        keywords="pourquoi choisir SimpShopy, avantages e-commerce, comparaison Shopify, plateforme Afrique, e-commerce international"
        type="website"
      />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <AppLogo />
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Accueil</Link>
              <Link to="/features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Fonctionnalités</Link>
              <Link to="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Tarifs</Link>
              <Link to="/testimonials" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Témoignages</Link>
              <Link to="/why-choose-us" className="text-blue-600 font-medium">Pourquoi nous choisir</Link>
              <Link to="/support" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Support</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" asChild>
                  <Link 
                    to="https://admin.simpshopy.com/auth"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Se connecter
                  </Link>
                </Button>
                <span className="text-gray-600">ou</span>
                <Button variant="outline" asChild>
                  <Link 
                    to="https://admin.simpshopy.com/auth"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    S'inscrire
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Pourquoi{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                choisir SimpShopy
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Découvrez ce qui fait de SimpShopy un choix unique pour les entrepreneurs ambitieux 
              et pourquoi nous sommes la plateforme e-commerce préférée en Afrique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Commencer gratuitement
                <CheckCircle className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Voir la comparaison
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos avantages uniques</h2>
            <p className="text-xl text-gray-600">
              Découvrez ce qui fait de SimpShopy un choix unique pour les entrepreneurs ambitieux.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 ${advantage.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <advantage.icon className={`h-6 w-6 ${advantage.color}`} />
                  </div>
                  <CardTitle className="text-lg">{advantage.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{advantage.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Comparaison avec la concurrence</h2>
            <p className="text-xl text-gray-600">
              Découvrez pourquoi SimpShopy est le meilleur choix pour votre entreprise.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Fonctionnalités</th>
                  <th className="text-center py-4 px-6 font-semibold text-purple-600">SimpShopy</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-600">Shopify</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-600">Wix</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-900">{item.feature}</td>
                    <td className="py-4 px-6 text-center">
                      {item.simpshopy ? (
                        <CheckCircle className="h-6 w-6 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {item.shopify ? (
                        <CheckCircle className="h-6 w-6 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {item.wix ? (
                        <CheckCircle className="h-6 w-6 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why SimpShopy Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Pourquoi SimpShopy est différent
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Nous avons créé SimpShopy spécifiquement pour répondre aux besoins 
                des entrepreneurs africains et internationaux.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Spécialement conçu pour l'Afrique</h3>
                    <p className="text-gray-600">Paiements mobiles, expédition locale et support multilingue.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Configuration ultra-rapide</h3>
                    <p className="text-gray-600">Votre boutique en ligne en moins de 5 minutes.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Headphones className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Support 24/7 en français</h3>
                    <p className="text-gray-600">Équipe d'experts disponible à tout moment.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
                  <div className="text-gray-600">Taux de satisfaction client</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">5 min</div>
                  <div className="text-gray-600">Temps de configuration moyen</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                  <div className="text-gray-600">Support disponible</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
                  <div className="text-gray-600">Pays supportés</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Highlight */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center text-white">
            <Star className="h-12 w-12 text-yellow-300 mx-auto mb-6" />
            <blockquote className="text-2xl font-medium mb-6">
              "SimpShopy a transformé ma façon de faire du commerce en ligne. 
              Les paiements mobiles africains sont parfaitement intégrés et le support est exceptionnel."
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold">
                DO
              </div>
              <div>
                <div className="font-medium">David Osei</div>
                <div className="text-white/80">Entrepreneur, Digital Store</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Prêt à choisir SimpShopy ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Rejoignez des milliers d'entrepreneurs qui ont déjà fait le bon choix.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              Commencer gratuitement
              <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600">
              Voir la démo
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

export default WhyChooseUs;
