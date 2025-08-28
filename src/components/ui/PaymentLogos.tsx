import { useState } from "react";
import { Smartphone, CreditCard, Building, Banknote, Bitcoin } from "lucide-react";

interface PaymentLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// PayPal Logo avec vraie image
export const PayPalLogo = ({ size = 'md', className = '' }: PaymentLogoProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-2xl bg-white border border-blue-200 flex items-center justify-center shadow-lg overflow-hidden ${className}`}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/PayPal_logo.svg/200px-PayPal_logo.svg.png"
        alt="PayPal"
        className="w-full h-full object-contain p-2"
        onError={(e) => {
          // Fallback vers le logo stylisé
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.parentElement!.innerHTML = `
            <div class="text-blue-600 text-center">
              <div class="font-bold text-lg leading-none">PayPal</div>
            </div>
          `;
        }}
      />
    </div>
  );
};

// Stripe Logo avec vraie image
export const StripeLogo = ({ size = 'md', className = '' }: PaymentLogoProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-2xl bg-white border border-purple-200 flex items-center justify-center shadow-lg overflow-hidden ${className}`}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Stripe_logo.svg/200px-Stripe_logo.svg.png"
        alt="Stripe"
        className="w-full h-full object-contain p-2"
        onError={(e) => {
          // Fallback vers le logo stylisé
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.parentElement!.innerHTML = `
            <div class="text-purple-600 text-center">
              <div class="font-bold text-lg leading-none">Stripe</div>
            </div>
          `;
        }}
      />
    </div>
  );
};

// Visa/Mastercard Logo avec vraie image
export const VisaMastercardLogo = ({ size = 'md', className = '' }: PaymentLogoProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-2xl bg-white border border-indigo-200 flex items-center justify-center shadow-lg overflow-hidden ${className}`}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png"
        alt="Visa/Mastercard"
        className="w-full h-full object-contain p-2"
        onError={(e) => {
          // Fallback vers le logo stylisé
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.parentElement!.innerHTML = `
            <div class="text-indigo-600 text-center">
              <div class="font-bold text-sm leading-none">VISA</div>
              <div class="text-xs opacity-90">Card</div>
            </div>
          `;
        }}
      />
    </div>
  );
};

// Bank Transfer Logo avec vraie image
export const BankLogo = ({ size = 'md', className = '' }: PaymentLogoProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const iconSizes = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-2xl bg-white border border-green-200 flex items-center justify-center shadow-lg overflow-hidden ${className}`}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Bank_icon.svg/200px-Bank_icon.svg.png"
        alt="Virement bancaire"
        className="w-full h-full object-contain p-2"
        onError={(e) => {
          // Fallback vers le logo stylisé
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.parentElement!.innerHTML = `
            <div class="w-full h-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center rounded-2xl">
              <svg class="${iconSizes[size]} text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
          `;
        }}
      />
    </div>
  );
};

// Cryptocurrency Logo avec vraie image
export const CryptoLogo = ({ size = 'md', className = '' }: PaymentLogoProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const iconSizes = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-2xl bg-white border border-orange-200 flex items-center justify-center shadow-lg overflow-hidden ${className}`}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/200px-Bitcoin.svg.png"
        alt="Cryptomonnaies"
        className="w-full h-full object-contain p-2"
        onError={(e) => {
          // Fallback vers le logo stylisé
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.parentElement!.innerHTML = `
            <div class="w-full h-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center rounded-2xl">
              <Bitcoin class="${iconSizes[size]} text-white" />
            </div>
          `;
        }}
      />
    </div>
  );
};

// Orange Money Logo avec vraie image
export const OrangeMoneyLogo = ({ size = 'md', className = '' }: PaymentLogoProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-2xl bg-white border border-orange-200 flex items-center justify-center shadow-lg overflow-hidden ${className}`}>
      <img
        src="https://pbs.twimg.com/profile_images/1458758047132798980/RtLX1cYg_400x400.jpg"
        alt="Orange Money"
        className="w-full h-full object-contain p-2"
        onError={(e) => {
          // Fallback vers le logo stylisé
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.parentElement!.innerHTML = `
            <div class="text-orange-600 text-center">
              <div class="font-bold text-lg leading-none">OM</div>
              <div class="text-xs opacity-90">Orange</div>
            </div>
          `;
        }}
      />
    </div>
  );
};

// MTN Mobile Money Logo avec vraie image
export const MTNLogo = ({ size = 'md', className = '' }: PaymentLogoProps) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-xl bg-white border border-yellow-200 flex items-center justify-center shadow-lg overflow-hidden ${className}`}>
      <img
        src="/mtn.png"
        alt="MTN Mobile Money"
        className="w-full h-full object-cover p-0"
        onError={(e) => {
          // Fallback vers le logo stylisé
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.parentElement!.innerHTML = `
            <div class="text-yellow-600 text-center">
              <div class="font-bold text-lg leading-none">MTN</div>
              <div class="text-xs opacity-80">MoMo</div>
            </div>
          `;
        }}
      />
    </div>
  );
};

// Moov Money Logo avec vraie image
export const MoovLogo = ({ size = 'md', className = '' }: PaymentLogoProps) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-xl bg-white border border-blue-200 flex items-center justify-center shadow-lg overflow-hidden ${className}`}>
      <img
        src="/movv.png"
        alt="Moov Money"
        className="w-full h-full object-cover p-0"
        onError={(e) => {
          // Fallback vers le logo stylisé
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.parentElement!.innerHTML = `
            <div class="text-blue-600 text-center">
              <div class="font-bold text-lg leading-none">MOOV</div>
              <div class="text-xs opacity-90">Money</div>
            </div>
          `;
        }}
      />
    </div>
  );
};

