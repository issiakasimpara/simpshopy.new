import React from 'react';
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import AppLogo from "@/components/ui/AppLogo";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="Conditions Générales d'Utilisation - SimpShopy | CGU"
        description="Consultez nos conditions générales d'utilisation. Découvrez les règles et conditions d'utilisation de la plateforme SimpShopy."
        keywords="conditions générales utilisation SimpShopy, CGU, termes service, plateforme e-commerce"
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Conditions Générales d'Utilisation</h1>
          
          <div className="space-y-8">
            {/* Préambule */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Préambule</h2>
              <div className="space-y-2 text-gray-700">
                <p>Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de la plateforme e-commerce SimpShopy, accessible à l'adresse simpshopy.com.</p>
                <p>En accédant et en utilisant cette plateforme, vous acceptez d'être lié par ces conditions. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.</p>
                <p><strong>Éditeur :</strong> SimpShopy SAS - 123 Rue de l'Innovation, 75001 Paris, France</p>
              </div>
            </section>

            {/* Définitions */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Définitions</h2>
              <div className="space-y-2 text-gray-700">
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Plateforme :</strong> Le site web simpshopy.com et ses services associés</li>
                  <li><strong>Utilisateur :</strong> Toute personne utilisant la plateforme</li>
                  <li><strong>Compte :</strong> L'espace personnel créé par l'utilisateur</li>
                  <li><strong>Services :</strong> L'ensemble des fonctionnalités proposées par SimpShopy</li>
                  <li><strong>Contenu :</strong> Toute information, donnée, texte, image publiée sur la plateforme</li>
                </ul>
              </div>
            </section>

            {/* Objet */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Objet</h2>
              <div className="space-y-2 text-gray-700">
                <p>SimpShopy propose une plateforme e-commerce permettant aux utilisateurs de :</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Créer et gérer des boutiques en ligne</li>
                  <li>Vendre des produits et services</li>
                  <li>Gérer les commandes et les paiements</li>
                  <li>Utiliser des outils de marketing et d'analytics</li>
                  <li>Intégrer des services tiers</li>
                </ul>
              </div>
            </section>

            {/* Inscription et compte */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Inscription et compte utilisateur</h2>
              <div className="space-y-2 text-gray-700">
                <p><strong>4.1 Création de compte</strong></p>
                <p>Pour utiliser nos services, vous devez créer un compte en fournissant des informations exactes et à jour. Vous êtes responsable de la confidentialité de vos identifiants.</p>
                
                <p><strong>4.2 Responsabilité du compte</strong></p>
                <p>Vous êtes entièrement responsable de toutes les activités effectuées sous votre compte. Vous devez nous informer immédiatement de toute utilisation non autorisée.</p>
                
                <p><strong>4.3 Âge minimum</strong></p>
                <p>Vous devez avoir au moins 18 ans ou l'âge de la majorité dans votre juridiction pour créer un compte.</p>
              </div>
            </section>

            {/* Utilisation acceptable */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Utilisation acceptable</h2>
              <div className="space-y-2 text-gray-700">
                <p>Vous vous engagez à utiliser la plateforme de manière légale et éthique. Il est interdit de :</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Violer les droits de propriété intellectuelle</li>
                  <li>Publier du contenu illégal, diffamatoire ou offensant</li>
                  <li>Tenter de pirater ou compromettre la sécurité de la plateforme</li>
                  <li>Utiliser la plateforme pour des activités frauduleuses</li>
                  <li>Spammer ou envoyer des communications non sollicitées</li>
                  <li>Vendre des produits interdits ou illégaux</li>
                </ul>
              </div>
            </section>

            {/* Services et fonctionnalités */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Services et fonctionnalités</h2>
              <div className="space-y-2 text-gray-700">
                <p><strong>6.1 Disponibilité</strong></p>
                <p>Nous nous efforçons de maintenir la plateforme disponible 24h/24 et 7j/7, mais nous ne garantissons pas une disponibilité continue. Des interruptions peuvent survenir pour maintenance.</p>
                
                <p><strong>6.2 Évolution des services</strong></p>
                <p>Nous nous réservons le droit de modifier, suspendre ou arrêter tout service à tout moment, avec ou sans préavis.</p>
                
                <p><strong>6.3 Support technique</strong></p>
                <p>Un support technique est disponible selon votre plan d'abonnement. Les temps de réponse peuvent varier.</p>
              </div>
            </section>

            {/* Tarifs et paiements */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Tarifs et paiements</h2>
              <div className="space-y-2 text-gray-700">
                <p><strong>7.1 Tarification</strong></p>
                <p>Les tarifs sont affichés sur notre site et peuvent être modifiés avec un préavis de 30 jours. Les prix s'entendent toutes taxes comprises.</p>
                
                <p><strong>7.2 Paiement</strong></p>
                <p>Les paiements sont effectués par carte bancaire ou autres moyens acceptés. Les factures sont émises automatiquement.</p>
                
                <p><strong>7.3 Remboursement</strong></p>
                <p>Conformément à la législation en vigueur, vous disposez d'un droit de rétractation de 14 jours à compter de la souscription.</p>
              </div>
            </section>

            {/* Propriété intellectuelle */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Propriété intellectuelle</h2>
              <div className="space-y-2 text-gray-700">
                <p><strong>8.1 Droits de SimpShopy</strong></p>
                <p>La plateforme et son contenu sont protégés par les droits de propriété intellectuelle. Tous les droits sont réservés à SimpShopy SAS.</p>
                
                <p><strong>8.2 Licence d'utilisation</strong></p>
                <p>Nous vous accordons une licence limitée, non exclusive et révocable d'utiliser la plateforme conformément à ces CGU.</p>
                
                <p><strong>8.3 Contenu utilisateur</strong></p>
                <p>Vous conservez vos droits sur le contenu que vous publiez. Vous nous accordez une licence d'utilisation pour fournir nos services.</p>
              </div>
            </section>

            {/* Protection des données */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Protection des données</h2>
              <div className="space-y-2 text-gray-700">
                <p>Le traitement de vos données personnelles est régi par notre <Link to="/privacy" className="text-blue-600 hover:underline">Politique de confidentialité</Link> et le RGPD.</p>
                <p>Nous nous engageons à protéger vos données et à respecter vos droits en matière de protection des données personnelles.</p>
              </div>
            </section>

            {/* Responsabilité */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Responsabilité</h2>
              <div className="space-y-2 text-gray-700">
                <p><strong>10.1 Limitation de responsabilité</strong></p>
                <p>Dans la limite autorisée par la loi, notre responsabilité est limitée aux dommages directs prouvés, dans la limite du montant payé pour nos services.</p>
                
                <p><strong>10.2 Exclusions</strong></p>
                <p>Nous ne sommes pas responsables des dommages indirects, accessoires ou consécutifs, ni des pertes de profits ou de données.</p>
                
                <p><strong>10.3 Force majeure</strong></p>
                <p>Nous ne sommes pas responsables des interruptions de service dues à des événements de force majeure.</p>
              </div>
            </section>

            {/* Résiliation */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Résiliation</h2>
              <div className="space-y-2 text-gray-700">
                <p><strong>11.1 Résiliation par l'utilisateur</strong></p>
                <p>Vous pouvez résilier votre compte à tout moment depuis votre espace personnel ou en nous contactant.</p>
                
                <p><strong>11.2 Résiliation par SimpShopy</strong></p>
                <p>Nous pouvons suspendre ou résilier votre compte en cas de violation de ces CGU, avec ou sans préavis.</p>
                
                <p><strong>11.3 Effets de la résiliation</strong></p>
                <p>À la résiliation, votre accès aux services sera immédiatement suspendu. Nous conserverons vos données conformément à notre politique de confidentialité.</p>
              </div>
            </section>

            {/* Droit applicable */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Droit applicable et juridiction</h2>
              <div className="space-y-2 text-gray-700">
                <p>Ces CGU sont régies par le droit français. Tout litige sera soumis à la compétence exclusive des tribunaux de Paris, sauf pour les consommateurs qui peuvent saisir les tribunaux de leur domicile.</p>
              </div>
            </section>

            {/* Modifications */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Modifications des CGU</h2>
              <div className="space-y-2 text-gray-700">
                <p>Nous nous réservons le droit de modifier ces CGU à tout moment. Les modifications seront notifiées par email et publiées sur le site. Votre utilisation continue de la plateforme après modification constitue votre acceptation des nouvelles conditions.</p>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact</h2>
              <div className="space-y-2 text-gray-700">
                <p>Pour toute question concernant ces CGU :</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Email :</strong> legal@simpshopy.com</li>
                  <li><strong>Adresse :</strong> SimpShopy SAS - Service Juridique, 123 Rue de l'Innovation, 75001 Paris, France</li>
                  <li><strong>Téléphone :</strong> +33 1 23 45 67 89</li>
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
                <li><Link to="/legal" className="hover:text-white transition-colors">Mentions légales</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Confidentialité</Link></li>
                <li><Link to="/terms" className="text-white font-medium">CGU</Link></li>
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

export default Terms;
