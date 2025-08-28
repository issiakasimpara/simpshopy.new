-- Script pour configurer le Supabase Scheduler pour la mise à jour quotidienne des taux de change
-- À exécuter dans l'éditeur SQL de Supabase

-- IMPORTANT: Activer d'abord les extensions nécessaires
-- Ces extensions doivent être activées par un administrateur Supabase

-- Activer l'extension pg_cron (pour les tâches planifiées)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Activer l'extension http (pour les appels HTTP)
CREATE EXTENSION IF NOT EXISTS http;

-- Vérifier que les extensions sont activées
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

-- Vérifier que le job a été créé
SELECT * FROM cron.job WHERE jobname = 'update-currency-rates-daily';

-- Optionnel : Créer un job de test qui s'exécute toutes les heures pour les tests
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

-- Vérifier tous les jobs créés
SELECT jobname, schedule, active FROM cron.job WHERE jobname LIKE '%currency%';

-- Activer l'extension cron si elle n'est pas déjà activée
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Activer l'extension http si elle n'est pas déjà activée
CREATE EXTENSION IF NOT EXISTS http;

-- Vérifier les extensions activées
SELECT extname FROM pg_extension WHERE extname IN ('cron', 'http');
