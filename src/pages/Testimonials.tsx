import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, Users, Globe, DollarSign, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import AppLogo from "@/components/ui/AppLogo";
import PublicPageHeader from "@/components/PublicPageHeader";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fondatrice, Fashion Boutique",
      company: "Fashion Boutique",
      rating: 5,
      content: "SimpShopy m'a permis de lancer ma boutique en ligne en quelques heures. Les paiements internationaux fonctionnent parfaitement et le support est exceptionnel. Je recommande vivement !",
      avatar: "/avatars/sarah.jpg",
      location: "Paris, France"
    },
    {
      name: "Michael Chen",
      role: "CEO, Tech Solutions",
      company: "Tech Solutions",
      rating: 5,
      content: "Grâce à SimpShopy, j'ai pu étendre mon activité à l'international. L'interface est intuitive et les fonctionnalités sont complètes. Un vrai gain de temps !",
      avatar: "/avatars/michael.jpg",
      location: "Lagos, Nigeria"
    },
    {
      name: "Emma Rodriguez",
      role: "Fondatrice, Artisan Shop",
      company: "Artisan Shop",
      rating: 5,
      content: "Le meilleur investissement pour mon entreprise. SimpShopy m'a donné tous les outils nécessaires pour réussir en ligne. Les ventes ont augmenté de 300% !",
      avatar: "/avatars/emma.jpg",
      location: "Dakar, Sénégal"
    },
    {
      name: "David Osei",
      role: "Entrepreneur, Digital Store",
      company: "Digital Store",
      rating: 5,
      content: "SimpShopy a transformé ma façon de faire du commerce en ligne. Les paiements mobiles africains sont parfaitement intégrés. Excellent service client !",
      avatar: "/avatars/david.jpg",
      location: "Accra, Ghana"
    },
    {
      name: "Marie Dubois",
      role: "Fondatrice, Beauty Products",
      company: "Beauty Products",
      rating: 5,
      content: "Interface simple et efficace. J'ai pu créer ma boutique en moins d'une heure. Les analytics m'aident à optimiser mes ventes quotidiennement.",
      avatar: "/avatars/marie.jpg",
      location: "Abidjan, Côte d'Ivoire"
    },
    {
      name: "Ahmed Hassan",
      role: "Directeur, Electronics Store",
      company: "Electronics Store",
      rating: 5,
      content: "SimpShopy m'a permis d'atteindre des clients dans toute l'Afrique. Les paiements internationaux et la logistique sont impeccables.",
      avatar: "/avatars/ahmed.jpg",
      location: "Cairo, Egypt"
    }
  ];

  const stats = [
    { number: "2,500+", label: "Clients satisfaits" },
    { number: "4.8/5", label: "Note moyenne" },
    { number: "50+", label: "Pays couverts" },
    { number: "98%", label: "Taux de satisfaction" }
  ];

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Témoignages Clients SimpShopy - Avis et Retours d'Expérience | Plateforme E-commerce"
        description="Découvrez les témoignages de nos clients satisfaits. Entrepreneurs africains et internationaux partagent leur expérience avec SimpShopy."
        keywords="témoignages clients, avis SimpShopy, retours d'expérience, e-commerce Afrique, entrepreneurs satisfaits"
        type="website"
      />

      {/* Header */}
      <PublicPageHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Témoignages{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                clients
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Découvrez comment SimpShopy a aidé des milliers d'entrepreneurs à atteindre 
              de nouveaux sommets et à développer leur activité en ligne.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Rejoindre nos clients
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Voir la démo
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

      {/* Testimonials Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ce que disent nos clients</h2>
            <p className="text-xl text-gray-600">
              Des entrepreneurs du monde entier partagent leur expérience avec SimpShopy.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-gray-300 mb-4" />
                  <p className="text-gray-600 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                      <div className="text-sm text-gray-400">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Histoires de succès</h2>
            <p className="text-xl text-gray-600">
              Découvrez comment nos clients ont transformé leur entreprise avec SimpShopy.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Croissance exponentielle</h3>
                  <p className="text-gray-600">Nos clients voient en moyenne une augmentation de 300% de leurs ventes</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Ventes moyennes</span>
                  <span className="font-semibold text-green-600">+300%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Clients satisfaits</span>
                  <span className="font-semibold text-blue-600">98%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Temps de mise en ligne</span>
                  <span className="font-semibold text-purple-600">-80%</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Globe className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Expansion internationale</h3>
                  <p className="text-gray-600">Vendez dans plus de 50 pays avec nos solutions locales</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pays couverts</span>
                  <span className="font-semibold text-green-600">50+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Moyens de paiement</span>
                  <span className="font-semibold text-blue-600">20+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Langues supportées</span>
                  <span className="font-semibold text-purple-600">5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Pourquoi nos clients nous choisissent</h2>
            <p className="text-xl text-gray-600">
              Découvrez les raisons qui font de SimpShopy le choix numéro 1 des entrepreneurs.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Excellence reconnue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Note moyenne de 4.8/5 basée sur plus de 2,500 avis clients vérifiés.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Support dédié</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Équipe d'experts disponible 24/7 pour vous accompagner dans votre succès.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Résultats garantis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  98% de nos clients voient une amélioration significative de leurs ventes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Rejoignez nos clients satisfaits
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Commencez votre voyage vers le succès avec SimpShopy dès aujourd'hui.
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

export default Testimonials;
