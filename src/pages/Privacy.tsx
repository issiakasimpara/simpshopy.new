import React from 'react';
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import AppLogo from "@/components/ui/AppLogo";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="Politique de Confidentialité - SimpShopy | Protection des Données"
        description="Consultez notre politique de confidentialité. Découvrez comment SimpShopy protège vos données personnelles et respecte le RGPD."
        keywords="politique confidentialité SimpShopy, RGPD, protection données, vie privée"
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Politique de Confidentialité</h1>
          
          <div className="space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <div className="space-y-2 text-gray-700">
                <p>SimpShopy SAS ("nous", "notre", "nos") s'engage à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos informations personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.</p>
                <p>En utilisant notre plateforme e-commerce, vous acceptez les pratiques décrites dans cette politique de confidentialité.</p>
              </div>
            </section>

            {/* Responsable du traitement */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Responsable du traitement</h2>
              <div className="space-y-2 text-gray-700">
                <p><strong>SimpShopy SAS</strong></p>
                <p>123 Rue de l'Innovation, 75001 Paris, France</p>
                <p>Email : privacy@simpshopy.com</p>
                <p>Téléphone : +33 1 23 45 67 89</p>
                <p>SIRET : 123 456 789 00012</p>
              </div>
            </section>

            {/* Données collectées */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Données que nous collectons</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">3.1 Données d'identification</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Nom et prénom</li>
                    <li>Adresse email</li>
                    <li>Numéro de téléphone</li>
                    <li>Adresse postale</li>
                    <li>Date de naissance (optionnel)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">3.2 Données de connexion</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Adresse IP</li>
                    <li>Données de navigation</li>
                    <li>Cookies et technologies similaires</li>
                    <li>Historique des connexions</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">3.3 Données commerciales</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Historique des commandes</li>
                    <li>Préférences d'achat</li>
                    <li>Données de paiement (traitées par nos prestataires)</li>
                    <li>Interactions avec le support client</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Finalités du traitement */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Finalités du traitement</h2>
              <div className="space-y-2 text-gray-700">
                <p>Nous utilisons vos données personnelles pour les finalités suivantes :</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Gestion de votre compte :</strong> Création, maintenance et sécurisation de votre compte utilisateur</li>
                  <li><strong>Exécution des services :</strong> Fourniture de notre plateforme e-commerce et des services associés</li>
                  <li><strong>Support client :</strong> Réponse à vos demandes et assistance technique</li>
                  <li><strong>Amélioration des services :</strong> Analyse et optimisation de nos services</li>
                  <li><strong>Communication :</strong> Envoi d'informations importantes et newsletters (avec votre consentement)</li>
                  <li><strong>Conformité légale :</strong> Respect de nos obligations légales et réglementaires</li>
                </ul>
              </div>
            </section>

            {/* Base légale */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Base légale du traitement</h2>
              <div className="space-y-2 text-gray-700">
                <p>Le traitement de vos données est fondé sur :</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Exécution du contrat :</strong> Pour la fourniture de nos services</li>
                  <li><strong>Obligation légale :</strong> Pour respecter nos obligations fiscales et comptables</li>
                  <li><strong>Intérêt légitime :</strong> Pour la sécurité, l'amélioration des services et la communication</li>
                  <li><strong>Consentement :</strong> Pour les newsletters et communications marketing</li>
                </ul>
              </div>
            </section>

            {/* Destinataires */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Destinataires des données</h2>
              <div className="space-y-2 text-gray-700">
                <p>Vos données peuvent être partagées avec :</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Nos prestataires de services :</strong> Hébergement (Vercel), base de données (Supabase), paiements (Stripe, PayPal)</li>
                  <li><strong>Autorités compétentes :</strong> En cas d'obligation légale</li>
                  <li><strong>Partenaires commerciaux :</strong> Uniquement avec votre consentement explicite</li>
                </ul>
                <p>Tous nos prestataires sont sélectionnés pour leur conformité au RGPD et signent des accords de protection des données.</p>
              </div>
            </section>

            {/* Conservation */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Durée de conservation</h2>
              <div className="space-y-2 text-gray-700">
                <p>Nous conservons vos données pendant les durées suivantes :</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Données de compte :</strong> Pendant la durée de votre compte + 3 ans</li>
                  <li><strong>Données de transaction :</strong> 10 ans (obligation comptable)</li>
                  <li><strong>Données de connexion :</strong> 12 mois</li>
                  <li><strong>Cookies :</strong> Selon les durées définies dans notre politique cookies</li>
                </ul>
              </div>
            </section>

            {/* Vos droits */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Vos droits</h2>
              <div className="space-y-2 text-gray-700">
                <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Droit d'accès :</strong> Obtenir une copie de vos données</li>
                  <li><strong>Droit de rectification :</strong> Corriger des données inexactes</li>
                  <li><strong>Droit à l'effacement :</strong> Demander la suppression de vos données</li>
                  <li><strong>Droit à la limitation :</strong> Limiter le traitement de vos données</li>
                  <li><strong>Droit à la portabilité :</strong> Récupérer vos données dans un format structuré</li>
                  <li><strong>Droit d'opposition :</strong> Vous opposer au traitement pour des raisons légitimes</li>
                  <li><strong>Droit de retrait du consentement :</strong> Retirer votre consentement à tout moment</li>
                </ul>
                <p>Pour exercer ces droits, contactez-nous à privacy@simpshopy.com</p>
              </div>
            </section>

            {/* Sécurité */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Sécurité des données</h2>
              <div className="space-y-2 text-gray-700">
                <p>Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données :</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Chiffrement SSL/TLS pour les transmissions</li>
                  <li>Accès restreint aux données personnelles</li>
                  <li>Surveillance continue de nos systèmes</li>
                  <li>Sauvegardes sécurisées</li>
                  <li>Formation du personnel à la protection des données</li>
                </ul>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Cookies</h2>
              <div className="space-y-2 text-gray-700">
                <p>Nous utilisons des cookies pour améliorer votre expérience. Consultez notre <Link to="/cookies" className="text-blue-600 hover:underline">Politique des cookies</Link> pour plus d'informations.</p>
              </div>
            </section>

            {/* Transferts internationaux */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Transferts internationaux</h2>
              <div className="space-y-2 text-gray-700">
                <p>Vos données peuvent être transférées en dehors de l'UE vers des pays offrant un niveau de protection adéquat ou avec des garanties appropriées (clauses contractuelles types, certifications).</p>
              </div>
            </section>

            {/* Contact DPO */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact</h2>
              <div className="space-y-2 text-gray-700">
                <p>Pour toute question concernant cette politique de confidentialité :</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Email :</strong> privacy@simpshopy.com</li>
                  <li><strong>Adresse :</strong> SimpShopy SAS - DPO, 123 Rue de l'Innovation, 75001 Paris, France</li>
                  <li><strong>CNIL :</strong> Vous pouvez également déposer une plainte auprès de la CNIL</li>
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
                <li><Link to="/privacy" className="text-white font-medium">Confidentialité</Link></li>
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

export default Privacy;
