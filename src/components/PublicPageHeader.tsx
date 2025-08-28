import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AppLogo from "@/components/ui/AppLogo";

interface PublicPageHeaderProps {
  activePage?: string;
}

const PublicPageHeader: React.FC<PublicPageHeaderProps> = ({ activePage = "home" }) => {
  const navigationItems = [
    { path: "/", label: "Accueil", key: "home" },
    { path: "/features", label: "Fonctionnalités", key: "features" },
    { path: "/pricing", label: "Tarifs", key: "pricing" },
    { path: "/testimonials", label: "Témoignages", key: "testimonials" },
    { path: "/why-choose-us", label: "Pourquoi nous choisir", key: "why-choose-us" },
    { path: "/support", label: "Support", key: "support" }
  ];

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <AppLogo />
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={`transition-colors font-medium ${
                  activePage === item.key
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" asChild>
                <Link 
                  to="https://admin.simpshopy.com/auth"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Se connecter
                </Link>
              </Button>
              <span className="text-gray-600">ou</span>
              <Button variant="outline" asChild>
                <Link 
                  to="https://admin.simpshopy.com/auth"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  S'inscrire
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicPageHeader;
