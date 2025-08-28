import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Coins, Globe, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { useStoreCurrency } from "@/hooks/useStoreCurrency";
import { CURRENCIES } from "@/utils/formatCurrency";
import { useToast } from "@/hooks/use-toast";


interface CurrencySectionProps {
  storeId?: string;
}

export const CurrencySection = ({ storeId }: CurrencySectionProps) => {
  const { toast } = useToast();
  
  // Vérifier si storeId est valide avant d'appeler useStoreCurrency
  const isValidStoreId = storeId && storeId.trim() !== '' && storeId !== 'undefined';
  
  const {
    currency,
    currencySettings,
    isLoading,
    isUpdating,
    updateCurrency,
    getSupportedCurrencies,
    formatPrice
  } = useStoreCurrency(isValidStoreId ? storeId : undefined);

  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const supportedCurrencies = getSupportedCurrencies();

  const handleCurrencyChange = async () => {
    if (!selectedCurrency || selectedCurrency === currency) return;

    try {
      await updateCurrency(selectedCurrency);
      toast({
        title: "Devise mise à jour",
        description: `Votre boutique utilise maintenant le ${CURRENCIES[selectedCurrency].name}.`,
      });
    } catch (error) {
      console.error('Erreur lors du changement de devise:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la devise. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };



  const getCurrencyLabel = (currencyCode: string) => {
    const currency = CURRENCIES[currencyCode as keyof typeof CURRENCIES];
    if (!currency) return currencyCode;
    
    return `${currency.symbol} ${currency.name}`;
  };

  const getCurrencyFlag = (currencyCode: string) => {
    const flags: Record<string, string> = {
      // Afrique (25 devises)
      'XOF': '🇧🇫', // CFA BCEAO
      'XAF': '🇨🇲', // CFA BEAC
      'GHS': '🇬🇭', // Ghana
      'NGN': '🇳🇬', // Nigeria
      'ZAR': '🇿🇦', // Afrique du Sud
      'EGP': '🇪🇬', // Égypte
      'KES': '🇰🇪', // Kenya
      'UGX': '🇺🇬', // Ouganda
      'TZS': '🇹🇿', // Tanzanie
      'MAD': '��🇦', // Maroc
      'DZD': '🇩🇿', // Algérie
      'TND': '🇹🇳', // Tunisie
      'LYD': '🇱🇾', // Libye
      'SDG': '🇸🇩', // Soudan
      'ETB': '🇪🇹', // Éthiopie
      'SOS': '🇸🇴', // Somalie
      'DJF': '🇩🇯', // Djibouti
      'KMF': '🇰🇲', // Comores
      'MUR': '🇲🇺', // Maurice
      'SCR': '🇸🇨', // Seychelles
      'BIF': '🇧🇮', // Burundi
      'RWF': '🇷🇼', // Rwanda
      'CDF': '🇨🇩', // RDC
      'GMD': '🇬🇲', // Gambie
      'SLL': '🇸��', // Sierra Leone
      
      // Europe (30 devises)
      'EUR': '🇪🇺', // Euro
      'GBP': '🇬🇧', // Livre sterling
      'CHF': '🇨🇭', // Franc suisse
      'SEK': '🇸🇪', // Couronne suédoise
      'NOK': '🇳🇴', // Couronne norvégienne
      'DKK': '🇩🇰', // Couronne danoise
      'ISK': '🇮🇸', // Couronne islandaise
      'PLN': '🇵🇱', // Złoty polonais
      'CZK': '🇨🇿', // Couronne tchèque
      'HUF': '🇭🇺', // Forint hongrois
      'RON': '🇷🇴', // Leu roumain
      'BGN': '🇧🇬', // Lev bulgare
      'HRK': '🇭🇷', // Kuna croate
      'RSD': '🇷🇸', // Dinar serbe
      'ALL': '🇦🇱', // Lek albanais
      'MKD': '🇲🇰', // Denar macédonien
      'BAM': '🇧🇦', // Mark convertible
      'MNT': '🇲🇳', // Tugrik mongol
      'GEL': '🇬🇪', // Lari géorgien
      'AMD': '🇦🇲', // Dram arménien
      'AZN': '🇦🇿', // Manat azerbaïdjanais
      'BYN': '🇧🇾', // Rouble biélorusse
      'MDL': '🇲🇩', // Leu moldave
      'UAH': '🇺🇦', // Hryvnia ukrainienne
      'RUB': '🇷🇺', // Rouble russe
      'TRY': '🇹🇷', // Livre turque
      'ILS': '🇮🇱', // Shekel israélien
      'JOD': '🇯🇴', // Dinar jordanien
      'LBP': '🇱🇧', // Livre libanaise
      'SYP': '🇸🇾', // Livre syrienne
      
      // Amériques (35 devises)
      'USD': '🇺🇸', // Dollar américain
      'CAD': '🇨🇦', // Dollar canadien
      'BRL': '🇧🇷', // Real brésilien
      'MXN': '🇲🇽', // Peso mexicain
      'ARS': '🇦🇷', // Peso argentin
      'CLP': '🇨🇱', // Peso chilien
      'COP': '🇨🇴', // Peso colombien
      'PEN': '🇵🇪', // Sol péruvien
      'UYU': '🇺🇾', // Peso uruguayen
      'PYG': '🇵🇾', // Guarani paraguayen
      'BOB': '🇧🇴', // Boliviano
      'GTQ': '🇬🇹', // Quetzal guatémaltèque
      'HNL': '🇭🇳', // Lempira hondurien
      'NIO': '🇳🇮', // Córdoba nicaraguayen
      'CRC': '🇨🇷', // Colón costaricain
      'PAB': '🇵🇦', // Balboa panaméen
      'BBD': '🇧🇧', // Dollar barbadien
      'JMD': '🇯🇲', // Dollar jamaïcain
      'TTD': '🇹🇹', // Dollar trinidadien
      'XCD': '🇦🇬', // Dollar est-caribéen
      'AWG': '🇦🇼', // Florin arubais
      'ANG': '🇨🇼', // Florin néerlandais
      'SRD': '🇸🇷', // Dollar surinamais
      'GYD': '🇬🇾', // Dollar guyanien
      'VEF': '🇻🇪', // Bolivar vénézuélien
      'ECU': '🇪🇨', // Dollar équatorien
      'BZD': '🇧🇿', // Dollar bélizien
      'HTG': '🇭🇹', // Gourde haïtienne
      'DOP': '🇩🇴', // Peso dominicain
      'CUP': '🇨🇺', // Peso cubain
      'KYD': '🇰🇾', // Dollar des îles Caïmans
      'BMD': '🇧🇲', // Dollar bermudien
      'FKP': '🇫🇰', // Livre des îles Falkland
      
      // Asie (40 devises)
      'JPY': '🇯🇵', // Yen japonais
      'CNY': '🇨🇳', // Yuan chinois
      'INR': '🇮🇳', // Roupie indienne
      'KRW': '🇰🇷', // Won sud-coréen
      'SGD': '🇸🇬', // Dollar singapourien
      'HKD': '🇭🇰', // Dollar de Hong Kong
      'TWD': '🇹🇼', // Dollar taïwanais
      'THB': '🇹🇭', // Baht thaïlandais
      'MYR': '🇲🇾', // Ringgit malaisien
      'IDR': '🇮🇩', // Roupie indonésienne
      'PHP': '🇵🇭', // Peso philippin
      'VND': '🇻🇳', // Dong vietnamien
      'BDT': '🇧🇩', // Taka bangladais
      'PKR': '🇵🇰', // Roupie pakistanaise
      'LKR': '🇱🇰', // Roupie srilankaise
      'NPR': '🇳🇵', // Roupie népalaise
      'MMK': '🇲🇲', // Kyat birman
      'KHR': '🇰🇭', // Riel cambodgien
      'LAK': '🇱🇦', // Kip laotien
      'KZT': '🇰🇿', // Tenge kazakh
      'UZS': '🇺🇿', // Sum ouzbek
      'TJS': '🇹🇯', // Somoni tadjik
      'TMM': '🇹🇲', // Manat turkmène
      'AFN': '🇦🇫', // Afghani afghan
      'IRR': '🇮🇷', // Rial iranien
      'IQD': '🇮🇶', // Dinar irakien
      'SAR': '🇸🇦', // Riyal saoudien
      'AED': '🇦🇪', // Dirham émirati
      'QAR': '🇶🇦', // Riyal qatari
      'KWD': '🇰🇼', // Dinar koweïtien
      'BHD': '🇧🇭', // Dinar bahreïni
      'OMR': '🇴🇲', // Rial omanais
      'YER': '🇾🇪', // Rial yéménite
      'KGS': '🇰🇬', // Som kirghize
      'TMT': '🇹🇲', // Manat turkmène
      
      // Océanie (10 devises)
      'AUD': '🇦🇺', // Dollar australien
      'NZD': '🇳🇿', // Dollar néo-zélandais
      'FJD': '🇫🇯', // Dollar fidjien
      'PGK': '🇵🇬', // Kina papouasien
      'SBD': '🇸🇧', // Dollar des îles Salomon
      'TOP': '🇹🇴', // Pa'anga tongien
      'VUV': '🇻🇺', // Vatu vanuatais
      'WST': '🇼🇸', // Tala samoane
      'KID': '🇰🇮', // Dollar kiribatien
      'TVD': '🇹🇻', // Dollar tuvaluan
      
      // Devises spéciales et crypto
      'XDR': '🌍', // Droits de tirage spéciaux
      'XAU': '🥇', // Or
      'XAG': '🥈', // Argent
      'BTC': '₿', // Bitcoin
      'ETH': 'Ξ', // Ethereum
      'USDT': '💱', // Tether
      'USDC': '💱', // USD Coin
    };
    return flags[currencyCode] || '💱';
  };

  // Si pas de storeId valide, afficher un message d'erreur
  if (!isValidStoreId) {
    return (
      <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-700 dark:text-gray-300">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            Configuration de devise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Impossible de charger la configuration de devise. Store ID manquant ou invalide.
              <br />
              <strong>Store ID reçu:</strong> {storeId || 'undefined'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-700 dark:text-gray-300">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Coins className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            Devise de la boutique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section principale */}
      <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-700 dark:text-gray-300">
            <div className="p-2 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/40 dark:to-orange-900/40 rounded-lg">
              <Coins className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            Devise de la boutique
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Devise actuelle */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Devise actuelle
            </Label>
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <span className="text-2xl">{getCurrencyFlag(currency)}</span>
              <div>
                <p className="font-semibold text-green-800 dark:text-green-200">
                  {getCurrencyLabel(currency)}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Exemple: {formatPrice(15000, { showSymbol: true, showCode: true })}
                </p>
              </div>
              <Badge variant="secondary" className="ml-auto bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Actif
              </Badge>
            </div>
          </div>

          {/* Sélecteur de devise */}
          <div className="space-y-2">
            <Label htmlFor="currency-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Changer de devise
            </Label>
            <Select value={selectedCurrency} onValueChange={(value) => setSelectedCurrency(value as any)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner une devise" />
              </SelectTrigger>
              <SelectContent>
                {supportedCurrencies.map((currencyCode) => (
                  <SelectItem key={currencyCode} value={currencyCode}>
                    <div className="flex items-center gap-2">
                      <span>{getCurrencyFlag(currencyCode)}</span>
                      <span>{getCurrencyLabel(currencyCode)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Cette devise sera utilisée pour tous les prix de votre boutique
            </p>
          </div>

          {/* Bouton de mise à jour */}
          <Button
            onClick={handleCurrencyChange}
            disabled={!selectedCurrency || selectedCurrency === currency || isUpdating}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
          >
            {isUpdating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Mise à jour...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mettre à jour la devise
              </>
            )}
          </Button>
        </CardContent>
      </Card>


    </div>
  );
};
