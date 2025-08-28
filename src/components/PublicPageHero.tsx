import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

interface PublicPageHeroProps {
  title: string;
  subtitle: string;
  primaryButtonText?: string;
  primaryButtonIcon?: React.ComponentType<{ className?: string }>;
  secondaryButtonText?: string;
  gradientTitle?: string;
}

const PublicPageHero: React.FC<PublicPageHeroProps> = ({
  title,
  subtitle,
  primaryButtonText = "Commencer gratuitement",
  primaryButtonIcon = CheckCircle,
  secondaryButtonText = "Voir la démo",
  gradientTitle
}) => {
  const IconComponent = primaryButtonIcon;

  return (
    <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {title}{' '}
            {gradientTitle && (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                {gradientTitle}
              </span>
            )}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {primaryButtonText}
              <IconComponent className="ml-2 h-4 w-4" />
            </Button>
            {secondaryButtonText && (
              <Button size="lg" variant="outline">
                {secondaryButtonText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PublicPageHero;
