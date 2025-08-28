import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentMethodLogo, OrangeMoneyLogo, MTNLogo, MoovLogo, BankLogo, VisaLogo, CashLogo } from "@/components/ui/PaymentLogos";

const PaymentLogosDemo = () => {
  const methods = [
    { type: 'orange' as const, name: 'Orange Money' },
    { type: 'mtn' as const, name: 'MTN Mobile Money' },
    { type: 'moov' as const, name: 'Moov Money' },
    { type: 'bank' as const, name: 'Virements bancaires' },
    { type: 'visa' as const, name: 'Cartes Visa/Mastercard' },
    { type: 'cash' as const, name: 'Paiement à la livraison' }
  ];

  const sizes = ['sm', 'md', 'lg'] as const;

  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Logos des Moyens de Paiement Simpshopy
        </h1>
        <p className="text-gray-600">
          Démonstration des logos utilisés dans l'application
        </p>
      </div>

      {/* Logos avec vraies images */}
      <Card>
        <CardHeader>
          <CardTitle>Logos avec Images Réelles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {methods.map((method) => (
              <div key={method.type} className="text-center space-y-2">
                <PaymentMethodLogo method={method.type} size="md" useRealLogo={true} />
                <p className="text-xs text-gray-600 font-medium">{method.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Logos stylisés (fallback) */}
      <Card>
        <CardHeader>
          <CardTitle>Logos Stylisés (Fallback)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {methods.map((method) => (
              <div key={method.type} className="text-center space-y-2">
                <PaymentMethodLogo method={method.type} size="md" useRealLogo={false} />
                <p className="text-xs text-gray-600 font-medium">{method.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Différentes tailles */}
      <Card>
        <CardHeader>
          <CardTitle>Différentes Tailles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sizes.map((size) => (
              <div key={size} className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 capitalize">
                  Taille {size}
                </h4>
                <div className="flex items-center space-x-4">
                  <PaymentMethodLogo method="orange" size={size} useRealLogo={true} />
                  <PaymentMethodLogo method="mtn" size={size} />
                  <PaymentMethodLogo method="moov" size={size} />
                  <PaymentMethodLogo method="visa" size={size} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Logos individuels */}
      <Card>
        <CardHeader>
          <CardTitle>Composants Individuels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            <div className="text-center space-y-2">
              <OrangeMoneyLogo />
              <p className="text-xs text-gray-600">OrangeMoneyLogo</p>
            </div>
            <div className="text-center space-y-2">
              <MTNLogo />
              <p className="text-xs text-gray-600">MTNLogo</p>
            </div>
            <div className="text-center space-y-2">
              <MoovLogo />
              <p className="text-xs text-gray-600">MoovLogo</p>
            </div>
            <div className="text-center space-y-2">
              <BankLogo />
              <p className="text-xs text-gray-600">BankLogo</p>
            </div>
            <div className="text-center space-y-2">
              <VisaLogo />
              <p className="text-xs text-gray-600">VisaLogo</p>
            </div>
            <div className="text-center space-y-2">
              <CashLogo />
              <p className="text-xs text-gray-600">CashLogo</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Utilisation dans des cartes */}
      <Card>
        <CardHeader>
          <CardTitle>Utilisation dans des Cartes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <PaymentMethodLogo method="orange" size="sm" useRealLogo={true} />
                  <div>
                    <h4 className="font-medium text-gray-900">Orange Money</h4>
                    <p className="text-sm text-gray-600">Paiement mobile Orange</p>
                    <p className="text-xs text-green-600 font-medium">Frais: Gratuit</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <PaymentMethodLogo method="mtn" size="sm" />
                  <div>
                    <h4 className="font-medium text-gray-900">MTN Mobile Money</h4>
                    <p className="text-sm text-gray-600">Paiement mobile MTN</p>
                    <p className="text-xs text-green-600 font-medium">Frais: Gratuit</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Code d'utilisation */}
      <Card>
        <CardHeader>
          <CardTitle>Comment Utiliser</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm text-gray-800">
{`// Import
import { PaymentMethodLogo } from "@/components/ui/PaymentLogos";

// Utilisation basique
<PaymentMethodLogo method="orange" size="md" />

// Avec vraie image
<PaymentMethodLogo method="orange" size="md" useRealLogo={true} />

// Composants individuels
import { OrangeMoneyLogo, MTNLogo } from "@/components/ui/PaymentLogos";
<OrangeMoneyLogo size="lg" className="custom-class" />`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentLogosDemo;
