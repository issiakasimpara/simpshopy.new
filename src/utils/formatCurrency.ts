/**
 * Utilitaires pour formater les devises
 */

export type Currency = 
  // Afrique (25 devises)
  | 'XOF' | 'XAF' | 'GHS' | 'NGN' | 'ZAR' | 'EGP' | 'KES' | 'UGX' | 'TZS' | 'MAD' | 'DZD' | 'TND' | 'LYD' | 'SDG' | 'ETB' | 'SOS' | 'DJF' | 'KMF' | 'MUR' | 'SCR' | 'BIF' | 'RWF' | 'CDF' | 'GMD' | 'SLL'
  // Europe (30 devises)
  | 'EUR' | 'GBP' | 'CHF' | 'SEK' | 'NOK' | 'DKK' | 'ISK' | 'PLN' | 'CZK' | 'HUF' | 'RON' | 'BGN' | 'HRK' | 'RSD' | 'ALL' | 'MKD' | 'BAM' | 'MNT' | 'GEL' | 'AMD' | 'AZN' | 'BYN' | 'MDL' | 'UAH' | 'RUB' | 'TRY' | 'ILS' | 'JOD' | 'LBP' | 'SYP'
  // Amériques (35 devises)
  | 'USD' | 'CAD' | 'BRL' | 'MXN' | 'ARS' | 'CLP' | 'COP' | 'PEN' | 'UYU' | 'PYG' | 'BOB' | 'GTQ' | 'HNL' | 'NIO' | 'CRC' | 'PAB' | 'BBD' | 'JMD' | 'TTD' | 'XCD' | 'AWG' | 'ANG' | 'SRD' | 'GYD' | 'VEF' | 'ECU' | 'BZD' | 'HTG' | 'DOP' | 'CUP' | 'KYD' | 'BMD' | 'FKP'
  // Asie (40 devises)
  | 'JPY' | 'CNY' | 'INR' | 'KRW' | 'SGD' | 'HKD' | 'TWD' | 'THB' | 'MYR' | 'IDR' | 'PHP' | 'VND' | 'BDT' | 'PKR' | 'LKR' | 'NPR' | 'MMK' | 'KHR' | 'LAK' | 'KZT' | 'UZS' | 'TJS' | 'TMM' | 'AFN' | 'IRR' | 'IQD' | 'SAR' | 'AED' | 'QAR' | 'KWD' | 'BHD' | 'OMR' | 'YER' | 'KGS' | 'TMT'
  // Océanie (10 devises)
  | 'AUD' | 'NZD' | 'FJD' | 'PGK' | 'SBD' | 'TOP' | 'VUV' | 'WST' | 'KID' | 'TVD'
  // Devises spéciales et crypto
  | 'XDR' | 'XAU' | 'XAG' | 'BTC' | 'ETH' | 'USDT' | 'USDC';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  locale: string;
  decimals: number;
}

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  // Afrique (25 devises)
  'XOF': { code: 'XOF', symbol: 'CFA', name: 'Franc CFA (BCEAO)', locale: 'fr-ML', decimals: 0 },
  'XAF': { code: 'XAF', symbol: 'FCFA', name: 'Franc CFA (BEAC)', locale: 'fr-CM', decimals: 0 },
  'GHS': { code: 'GHS', symbol: 'GHS', name: 'Cedi ghanéen', locale: 'en-GH', decimals: 2 },
  'NGN': { code: 'NGN', symbol: 'NGN', name: 'Naira nigérian', locale: 'en-NG', decimals: 2 },
  'ZAR': { code: 'ZAR', symbol: 'ZAR', name: 'Rand sud-africain', locale: 'en-ZA', decimals: 2 },
  'EGP': { code: 'EGP', symbol: 'EGP', name: 'Livre égyptienne', locale: 'ar-EG', decimals: 2 },
  'KES': { code: 'KES', symbol: 'KES', name: 'Shilling kényan', locale: 'en-KE', decimals: 2 },
  'UGX': { code: 'UGX', symbol: 'UGX', name: 'Shilling ougandais', locale: 'en-UG', decimals: 0 },
  'TZS': { code: 'TZS', symbol: 'TZS', name: 'Shilling tanzanien', locale: 'en-TZ', decimals: 0 },
  'MAD': { code: 'MAD', symbol: 'MAD', name: 'Dirham marocain', locale: 'ar-MA', decimals: 2 },
  'DZD': { code: 'DZD', symbol: 'DZD', name: 'Dinar algérien', locale: 'ar-DZ', decimals: 2 },
  'TND': { code: 'TND', symbol: 'TND', name: 'Dinar tunisien', locale: 'ar-TN', decimals: 3 },
  'LYD': { code: 'LYD', symbol: 'LYD', name: 'Dinar libyen', locale: 'ar-LY', decimals: 3 },
  'SDG': { code: 'SDG', symbol: 'SDG', name: 'Livre soudanaise', locale: 'ar-SD', decimals: 2 },
  'ETB': { code: 'ETB', symbol: 'ETB', name: 'Birr éthiopien', locale: 'am-ET', decimals: 2 },
  'SOS': { code: 'SOS', symbol: 'SOS', name: 'Shilling somalien', locale: 'so-SO', decimals: 2 },
  'DJF': { code: 'DJF', symbol: 'DJF', name: 'Franc djiboutien', locale: 'fr-DJ', decimals: 0 },
  'KMF': { code: 'KMF', symbol: 'KMF', name: 'Franc comorien', locale: 'fr-KM', decimals: 0 },
  'MUR': { code: 'MUR', symbol: 'MUR', name: 'Roupie mauricienne', locale: 'en-MU', decimals: 2 },
  'SCR': { code: 'SCR', symbol: 'SCR', name: 'Roupie seychelloise', locale: 'en-SC', decimals: 2 },
  'BIF': { code: 'BIF', symbol: 'BIF', name: 'Franc burundais', locale: 'fr-BI', decimals: 0 },
  'RWF': { code: 'RWF', symbol: 'RWF', name: 'Franc rwandais', locale: 'rw-RW', decimals: 0 },
  'CDF': { code: 'CDF', symbol: 'CDF', name: 'Franc congolais', locale: 'fr-CD', decimals: 2 },
  'GMD': { code: 'GMD', symbol: 'GMD', name: 'Dalasi gambien', locale: 'en-GM', decimals: 2 },
  'SLL': { code: 'SLL', symbol: 'SLL', name: 'Leone sierra-léonais', locale: 'en-SL', decimals: 2 },

  // Europe (30 devises)
  'EUR': { code: 'EUR', symbol: 'EUR', name: 'Euro', locale: 'fr-FR', decimals: 2 },
  'GBP': { code: 'GBP', symbol: 'GBP', name: 'Livre sterling', locale: 'en-GB', decimals: 2 },
  'CHF': { code: 'CHF', symbol: 'CHF', name: 'Franc suisse', locale: 'de-CH', decimals: 2 },
  'SEK': { code: 'SEK', symbol: 'SEK', name: 'Couronne suédoise', locale: 'sv-SE', decimals: 2 },
  'NOK': { code: 'NOK', symbol: 'NOK', name: 'Couronne norvégienne', locale: 'nb-NO', decimals: 2 },
  'DKK': { code: 'DKK', symbol: 'DKK', name: 'Couronne danoise', locale: 'da-DK', decimals: 2 },
  'ISK': { code: 'ISK', symbol: 'ISK', name: 'Couronne islandaise', locale: 'is-IS', decimals: 0 },
  'PLN': { code: 'PLN', symbol: 'PLN', name: 'Złoty polonais', locale: 'pl-PL', decimals: 2 },
  'CZK': { code: 'CZK', symbol: 'CZK', name: 'Couronne tchèque', locale: 'cs-CZ', decimals: 2 },
  'HUF': { code: 'HUF', symbol: 'HUF', name: 'Forint hongrois', locale: 'hu-HU', decimals: 0 },
  'RON': { code: 'RON', symbol: 'RON', name: 'Leu roumain', locale: 'ro-RO', decimals: 2 },
  'BGN': { code: 'BGN', symbol: 'BGN', name: 'Lev bulgare', locale: 'bg-BG', decimals: 2 },
  'HRK': { code: 'HRK', symbol: 'HRK', name: 'Kuna croate', locale: 'hr-HR', decimals: 2 },
  'RSD': { code: 'RSD', symbol: 'RSD', name: 'Dinar serbe', locale: 'sr-RS', decimals: 2 },
  'ALL': { code: 'ALL', symbol: 'ALL', name: 'Lek albanais', locale: 'sq-AL', decimals: 2 },
  'MKD': { code: 'MKD', symbol: 'MKD', name: 'Denar macédonien', locale: 'mk-MK', decimals: 2 },
  'BAM': { code: 'BAM', symbol: 'BAM', name: 'Mark convertible', locale: 'bs-BA', decimals: 2 },
  'MNT': { code: 'MNT', symbol: 'MNT', name: 'Tugrik mongol', locale: 'mn-MN', decimals: 2 },
  'GEL': { code: 'GEL', symbol: 'GEL', name: 'Lari géorgien', locale: 'ka-GE', decimals: 2 },
  'AMD': { code: 'AMD', symbol: 'AMD', name: 'Dram arménien', locale: 'hy-AM', decimals: 2 },
  'AZN': { code: 'AZN', symbol: 'AZN', name: 'Manat azerbaïdjanais', locale: 'az-AZ', decimals: 2 },
  'BYN': { code: 'BYN', symbol: 'BYN', name: 'Rouble biélorusse', locale: 'be-BY', decimals: 2 },
  'MDL': { code: 'MDL', symbol: 'MDL', name: 'Leu moldave', locale: 'ro-MD', decimals: 2 },
  'UAH': { code: 'UAH', symbol: 'UAH', name: 'Hryvnia ukrainienne', locale: 'uk-UA', decimals: 2 },
  'RUB': { code: 'RUB', symbol: 'RUB', name: 'Rouble russe', locale: 'ru-RU', decimals: 2 },
  'TRY': { code: 'TRY', symbol: 'TRY', name: 'Livre turque', locale: 'tr-TR', decimals: 2 },
  'ILS': { code: 'ILS', symbol: 'ILS', name: 'Shekel israélien', locale: 'he-IL', decimals: 2 },
  'JOD': { code: 'JOD', symbol: 'JOD', name: 'Dinar jordanien', locale: 'ar-JO', decimals: 3 },
  'LBP': { code: 'LBP', symbol: 'LBP', name: 'Livre libanaise', locale: 'ar-LB', decimals: 2 },
  'SYP': { code: 'SYP', symbol: 'SYP', name: 'Livre syrienne', locale: 'ar-SY', decimals: 2 },

  // Amériques (35 devises)
  'USD': { code: 'USD', symbol: 'USD', name: 'Dollar américain', locale: 'en-US', decimals: 2 },
  'CAD': { code: 'CAD', symbol: 'CAD', name: 'Dollar canadien', locale: 'en-CA', decimals: 2 },
  'BRL': { code: 'BRL', symbol: 'BRL', name: 'Real brésilien', locale: 'pt-BR', decimals: 2 },
  'MXN': { code: 'MXN', symbol: 'MXN', name: 'Peso mexicain', locale: 'es-MX', decimals: 2 },
  'ARS': { code: 'ARS', symbol: 'ARS', name: 'Peso argentin', locale: 'es-AR', decimals: 2 },
  'CLP': { code: 'CLP', symbol: 'CLP', name: 'Peso chilien', locale: 'es-CL', decimals: 0 },
  'COP': { code: 'COP', symbol: 'COP', name: 'Peso colombien', locale: 'es-CO', decimals: 2 },
  'PEN': { code: 'PEN', symbol: 'PEN', name: 'Sol péruvien', locale: 'es-PE', decimals: 2 },
  'UYU': { code: 'UYU', symbol: 'UYU', name: 'Peso uruguayen', locale: 'es-UY', decimals: 2 },
  'PYG': { code: 'PYG', symbol: 'PYG', name: 'Guarani paraguayen', locale: 'es-PY', decimals: 0 },
  'BOB': { code: 'BOB', symbol: 'BOB', name: 'Boliviano', locale: 'es-BO', decimals: 2 },
  'GTQ': { code: 'GTQ', symbol: 'GTQ', name: 'Quetzal guatémaltèque', locale: 'es-GT', decimals: 2 },
  'HNL': { code: 'HNL', symbol: 'HNL', name: 'Lempira hondurien', locale: 'es-HN', decimals: 2 },
  'NIO': { code: 'NIO', symbol: 'NIO', name: 'Córdoba nicaraguayen', locale: 'es-NI', decimals: 2 },
  'CRC': { code: 'CRC', symbol: 'CRC', name: 'Colón costaricain', locale: 'es-CR', decimals: 2 },
  'PAB': { code: 'PAB', symbol: 'PAB', name: 'Balboa panaméen', locale: 'es-PA', decimals: 2 },
  'BBD': { code: 'BBD', symbol: 'BBD', name: 'Dollar barbadien', locale: 'en-BB', decimals: 2 },
  'JMD': { code: 'JMD', symbol: 'JMD', name: 'Dollar jamaïcain', locale: 'en-JM', decimals: 2 },
  'TTD': { code: 'TTD', symbol: 'TTD', name: 'Dollar trinidadien', locale: 'en-TT', decimals: 2 },
  'XCD': { code: 'XCD', symbol: 'XCD', name: 'Dollar est-caribéen', locale: 'en-AG', decimals: 2 },
  'AWG': { code: 'AWG', symbol: 'AWG', name: 'Florin arubais', locale: 'nl-AW', decimals: 2 },
  'ANG': { code: 'ANG', symbol: 'ANG', name: 'Florin néerlandais', locale: 'nl-CW', decimals: 2 },
  'SRD': { code: 'SRD', symbol: 'SRD', name: 'Dollar surinamais', locale: 'nl-SR', decimals: 2 },
  'GYD': { code: 'GYD', symbol: 'GYD', name: 'Dollar guyanien', locale: 'en-GY', decimals: 2 },
  'VEF': { code: 'VEF', symbol: 'VEF', name: 'Bolivar vénézuélien', locale: 'es-VE', decimals: 2 },
  'ECU': { code: 'ECU', symbol: 'ECU', name: 'Dollar équatorien', locale: 'es-EC', decimals: 2 },
  'BZD': { code: 'BZD', symbol: 'BZD', name: 'Dollar bélizien', locale: 'en-BZ', decimals: 2 },
  'HTG': { code: 'HTG', symbol: 'HTG', name: 'Gourde haïtienne', locale: 'ht-HT', decimals: 2 },
  'DOP': { code: 'DOP', symbol: 'DOP', name: 'Peso dominicain', locale: 'es-DO', decimals: 2 },
  'CUP': { code: 'CUP', symbol: 'CUP', name: 'Peso cubain', locale: 'es-CU', decimals: 2 },
  'KYD': { code: 'KYD', symbol: 'KYD', name: 'Dollar des îles Caïmans', locale: 'en-KY', decimals: 2 },
  'BMD': { code: 'BMD', symbol: 'BMD', name: 'Dollar bermudien', locale: 'en-BM', decimals: 2 },
  'FKP': { code: 'FKP', symbol: 'FKP', name: 'Livre des îles Falkland', locale: 'en-FK', decimals: 2 },

  // Asie (40 devises)
  'JPY': { code: 'JPY', symbol: 'JPY', name: 'Yen japonais', locale: 'ja-JP', decimals: 0 },
  'CNY': { code: 'CNY', symbol: 'CNY', name: 'Yuan chinois', locale: 'zh-CN', decimals: 2 },
  'INR': { code: 'INR', symbol: 'INR', name: 'Roupie indienne', locale: 'en-IN', decimals: 2 },
  'KRW': { code: 'KRW', symbol: 'KRW', name: 'Won sud-coréen', locale: 'ko-KR', decimals: 0 },
  'SGD': { code: 'SGD', symbol: 'SGD', name: 'Dollar singapourien', locale: 'en-SG', decimals: 2 },
  'HKD': { code: 'HKD', symbol: 'HKD', name: 'Dollar de Hong Kong', locale: 'zh-HK', decimals: 2 },
  'TWD': { code: 'TWD', symbol: 'TWD', name: 'Dollar taïwanais', locale: 'zh-TW', decimals: 2 },
  'THB': { code: 'THB', symbol: 'THB', name: 'Baht thaïlandais', locale: 'th-TH', decimals: 2 },
  'MYR': { code: 'MYR', symbol: 'MYR', name: 'Ringgit malaisien', locale: 'ms-MY', decimals: 2 },
  'IDR': { code: 'IDR', symbol: 'IDR', name: 'Roupie indonésienne', locale: 'id-ID', decimals: 0 },
  'PHP': { code: 'PHP', symbol: 'PHP', name: 'Peso philippin', locale: 'en-PH', decimals: 2 },
  'VND': { code: 'VND', symbol: 'VND', name: 'Dong vietnamien', locale: 'vi-VN', decimals: 0 },
  'BDT': { code: 'BDT', symbol: 'BDT', name: 'Taka bangladais', locale: 'bn-BD', decimals: 2 },
  'PKR': { code: 'PKR', symbol: 'PKR', name: 'Roupie pakistanaise', locale: 'ur-PK', decimals: 2 },
  'LKR': { code: 'LKR', symbol: 'LKR', name: 'Roupie srilankaise', locale: 'si-LK', decimals: 2 },
  'NPR': { code: 'NPR', symbol: 'NPR', name: 'Roupie népalaise', locale: 'ne-NP', decimals: 2 },
  'MMK': { code: 'MMK', symbol: 'MMK', name: 'Kyat birman', locale: 'my-MM', decimals: 2 },
  'KHR': { code: 'KHR', symbol: 'KHR', name: 'Riel cambodgien', locale: 'km-KH', decimals: 2 },
  'LAK': { code: 'LAK', symbol: 'LAK', name: 'Kip laotien', locale: 'lo-LA', decimals: 2 },
  'KZT': { code: 'KZT', symbol: 'KZT', name: 'Tenge kazakh', locale: 'kk-KZ', decimals: 2 },
  'UZS': { code: 'UZS', symbol: 'UZS', name: 'Sum ouzbek', locale: 'uz-UZ', decimals: 2 },
  'TJS': { code: 'TJS', symbol: 'TJS', name: 'Somoni tadjik', locale: 'tg-TJ', decimals: 2 },
  'TMM': { code: 'TMM', symbol: 'TMM', name: 'Manat turkmène', locale: 'tk-TM', decimals: 2 },
  'AFN': { code: 'AFN', symbol: 'AFN', name: 'Afghani afghan', locale: 'ps-AF', decimals: 2 },
  'IRR': { code: 'IRR', symbol: 'IRR', name: 'Rial iranien', locale: 'fa-IR', decimals: 2 },
  'IQD': { code: 'IQD', symbol: 'IQD', name: 'Dinar irakien', locale: 'ar-IQ', decimals: 3 },
  'SAR': { code: 'SAR', symbol: 'SAR', name: 'Riyal saoudien', locale: 'ar-SA', decimals: 2 },
  'AED': { code: 'AED', symbol: 'AED', name: 'Dirham émirati', locale: 'ar-AE', decimals: 2 },
  'QAR': { code: 'QAR', symbol: 'QAR', name: 'Riyal qatari', locale: 'ar-QA', decimals: 2 },
  'KWD': { code: 'KWD', symbol: 'KWD', name: 'Dinar koweïtien', locale: 'ar-KW', decimals: 3 },
  'BHD': { code: 'BHD', symbol: 'BHD', name: 'Dinar bahreïni', locale: 'ar-BH', decimals: 3 },
  'OMR': { code: 'OMR', symbol: 'OMR', name: 'Rial omanais', locale: 'ar-OM', decimals: 3 },
  'YER': { code: 'YER', symbol: 'YER', name: 'Rial yéménite', locale: 'ar-YE', decimals: 2 },
  'KGS': { code: 'KGS', symbol: 'KGS', name: 'Som kirghize', locale: 'ky-KG', decimals: 2 },
  'TMT': { code: 'TMT', symbol: 'TMT', name: 'Manat turkmène', locale: 'tk-TM', decimals: 2 },

  // Océanie (10 devises)
  'AUD': { code: 'AUD', symbol: 'AUD', name: 'Dollar australien', locale: 'en-AU', decimals: 2 },
  'NZD': { code: 'NZD', symbol: 'NZD', name: 'Dollar néo-zélandais', locale: 'en-NZ', decimals: 2 },
  'FJD': { code: 'FJD', symbol: 'FJD', name: 'Dollar fidjien', locale: 'en-FJ', decimals: 2 },
  'PGK': { code: 'PGK', symbol: 'PGK', name: 'Kina papouasien', locale: 'en-PG', decimals: 2 },
  'SBD': { code: 'SBD', symbol: 'SBD', name: 'Dollar des îles Salomon', locale: 'en-SB', decimals: 2 },
  'TOP': { code: 'TOP', symbol: 'TOP', name: 'Pa\'anga tongien', locale: 'to-TO', decimals: 2 },
  'VUV': { code: 'VUV', symbol: 'VUV', name: 'Vatu vanuatais', locale: 'bi-VU', decimals: 0 },
  'WST': { code: 'WST', symbol: 'WST', name: 'Tala samoane', locale: 'sm-WS', decimals: 2 },
  'KID': { code: 'KID', symbol: 'KID', name: 'Dollar kiribatien', locale: 'en-KI', decimals: 2 },
  'TVD': { code: 'TVD', symbol: 'TVD', name: 'Dollar tuvaluan', locale: 'en-TV', decimals: 2 },

  // Devises spéciales et crypto
  'XDR': { code: 'XDR', symbol: 'XDR', name: 'Droits de tirage spéciaux', locale: 'en-US', decimals: 2 },
  'XAU': { code: 'XAU', symbol: 'XAU', name: 'Or', locale: 'en-US', decimals: 2 },
  'XAG': { code: 'XAG', symbol: 'XAG', name: 'Argent', locale: 'en-US', decimals: 2 },
  'BTC': { code: 'BTC', symbol: 'BTC', name: 'Bitcoin', locale: 'en-US', decimals: 8 },
  'ETH': { code: 'ETH', symbol: 'ETH', name: 'Ethereum', locale: 'en-US', decimals: 18 },
  'USDT': { code: 'USDT', symbol: 'USDT', name: 'Tether', locale: 'en-US', decimals: 2 },
  'USDC': { code: 'USDC', symbol: 'USDC', name: 'USD Coin', locale: 'en-US', decimals: 2 }
};

