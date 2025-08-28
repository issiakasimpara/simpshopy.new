import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Globe, Target, Award, TrendingUp, Heart, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import AppLogo from "@/components/ui/AppLogo";

const About = () => {
  const stats = [
    { number: "2,500+", label: "Clients satisfaits" },
    { number: "50+", label: "Pays couverts" },
    { number: "4.8/5", label: "Note moyenne" },
    { number: "24/7", label: "Support disponible" }
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion",
      description: "Nous sommes passionnés par l'entrepreneuriat et l'innovation technologique",
      color: "text-red-500",
      bgColor: "bg-red-100"
    },
    {
      icon: Shield,
      title: "Confiance",
      description: "La sécurité et la fiabilité sont au cœur de notre plateforme",
      color: "text-blue-500",
      bgColor: "bg-blue-100"
    },
    {
      icon: Globe,
      title: "Innovation",
      description: "Nous repoussons constamment les limites de l'e-commerce",
      color: "text-green-500",
      bgColor: "bg-green-100"
    },
    {
      icon: Users,
      title: "Communauté",
      description: "Nous construisons ensemble l'avenir du commerce en ligne",
      color: "text-purple-500",
      bgColor: "bg-purple-100"
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Fondatrice",
      description: "Experte en e-commerce avec 10+ ans d'expérience",
      avatar: "/team/sarah.jpg"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      description: "Spécialiste en technologies cloud et paiements",
      avatar: "/team/michael.jpg"
    },
    {
      name: "Emma Rodriguez",
      role: "Directrice Marketing",
      description: "Experte en croissance et acquisition clients",
      avatar: "/team/emma.jpg"
    },
    {
      name: "David Osei",
      role: "Directeur Afrique",
      description: "Spécialiste des marchés africains",
      avatar: "/team/david.jpg"
    }
  ];

  const timeline = [
    {
      year: "2020",
      title: "Fondation",
      description: "Création de SimpShopy avec la vision de démocratiser l'e-commerce en Afrique"
    },
    {
      year: "2021",
      title: "Premiers clients",
      description: "Lancement de la plateforme et acquisition des 100 premiers clients"
    },
    {
      year: "2022",
      title: "Expansion",
      description: "Ouverture dans 25 pays et intégration des paiements mobiles africains"
    },
    {
      year: "2023",
      title: "Innovation",
      description: "Lancement de l'éditeur drag & drop et des analytics avancées"
    },
    {
      year: "2024",
      title: "Leader",
      description: "SimpShopy devient la plateforme e-commerce leader en Afrique"
    }
  ];

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="À Propos de SimpShopy - Notre Histoire et Mission | Plateforme E-commerce"
        description="Découvrez l'histoire de SimpShopy, notre mission de démocratiser l'e-commerce en Afrique et notre équipe passionnée d'experts."
        keywords="à propos SimpShopy, histoire e-commerce, mission Afrique, équipe SimpShopy, plateforme e-commerce"
        type="website"
      />

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <AppLogo />
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-10 ml-8">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm xl:text-lg">Accueil</Link>
              <Link to="/features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm xl:text-lg">Fonctionnalités</Link>
              <Link to="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm xl:text-lg">Tarifs</Link>
              <Link to="/testimonials" className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm xl:text-lg">Témoignages</Link>
              <Link to="/why-choose-us" className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm xl:text-lg">Pourquoi nous choisir</Link>
              <Link to="/support" className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm xl:text-lg">Support</Link>
            </nav>
            <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
                <Link 
                  to="https://admin.simpshopy.com/auth"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Connexion
                </Link>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-xl text-sm lg:text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Vendre
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              À propos de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                SimpShopy
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Découvrez notre histoire, notre mission et l'équipe passionnée qui fait 
              de SimpShopy la plateforme e-commerce leader en Afrique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Rejoindre l'équipe
                <Users className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Voir nos valeurs
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

      {/* Mission Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Notre mission</h2>
              <p className="text-xl text-gray-600 mb-8">
                Démocratiser l'e-commerce en Afrique en donnant à chaque entrepreneur 
                les outils nécessaires pour réussir en ligne.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Accessibilité</h3>
                    <p className="text-gray-600">Rendre l'e-commerce accessible à tous, partout en Afrique.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
                    <p className="text-gray-600">Développer des solutions innovantes adaptées aux besoins locaux.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Expansion</h3>
                    <p className="text-gray-600">Permettre aux entrepreneurs africains de vendre dans le monde entier.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">2020</div>
                  <div className="text-gray-600">Année de fondation</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                  <div className="text-gray-600">Pays couverts</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">100+</div>
                  <div className="text-gray-600">Employés passionnés</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                  <div className="text-gray-600">Support client</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos valeurs</h2>
            <p className="text-xl text-gray-600">
              Les principes qui guident nos actions et notre vision.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardHeader>
                  <div className={`w-16 h-16 ${value.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <value.icon className={`h-8 w-8 ${value.color}`} />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Timeline */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre histoire</h2>
            <p className="text-xl text-gray-600">
              Découvrez les étapes clés de notre parcours vers le succès.
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-purple-200"></div>
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="w-1/2 px-8">
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <div className="flex items-center space-x-4">
                          <Badge className="bg-purple-500 text-white text-lg px-4 py-2">
                            {item.year}
                          </Badge>
                          <CardTitle className="text-xl">{item.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="w-8 h-8 bg-purple-500 rounded-full border-4 border-white shadow-lg relative z-10"></div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre équipe</h2>
            <p className="text-xl text-gray-600">
              Rencontrez les experts passionnés qui font de SimpShopy une réalité.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardHeader>
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="font-semibold text-purple-600">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Rejoignez l'aventure SimpShopy
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Faites partie de la révolution e-commerce en Afrique.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              Commencer maintenant
              <TrendingUp className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600">
              Nous contacter
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

export default About;
