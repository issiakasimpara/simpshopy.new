-- Créer la table currency_rates pour stocker les taux de change
CREATE TABLE IF NOT EXISTS currency_rates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    base_currency VARCHAR(3) NOT NULL,
    target_currency VARCHAR(3) NOT NULL,
    rate DECIMAL(20, 10) NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contrainte unique pour éviter les doublons
    UNIQUE(base_currency, target_currency)
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_currency_rates_base_target ON currency_rates(base_currency, target_currency);
CREATE INDEX IF NOT EXISTS idx_currency_rates_last_updated ON currency_rates(last_updated);

-- RLS (Row Level Security) - Lecture publique, écriture admin seulement
ALTER TABLE currency_rates ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique des taux de change
CREATE POLICY "Allow public read access to currency rates" ON currency_rates
    FOR SELECT USING (true);

-- Politique pour permettre l'insertion/mise à jour seulement par les fonctions authentifiées
CREATE POLICY "Allow authenticated functions to manage currency rates" ON currency_rates
    FOR ALL USING (auth.role() = 'service_role');

-- Fonction pour mettre à jour automatiquement last_updated
CREATE OR REPLACE FUNCTION update_currency_rate_last_updated()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement last_updated
CREATE TRIGGER trigger_update_currency_rate_last_updated
    BEFORE UPDATE ON currency_rates
    FOR EACH ROW
    EXECUTE FUNCTION update_currency_rate_last_updated();

-- Insérer quelques taux de base (exemples)
INSERT INTO currency_rates (base_currency, target_currency, rate) VALUES
    ('XOF', 'EUR', 0.00152),
    ('XOF', 'USD', 0.00167),
    ('XOF', 'GBP', 0.00132),
    ('EUR', 'XOF', 657.89),
    ('USD', 'XOF', 598.80),
    ('GBP', 'XOF', 757.58),
    ('EUR', 'USD', 1.10),
    ('USD', 'EUR', 0.91),
    ('EUR', 'GBP', 0.86),
    ('GBP', 'EUR', 1.16),
    ('USD', 'GBP', 0.79),
    ('GBP', 'USD', 1.27)
ON CONFLICT (base_currency, target_currency) 
DO UPDATE SET 
    rate = EXCLUDED.rate,
    last_updated = NOW();

-- Fonction utilitaire pour convertir un montant
CREATE OR REPLACE FUNCTION convert_currency(
    amount DECIMAL,
    from_currency VARCHAR(3),
    to_currency VARCHAR(3)
)
RETURNS DECIMAL AS $$
DECLARE
    conversion_rate DECIMAL;
BEGIN
    -- Si les devises sont identiques, retourner le montant original
    IF from_currency = to_currency THEN
        RETURN amount;
    END IF;
    
    -- Chercher le taux de conversion direct
    SELECT rate INTO conversion_rate
    FROM currency_rates
    WHERE base_currency = from_currency AND target_currency = to_currency
    AND last_updated >= NOW() - INTERVAL '7 days'; -- Taux pas plus vieux que 7 jours
    
    -- Si trouvé, faire la conversion
    IF conversion_rate IS NOT NULL THEN
        RETURN amount * conversion_rate;
    END IF;
    
    -- Sinon, essayer la conversion inverse
    SELECT 1/rate INTO conversion_rate
    FROM currency_rates
    WHERE base_currency = to_currency AND target_currency = from_currency
    AND last_updated >= NOW() - INTERVAL '7 days';
    
    -- Si trouvé, faire la conversion
    IF conversion_rate IS NOT NULL THEN
        RETURN amount * conversion_rate;
    END IF;
    
    -- Si aucune conversion trouvée, retourner NULL
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir le taux de change
CREATE OR REPLACE FUNCTION get_exchange_rate(
    from_currency VARCHAR(3),
    to_currency VARCHAR(3)
)
RETURNS DECIMAL AS $$
DECLARE
    conversion_rate DECIMAL;
BEGIN
    -- Si les devises sont identiques, retourner 1
    IF from_currency = to_currency THEN
        RETURN 1;
    END IF;
    
    -- Chercher le taux de conversion direct
    SELECT rate INTO conversion_rate
    FROM currency_rates
    WHERE base_currency = from_currency AND target_currency = to_currency
    AND last_updated >= NOW() - INTERVAL '7 days';
    
    -- Si trouvé, retourner le taux
    IF conversion_rate IS NOT NULL THEN
        RETURN conversion_rate;
    END IF;
    
    -- Sinon, essayer la conversion inverse
    SELECT 1/rate INTO conversion_rate
    FROM currency_rates
    WHERE base_currency = to_currency AND target_currency = from_currency
    AND last_updated >= NOW() - INTERVAL '7 days';
    
    -- Si trouvé, retourner le taux inverse
    IF conversion_rate IS NOT NULL THEN
        RETURN conversion_rate;
    END IF;
    
    -- Si aucune conversion trouvée, retourner NULL
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
