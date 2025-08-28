import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SECTOR_OPTIONS } from '@/types/onboarding';
import type { SectorOption } from '@/types/onboarding';

interface SectorStepProps {
  selectedSector?: string;
  onSelect: (sector: string) => void;
}

const SectorStep: React.FC<SectorStepProps> = ({
  selectedSector,
  onSelect,
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <p className="text-gray-600">
          Choisissez votre secteur d'activité pour personnaliser votre boutique
        </p>
      </div>

      <div className="grid gap-4">
        {SECTOR_OPTIONS.map((option) => (
          <Card
            key={option.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedSector === option.id
                ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                : 'hover:border-gray-300'
            }`}
            onClick={() => onSelect(option.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{option.emoji}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {option.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center w-6 h-6">
                  {selectedSector === option.id ? (
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

export default SectorStep;
