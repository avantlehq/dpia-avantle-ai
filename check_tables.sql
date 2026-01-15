-- Check what tables actually exist in database
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE '%system%'
ORDER BY table_name;
