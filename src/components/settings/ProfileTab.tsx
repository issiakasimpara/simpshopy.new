
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, Save, Sparkles } from "lucide-react";

interface UserSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface ProfileTabProps {
  profileData: UserSettings;
  loading: boolean;
  onProfileDataChange: (data: UserSettings) => void;
  onSave: () => void;
}

export const ProfileTab = ({ profileData, loading, onProfileDataChange, onSave }: ProfileTabProps) => {
  return (
    <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background via-background to-muted/20">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      
      <CardHeader className="relative pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 sm:gap-4">
          <div className="relative p-2 sm:p-3 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-xl shadow-inner">
            <User className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
          </div>
          <div className="flex-1">
            <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Informations personnelles
            </span>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1 flex items-center gap-1 sm:gap-2">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />
              Modifiez vos informations de profil
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative space-y-4 sm:space-y-6 lg:space-y-8 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <div className="space-y-3 sm:space-y-4">
            <Label htmlFor="firstName" className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-bold text-blue-700 dark:text-blue-400">
              <div className="p-1 sm:p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
              Prénom
            </Label>
            <div className="relative group">
              <Input
                id="firstName"
                value={profileData.firstName}
                onChange={(e) => onProfileDataChange({ ...profileData, firstName: e.target.value })}
                disabled={loading}
                className="h-12 sm:h-14 text-sm sm:text-base transition-all duration-300 border-2 hover:border-blue-300 dark:hover:border-blue-600 focus:border-blue-500 bg-gradient-to-r from-white to-blue-50/30 dark:from-gray-950 dark:to-blue-950/20 group-hover:shadow-md"
              />
            </div>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <Label htmlFor="lastName" className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-bold text-purple-700 dark:text-purple-400">
              <div className="p-1 sm:p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
              Nom
            </Label>
            <div className="relative group">
              <Input
                id="lastName"
                value={profileData.lastName}
                onChange={(e) => onProfileDataChange({ ...profileData, lastName: e.target.value })}
                disabled={loading}
                className="h-12 sm:h-14 text-sm sm:text-base transition-all duration-300 border-2 hover:border-purple-300 dark:hover:border-purple-600 focus:border-purple-500 bg-gradient-to-r from-white to-purple-50/30 dark:from-gray-950 dark:to-purple-950/20 group-hover:shadow-md"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          <Label htmlFor="email" className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-bold text-green-700 dark:text-green-400">
            <div className="p-1 sm:p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
            </div>
            Email
          </Label>
          <div className="relative group">
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => onProfileDataChange({ ...profileData, email: e.target.value })}
              disabled={loading}
              className="h-12 sm:h-14 text-sm sm:text-base transition-all duration-300 border-2 hover:border-green-300 dark:hover:border-green-600 focus:border-green-500 bg-gradient-to-r from-white to-green-50/30 dark:from-gray-950 dark:to-green-950/20 group-hover:shadow-md"
            />
          </div>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          <Label htmlFor="phone" className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-bold text-orange-700 dark:text-orange-400">
            <div className="p-1 sm:p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
            </div>
            Téléphone
          </Label>
          <div className="relative group">
            <Input
              id="phone"
              value={profileData.phone}
              onChange={(e) => onProfileDataChange({ ...profileData, phone: e.target.value })}
              placeholder="+33 1 23 45 67 89"
              disabled={loading}
              className="h-12 sm:h-14 text-sm sm:text-base transition-all duration-300 border-2 hover:border-orange-300 dark:hover:border-orange-600 focus:border-orange-500 bg-gradient-to-r from-white to-orange-50/30 dark:from-gray-950 dark:to-orange-950/20 group-hover:shadow-md"
            />
          </div>
        </div>
        
        <div className="pt-4 sm:pt-6">
          <Button 
            onClick={onSave} 
            disabled={loading}
            size="lg"
            className="w-full h-12 sm:h-14 text-sm sm:text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Save className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
            {loading ? 'Sauvegarde en cours...' : 'Sauvegarder les modifications'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
