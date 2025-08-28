
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Eye, Type, Gauge, Zap, Check, Sparkles } from "lucide-react";
import { useDisplaySettings } from "@/hooks/useDisplaySettings";
import { useToast } from "@/hooks/use-toast";

export const DisplaySection = () => {
  const { settings, updateSetting } = useDisplaySettings();
  const { toast } = useToast();

  const handleFontSizeChange = (newSize: string) => {
    updateSetting('fontSize', newSize);
    toast({
      title: "Taille de police modifiée",
      description: `Taille changée vers ${newSize === 'small' ? 'Petite' : newSize === 'large' ? 'Grande' : 'Normale'}`,
    });
  };

  return (
    <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background via-background to-muted/20">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-pink-500/5 to-red-500/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-red-500" />
      
      <CardHeader className="relative pb-4">
        <CardTitle className="flex items-center gap-4">
          <div className="relative p-3 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/40 dark:to-pink-900/40 rounded-xl shadow-inner">
            <Eye className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
          </div>
          <div className="flex-1">
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-400 bg-clip-text text-transparent">
              Affichage
            </span>
            <p className="text-sm text-muted-foreground font-medium mt-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Personnalisation avec aperçu instantané
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative space-y-8 pt-2">
        <div className="space-y-6">
          <Label className="flex items-center gap-3 text-base font-bold text-orange-700 dark:text-orange-400">
            <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Type className="h-4 w-4" />
            </div>
            Taille du texte
          </Label>
          <div className="relative group">
            <Select value={settings.fontSize} onValueChange={handleFontSizeChange}>
              <SelectTrigger className="h-14 transition-all duration-300 hover:border-orange-300 dark:hover:border-orange-600 focus:border-orange-500 bg-gradient-to-r from-white to-orange-50/30 dark:from-gray-950 dark:to-orange-950/20 border-2 group-hover:shadow-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-2 border-orange-200 dark:border-orange-800">
                <SelectItem value="small" className="py-4 hover:bg-orange-50 dark:hover:bg-orange-950/30">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">Petite</span>
                      <span className="text-xs text-muted-foreground bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded">14px</span>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="medium" className="py-4 hover:bg-orange-50 dark:hover:bg-orange-950/30">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">Normale</span>
                      <span className="text-xs text-muted-foreground bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded">16px</span>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="large" className="py-4 hover:bg-orange-50 dark:hover:bg-orange-950/30">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold">Grande</span>
                      <span className="text-xs text-muted-foreground bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded">18px</span>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3 text-sm bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 px-4 py-3 rounded-lg border border-orange-200/50 dark:border-orange-800/50">
            <Check className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <span className="font-medium text-orange-800 dark:text-orange-200">
              Actuel : {settings.fontSize === 'small' ? 'Petite' : settings.fontSize === 'large' ? 'Grande' : 'Normale'}
            </span>
          </div>
        </div>

        <Separator className="my-8 bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="space-y-6">
          <div className="group p-6 bg-gradient-to-r from-cyan-50/50 to-blue-50/50 dark:from-cyan-950/20 dark:to-blue-950/20 rounded-xl border-2 border-cyan-200/30 dark:border-cyan-800/30 hover:border-cyan-300/50 dark:hover:border-cyan-600/50 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/40 dark:to-blue-900/40 rounded-xl shadow-inner group-hover:shadow-md transition-shadow">
                  <Gauge className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="space-y-1">
                  <Label className="text-base font-bold cursor-pointer text-cyan-700 dark:text-cyan-300">Mode compact</Label>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Réduire l'espacement pour afficher plus de contenu sur l'écran
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.compactMode}
                onCheckedChange={(checked) => {
                  updateSetting('compactMode', checked);
                  toast({
                    title: checked ? "Mode compact activé" : "Mode compact désactivé",
                    description: checked ? "L'espacement a été réduit" : "L'espacement normal a été restauré",
                  });
                }}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
              />
            </div>
          </div>

          <div className="group p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border-2 border-purple-200/30 dark:border-purple-800/30 hover:border-purple-300/50 dark:hover:border-purple-600/50 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-xl shadow-inner group-hover:shadow-md transition-shadow">
                  <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="space-y-1">
                  <Label className="text-base font-bold cursor-pointer text-purple-700 dark:text-purple-300">Animations</Label>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Activer les transitions et animations fluides pour une expérience immersive
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.animations}
                onCheckedChange={(checked) => {
                  updateSetting('animations', checked);
                  toast({
                    title: checked ? "Animations activées" : "Animations désactivées",
                    description: checked ? "Les transitions sont maintenant activées" : "Les transitions ont été désactivées",
                  });
                }}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
