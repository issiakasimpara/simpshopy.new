import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PaymentMethodLogo } from "@/components/ui/PaymentLogos";
import { CheckCircle, Globe, Smartphone, CreditCard, Building, Banknote } from "lucide-react";

const PaymentLogosShowcase = () => {
  const paymentMethods = [
    {
      id: 'orange',
      name: 'Orange Money',
      description: 'Paiement mobile Orange',
      countries: ['Mali', 'Sénégal', 'Côte d\'Ivoire', 'Burkina Faso'],
      type: 'Mobile Money',
      fee: 'Gratuit',
      processingTime: 'Instantané',
      icon: Smartphone,
      color: 'orange',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-800'
    },
    {
      id: 'mtn',
      name: 'MTN Mobile Money',
      description: 'Paiement mobile MTN',
      countries: ['Ghana', 'Côte d\'Ivoire', 'Cameroun', 'Ouganda'],
      type: 'Mobile Money',
      fee: 'Gratuit',
      processingTime: 'Instantané',
      icon: Smartphone,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800'
    },
    {
      id: 'moov',
      name: 'Moov Money',
      description: 'Paiement mobile Moov',
      countries: ['Bénin', 'Togo', 'Côte d\'Ivoire', 'Mali'],
      type: 'Mobile Money',
      fee: 'Gratuit',
      processingTime: 'Instantané',
      icon: Smartphone,
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800'
    },
    {
      id: 'bank',
      name: 'Virements bancaires',
      description: 'Transfert depuis votre banque',
      countries: ['Toute l\'Afrique de l\'Ouest'],
      type: 'Virement',
      fee: 'Selon banque',
      processingTime: '1-3 jours',
      icon: Building,
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800'
    },
    {
      id: 'visa',
      name: 'Cartes Visa/Mastercard',
      description: 'Cartes bancaires internationales',
      countries: ['International'],
      type: 'Carte bancaire',
      fee: '2.5%',
      processingTime: 'Instantané',
      icon: CreditCard,
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-800'
    },
    {
      id: 'cash',
      name: 'Paiement à la livraison',
      description: 'Payez en espèces à la réception',
      countries: ['Zones urbaines'],
      type: 'Cash',
      fee: '500 CFA',
      processingTime: 'À la livraison',
      icon: Banknote,
      color: 'gray',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-800'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Moyens de Paiement Simpshopy
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Acceptez tous les moyens de paiement populaires en Afrique de l'Ouest. 
          Vos clients peuvent payer comme ils le souhaitent.
        </p>
        <div className="flex items-center justify-center mt-6 space-x-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            6 moyens de paiement
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Globe className="w-4 h-4 mr-1" />
            8 pays couverts
          </Badge>
        </div>
      </div>

      {/* Grid des moyens de paiement */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {paymentMethods.map((method) => (
          <Card 
            key={method.id} 
            className={`${method.borderColor} ${method.bgColor} border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <PaymentMethodLogo 
                  method={method.id as any} 
                  size="md" 
                  useRealLogo={true} 
                />
                <Badge variant="outline" className={method.textColor}>
                  {method.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {method.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {method.description}
              </p>
              
              {/* Informations détaillées */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Frais:</span>
                  <span className="font-medium text-green-600">{method.fee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Traitement:</span>
                  <span className="font-medium text-gray-700">{method.processingTime}</span>
                </div>
              </div>

              {/* Pays disponibles */}
              <div className="mt-4">
                <p className="text-xs font-medium text-gray-700 mb-2">Disponible dans:</p>
                <div className="flex flex-wrap gap-1">
                  {method.countries.map((country, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs px-2 py-1"
                    >
                      {country}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Section avantages */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Pourquoi Choisir Simpshopy ?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Intégration Simple</h4>
              <p className="text-sm text-gray-600">
                Tous les moyens de paiement intégrés automatiquement. 
                Aucune configuration complexe.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Mobile First</h4>
              <p className="text-sm text-gray-600">
                Optimisé pour les paiements mobiles populaires en Afrique. 
                Interface adaptée aux smartphones.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Couverture Régionale</h4>
              <p className="text-sm text-gray-600">
                Support de tous les opérateurs majeurs d'Afrique de l'Ouest. 
                Expansion continue.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to action */}
      <div className="text-center mt-12">
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium">
          <CheckCircle className="w-5 h-5 mr-2" />
          Commissions transparentes • Support technique inclus • Intégration en 5 minutes
        </div>
      </div>
    </div>
  );
};

export default PaymentLogosShowcase;
