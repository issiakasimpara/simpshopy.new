import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentMethodLogo } from "@/components/ui/PaymentLogos";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PaymentMethod {
  id: string;
  type: 'orange' | 'mtn' | 'moov' | 'bank' | 'visa' | 'cash';
  name: string;
  description: string;
  fee?: string;
  processingTime?: string;
}

interface PaymentMethodSelectorProps {
  onSelect: (method: PaymentMethod) => void;
  selectedMethod?: string;
}

const PaymentMethodSelector = ({ onSelect, selectedMethod }: PaymentMethodSelectorProps) => {
  const [selected, setSelected] = useState<string>(selectedMethod || '');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'orange_money',
      type: 'orange',
      name: 'Orange Money',
      description: 'Paiement mobile Orange',
      fee: 'Gratuit',
      processingTime: 'Instantané'
    },
    {
      id: 'mtn_momo',
      type: 'mtn',
      name: 'MTN Mobile Money',
      description: 'Paiement mobile MTN',
      fee: 'Gratuit',
      processingTime: 'Instantané'
    },
    {
      id: 'moov_money',
      type: 'moov',
      name: 'Moov Money',
      description: 'Paiement mobile Moov',
      fee: 'Gratuit',
      processingTime: 'Instantané'
    },
    {
      id: 'bank_transfer',
      type: 'bank',
      name: 'Virement bancaire',
      description: 'Virement depuis votre banque',
      fee: 'Selon banque',
      processingTime: '1-3 jours'
    },
    {
      id: 'visa_card',
      type: 'visa',
      name: 'Carte bancaire',
      description: 'Visa, Mastercard',
      fee: '2.5%',
      processingTime: 'Instantané'
    },
    {
      id: 'cash_delivery',
      type: 'cash',
      name: 'Paiement à la livraison',
      description: 'Payez en espèces à la réception',
      fee: '500 CFA',
      processingTime: 'À la livraison'
    }
  ];

  const handleSelect = (method: PaymentMethod) => {
    setSelected(method.id);
    onSelect(method);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Choisissez votre moyen de paiement
      </h3>
      
      <div className="grid gap-3">
        {paymentMethods.map((method) => (
          <Card 
            key={method.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selected === method.id 
                ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleSelect(method)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                {/* Logo */}
                <div className="flex-shrink-0">
                  <PaymentMethodLogo method={method.type} size="sm" />
                </div>
                
                {/* Informations */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {method.name}
                    </h4>
                    {selected === method.id && (
                      <div className="flex-shrink-0">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-1">
                    {method.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-green-600 font-medium">
                      Frais: {method.fee}
                    </span>
                    <span className="text-gray-500">
                      {method.processingTime}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selected && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Moyen de paiement sélectionné
            </span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Vous pouvez maintenant procéder au paiement avec{' '}
            {paymentMethods.find(m => m.id === selected)?.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
