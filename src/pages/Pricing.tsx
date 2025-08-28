import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, ArrowRight, Zap, Shield, Globe, Headphones, Users, CreditCard, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import AppLogo from "@/components/ui/AppLogo";
import PublicPageHeader from "@/components/PublicPageHeader";
import PublicPageHero from "@/components/PublicPageHero";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "Gratuit",
      description: "Parfait pour commencer votre aventure e-commerce",
      features: [
        "1 boutique en ligne",
        "Jusqu'à 50 produits",
        "Paiements de base",
        "Support par email",
        "Templates de base",
        "Analytics simples"
      ],
      popular: false,
      color: "border-gray-200",
      bgColor: "bg-white"
    },
    {
      name: "Pro",
      price: "29€",
      period: "/mois",
      description: "Pour les entrepreneurs sérieux qui veulent grandir",
      features: [
        "Boutiques illimitées",
        "Produits illimités",
        "Paiements internationaux",
        "Support 24/7",
        "Templates premium",
        "Analytics avancées",
        "Expédition mondiale",
        "Marketing intégré"
      ],
      popular: true,
      color: "border-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      name: "Enterprise",
      price: "99€",
      period: "/mois",
      description: "Pour les grandes entreprises et les équipes",
      features: [
        "Tout du plan Pro",
        "API personnalisée",
        "Support dédié",
        "Formation sur mesure",
        "Intégrations avancées",
        "Rapports personnalisés",
        "Gestion d'équipe",
        "SLA garanti"
      ],
      popular: false,
      color: "border-gray-200",
      bgColor: "bg-white"
    }
  ];

  const features = [
    {
      name: "Boutiques illimitées",
      starter: false,
      pro: true,
      enterprise: true
    },
    {
      name: "Produits illimités",
      starter: false,
      pro: true,
      enterprise: true
    },
    {
      name: "Paiements internationaux",
      starter: false,
      pro: true,
      enterprise: true
    },
    {
      name: "Support 24/7",
      starter: false,
      pro: true,
      enterprise: true
    },
    {
      name: "Templates premium",
      starter: false,
      pro: true,
      enterprise: true
    },
    {
      name: "Analytics avancées",
      starter: false,
      pro: true,
      enterprise: true
    },
    {
      name: "Expédition mondiale",
      starter: false,
      pro: true,
      enterprise: true
    },
    {
      name: "Marketing intégré",
      starter: false,
      pro: true,
      enterprise: true
    },
    {
      name: "API personnalisée",
      starter: false,
      pro: false,
      enterprise: true
    },
    {
      name: "Support dédié",
      starter: false,
      pro: false,
      enterprise: true
    },
    {
      name: "Formation sur mesure",
      starter: false,
      pro: false,
      enterprise: true
    },
    {
      name: "Gestion d'équipe",
      starter: false,
      pro: false,
      enterprise: true
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Configuration rapide",
      description: "Votre boutique en ligne en moins de 5 minutes"
    },
    {
      icon: Shield,
      title: "Sécurité garantie",
      description: "Protection SSL et conformité PCI DSS"
    },
    {
      icon: Globe,
      title: "Expansion mondiale",
      description: "Vendez dans plus de 50 pays"
    },
    {
      icon: Headphones,
      title: "Support 24/7",
      description: "Notre équipe d'experts est là pour vous"
    }
  ];

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Tarifs SimpShopy - Plans et Prix | Plateforme E-commerce"
        description="Découvrez nos tarifs transparents et nos plans adaptés à tous les besoins. Commencez gratuitement ou choisissez le plan qui correspond à votre ambition."
        keywords="tarifs SimpShopy, prix e-commerce, plans abonnement, plateforme e-commerce Afrique, prix boutique en ligne, tarifs transparents"
        type="website"
        canonical="https://simpshopy.com/pricing"
        ogTitle="Tarifs SimpShopy - Plans et Prix Transparents"
        ogDescription="Découvrez nos tarifs transparents et nos plans adaptés à tous les besoins. Commencez gratuitement ou choisissez le plan qui correspond à votre ambition."
        ogImage="https://simpshopy.com/og-pricing.jpg"
        twitterCard="summary_large_image"
      />

      <PublicPageHeader activePage="pricing" />

      {/* Hero Section */}
      <PublicPageHero 
        title="Tarifs"
        subtitle="Choisissez le plan qui correspond à vos ambitions. Commencez gratuitement et faites évoluer votre entreprise avec nos solutions évolutives."
        primaryButtonText="Commencer gratuitement"
        secondaryButtonText="Voir la comparaison"
        gradientTitle="transparents"
      />

      {/* Pricing Cards */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`border-2 ${plan.color} ${plan.bgColor} relative ${plan.popular ? 'transform scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-500 text-white px-4 py-2">
                      <Star className="h-4 w-4 mr-1" />
                      Le plus populaire
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && (
                      <span className="text-gray-600">{plan.period}</span>
                    )}
                  </div>
                  <CardDescription className="text-gray-600 mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                  >
                    {plan.name === "Starter" ? "Commencer gratuitement" : "Choisir ce plan"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Comparaison des fonctionnalités</h2>
            <p className="text-xl text-gray-600">
              Découvrez ce qui est inclus dans chaque plan.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Fonctionnalités</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-600">Starter</th>
                  <th className="text-center py-4 px-6 font-semibold text-purple-600">Pro</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-600">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-900">{feature.name}</td>
                    <td className="py-4 px-6 text-center">
                      {feature.starter ? (
                        <CheckCircle className="h-6 w-6 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {feature.pro ? (
                        <CheckCircle className="h-6 w-6 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {feature.enterprise ? (
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

      {/* Benefits Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Pourquoi choisir SimpShopy ?</h2>
            <p className="text-xl text-gray-600">
              Découvrez les avantages qui font de SimpShopy le choix numéro 1.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Questions fréquentes</h2>
            <p className="text-xl text-gray-600">
              Tout ce que vous devez savoir sur nos tarifs.
            </p>
          </div>
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Puis-je changer de plan à tout moment ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Oui ! Vous pouvez mettre à niveau ou rétrograder votre plan à tout moment. Les changements prennent effet immédiatement.</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Y a-t-il des frais cachés ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Non, nos tarifs sont transparents. Vous payez uniquement votre abonnement mensuel, sans frais cachés ni commissions sur les ventes.</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Le plan gratuit est-il vraiment gratuit ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Absolument ! Le plan Starter est 100% gratuit, sans limite de temps. Vous pouvez l'utiliser aussi longtemps que vous le souhaitez.</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Que se passe-t-il si je dépasse les limites ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Nous vous avertirons avant d'atteindre les limites. Vous pourrez alors mettre à niveau votre plan ou optimiser votre boutique.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Prêt à commencer votre aventure e-commerce ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Rejoignez des milliers d'entrepreneurs qui ont déjà choisi SimpShopy.
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

export default Pricing;
