
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Shield, 
  Bell, 
  Palette,
  Coins
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useStores } from "@/hooks/useStores";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { ProfileTab } from "@/components/settings/ProfileTab";
import { SecurityTab } from "@/components/settings/SecurityTab";
import { NotificationsTab } from "@/components/settings/NotificationsTab";
import { AppearanceTab } from "@/components/settings/AppearanceTab";
import { CurrencySection } from "@/components/settings/sections/CurrencySection";


const Settings = () => {
  const { toast } = useToast();
  const { store } = useStores(); // Récupérer le store de l'utilisateur

  const {
    profileData,
    notifications,
    loading,
    setProfileData,
    setNotifications,
    updateProfile,
    updatePassword
  } = useUserSettings();

  const handleProfileSave = async () => {
    await updateProfile(profileData);
  };

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    if (!currentPassword || !newPassword) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }
    
    await updatePassword(currentPassword, newPassword);
  };

  const handleNotificationSave = () => {
    toast({
      title: "Préférences sauvegardées",
      description: "Vos paramètres de notification ont été mis à jour.",
    });
  };

  return (
    <DashboardLayout>
      <div className="relative">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20 pointer-events-none rounded-3xl" />
        
        <div className="relative space-y-4 sm:space-y-6 lg:space-y-8 p-1">
          <SettingsHeader />

          <div className="bg-gradient-to-br from-background/95 via-background to-muted/5 backdrop-blur-sm rounded-3xl border border-border/50 shadow-xl p-4 sm:p-6 lg:p-8">
            <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6 lg:space-y-8">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 border border-border/30 shadow-lg rounded-2xl p-1 sm:p-2 h-auto min-h-12 sm:min-h-14 lg:min-h-16">
                <TabsTrigger 
                  value="profile" 
                  className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 lg:gap-3 h-10 sm:h-12 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 hover:bg-muted/50 px-2 sm:px-3 py-2"
                >
                  <div className="p-1 sm:p-1.5 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-lg data-[state=active]:bg-white/20">
                    <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <span className="font-semibold text-xs sm:text-sm lg:text-base text-center">Profil</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 lg:gap-3 h-10 sm:h-12 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 hover:bg-muted/50 px-2 sm:px-3 py-2"
                >
                  <div className="p-1 sm:p-1.5 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-lg data-[state=active]:bg-white/20">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <span className="font-semibold text-xs sm:text-sm lg:text-base text-center">Sécurité</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 lg:gap-3 h-10 sm:h-12 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 hover:bg-muted/50 px-2 sm:px-3 py-2"
                >
                  <div className="p-1 sm:p-1.5 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 rounded-lg data-[state=active]:bg-white/20">
                    <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <span className="font-semibold text-xs sm:text-sm lg:text-base text-center">Notifications</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="appearance" 
                  className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 lg:gap-3 h-10 sm:h-12 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 hover:bg-muted/50 px-2 sm:px-3 py-2"
                >
                  <div className="p-1 sm:p-1.5 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-lg data-[state=active]:bg-white/20">
                    <Palette className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <span className="font-semibold text-xs sm:text-sm lg:text-base text-center">Apparence</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="currency" 
                  className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 lg:gap-3 h-10 sm:h-12 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 hover:bg-muted/50 px-2 sm:px-3 py-2"
                >
                  <div className="p-1 sm:p-1.5 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/40 dark:to-orange-900/40 rounded-lg data-[state=active]:bg-white/20">
                    <Coins className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <span className="font-semibold text-xs sm:text-sm lg:text-base text-center">Devise</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-4 sm:mt-6 lg:mt-8">
                <ProfileTab
                  profileData={profileData}
                  loading={loading}
                  onProfileDataChange={setProfileData}
                  onSave={handleProfileSave}
                />
              </TabsContent>

              <TabsContent value="security" className="mt-4 sm:mt-6 lg:mt-8">
                <SecurityTab
                  loading={loading}
                  onPasswordChange={handlePasswordChange}
                />
              </TabsContent>

              <TabsContent value="notifications" className="mt-4 sm:mt-6 lg:mt-8">
                <NotificationsTab
                  notifications={notifications}
                  onNotificationsChange={setNotifications}
                  onSave={handleNotificationSave}
                />
              </TabsContent>

              <TabsContent value="appearance" className="mt-4 sm:mt-6 lg:mt-8">
                <AppearanceTab />
              </TabsContent>

              <TabsContent value="currency" className="mt-4 sm:mt-6 lg:mt-8">
                <CurrencySection storeId={store?.id} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
