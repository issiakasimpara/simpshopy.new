import { Shield, Zap, Globe, BarChart3, CreditCard, Users, Palette, Smartphone } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Paiements sécurisés",
      description: "Intégration native avec cartes bancaires, PayPal et paiements internationaux",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Zap,
      title: "Configuration rapide",
      description: "Créez votre boutique en moins de 2 minutes avec notre interface intuitive",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Globe,
      title: "Multi-devises",
      description: "Vendez dans plusieurs devises et recevez vos gains en dollars",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: BarChart3,
      title: "Analytics avancés",
      description: "Suivez vos ventes, analysez vos performances et optimisez votre stratégie",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: CreditCard,
      title: "Paiements instantanés",
      description: "Recevez vos gains dans les 72 heures après chaque vente",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: Users,
      title: "Support 24/7",
      description: "Une équipe d'experts à votre disposition en français et anglais",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: Palette,
      title: "Design personnalisable",
      description: "Adaptez l'apparence de votre boutique à votre marque",
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: Smartphone,
      title: "Mobile-first",
      description: "Interface optimisée pour mobile, vos clients achètent facilement",
      color: "from-cyan-500 to-cyan-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Fonctionnalités clés
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Tout ce dont vous avez besoin pour réussir en ligne
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                {/* Icon */}
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="mt-16 bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Et bien plus encore...
            </h3>
            <p className="text-gray-600">
              Explorez nos fonctionnalités avancées pour développer votre business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Protection des produits</h4>
                <p className="text-sm text-gray-600">Sécurisez vos produits digitaux avec des filigranes</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Workflows automatisés</h4>
                <p className="text-sm text-gray-600">Automatisez vos processus de vente</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Codes de réduction</h4>
                <p className="text-sm text-gray-600">Offrez des réductions à vos clients</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 