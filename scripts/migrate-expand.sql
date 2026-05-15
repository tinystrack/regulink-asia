-- migrate-expand.sql
-- 1. Extend dimension ENUM with two new values
-- 2. Insert country whitelist rows (informational; actual data comes from seed scripts)
-- Run: docker exec -i hackathon-mysql mysql -uroot -p<PASS> regulink_asia < scripts/migrate-expand.sql

-- Extend the dimension column to include new values
-- MySQL requires listing ALL existing values when modifying an ENUM
ALTER TABLE rules
  MODIFY COLUMN dimension ENUM(
    'cross_border_transfer',
    'data_localisation',
    'consent',
    'security_assessment',
    'privacy_policy',
    'data_subject_rights',
    'breach_notification',
    'retention',
    'data_portability',
    'algorithmic_decision'
  ) NOT NULL;

SELECT 'dimension ENUM extended OK' AS status;
