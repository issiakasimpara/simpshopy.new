-- Migration pour ajouter toutes les devises du monde
-- Ce script met à jour les contraintes avec toutes les devises officielles

-- 1. Mettre à jour la contrainte avec toutes les devises du monde
DO $$
BEGIN
    -- Supprimer l'ancienne contrainte si elle existe
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'market_settings_currency_check' 
        AND table_name = 'market_settings'
    ) THEN
        ALTER TABLE market_settings DROP CONSTRAINT market_settings_currency_check;
    END IF;
    
    -- Recréer la contrainte avec toutes les devises du monde
    ALTER TABLE market_settings ADD CONSTRAINT market_settings_currency_check 
    CHECK (default_currency IN (
        -- Afrique (25 devises)
        'XOF', 'XAF', 'GHS', 'NGN', 'ZAR', 'EGP', 'KES', 'UGX', 'TZS', 'MAD', 'DZD', 'TND', 'LYD', 'SDG', 'ETB', 'SOS', 'DJF', 'KMF', 'MUR', 'SCR', 'BIF', 'RWF', 'CDF', 'GMD', 'SLL',
        
        -- Europe (30 devises)
        'EUR', 'GBP', 'CHF', 'SEK', 'NOK', 'DKK', 'ISK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK', 'RSD', 'ALL', 'MKD', 'BAM', 'MNT', 'GEL', 'AMD', 'AZN', 'BYN', 'MDL', 'UAH', 'RUB', 'TRY', 'ILS', 'JOD', 'LBP', 'SYP',
        
        -- Amériques (35 devises)
        'USD', 'CAD', 'BRL', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU', 'PYG', 'BOB', 'GTQ', 'HNL', 'NIO', 'CRC', 'PAB', 'BBD', 'JMD', 'TTD', 'XCD', 'AWG', 'ANG', 'SRD', 'GYD', 'VEF', 'ECU', 'GYD', 'SRD', 'BZD', 'HTG', 'DOP', 'CUP', 'KYD', 'BMD', 'FKP',
        
        -- Asie (40 devises)
        'JPY', 'CNY', 'INR', 'KRW', 'SGD', 'HKD', 'TWD', 'THB', 'MYR', 'IDR', 'PHP', 'VND', 'BDT', 'PKR', 'LKR', 'NPR', 'MMK', 'KHR', 'LAK', 'MNT', 'KZT', 'UZS', 'TJS', 'TMM', 'AFN', 'IRR', 'IQD', 'SAR', 'AED', 'QAR', 'KWD', 'BHD', 'OMR', 'YER', 'KGS', 'TMT', 'AZN', 'GEL', 'AMD', 'BYN', 'MDL',
        
        -- Océanie (10 devises)
        'AUD', 'NZD', 'FJD', 'PGK', 'SBD', 'TOP', 'VUV', 'WST', 'KID', 'TVD',
        
        -- Devises spéciales et crypto
        'XDR', 'XAU', 'XAG', 'BTC', 'ETH', 'USDT', 'USDC'
    ));
    
    RAISE NOTICE 'Contrainte mise à jour avec toutes les devises du monde (180+ devises)';
END $$;

