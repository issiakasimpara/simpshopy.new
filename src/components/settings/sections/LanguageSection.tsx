
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Languages, Calendar, Check, Zap } from "lucide-react";
import { useDisplaySettings } from "@/hooks/useDisplaySettings";
import { useToast } from "@/hooks/use-toast";

export const LanguageSection = () => {
  const { settings, updateSetting } = useDisplaySettings();
  const { toast } = useToast();

  const getLanguageLabel = (lang: string) => {
    const languages = {
      'fr': '🇫🇷 Français',
      'en': '🇺🇸 English',
      'es': '🇪🇸 Español',
      'de': '🇩🇪 Deutsch'
    };
    return languages[lang as keyof typeof languages] || lang;
  };

  const getDateFormatLabel = (format: string) => {
    const formats = {
      'fr': 'JJ/MM/AAAA',
      'us': 'MM/JJ/AAAA',
      'iso': 'AAAA-MM-JJ'
    };
    return formats[format as keyof typeof formats] || format;
  };

  const handleLanguageChange = (newLanguage: string) => {
    updateSetting('language', newLanguage);
    toast({
      title: "Langue modifiée",
      description: `Langue changée vers ${getLanguageLabel(newLanguage)}`,
    });
  };

  return (
    <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background via-background to-muted/20">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-cyan-500/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-cyan-500" />
      
      <CardHeader className="relative pb-4">
        <CardTitle className="flex items-center gap-4">
          <div className="relative p-3 bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900/40 dark:to-blue-900/40 rounded-xl shadow-inner">
            <Globe className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
          </div>
          <div className="flex-1">
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
              Langue & Région
            </span>
            <p className="text-sm text-muted-foreground font-medium mt-1 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              Paramètres appliqués instantanément
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative space-y-8 pt-2">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Label className="flex items-center gap-3 text-base font-bold text-emerald-700 dark:text-emerald-400">
              <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <Languages className="h-4 w-4" />
              </div>
              Langue d'affichage
            </Label>
            <div className="relative group">
              <Select value={settings.language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="h-14 transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-600 focus:border-emerald-500 bg-gradient-to-r from-white to-emerald-50/30 dark:from-gray-950 dark:to-emerald-950/20 border-2 group-hover:shadow-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-2 border-emerald-200 dark:border-emerald-800">
                  <SelectItem value="fr" className="py-4 hover:bg-emerald-50 dark:hover:bg-emerald-950/30">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🇫🇷</span>
                      <div>
                        <div className="font-semibold">Français</div>
                        <div className="text-xs text-muted-foreground">France</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="en" className="py-4 hover:bg-emerald-50 dark:hover:bg-emerald-950/30">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🇺🇸</span>
                      <div>
                        <div className="font-semibold">English</div>
                        <div className="text-xs text-muted-foreground">United States</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="es" className="py-4 hover:bg-emerald-50 dark:hover:bg-emerald-950/30">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🇪🇸</span>
                      <div>
                        <div className="font-semibold">Español</div>
                        <div className="text-xs text-muted-foreground">España</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="de" className="py-4 hover:bg-emerald-50 dark:hover:bg-emerald-950/30">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🇩🇪</span>
                      <div>
                        <div className="font-semibold">Deutsch</div>
                        <div className="text-xs text-muted-foreground">Deutschland</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 text-sm bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 px-4 py-3 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50">
              <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium text-emerald-800 dark:text-emerald-200">
                Actuel : {getLanguageLabel(settings.language)}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <Label className="flex items-center gap-3 text-base font-bold text-blue-700 dark:text-blue-400">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Calendar className="h-4 w-4" />
              </div>
              Format de date
            </Label>
            <div className="relative group">
              <Select value={settings.dateFormat} onValueChange={(value) => updateSetting('dateFormat', value)}>
                <SelectTrigger className="h-14 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600 focus:border-blue-500 bg-gradient-to-r from-white to-blue-50/30 dark:from-gray-950 dark:to-blue-950/20 border-2 group-hover:shadow-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-2 border-blue-200 dark:border-blue-800">
                  <SelectItem value="fr" className="py-4 hover:bg-blue-50 dark:hover:bg-blue-950/30">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-blue-600">JJ/MM/AAAA</span>
                        <span className="text-sm text-muted-foreground bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">Français</span>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="us" className="py-4 hover:bg-blue-50 dark:hover:bg-blue-950/30">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-blue-600">MM/JJ/AAAA</span>
                        <span className="text-sm text-muted-foreground bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">Américain</span>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="iso" className="py-4 hover:bg-blue-50 dark:hover:bg-blue-950/30">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-blue-600">AAAA-MM-JJ</span>
                        <span className="text-sm text-muted-foreground bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">ISO</span>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 text-sm bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 px-4 py-3 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
              <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-800 dark:text-blue-200">
                Actuel : {getDateFormatLabel(settings.dateFormat)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