/**
 * Formate un montant selon la devise spécifiée
 */
export function formatCurrency(
  amount: number, 
  currency: Currency = 'XOF',
  options: {
    showSymbol?: boolean;
    compact?: boolean;
    locale?: string;
  } = {}
): string {
  const config = CURRENCIES[currency];
  const { showSymbol = true, compact = false, locale } = options;
  
  // Si la devise n'existe pas, utiliser XOF par défaut
  if (!config) {
    console.warn(`Devise non supportée: ${currency}, utilisation de XOF par défaut`);
    const defaultConfig = CURRENCIES['XOF'];
    const formatLocale = locale || defaultConfig.locale;
    
    try {
      if (compact && amount >= 1000000) {
        const millions = amount / 1000000;
        return `${millions.toFixed(1)}M ${showSymbol ? defaultConfig.symbol : ''}`.trim();
      }
      
      if (compact && amount >= 1000) {
        const thousands = amount / 1000;
        return `${thousands.toFixed(0)}K ${showSymbol ? defaultConfig.symbol : ''}`.trim();
      }
      
      const formatted = new Intl.NumberFormat(formatLocale, {
        style: 'decimal',
        minimumFractionDigits: defaultConfig.decimals,
        maximumFractionDigits: defaultConfig.decimals,
      }).format(amount);
      
      return showSymbol ? `${formatted} ${defaultConfig.symbol}` : formatted;
      
    } catch (error) {
      // Fallback si la locale n'est pas supportée
      const formatted = amount.toLocaleString('fr-FR', {
        minimumFractionDigits: defaultConfig.decimals,
        maximumFractionDigits: defaultConfig.decimals,
      });
      
      return showSymbol ? `${formatted} ${defaultConfig.symbol}` : formatted;
    }
  }
  
  const formatLocale = locale || config.locale;
  
  try {
    if (compact && amount >= 1000000) {
      const millions = amount / 1000000;
      return `${millions.toFixed(1)}M ${showSymbol ? config.symbol : ''}`.trim();
    }
    
    if (compact && amount >= 1000) {
      const thousands = amount / 1000;
      return `${thousands.toFixed(0)}K ${showSymbol ? config.symbol : ''}`.trim();
    }
    
    const formatted = new Intl.NumberFormat(formatLocale, {
      style: 'decimal',
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals,
    }).format(amount);
    
    return showSymbol ? `${formatted} ${config.symbol}` : formatted;
    
  } catch (error) {
    // Fallback si la locale n'est pas supportée
    const formatted = amount.toLocaleString('fr-FR', {
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals,
    });
    
    return showSymbol ? `${formatted} ${config.symbol}` : formatted;
  }
}

