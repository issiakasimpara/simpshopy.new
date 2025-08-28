import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentMethodLogo, OrangeMoneyLogo, MTNLogo, MoovLogo, VisaLogo } from "@/components/ui/PaymentLogos";
import { RefreshCw } from "lucide-react";

const LogoTest = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Test des Logos de Paiement</h1>
          <p className="text-gray-600">Vérification des logos Orange Money et MTN Mobile Money</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Test Orange Money */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🟠</span>
              <span>Orange Money</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <OrangeMoneyLogo key={`orange-${refreshKey}`} size="lg" />
                  <p className="text-xs text-gray-600 mt-2">Composant direct</p>
                </div>
                <div className="text-center">
                  <PaymentMethodLogo method="orange" size="lg" useRealLogo={true} key={`orange-method-${refreshKey}`} />
                  <p className="text-xs text-gray-600 mt-2">Via PaymentMethodLogo</p>
                </div>
                <div className="text-center">
                  <PaymentMethodLogo method="orange" size="lg" useRealLogo={false} />
                  <p className="text-xs text-gray-600 mt-2">Version stylisée</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <strong>URL:</strong> https://change.sn/assets/images/orange_ci.png
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test MTN */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🟡</span>
              <span>MTN Mobile Money</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <MTNLogo key={`mtn-${refreshKey}`} size="lg" />
                  <p className="text-xs text-gray-600 mt-2">Composant direct</p>
                </div>
                <div className="text-center">
                  <PaymentMethodLogo method="mtn" size="lg" useRealLogo={true} key={`mtn-method-${refreshKey}`} />
                  <p className="text-xs text-gray-600 mt-2">Via PaymentMethodLogo</p>
                </div>
                <div className="text-center">
                  <PaymentMethodLogo method="mtn" size="lg" useRealLogo={false} />
                  <p className="text-xs text-gray-600 mt-2">Version stylisée</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <strong>URL:</strong> https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmJ3HE2TArNjWyS6gBWEEBEtCAicuJ2M6vWw&s
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Moov */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🔵</span>
              <span>Moov Money</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <MoovLogo key={`moov-${refreshKey}`} size="lg" />
                  <p className="text-xs text-gray-600 mt-2">Composant direct</p>
                </div>
                <div className="text-center">
                  <PaymentMethodLogo method="moov" size="lg" useRealLogo={true} key={`moov-method-${refreshKey}`} />
                  <p className="text-xs text-gray-600 mt-2">Via PaymentMethodLogo</p>
                </div>
                <div className="text-center">
                  <PaymentMethodLogo method="moov" size="lg" useRealLogo={false} />
                  <p className="text-xs text-gray-600 mt-2">Version stylisée</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <strong>URL:</strong> https://www.moov-africa.ml/PublishingImages/contenu/moov-money.png
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Visa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>💳</span>
              <span>Visa</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <VisaLogo key={`visa-${refreshKey}`} size="lg" />
                  <p className="text-xs text-gray-600 mt-2">Composant direct</p>
                </div>
                <div className="text-center">
                  <PaymentMethodLogo method="visa" size="lg" useRealLogo={true} key={`visa-method-${refreshKey}`} />
                  <p className="text-xs text-gray-600 mt-2">Via PaymentMethodLogo</p>
                </div>
                <div className="text-center">
                  <PaymentMethodLogo method="visa" size="lg" useRealLogo={false} />
                  <p className="text-xs text-gray-600 mt-2">Version stylisée</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test de tous les logos ensemble */}
        <Card>
          <CardHeader>
            <CardTitle>Tous les Logos Ensemble</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {(['orange', 'mtn', 'moov', 'bank', 'visa', 'cash'] as const).map((method) => (
                <div key={method} className="text-center space-y-2">
                  <PaymentMethodLogo 
                    method={method} 
                    size="md" 
                    useRealLogo={true}
                    key={`all-${method}-${refreshKey}`}
                  />
                  <p className="text-xs text-gray-600 capitalize">{method}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Simulation d'utilisation dans une interface */}
        <Card>
          <CardHeader>
            <CardTitle>Simulation Interface de Paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border border-orange-200 rounded-lg bg-orange-50 flex items-center space-x-3">
                <PaymentMethodLogo method="orange" size="sm" useRealLogo={true} />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Orange Money</h4>
                  <p className="text-sm text-gray-600">Paiement mobile Orange • Gratuit</p>
                </div>
                <div className="text-green-600 font-medium">✓</div>
              </div>

              <div className="p-3 border border-yellow-200 rounded-lg bg-yellow-50 flex items-center space-x-3">
                <PaymentMethodLogo method="mtn" size="sm" useRealLogo={true} />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">MTN Mobile Money</h4>
                  <p className="text-sm text-gray-600">Paiement mobile MTN • Gratuit</p>
                </div>
                <div className="text-gray-400">○</div>
              </div>

              <div className="p-3 border border-blue-200 rounded-lg bg-blue-50 flex items-center space-x-3">
                <PaymentMethodLogo method="moov" size="sm" useRealLogo={true} />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Moov Money</h4>
                  <p className="text-sm text-gray-600">Paiement mobile Moov • Gratuit</p>
                </div>
                <div className="text-gray-400">○</div>
              </div>

              <div className="p-3 border border-purple-200 rounded-lg bg-purple-50 flex items-center space-x-3">
                <PaymentMethodLogo method="visa" size="sm" useRealLogo={true} />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Carte Visa/Mastercard</h4>
                  <p className="text-sm text-gray-600">Carte bancaire • 2.5% de frais</p>
                </div>
                <div className="text-gray-400">○</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LogoTest;
