
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, EyeOff, Key, Sparkles } from "lucide-react";

interface SecurityTabProps {
  loading: boolean;
  onPasswordChange: (currentPassword: string, newPassword: string) => void;
}

export const SecurityTab = ({ loading, onPasswordChange }: SecurityTabProps) => {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordSubmit = () => {
    onPasswordChange(passwordData.currentPassword, passwordData.newPassword);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background via-background to-muted/20">
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-teal-500/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />
      
      <CardHeader className="relative pb-4">
        <CardTitle className="flex items-center gap-4">
          <div className="relative p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-xl shadow-inner">
            <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
          </div>
          <div className="flex-1">
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Sécurité
            </span>
            <p className="text-sm text-muted-foreground font-medium mt-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Modifiez votre mot de passe et gérez la sécurité
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative space-y-8 pt-2">
        <div className="space-y-4">
          <Label htmlFor="currentPassword" className="flex items-center gap-3 text-base font-bold text-green-700 dark:text-green-400">
            <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Key className="h-4 w-4" />
            </div>
            Mot de passe actuel
          </Label>
          <div className="relative group">
            <Input
              id="currentPassword"
              type={showPasswords.current ? "text" : "password"}
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              disabled={loading}
              className="h-14 text-base pr-14 transition-all duration-300 border-2 hover:border-green-300 dark:hover:border-green-600 focus:border-green-500 bg-gradient-to-r from-white to-green-50/30 dark:from-gray-950 dark:to-green-950/20 group-hover:shadow-md"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 p-0 hover:bg-green-100 dark:hover:bg-green-900/30"
              onClick={() => togglePasswordVisibility('current')}
            >
              {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <Label htmlFor="newPassword" className="flex items-center gap-3 text-base font-bold text-emerald-700 dark:text-emerald-400">
            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <Lock className="h-4 w-4" />
            </div>
            Nouveau mot de passe
          </Label>
          <div className="relative group">
            <Input
              id="newPassword"
              type={showPasswords.new ? "text" : "password"}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              disabled={loading}
              className="h-14 text-base pr-14 transition-all duration-300 border-2 hover:border-emerald-300 dark:hover:border-emerald-600 focus:border-emerald-500 bg-gradient-to-r from-white to-emerald-50/30 dark:from-gray-950 dark:to-emerald-950/20 group-hover:shadow-md"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 p-0 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
              onClick={() => togglePasswordVisibility('new')}
            >
              {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <Label htmlFor="confirmPassword" className="flex items-center gap-3 text-base font-bold text-teal-700 dark:text-teal-400">
            <div className="p-1.5 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
              <Lock className="h-4 w-4" />
            </div>
            Confirmer le mot de passe
          </Label>
          <div className="relative group">
            <Input
              id="confirmPassword"
              type={showPasswords.confirm ? "text" : "password"}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              disabled={loading}
              className="h-14 text-base pr-14 transition-all duration-300 border-2 hover:border-teal-300 dark:hover:border-teal-600 focus:border-teal-500 bg-gradient-to-r from-white to-teal-50/30 dark:from-gray-950 dark:to-teal-950/20 group-hover:shadow-md"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 p-0 hover:bg-teal-100 dark:hover:bg-teal-900/30"
              onClick={() => togglePasswordVisibility('confirm')}
            >
              {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className="pt-6">
          <Button 
            onClick={handlePasswordSubmit} 
            disabled={loading}
            size="lg"
            className="w-full h-14 text-base font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Shield className="mr-3 h-5 w-5" />
            {loading ? 'Modification en cours...' : 'Changer le mot de passe'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
