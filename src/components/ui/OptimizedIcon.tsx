import React, { memo } from 'react';
import * as HeroIcons from '@heroicons/react/24/outline';
import * as HeroIconsSolid from '@heroicons/react/24/solid';

interface OptimizedIconProps {
  name: string;
  variant?: 'outline' | 'solid';
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}

const OptimizedIcon = memo<OptimizedIconProps>(({
  name,
  variant = 'outline',
  className = '',
  size = 'md',
  onClick
}) => {
  // Mapping des tailles
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  // Sélectionner la bibliothèque d'icônes
  const iconLibrary = variant === 'solid' ? HeroIconsSolid : HeroIcons;
  
  // Construire le nom de l'icône
  const iconName = `${name.charAt(0).toUpperCase() + name.slice(1)}Icon`;
  
  // Récupérer l'icône
  const IconComponent = (iconLibrary as any)[iconName];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Heroicons`);
    return (
      <div 
        className={`${sizeClasses[size]} ${className} bg-gray-200 rounded flex items-center justify-center`}
        onClick={onClick}
      >
        <span className="text-xs text-gray-500">?</span>
      </div>
    );
  }

  return (
    <IconComponent
      className={`${sizeClasses[size]} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    />
  );
});

OptimizedIcon.displayName = 'OptimizedIcon';

export default OptimizedIcon;

// Export des icônes les plus utilisées pour un accès direct
export const Icons = {
  // Icônes de navigation
  Home: HeroIcons.HomeIcon,
  Dashboard: HeroIcons.Squares2X2Icon,
  Products: HeroIcons.CubeIcon,
  Orders: HeroIcons.ShoppingCartIcon,
  Customers: HeroIcons.UsersIcon,
  Analytics: HeroIcons.ChartBarIcon,
  Settings: HeroIcons.Cog6ToothIcon,
  
  // Icônes d'actions
  Plus: HeroIcons.PlusIcon,
  Minus: HeroIcons.MinusIcon,
  Edit: HeroIcons.PencilIcon,
  Delete: HeroIcons.TrashIcon,
  Save: HeroIcons.CheckIcon,
  Cancel: HeroIcons.XMarkIcon,
  Search: HeroIcons.MagnifyingGlassIcon,
  
  // Icônes de statut
  Success: HeroIcons.CheckCircleIcon,
  Error: HeroIcons.XCircleIcon,
  Warning: HeroIcons.ExclamationTriangleIcon,
  Info: HeroIcons.InformationCircleIcon,
  
  // Icônes de commerce
  ShoppingCart: HeroIcons.ShoppingCartIcon,
  CreditCard: HeroIcons.CreditCardIcon,
  Truck: HeroIcons.TruckIcon,
  Store: HeroIcons.BuildingStorefrontIcon,
  
  // Icônes d'interface
  Menu: HeroIcons.Bars3Icon,
  Close: HeroIcons.XMarkIcon,
  ArrowUp: HeroIcons.ArrowUpIcon,
  ArrowDown: HeroIcons.ArrowDownIcon,
  ArrowLeft: HeroIcons.ArrowLeftIcon,
  ArrowRight: HeroIcons.ArrowRightIcon,
  ChevronUp: HeroIcons.ChevronUpIcon,
  ChevronDown: HeroIcons.ChevronDownIcon,
  ChevronLeft: HeroIcons.ChevronLeftIcon,
  ChevronRight: HeroIcons.ChevronRightIcon,
  
  // Icônes de communication
  Mail: HeroIcons.EnvelopeIcon,
  Phone: HeroIcons.PhoneIcon,
  Chat: HeroIcons.ChatBubbleLeftIcon,
  
  // Icônes de fichiers
  Document: HeroIcons.DocumentIcon,
  Image: HeroIcons.PhotoIcon,
  Download: HeroIcons.ArrowDownTrayIcon,
  Upload: HeroIcons.ArrowUpTrayIcon,
  
  // Icônes de sécurité
  Lock: HeroIcons.LockClosedIcon,
  Unlock: HeroIcons.LockOpenIcon,
  Eye: HeroIcons.EyeIcon,
  EyeSlash: HeroIcons.EyeSlashIcon,
  
  // Icônes de temps
  Clock: HeroIcons.ClockIcon,
  Calendar: HeroIcons.CalendarIcon,
  
  // Icônes de localisation
  MapPin: HeroIcons.MapPinIcon,
  Globe: HeroIcons.GlobeAltIcon,
  
  // Icônes de réseaux sociaux
  Facebook: HeroIcons.ChatBubbleLeftRightIcon,
  Twitter: HeroIcons.ChatBubbleLeftRightIcon,
  Instagram: HeroIcons.PhotoIcon,
  LinkedIn: HeroIcons.UserGroupIcon,
};