// Visa/Mastercard Logo avec vraie image
export const VisaLogo = ({ size = 'md', className = '' }: PaymentLogoProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-2xl bg-white border border-purple-200 flex items-center justify-center shadow-lg overflow-hidden ${className}`}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png"
        alt="Visa Card"
        className="w-full h-full object-contain p-2"
        onError={(e) => {
          // Fallback vers le logo stylisé
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.parentElement!.innerHTML = `
            <div class="text-purple-600 text-center">
              <div class="font-bold text-sm leading-none">VISA</div>
              <div class="text-xs opacity-90">Card</div>
            </div>
          `;
        }}
      />
    </div>
  );
};

// Cash on Delivery Logo avec vraie image
export const CashLogo = ({ size = 'md', className = '' }: PaymentLogoProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const iconSizes = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-lg overflow-hidden ${className}`}>
      <img
        src="https://img.freepik.com/photos-gratuite/gros-plan-livreur-donnant-colis-au-client_23-2149095900.jpg"
        alt="Paiement à la livraison"
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback vers le logo stylisé
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.parentElement!.innerHTML = `
            <div class="w-full h-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center rounded-2xl">
              <svg class="${iconSizes[size]} text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
          `;
        }}
      />
    </div>
  );
};

// Logo avec image réelle (pour les vrais logos)
interface RealLogoProps extends PaymentLogoProps {
  src: string;
  alt: string;
  fallback?: React.ReactNode;
}

export const RealPaymentLogo = ({ src, alt, size = 'md', className = '', fallback }: RealLogoProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const [imageError, setImageError] = useState(false);

  return (
    <div className={`${sizeClasses[size]} rounded-2xl bg-white border-2 border-gray-200 flex items-center justify-center shadow-lg overflow-hidden relative ${className}`}>
      {!imageError ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain p-2"
          onError={() => setImageError(true)}
        />
      ) : (
        fallback || (
          <div className="text-gray-400 text-center">
            <div className="text-xs">Logo</div>
          </div>
        )
      )}
    </div>
  );
};

// Composant principal qui choisit le bon logo
interface PaymentMethodLogoProps {
  method: 'paypal' | 'stripe' | 'visa' | 'bank' | 'crypto' | 'cash' | 'orange' | 'mtn' | 'moov';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  useRealLogo?: boolean;
}

export const PaymentMethodLogo = ({ method, size = 'md', className = '', useRealLogo = false }: PaymentMethodLogoProps) => {
  // URLs des vrais logos
  const realLogos = {
    paypal: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/PayPal_logo.svg/200px-PayPal_logo.svg.png',
    stripe: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Stripe_logo.svg/200px-Stripe_logo.svg.png',
    visa: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png',
    bank: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Bank_icon.svg/200px-Bank_icon.svg.png',
    crypto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/200px-Bitcoin.svg.png',
    cash: 'https://img.freepik.com/photos-gratuite/gros-plan-livreur-donnant-colis-au-client_23-2149095900.jpg',
    orange: 'https://pbs.twimg.com/profile_images/1458758047132798980/RtLX1cYg_400x400.jpg',
    mtn: '/mtn.png',
    moov: '/movv.png'
  };

  const fallbacks = {
    paypal: <PayPalLogo size={size} />,
    stripe: <StripeLogo size={size} />,
    visa: <VisaMastercardLogo size={size} />,
    bank: <BankLogo size={size} />,
    crypto: <CryptoLogo size={size} />,
    cash: <CashLogo size={size} />,
    orange: <OrangeMoneyLogo size={size} />,
    mtn: <MTNLogo size={size} />,
    moov: <MoovLogo size={size} />
  };

  if (useRealLogo && realLogos[method]) {
    return (
      <RealPaymentLogo 
        src={realLogos[method]}
        alt={`${method} logo`}
        size={size}
        className={className}
        fallback={fallbacks[method]}
      />
    );
  }

  // Utiliser les logos stylisés par défaut
  switch (method) {
    case 'paypal':
      return <PayPalLogo size={size} className={className} />;
    case 'stripe':
      return <StripeLogo size={size} className={className} />;
    case 'visa':
      return <VisaMastercardLogo size={size} className={className} />;
    case 'bank':
      return <BankLogo size={size} className={className} />;
    case 'crypto':
      return <CryptoLogo size={size} className={className} />;
    case 'cash':
      return <CashLogo size={size} className={className} />;
    case 'orange':
      return <OrangeMoneyLogo size={size} className={className} />;
    case 'mtn':
      return <MTNLogo size={size} className={className} />;
    case 'moov':
      return <MoovLogo size={size} className={className} />;
    default:
      return <BankLogo size={size} className={className} />;
  }
};
