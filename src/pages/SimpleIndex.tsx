import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Store, ShoppingCart, ArrowRight } from "lucide-react";

const SimpleIndex = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-2">
              <Store className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">MalibaShopy</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="https://admin.simpshopy.com/auth">
                <Button variant="outline">Se connecter</Button>
              </Link>
              <Link to="https://admin.simpshopy.com/auth">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Commencer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Créez votre boutique en ligne
            <span className="text-blue-600"> en quelques minutes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            La plateforme e-commerce complète pour les entrepreneurs africains. 
            Vendez vos produits, gérez vos commandes et développez votre business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="https://admin.simpshopy.com/auth">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                <Store className="mr-2 h-5 w-5" />
                Créer ma boutique
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Voir la démo
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Store className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Boutique personnalisée</h3>
            <p className="text-gray-600">
              Créez votre boutique avec votre propre design et domaine personnalisé.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Gestion des commandes</h3>
            <p className="text-gray-600">
              Suivez vos ventes, gérez vos stocks et traitez vos commandes facilement.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Livraisons optimisées</h3>
            <p className="text-gray-600">
              Configurez vos zones et méthodes de livraison pour l'Afrique francophone.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Store className="h-6 w-6" />
            <span className="text-xl font-bold">MalibaShopy</span>
          </div>
          <p className="text-gray-400">
            La plateforme e-commerce pour l'Afrique francophone
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SimpleIndex;
