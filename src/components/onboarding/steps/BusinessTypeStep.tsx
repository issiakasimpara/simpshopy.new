import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BUSINESS_TYPE_OPTIONS } from '@/types/onboarding';
import type { BusinessTypeOption } from '@/types/onboarding';

interface BusinessTypeStepProps {
  selectedType?: string;
  onSelect: (type: 'digital_products' | 'online_services' | 'free_choice') => void;
}

const BusinessTypeStep: React.FC<BusinessTypeStepProps> = ({
  selectedType,
  onSelect,
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <p className="text-gray-600">
          Choisissez le type de produit que vous souhaitez vendre
        </p>
      </div>

      <div className="grid gap-4">
        {BUSINESS_TYPE_OPTIONS.map((option) => (
          <Card
            key={option.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedType === option.id
                ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                : 'hover:border-gray-300'
            }`}
            onClick={() => onSelect(option.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="text-3xl mt-1">{option.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {option.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center w-6 h-6 mt-1">
                  {selectedType === option.id ? (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BusinessTypeStep;