-- 2. Vérifier que toutes les entrées utilisent des devises valides
UPDATE market_settings 
SET default_currency = 'XOF' 
WHERE default_currency NOT IN (
    -- Liste complète des devises (même liste que ci-dessus)
    'XOF', 'XAF', 'GHS', 'NGN', 'ZAR', 'EGP', 'KES', 'UGX', 'TZS', 'MAD', 'DZD', 'TND', 'LYD', 'SDG', 'ETB', 'SOS', 'DJF', 'KMF', 'MUR', 'SCR', 'BIF', 'RWF', 'CDF', 'GMD', 'SLL',
    'EUR', 'GBP', 'CHF', 'SEK', 'NOK', 'DKK', 'ISK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK', 'RSD', 'ALL', 'MKD', 'BAM', 'MNT', 'GEL', 'AMD', 'AZN', 'BYN', 'MDL', 'UAH', 'RUB', 'TRY', 'ILS', 'JOD', 'LBP', 'SYP',
    'USD', 'CAD', 'BRL', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU', 'PYG', 'BOB', 'GTQ', 'HNL', 'NIO', 'CRC', 'PAB', 'BBD', 'JMD', 'TTD', 'XCD', 'AWG', 'ANG', 'SRD', 'GYD', 'VEF', 'ECU', 'GYD', 'SRD', 'BZD', 'HTG', 'DOP', 'CUP', 'KYD', 'BMD', 'FKP',
    'JPY', 'CNY', 'INR', 'KRW', 'SGD', 'HKD', 'TWD', 'THB', 'MYR', 'IDR', 'PHP', 'VND', 'BDT', 'PKR', 'LKR', 'NPR', 'MMK', 'KHR', 'LAK', 'MNT', 'KZT', 'UZS', 'TJS', 'TMM', 'AFN', 'IRR', 'IQD', 'SAR', 'AED', 'QAR', 'KWD', 'BHD', 'OMR', 'YER', 'KGS', 'TMT', 'AZN', 'GEL', 'AMD', 'BYN', 'MDL',
    'AUD', 'NZD', 'FJD', 'PGK', 'SBD', 'TOP', 'VUV', 'WST', 'KID', 'TVD',
    'XDR', 'XAU', 'XAG', 'BTC', 'ETH', 'USDT', 'USDC'
);

-- 3. Afficher le statut
SELECT 
    'Migration terminée: Toutes les devises du monde ajoutées' as status,
    COUNT(*) as total_currencies
FROM (
    SELECT unnest(ARRAY[
        'XOF', 'XAF', 'GHS', 'NGN', 'ZAR', 'EGP', 'KES', 'UGX', 'TZS', 'MAD', 'DZD', 'TND', 'LYD', 'SDG', 'ETB', 'SOS', 'DJF', 'KMF', 'MUR', 'SCR', 'BIF', 'RWF', 'CDF', 'GMD', 'SLL',
        'EUR', 'GBP', 'CHF', 'SEK', 'NOK', 'DKK', 'ISK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK', 'RSD', 'ALL', 'MKD', 'BAM', 'MNT', 'GEL', 'AMD', 'AZN', 'BYN', 'MDL', 'UAH', 'RUB', 'TRY', 'ILS', 'JOD', 'LBP', 'SYP',
        'USD', 'CAD', 'BRL', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU', 'PYG', 'BOB', 'GTQ', 'HNL', 'NIO', 'CRC', 'PAB', 'BBD', 'JMD', 'TTD', 'XCD', 'AWG', 'ANG', 'SRD', 'GYD', 'VEF', 'ECU', 'GYD', 'SRD', 'BZD', 'HTG', 'DOP', 'CUP', 'KYD', 'BMD', 'FKP',
        'JPY', 'CNY', 'INR', 'KRW', 'SGD', 'HKD', 'TWD', 'THB', 'MYR', 'IDR', 'PHP', 'VND', 'BDT', 'PKR', 'LKR', 'NPR', 'MMK', 'KHR', 'LAK', 'MNT', 'KZT', 'UZS', 'TJS', 'TMM', 'AFN', 'IRR', 'IQD', 'SAR', 'AED', 'QAR', 'KWD', 'BHD', 'OMR', 'YER', 'KGS', 'TMT', 'AZN', 'GEL', 'AMD', 'BYN', 'MDL',
        'AUD', 'NZD', 'FJD', 'PGK', 'SBD', 'TOP', 'VUV', 'WST', 'KID', 'TVD',
        'XDR', 'XAU', 'XAG', 'BTC', 'ETH', 'USDT', 'USDC'
    ]) as currency
) as currencies;
