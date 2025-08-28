-- Script final pour configurer le Supabase Scheduler
-- À exécuter dans l'éditeur SQL de Supabase

-- Vérifier que les extensions sont activées
SELECT 'Extensions activées:' as status;
SELECT extname FROM pg_extension WHERE extname IN ('cron', 'http');

-- Créer le job de mise à jour quotidienne des taux de change
-- Le job s'exécutera tous les jours à 6h00 UTC
SELECT cron.schedule(
  'update-currency-rates-daily',
  '0 6 * * *', -- Tous les jours à 6h00 UTC
  $$
  SELECT
    net.http_post(
      url := 'https://grutldacuowplosarucp.supabase.co/functions/v1/update-currency-rates',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydXRsZGFjdW93cGxvc2FydWNwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MjA2NDY2NjE2MX0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8"}',
      body := '{}'
    ) AS request_id;
  $$
);

-- Créer un job de test qui s'exécute toutes les heures pour les tests
SELECT cron.schedule(
  'update-currency-rates-test',
  '0 * * * *', -- Toutes les heures
  $$
  SELECT
    net.http_post(
      url := 'https://grutldacuowplosarucp.supabase.co/functions/v1/update-currency-rates',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydXRsZGFjdW93cGxvc2FydWNwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MjA2NDY2NjE2MX0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8"}',
      body := '{}'
    ) AS request_id;
  $$
);

-- Vérifier que les jobs ont été créés
SELECT 'Jobs créés:' as status;
SELECT jobname, schedule, active FROM cron.job WHERE jobname LIKE '%currency%';

-- Vérifier l'état actuel de la table currency_rates
SELECT 'État actuel de la table currency_rates:' as status;
SELECT COUNT(*) as nombre_taux FROM currency_rates;
SELECT base_currency, target_currency, rate, last_updated, source 
FROM currency_rates 
ORDER BY last_updated DESC LIMIT 5;

-- Test de conversion
SELECT 'Test de conversion:' as status;
SELECT convert_currency(1000, 'XOF', 'EUR') as conversion_xof_eur;
SELECT convert_currency(100, 'EUR', 'USD') as conversion_eur_usd;
