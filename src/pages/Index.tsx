
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, HeadphonesIcon } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import ComparisonSection from "@/components/home/ComparisonSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CtaSection from "@/components/home/CtaSection";

import PaymentMethodsSection from "@/components/home/PaymentMethodsSection";
import { useAppConfig } from "@/hooks/useAppConfig";
import AppLogo from "@/components/ui/AppLogo";
import Integrations from './Integrations';
import { useAuth } from "@/hooks/useAuth";
import { useOnboarding } from "@/hooks/useOnboarding";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { shouldShowOnboarding } = useOnboarding();
  const isPreviewMode = searchParams.get('preview') === 'true';
  const previewPage = searchParams.get('page');
  const { appName, features, getAllPricingPlans } = useAppConfig();

  // Si nous sommes en mode aperçu, afficher un message de retour à l'accueil
  useEffect(() => {
    if (isPreviewMode) {
      console.log('🏠 Index page loaded in preview mode');
      console.log('📄 Preview page:', previewPage);

      // Envoyer un message au parent pour indiquer qu'on est revenu à l'accueil
      try {
        window.parent.postMessage({
          type: 'PREVIEW_HOME_LOADED',
          page: previewPage || 'home'
        }, '*');
      } catch (error) {
        console.error('Error sending preview message:', error);
      }
    }
  }, [isPreviewMode, previewPage]);

  // Si nous sommes en mode aperçu, afficher une interface simplifiée
  if (isPreviewMode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="text-6xl mb-4">🏪</div>
          <h1 className="text-2xl font-bold mb-4">Retour à l'accueil de la boutique</h1>
          <p className="text-gray-600 mb-6">
            Vous êtes revenu à l'accueil de votre boutique dans l'aperçu.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-green-800">
              <strong>✅ Succès :</strong> Le bouton "Retour à la boutique" fonctionne correctement !
            </p>
          </div>
          <Button
            onClick={() => window.parent.postMessage({ type: 'CLOSE_PREVIEW' }, '*')}
            className="w-full"
          >
            Fermer l'aperçu
          </Button>
        </div>
      </div>
    );
  }

  const plans = getAllPricingPlans().map(plan => {
    const isPopular = plan.name === "Business" || plan.name === "Pro";
    return {
      name: plan.name,
      price: plan.formattedPrice.replace(' USD', ''),
      period: "USD/mois",
      description: plan.description,
      features: plan.features,
      popular: isPopular,
      badge: isPopular ? "Le plus populaire" : (plan.name === "Enterprise" ? "Nouveau" : null)
    };
  });

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="SimpShopy - Plateforme E-commerce Internationale | Créez votre boutique en ligne"
        description="SimpShopy est la plateforme e-commerce internationale. Créez votre boutique en ligne en 2 minutes avec paiements globaux, support français/anglais et tarifs en devises locales."
        keywords="e-commerce, boutique en ligne, plateforme internationale, paiements globaux, dropshipping, SimpShopy, support français, support anglais"
        type="website"
      />
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <AppLogo />
            <nav className="hidden md:flex items-center space-x-8">
                              <Link to="/features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Fonctionnalités</Link>
                <Link to="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Tarifs</Link>
                <Link to="/testimonials" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Témoignages</Link>
                <Link to="/why-choose-us" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Pourquoi nous choisir</Link>
                              <Link to="/support" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Support</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild className="font-medium">
                <Link to="https://admin.simpshopy.com/auth">Connexion</Link>
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => {
                  if (user) {
                    // Utilisateur connecté
                    if (shouldShowOnboarding) {
                      navigate('/onboarding');
                    } else {
                      navigate('/dashboard');
                    }
                  } else {
                    // Nouvel utilisateur - rediriger vers l'auth avec un paramètre pour indiquer qu'il faut faire l'onboarding après
                    window.location.href = 'https://admin.simpshopy.com/auth?onboarding=true';
                  }
                }}
              >
                Commencer <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Why Choose Us Section */}
      <section id="why-us">
        <ComparisonSection />
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Payment Methods Section */}
      <PaymentMethodsSection />

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Des tarifs simples et abordables
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choisissez le plan qui correspond à votre business. Tarifs en dollars, aucun frais caché.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-blue-500 border-2 shadow-2xl scale-105 bg-gradient-to-br from-blue-50 to-white' : 'border-gray-200 shadow-xl hover:shadow-2xl'} transition-all duration-300 hover:-translate-y-1`}>
                {plan.badge && (
                  <Badge className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${plan.popular ? 'bg-blue-600' : 'bg-purple-600'} text-white px-4 py-1`}>
                    {plan.badge}
                  </Badge>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  <div className="flex items-baseline justify-center mt-6">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 ml-2 text-lg">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div className="w-5 h-5 bg-green-500 rounded-full mr-3 flex-shrink-0 flex items-center justify-center mt-0.5">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-gray-700 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full mt-8 py-3 ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : ''}`} variant={plan.popular ? "default" : "outline"}>
                    {plan.popular ? 'Commencer maintenant' : 'Choisir ce plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-24 h-24 mx-auto mb-8 flex items-center justify-center">
              <HeadphonesIcon className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Support expert international 24/7
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Notre équipe d'experts e-commerce vous accompagne à chaque étape en français et anglais. 
              Chat en direct, documentation complète et communauté active de +5,000 membres.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-2 hover:bg-white">
                Documentation complète
              </Button>
              <Button size="lg" className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Chat avec un expert
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CtaSection />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-5 gap-8">
            <div>
              <AppLogo />
              <p className="mt-4 text-gray-400">
                La plateforme e-commerce internationale tout-en-un
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
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Communauté</a></li>
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
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SimpShopy. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