/**
 * Formate spécifiquement pour le franc CFA (devise par défaut)
 */
export function formatCFA(amount: number, compact = false): string {
  return formatCurrency(amount, 'XOF', { compact });
}

/**
 * Parse un montant depuis une chaîne formatée
 */
export function parseCurrency(value: string): number {
  // Supprime tous les caractères non numériques sauf le point et la virgule
  const cleaned = value.replace(/[^\d.,]/g, '');
  
  // Remplace la virgule par un point pour la conversion
  const normalized = cleaned.replace(',', '.');
  
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Convertit entre devises (taux de change fictifs pour la démo)
 */
export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): number {
  // Taux de change fictifs (en production, utiliser une API de change)
  const rates: Record<Currency, number> = {
    XOF: 1,        // Base: Franc CFA BCEAO
    XAF: 1,        // Parité avec XOF
    EUR: 0.0015,   // 1 EUR ≈ 655 XOF
    USD: 0.0016,   // 1 USD ≈ 620 XOF
    GBP: 0.0020,   // 1 GBP ≈ 500 XOF
    JPY: 0.24,     // 1 JPY ≈ 4.2 XOF
    CAD: 0.0021,   // 1 CAD ≈ 480 XOF
    AUD: 0.0024,   // 1 AUD ≈ 420 XOF
    CHF: 0.0018,   // 1 CHF ≈ 560 XOF
    CNY: 0.0022,   // 1 CNY ≈ 450 XOF
    INR: 0.019,    // 1 INR ≈ 52 XOF
    BRL: 0.0033,   // 1 BRL ≈ 300 XOF
    MXN: 0.0094,   // 1 MXN ≈ 106 XOF
    ZAR: 0.0085,   // 1 ZAR ≈ 118 XOF
    EGP: 0.052,    // 1 EGP ≈ 19 XOF
    KES: 0.0095,   // 1 KES ≈ 105 XOF
    UGX: 0.00042,  // 1 UGX ≈ 2380 XOF
    TZS: 0.00068,  // 1 TZS ≈ 1470 XOF
    GHS: 0.0095,   // 1 GHS ≈ 105 XOF
    NGN: 0.0013,   // 1 NGN ≈ 770 XOF
  };
  
  if (fromCurrency === toCurrency) return amount;
  
  // Convertir vers XOF puis vers la devise cible
  const inXOF = fromCurrency === 'XOF' ? amount : amount / (rates[fromCurrency] || 1);
  const result = toCurrency === 'XOF' ? inXOF : inXOF * (rates[toCurrency] || 1);
  
  return Math.round(result * 100) / 100;
}

