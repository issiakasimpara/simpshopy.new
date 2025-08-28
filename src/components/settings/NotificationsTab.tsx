
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, Package, Gift, AlertTriangle, Sparkles } from "lucide-react";

interface NotificationSettings {
  emailNotifications: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  securityAlerts: boolean;
}

interface NotificationsTabProps {
  notifications: NotificationSettings;
  onNotificationsChange: (notifications: NotificationSettings) => void;
  onSave: () => void;
}

export const NotificationsTab = ({ notifications, onNotificationsChange, onSave }: NotificationsTabProps) => {
  return (
    <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background via-background to-muted/20">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-amber-500/5 to-yellow-500/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500" />
      
      <CardHeader className="relative pb-4">
        <CardTitle className="flex items-center gap-4">
          <div className="relative p-3 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 rounded-xl shadow-inner">
            <Bell className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
          </div>
          <div className="flex-1">
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent">
              Notifications
            </span>
            <p className="text-sm text-muted-foreground font-medium mt-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Gérez vos préférences de notification
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative space-y-8 pt-2">
        <div className="space-y-8">
          <div className="group p-6 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl border-2 border-blue-200/30 dark:border-blue-800/30 hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 rounded-xl shadow-inner group-hover:shadow-md transition-shadow">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-1">
                  <Label className="text-base font-bold cursor-pointer text-blue-700 dark:text-blue-300">Notifications email</Label>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Recevoir des emails de notification pour les mises à jour importantes
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => 
                  onNotificationsChange({ ...notifications, emailNotifications: checked })
                }
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-cyan-500"
              />
            </div>
          </div>
          
          <Separator className="my-8 bg-gradient-to-r from-transparent via-border to-transparent" />
          
          <div className="group p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border-2 border-green-200/30 dark:border-green-800/30 hover:border-green-300/50 dark:hover:border-green-600/50 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-xl shadow-inner group-hover:shadow-md transition-shadow">
                  <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="space-y-1">
                  <Label className="text-base font-bold cursor-pointer text-green-700 dark:text-green-300">Mises à jour des commandes</Label>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Notifications sur l'état et le suivi de vos commandes
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.orderUpdates}
                onCheckedChange={(checked) => 
                  onNotificationsChange({ ...notifications, orderUpdates: checked })
                }
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500"
              />
            </div>
          </div>
          
          <Separator className="my-8 bg-gradient-to-r from-transparent via-border to-transparent" />
          
          <div className="group p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border-2 border-purple-200/30 dark:border-purple-800/30 hover:border-purple-300/50 dark:hover:border-purple-600/50 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-xl shadow-inner group-hover:shadow-md transition-shadow">
                  <Gift className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="space-y-1">
                  <Label className="text-base font-bold cursor-pointer text-purple-700 dark:text-purple-300">Promotions</Label>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Offres spéciales, remises et promotions exclusives
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.promotions}
                onCheckedChange={(checked) => 
                  onNotificationsChange({ ...notifications, promotions: checked })
                }
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500"
              />
            </div>
          </div>
          
          <Separator className="my-8 bg-gradient-to-r from-transparent via-border to-transparent" />
          
          <div className="group p-6 bg-gradient-to-r from-red-50/50 to-orange-50/50 dark:from-red-950/20 dark:to-orange-950/20 rounded-xl border-2 border-red-200/30 dark:border-red-800/30 hover:border-red-300/50 dark:hover:border-red-600/50 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/40 dark:to-orange-900/40 rounded-xl shadow-inner group-hover:shadow-md transition-shadow">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="space-y-1">
                  <Label className="text-base font-bold cursor-pointer text-red-700 dark:text-red-300">Alertes de sécurité</Label>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Notifications de sécurité critiques et changements de compte
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.securityAlerts}
                onCheckedChange={(checked) => 
                  onNotificationsChange({ ...notifications, securityAlerts: checked })
                }
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-red-500 data-[state=checked]:to-orange-500"
              />
            </div>
          </div>
        </div>
        
        <div className="pt-6">
          <Button 
            onClick={onSave} 
            size="lg"
            className="w-full h-14 text-base font-bold bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Bell className="mr-3 h-5 w-5" />
            Sauvegarder les préférences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
