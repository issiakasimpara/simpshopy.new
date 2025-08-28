import React from 'react';
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import AppLogo from "@/components/ui/AppLogo";

const Legal = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="Mentions Légales - SimpShopy | Informations Légales"
        description="Consultez les mentions légales de SimpShopy. Informations sur l'entreprise, les conditions d'utilisation et la conformité légale."
        keywords="mentions légales SimpShopy, informations légales, conditions utilisation, conformité"
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
              <Link to="/support" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Support</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Mentions Légales</h1>
          
          <div className="space-y-8">
            {/* Éditeur */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Éditeur</h2>
              <div className="space-y-2 text-gray-700">
                <p><strong>Raison sociale :</strong> SimpShopy SAS</p>
                <p><strong>Adresse :</strong> 123 Rue de l'Innovation, 75001 Paris, France</p>
                <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
                <p><strong>Email :</strong> contact@simpshopy.com</p>
                <p><strong>SIRET :</strong> 123 456 789 00012</p>
                <p><strong>Capital social :</strong> 100 000 €</p>
                <p><strong>Directeur de publication :</strong> Jean Dupont</p>
              </div>
            </section>

            

            {/* Propriété intellectuelle */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Propriété intellectuelle</h2>
              <div className="space-y-2 text-gray-700">
                <p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.</p>
                <p>La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.</p>
              </div>
            </section>

            {/* Responsabilité */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Responsabilité</h2>
              <div className="space-y-2 text-gray-700">
                <p>Les informations contenues sur ce site sont aussi précises que possible et le site est périodiquement remis à jour, mais peut toutefois contenir des inexactitudes, des omissions ou des lacunes.</p>
                <p>Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, merci de bien vouloir le signaler par email à l'adresse contact@simpshopy.com.</p>
              </div>
            </section>

            {/* Liens hypertextes */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Liens hypertextes</h2>
              <div className="space-y-2 text-gray-700">
                <p>Les liens hypertextes mis en place dans le cadre du présent site web en direction d'autres ressources présentes sur le réseau Internet ne sauraient engager la responsabilité de SimpShopy.</p>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies</h2>
              <div className="space-y-2 text-gray-700">
                <p>Le site peut-être amené à vous demander l'acceptation des cookies pour des besoins de statistiques et d'affichage. Si vous n'acceptez pas les cookies, il se peut que certaines fonctionnalités soient limitées.</p>
                <p>Pour plus d'informations, consultez notre <Link to="/privacy" className="text-blue-600 hover:underline">Politique de confidentialité</Link>.</p>
              </div>
            </section>

            {/* Droit applicable */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Droit applicable</h2>
              <div className="space-y-2 text-gray-700">
                <p>Tout litige en relation avec l'utilisation du site simpshopy.com est soumis au droit français. En dehors des cas où la loi ne le permet pas, il est fait attribution exclusive de juridiction aux tribunaux compétents de Paris.</p>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact</h2>
              <div className="space-y-2 text-gray-700">
                <p>Pour toute question concernant ces mentions légales, vous pouvez nous contacter :</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Par email :</strong> legal@simpshopy.com</li>
                  <li><strong>Par courrier :</strong> SimpShopy SAS - Service Juridique, 123 Rue de l'Innovation, 75001 Paris, France</li>
                  <li><strong>Par téléphone :</strong> +33 1 23 45 67 89</li>
                </ul>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>

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
              <h3 className="font-semibold mb-4">Légal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/legal" className="text-white font-medium">Mentions légales</Link></li>
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

export default Legal;