/**
 * Obtient la liste des devises supportées pour un pays
 */
export function getCurrenciesForCountry(countryCode: string): Currency[] {
  const countryToCurrencies: Record<string, Currency[]> = {
    // Pays XOF (BCEAO)
    'ML': ['XOF'], // Mali
    'SN': ['XOF'], // Sénégal
    'CI': ['XOF'], // Côte d'Ivoire
    'BF': ['XOF'], // Burkina Faso
    'NE': ['XOF'], // Niger
    'TG': ['XOF'], // Togo
    'BJ': ['XOF'], // Bénin
    'GW': ['XOF'], // Guinée-Bissau
    
    // Pays XAF (BEAC)
    'CM': ['XAF'], // Cameroun
    'GA': ['XAF'], // Gabon
    'CF': ['XAF'], // République centrafricaine
    'TD': ['XAF'], // Tchad
    'CG': ['XAF'], // Congo
    'GQ': ['XAF'], // Guinée équatoriale
    
    // Autres pays africains
    'GH': ['GHS'], // Ghana
    'NG': ['NGN'], // Nigeria
    'ZA': ['ZAR'], // Afrique du Sud
    'EG': ['EGP'], // Égypte
    'KE': ['KES'], // Kenya
    'UG': ['UGX'], // Ouganda
    'TZ': ['TZS'], // Tanzanie
    
    // Pays occidentaux
    'FR': ['EUR'], // France
    'DE': ['EUR'], // Allemagne
    'US': ['USD'], // États-Unis
    'GB': ['GBP'], // Royaume-Uni
    'CA': ['CAD'], // Canada
    'AU': ['AUD'], // Australie
    'JP': ['JPY'], // Japon
    'CN': ['CNY'], // Chine
    'IN': ['INR'], // Inde
    'BR': ['BRL'], // Brésil
    'MX': ['MXN'], // Mexique
    'CH': ['CHF'], // Suisse
  };
  
  return countryToCurrencies[countryCode] || ['XOF', 'EUR', 'USD'];
}
